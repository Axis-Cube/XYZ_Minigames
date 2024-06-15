import { system } from "@minecraft/server"
import { getGame } from "../../../../games/main"
import { getScore, runCMD } from "../../../axisTools"
import { config_map_info } from "./config"

if (getScore(config_map_info.file, 'data.plugins') != 0) {
  system.runInterval(()=>{  
    if(getGame() == 0){
      let VERSION = `${getScore('version.major','settings')}.${getScore('version.minor','settings')}.${getScore('version.bug_fix','settings')}`
      switch(getScore('testrun','settings')){
        case 1:
          runCMD(`title @a title ud0"§4X§2Y§1Z §4M§6I§eN§aI §bG§3A§aM§5E§dS §r${VERSION}_§3TestRun§r"`)
        break;

        case 2:
          runCMD(`title @a title ud0"§4DO NOT DESTRIBUTE!!! DEV_BUILD§r"`)
        break;
        default:
          runCMD(`title @a title ud0"§4X§2Y§1Z §4M§6I§eN§aI §bG§3A§aM§5E§dS §r${VERSION}"`)
        break;
      }
    }
  },200)
}