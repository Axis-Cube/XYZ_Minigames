import {
    ActionFormData
} from "@minecraft/server-ui"
import { system } from "@minecraft/server"
import { runCMD, rawtext, tellraw } from './axisTools'
import { FORMS } from "../forms"
import { axisEval } from "./evalSandbox"

export function actionsChain(chain,player) {
    let name = player.name
    for (let i in chain) {
        let toValue = chain[i].value
        switch (chain[i].type) {
            case 'eval':
                axisEval(toValue,player)
                break
            case 'cmds':
                for (let j in toValue) {
                    runCMD(toValue[j],name)
                }
                break
            case 'say':
                rawtext(toValue,name)
                break
            case 'cmd':
                runCMD(toValue,name)
                break
            case 'form':
                openJSON(toValue,player)
                break
            case 'tellraw':
                tellraw(toValue,name)
                break
            case 'tellraw_sel':
                tellraw(toValue[1],toValue[0])
                break
        }
    }
}

export function openJSON(systemName,player,formobj=FORMS) {
    system.run(() => {
        let name = player.name
        let formData = formobj[systemName]
        //JSON.stringify(formData)

        const formTale = new ActionFormData()
        formTale.title(formData.title)
        formTale.body(formData.body)

        let buttons = formData.buttons
        for (let i in buttons) {
            let thisButt = buttons[i]
            if (thisButt.icon != undefined || thisButt.icon != '') {
                formTale.button(thisButt.button_name,thisButt.icon)
            } else {
                formTale.button(thisButt.button_name)
            }
        }

        formTale.show(player).then(gg => {
            if (gg.selection != undefined) {
                actionsChain(buttons[gg.selection].on_click,player)
            } else if (formData.on_close != undefined) {
                actionsChain(formData.on_close,player)
            }
        })
    })
}