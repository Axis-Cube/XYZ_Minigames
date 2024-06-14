import {
    ModalFormData
} from "@minecraft/server-ui"; // Непосредственно создание форм
import { edScore, getScore, runCMD } from "../../../../axisTools.js";

let FORM = new ModalFormData()
    .title('Map_info')
    .toggle('Enabled')

function main(response, source){
    let [toggle] = response.formValues;
    if(toggle){
        edScore('map_info','data.plugins',1)
    }else{
        edScore('map_info','data.plugins',0)
        runCMD('title @a title ud0""')
    }
    
}

export let packui_map_info = [FORM, main]