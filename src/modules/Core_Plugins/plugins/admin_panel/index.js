import { system } from "@minecraft/server"
import { getScore } from "../../../axisTools"
import { ICONS } from "../../../../const"
export const config_admin_panel = {
  "version": [ 0, 1, 1 ],
  "engine_version": [ 1, 3, 0 ],
  "file": "admin_panel",
  "name": "Admin Panel",
  "description": "Cool plugin",
  "authors": ["Lndrs_"],
  "license": "MIT",
  "dependencies": [
      "ui_features"
  ],
  "protection_code": undefined,
  "icon": ICONS.console
}

if (getScore(config_admin_panel.file, 'data.plugins') != 0) {
  system.runInterval(()=>{ 
  },200)
}