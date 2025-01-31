let initStart = new Date().valueOf()
/*    EARLY INITIALIZATION    */
import "#games/main";
import "#root/initialization"
/*     LATE INITIALIZATION    */
import { Exec } from '#root/modules/core/plugins/main';
import { runCMDs } from '#modules/axisTools'
import { pluginsExec } from "interfaces";
import '#root/events';

Exec(pluginsExec.INIT);
/* END OF LATE INITIALIZATION */
let initEnd = new Date().valueOf()
//Anti-Stuck Sys
try {runCMDs([`inputpermission set @a movement enabled`]);}catch {}

console.warn(`Hello map! Load tooks ${initEnd-initStart}ms`);

