import {
    ModalFormData
} from "@minecraft/server-ui"; // Непосредственно создание форм
import { runCMD } from "../../../../axisTools";

let forms = ['ud0', 'ud1']

export let FORM = new ModalFormData()
    .title('Map_info')
    .dropdown('Label to update', forms,0)
    .textField('Info','...','v0.1')
    .toggle('Enable', true)

export function main(response){
    let [drop, text, toggle] = response.formValues;
    let upd = forms[drop]
    if(toggle){
        runCMD(`title @a title ${upd}"${text}"`)
    }else{
        runCMD(`title @a title ${upd}""`)
    }
    
}