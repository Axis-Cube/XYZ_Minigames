import { system } from "@minecraft/server"
import { getScore } from "#modules/axisTools"
import { config_admin_panel } from "./config"

if (getScore(config_admin_panel.file, 'data.plugins') != 0) {
  system.runInterval(()=>{ 
  },200)
}