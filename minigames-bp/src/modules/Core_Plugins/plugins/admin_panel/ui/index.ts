import {ActionFormData, ModalFormData} from "@minecraft/server-ui"; // Непосредственно создание форм
import {shortNick} from "../../../../axisTools.js";
import {dbSetPlayerRecord} from "../../../../cheesebase.js";
import {DB_A} from "../../../../../const.js";

let FORM = new ActionFormData()
    .title('Admin Panel')
    .button('Get Admin Priveleges')

let get_admin_form = new ModalFormData()
    .title('Admin Code Enter')
    .textField('Enter Code','xxxxxxxx')

async function main(response, source){
    switch (response.selection){
        case 0:
            get_admin_form.show(source).then(gg => {
                if(gg.canceled){}
                if(!gg.formValues){return;}

                let code: string  = String(gg.formValues[0])
                if(code != '')
                setCode(source, code)
            })
        break;
    }
    
}
async function setCode(player, code){
    let short_nick = await shortNick(player.name)
    await dbSetPlayerRecord(short_nick,DB_A,{'0':code})
}

export let packui_admin_panel = [FORM, main]