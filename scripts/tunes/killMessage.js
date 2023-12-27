import { ActionFormData } from "@minecraft/server-ui"
import { randomInt, shuffle, tellraw } from "../modules/axisTools"
import { STORE_COLOR, formShowOffersByCategory, getItemsByCategory, getPurchasedItemsByCategory } from "./store"
import { editPlayerSettings, formCustomize, getPlayerSettings } from "./profile"
import { ICONS } from "../const"

// export const KILL_MESSAGES = [
//     0, 1, 2
// ]

export const FILE_TYPES = ['txt','png','jpg','js','jpeg','exe','exe','exe','exe','bat','bin','ts','mcplayer','plr','lnk','zip','rar']

export const KILL_MESSAGES_SAMPLE_PREYNAME = {
    0: 'Steve',
    1: `STEVE.${shuffle(FILE_TYPES)[0]}`,
    2: 'Steve',
    3: '§dKen§r',
    4: 'Doge',
    5: 'Alex'
}

export function killMessage(killer,prey,projectile) {
    let currentSettings = getPlayerSettings(killer.name)
    let messageType = currentSettings.sel.killmsg
    if (messageType == -1) {
        let purc = getPurchasedItemsByCategory(killer.name,'killmsg',true)
        purc.push(0)
        messageType = shuffle(purc)[0]
    }
    let killerName = killer.nameTag
    let preyName = prey.nameTag
    if (messageType == 1) {
        preyName = `${preyName.replace(/ /g,"_").toUpperCase()}.${shuffle(FILE_TYPES)[0]}`
    }
    let suffix = ''
    if (projectile) suffix = '.bow'
    tellraw(`{"rawtext":[{"translate":"axiscube.kill.t${messageType}${suffix}","with":["${preyName}","${killerName}"]}]}`,'@a')
}

export function knockVoidMessage(killer,prey) {
    let currentSettings = getPlayerSettings(killer.name)
    let messageType = currentSettings.sel.killmsg
    if (messageType == -1) {
        let purc = getPurchasedItemsByCategory(killer.name,'killmsg',true)
        purc.push(0)
        messageType = shuffle(purc)[0]
    }
    let killerName = killer.nameTag
    let preyName = prey.nameTag
    if (messageType == 1) {
        preyName = `${preyName.replace(/ /g,"_").toUpperCase()}.${shuffle(FILE_TYPES)[0]}`
    }
    tellraw(`{"rawtext":[{"translate":"axiscube.kill.t${messageType}.void","with":["${preyName}","${killerName}"]}]}`,'@a')
}

export function haveVoidMessage(player) {
    tellraw(`{"rawtext":[{"translate":"axiscube.void.t${randomInt(0,2)}","with":["${player.nameTag}"]}]}`,'@a')
}

export function playerKillmsgList(player,showBackButton=true) {
    let name = player.name
    let items = getPurchasedItemsByCategory(name,'killmsg',true)
    let selArr = [ undefined, -1, 0 ]
    if (showBackButton) { selArr = [ undefined, undefined, -1, 0 ] }
    let currentSettings = getPlayerSettings(name)

    const form = new ActionFormData()
    .title('%axiscube.store.killmsg.s')
    .body(`%axiscube.store.killmsg.d`)
    if (showBackButton) {
        form.button('%gui.back',"textures/ui/icons/back")
    }
    form.button(`${STORE_COLOR}%axiscube.store.action.view_in_store`,ICONS.store)
    form.button(`${currentSettings.sel.killmsg == -1 ? '\ue124 ' : ''}%axiscube.store.action.random`,ICONS.dice)
    form.button({rawtext:[{text:`${currentSettings.sel.killmsg == 0 ? '\ue124 ' : ''}§r`},{translate:`axiscube.kill.t0`,with:[KILL_MESSAGES_SAMPLE_PREYNAME[0],`§q${player.nameTag}`]}]})

    for (let item of items) {
        selArr.push(item)
        form.button({rawtext:[{text:`${currentSettings.sel.killmsg == item ? '\ue124 ' : ''}§r`},{translate:`axiscube.kill.t${item}`,with:[KILL_MESSAGES_SAMPLE_PREYNAME[item],`§q${player.nameTag}`]}]})
    }
    form.show(player).then(async gg => {
        if ((gg.selection == 0 && !showBackButton) || gg.selection == 1 && showBackButton) {
            formShowOffersByCategory(player,'killmsg',false)
        } else if (showBackButton && gg.selection == 0) {
            formCustomize(player)
        } else if ((gg.selection > 0 && !showBackButton) || gg.selection > 1) {
            currentSettings.sel.killmsg = selArr[Number(gg.selection)]
            await editPlayerSettings(name,currentSettings)
            playerKillmsgList(player,showBackButton)
        }
    })
}