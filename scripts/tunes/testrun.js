//import { getScore, getScorev2, scoreboard } from "../modules/axisTools";
import {
    ActionFormData,
    ModalFormData,
  } from "@minecraft/server-ui";

export const TESTERS = {
    "alexthecools260": 1,
    "hew1n": 1,
    "elitethevii": 1,
    "violetctrini": 2,
    "direberet993593": 1,
    "axisander": 4,
    "olecssandr yt": 4,
    "miaumiez": 4,
    "lndrs2224": 4
}

export const TESTER_LEVELS = [
    'axiscube.testrun.level.beginner',
    'axiscube.testrun.level.active',
    'axiscube.testrun.level.advanced',
    'axiscube.testrun.level.pro',
    'axiscube.testrun.level.dev'
]
export function formTestRun(target) {
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
    const form = new ActionFormData()
    form.title("%axiscube.testrun.button")
    form.body(bodyText)
    //form.button(`Unlimited emeralds ${ue_status[getScore('settings','tsrun_unlimit_em',true)]}`,'textures/items/emerald')
    form.button('%gui.close','textures/blocks/barrier')
    form.show(target).then(gg => {
        if(gg.canceled) return
        switch (gg.selection){
            case 0:
                //scoreboard('tsrun_unlimit_em', ue_next(getScore('settings','tsrun_unlimit_em',true)), 'settings')
                //break
            default:
                break;
        }
    })}
