/*     LATE INITIALIZATION    */
import "./games/main";
/* END OF LATE INITIALIZATION */

//import { TikTakToe } from './games/lobby.js' //TikTakToe()

import { Process } from './modules/Core_Plugins/index';
import { runCMDs } from './modules/axisTools'
import './events';

Process('Init');

//Anti-Stuck Sys
try {runCMDs([`inputpermission set @a movement enabled`]);}catch {}


console.warn('Hello map!');


