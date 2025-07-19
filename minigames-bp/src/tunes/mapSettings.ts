import {world} from "@minecraft/server"
import {ActionFormData} from "@minecraft/server-ui"
import {
    checkPerm,
    formGlobalPerms,
    formMainOpNeeded,
    formPermSettingPlayer,
    isMainManager,
    isManager,
    isTempManager
} from "../modules/perm.js"
import {nameToPlayer, rawtext} from "../modules/axisTools.js"
import {ICONS} from "../const.js"
import {openJSON} from "../modules/easyform.js"
import {getPlayerAvatar, getPlayerColor} from "./profile.js"
import {showWindow} from "../modules/Core_Plugins/index.js"

/**
 * @param {import("@minecraft/server").Player} player
*/
export function formMapSettings(player) {
    const name = player.name

    if (!checkPerm(name,'setting')) {
        rawtext('axiscube.perm.denied.setting',name,'translate','c')
        return
    }

    const form = new ActionFormData()
    .title('%axiscube.settings.map')
    .body('')
    .button('%gui.back',ICONS.back)
    .button('%axiscube.settings.perms',ICONS.crown)
    .button('%axiscube.settings.plugins',ICONS.import)
    .show(player).then( gg => {
        switch (gg.selection) {
            case 0:
                openJSON('mainmenu',player)
            break;
            case 1:
                formPermSettings(player)
            break;
            case 2:
                showWindow(player)
            break;
        }
    })
}

/**
 * @param {import("@minecraft/server").Player} player
*/
export function formPermSettings(player) {
    const name = player.name

    if (!isManager(player)) {
        rawtext('axiscube.perm.denied.setting',name,'translate','c')
        return
    }

    const form = new ActionFormData()
    .title('%axiscube.settings.map')
    .body('%axiscube.settings.perms')
    .button('%axiscube.settings.perms.global',ICONS.pl3)
    .button('%axiscube.settings.perms.local',ICONS.plsel)
    .button('%gui.back',ICONS.back)
    .show(player).then( gg => {
        if (gg.selection == 0) {
            formGlobalPerms(player)
        } else if (gg.selection == 1) {
            formPermLocalSettings(player)
        } else if (gg.selection == 2) {
            formMapSettings(player)
        }
    })
}

/**
 * @param {import("@minecraft/server").Player} player
*/
export function formPermLocalSettings(player) {

    const name = player.name
    const playerData = [...world.getPlayers()]
    const playerNames = Array.from(playerData,plr=>plr.name)

    const form = new ActionFormData()
    .title('%axiscube.settings.map')
    .body('%axiscube.settings.perms')
    .button('%gui.back',ICONS.back)

    for (const nameT of playerNames) {
        let sign = ''
        let playerT = nameToPlayer(nameT)
        if (isMainManager(playerT)) { sign = '§r§l§8\n[%axiscube.settings.perms.role.op.main]' }
        else if (isTempManager(playerT)) { sign = '§r§8§l\n[%axiscube.settings.perms.role.op.temp]' }
        else if (isManager(playerT)) { sign = '§r§8§l\n[%axiscube.settings.perms.role.op]' }
        form.button(`§q${getPlayerColor(nameT)}${nameT}${sign}`,getPlayerAvatar(nameT))
    }
    form.button('%axiscube.settings.perms.howto',ICONS.crown)

    form.show(player).then( gg => {
        if (!gg.selection){return;}
         
        if (gg.selection == 0) {
            formPermSettings(player)
        } else if (gg.selection == playerNames.length+1) {
            formMainOpNeeded(player,1,()=>{formPermLocalSettings(player)})
        } else if (gg.selection > 0) {
            formPermSettingPlayer(player,playerNames[gg.selection-1])
        }
    })
}