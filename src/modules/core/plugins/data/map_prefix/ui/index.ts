import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, ModalFormResponse } from "@minecraft/server-ui";
import { MT_PLUGINS } from "modules/MultiTasking/instances";
import { edScore, runCMD } from "modules/axisTools";

function containsUnicode(str) {
    for (var i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt( i ) > 57600 && str.charCodeAt( i ) < 57856 /*e1_glyphs*/) { return true; }
    }
    return false;
}

let FORM = new ModalFormData()
    .title('Prefixes')
    .toggle('Enabled', true)

function main(response, source){
    if(response.canceled){return}
    let [toggle] = response.formValues;
    if(toggle){
        edScore('map_prefix','data.plugins',1)
    }else{
        edScore('map_prefix','data.plugins',0)
        MT_PLUGINS.killNamed("map_prefix")

        for(const player of [...world.getPlayers()]){
            if(containsUnicode(player.nameTag)){
                let new_name = `${player.nameTag.slice(2)}`
                player.nameTag = new_name
            }
        }
    }
    
}

export let packui_map_prefix = [FORM, main]

