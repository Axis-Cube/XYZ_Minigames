import {system, world} from "@minecraft/server"
import {MT_PLUGINS} from "../../../MultiTasking/instances"
import {isAdmin} from "../../../axisTools";
import {TESTERS} from "../../../../tunes/testrun";
import {config_map_prefix} from "./config";

let prefixes = {
    admin: "04",
    testers: {
        1: "25",
        2: "26",
        3: "27",
        4: "28"
    }
}


function containsUnicode(str) {
    for (var i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt( i ) > 57600 && str.charCodeAt( i ) < 57856 /*e1_glyphs*/) { return true; }
    }
    return false;
}

let admin_icon = "04"
let prefix_interval = system.runInterval(async ()=>{
    for(const player of [...world.getPlayers()]){
        //console.warn(`Your nick -> ${player.nameTag}`, await isAdmin(player))
        if(!containsUnicode(player.nameTag)){ //1 Because 0 is a "
            if(await isAdmin(player)){
                let new_name = `${String.fromCharCode(parseInt(`e1${prefixes.admin}`,16))} ${player.nameTag}`
                player.nameTag = new_name
            }else if(TESTERS[player.name.toLowerCase()]){
                let level = TESTERS[player.name.toLowerCase()]
                let new_name = `${String.fromCharCode(parseInt(`e1${prefixes.testers[level]}`,16))} ${player.nameTag}`
                player.nameTag = new_name
            }
        }else{
            if(await isAdmin(player) == false && player.nameTag.charCodeAt(0) == 57604){
                let new_name = `${player.nameTag.slice(2)}`
                player.nameTag = new_name
            }else if(await isAdmin(player) && player.nameTag.charCodeAt(0) != 57604){
                let new_name = `${player.nameTag.slice(2)}`
                player.nameTag = new_name
            }
        }
    }
    
},50)

MT_PLUGINS.registerNamed(config_map_prefix.file, prefix_interval)
