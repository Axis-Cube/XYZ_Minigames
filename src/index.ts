let initStart = new Date().valueOf()
/*    EARLY INITIALIZATION    */
import "./games/main";
import "./initialization"
/*     LATE INITIALIZATION    */
//import { TikTakToe } from './games/lobby.js' //TikTakToe()
import { Exec } from './modules/Core_Plugins/index';
import { runCMDs } from './modules/axisTools'
import { pluginsExec } from "interfaces";
import './events';

Exec(pluginsExec.INIT);
/* END OF LATE INITIALIZATION */
let initEnd = new Date().valueOf()
//Anti-Stuck Sys
try {runCMDs([`inputpermission set @a movement enabled`]);}catch {}

console.warn(`Hello map! Load tooks ${initEnd-initStart}ms`);



