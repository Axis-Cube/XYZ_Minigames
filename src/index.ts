/*    EARLY INITIALIZATION    */
import "#root/modules/core/games/main";
import "#root/initialization"
/*     LATE INITIALIZATION    */
import { Exec } from '#root/modules/core/plugins/main';
import { runCMDs } from '#modules/axisTools'
import { pluginsExec } from "interfaces";
import '#root/events';
try {runCMDs([`inputpermission set @a movement enabled`]);}catch {}
Exec(pluginsExec.INIT);
