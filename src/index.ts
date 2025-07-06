import {world} from "@minecraft/server";
/*    EARLY INITIALIZATION    */
import "./initialization"

let initStart = new Date().valueOf()

/*     LATE INITIALIZATION    */
world.afterEvents.worldLoad.subscribe(world => {
    import("./games/main");
    //import { TikTakToe } from './games/lobby.js' //TikTakToe()
    import('./modules/Core_Plugins/index').then(({Exec}) => {
        import("./interfaces").then(({pluginsExec})=>{
            Exec(pluginsExec.INIT);
        })

    });

    import('./modules/axisTools').then(({runCMDs})=>{
        try {runCMDs([`inputpermission set @a movement enabled`]);}catch {}
    })

    import('./events');

    let initEnd = new Date().valueOf()
    console.warn(`Hello map! Load tooks ${initEnd-initStart}ms`);
})
/* END OF LATE INITIALIZATION */




