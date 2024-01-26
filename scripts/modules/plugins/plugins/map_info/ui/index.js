import {
    ModalFormData
} from "@minecraft/server-ui"; // Непосредственно создание форм
import { edScore, getScore, runCMD } from "../../../../axisTools";
import {Process} from '../../../../plugins/index.js'

let enabled = false

export let FORM = new ModalFormData()
    .title('Map_info')
    .toggle('Enabled')

export function main(response){
    let [toggle] = response.formValues;
    if(toggle){
        edScore('map_info','data.plugins',1)
    }else{
        edScore('map_info','data.plugins',0)
        runCMD('title @a title ud0""')
    }
    
}