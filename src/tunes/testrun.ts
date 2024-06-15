//import { getScore, getScorev2, scoreboard } from "../modules/axisTools";
import {
    ActionFormData,
    ModalFormData,
  } from "@minecraft/server-ui";
import { load_log } from "../modules/Logger/logger";
import { EvalForm, axisEval } from "../modules/evalSandbox";

export const TESTERS = {
    "alexthecools260": 1,
    "hew1n": 1,
    "elitethevii": 1,
    "violetctrini": 2,
    "direberet993593": 1,
    "axisander": 4,
    "olecssandr yt": 4,
    "miaumiez": 4,
    "lndrs2224": 4,
    "drak5945": 1,
    "tvminerpe": 3,
}

export const TESTER_LEVELS = [
    'axiscube.testrun.level.beginner',
    'axiscube.testrun.level.active',
    'axiscube.testrun.level.advanced',
    'axiscube.testrun.level.pro',
    'axiscube.testrun.level.dev'
]
export async function formTestRun(target) {
    let name = target.name
    let level = TESTERS[name.toLowerCase()]
    if (level == undefined) {
        level = 0
    }
    let levelword = TESTER_LEVELS[level]
    let bodyText = {
        rawtext: [
            {
                translate: 'axiscube.testrun.welcome2',
                with: {rawtext:[{ text: '\n'},{text: name},{translate: levelword}]}
            }
        ]
    }
    let ue_status = ['§4[Disabled]§r', '§2[Enabled]§r']
    function ue_next(num){
        if(num==1)return 0
        else return 1
    }


    //Permissions
    let scopes = {
        'logs': 3,
        'eval': 4,
    }

    let availability = {
        'available': '',
        'logs': ` §9[Need level ${scopes['logs']}]§r`,
        'eval': ` §9[Need level ${scopes['eval']}]§r`
    }

    function check_perms(scope){

        if(level>=scopes[scope]){
            return [true,availability['available']]
        }else{
            return [false,availability[scope]]
        }
    }

    ///

    const form = new ActionFormData()
    form.title("%axiscube.testrun.button")
    form.body(bodyText)
    //form.button(`Unlimited emeralds ${ue_status[getScore('settings','tsrun_unlimit_em',true)]}`,'textures/items/emerald')
    form.button('%axiscube.testrun.logs' + check_perms('logs')[1], 'textures/items/spyglass')
    form.button('%axiscube.testrun.eval' + check_perms('eval')[1], 'textures/items/spyglass')
    form.button('%gui.close', 'textures/blocks/barrier')
    form.show(target).then(gg => {
        if (gg.canceled) return
        switch (gg.selection) {
            case 0:
                if (check_perms('logs')[0]) {
                    load_log('games_log', target)
                }
                break;
            //scoreboard('tsrun_unlimit_em', ue_next(getScore('settings','tsrun_unlimit_em',true)), 'settings')
            case 1:
                if (check_perms('eval')[0]) {
                    EvalForm.show(target).then(ef => {
                        if(!ef.formValues){return;}

                        let [command] = String(ef.formValues)
                        axisEval(command, target)
                    })
                }
                break;
            default:
                break;
        }
    })
}
