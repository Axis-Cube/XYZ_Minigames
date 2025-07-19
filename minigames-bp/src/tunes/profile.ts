import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { ICONS, REGION_CODES, REGION_NAMES, SCOLOR, SYM } from "../const";
import { playsound, randomInt,  shuffle,  tellraw } from "../modules/axisTools";
import { playerKillmsgList } from "./killMessage";
import { STORE_COLOR, formShowCategories, formShowOffersByCategory, getPurchasedItemsByCategory } from "./store";
import { getMoney } from "./bank";
import { openJSON } from "../modules/easyform";
import { dbGetPlayerRecord, dbSetPlayerRecord } from "../modules/cheesebase";

const DB_DEFAULT = {
    region: 0,
    sel: {
        killmsg: 0,
        elmsg: 0,
        colorname: '',
        soundmsg: 'random.pop2'
    },
    gamedata: {
        '5': { kitsel: 0 }
    }
}

const DB_S = '@'

export const SOUNDMSG = {
    'random.pop2' : ['Pop2!',[1,1.5],[1,1]],
    'random.pop' : ['Pop!',[1,1.5],[1,1]],
    'random.toast' : ['Toast!',[1,1.5],[1,1]],
    'mob.player.oof' : ['OOOF!',[0.5,1.5],[0.5,1]],
    'mob.evocation_illager.ambient' : ['Illager',[0.5,1.5],[0.5,1]],
    'mob.villager.no' : ['Angry Villager',[0.5,1.5],[0.5,1]],
    'mob.villager.yes' : ['Good Villager',[0.5,1.5],[0.5,1]],
    'random.orb' : ['Orb',[0.5,1.5],[0.5,1]]
}

export function getPlayerSettings(name) {
    return dbGetPlayerRecord(name,DB_S,DB_DEFAULT)
}

export async function editPlayerSettings(name,obj) {
    await dbSetPlayerRecord(name,DB_S,obj)
}

export function getPlayerGamedata(name,gameId,record) {
    return getPlayerSettings(name).gamedata[gameId][record]
}

export function editPlayerGamedata(name,gameId,record,data) {
    let sett = getPlayerSettings(name)
    sett.gamedata[gameId][record] = data
    editPlayerSettings(name,sett)
}

export function getPlayerAvatar(name,type='icon') {
    if (type == 'icon') {
        return `textures/ui/icons/avatars/${randomInt(1,9)}`
    }
}

export function getPlayerSoundMessage(name) {
    return getPlayerSettings(name).sel.soundmsg
}

export function formProfile(player) {
    const name = player.name
    const playerSettings = getPlayerSettings(name)
    
    const country = REGION_CODES[playerSettings.region]
    const countryName = REGION_NAMES[country]

    const form = new ActionFormData()
    .title('%axiscube.profile')
    .body(`%axiscube.profile.region.my: §b${countryName} [${country}]\n\n§r%axiscube.bank.balance.my: ${SCOLOR}${getMoney(name)}${SYM}`)
    .button(`%gui.back`,"textures/ui/icons/back")
    .button('%axiscube.profile.region.edit','textures/ui/icons/earth')
    .button(`${STORE_COLOR}%axiscube.store`,ICONS.store)
    .button('%axiscube.profile.customize',ICONS.customize)
    .show(player).then(gg => {
        if (gg.selection == 0) {openJSON('mainmenu',player)}
        else if (gg.selection == 1) {formEditRegion(player)}
        else if (gg.selection == 2) {formShowCategories(player)}
        else if (gg.selection == 3) {formCustomize(player)}
    })

}

export function formCustomize(player) {
    const name = player.name
    const form = new ActionFormData()
    .title('%axiscube.profile.customize')
    .body(``)
    .button(`%gui.back`,"textures/ui/icons/back")
    .button(`${STORE_COLOR}%axiscube.store.action.view_in_store`,ICONS.store)
    .button('%axiscube.store.killmsg.s','textures/ui/icons/store/killmsg')
    .button('%axiscube.store.colorname.s','textures/ui/icons/store/colorname')
    .button('%axiscube.store.soundmsg.s','textures/ui/icons/store/soundmsg')
    .button('%axiscube.store.elmsg.s','textures/ui/icons/store/elmsg')
    .show(player).then(gg => { if (!gg.canceled) {
        if (gg.selection == 0) {
            formProfile(player)
        } else if (gg.selection == 1) {
            formShowCategories(player)
        } else if (gg.selection == 2) {
            playerKillmsgList(player)
        } else if (gg.selection == 3) {
            formSetcolor(player)
        } else if (gg.selection == 4) {
            formSetSoundmsg(player)
        } else if (gg.selection == 5) {
            playerElmsgList(player)
        }
    }})
}

export function getPlayerColor(name) {
    return getPlayerSettings(name).sel.colorname
}

export function formSetcolor(player) {
    const name = player.name
    const currentColor = getPlayerColor(name)
    const colors = ['',...getPurchasedItemsByCategory(name,'colorname',true)]
    const form = new ActionFormData()
    .title('%axiscube.store.colorname')
    .body(`%axiscube.store.colorname.d`)
    .button(`%gui.back`,"textures/ui/icons/back")
    .button(`${STORE_COLOR}%axiscube.store.action.view_in_store`,ICONS.store)
    for (let i of colors) {
        form.button(`${currentColor == i ? '\ue124 ' : ''}${i}${name}`)
    }
    form.show(player).then(async gg => { if (!gg.canceled) {
        if (gg.selection === 0) {
            formCustomize(player)
        } else if (gg.selection === 1) {
            formShowOffersByCategory(player,'colorname',false)
        } else {
            let color = colors[Number(gg.selection)-2]
            player.nameTag = `${color}${name}§r`
            let currentSettings = getPlayerSettings(name)
            currentSettings.sel.colorname = color
            await editPlayerSettings(name,currentSettings)
            formSetcolor(player)
        }
    }})
}

export function formSetSoundmsg(player) {
    const name = player.name
    const currentSound = getPlayerSoundMessage(name)
    const sounds = ['random.pop2',...getPurchasedItemsByCategory(name,'soundmsg',true)]
    const form = new ActionFormData()
    .title('%axiscube.store.soundmsg')
    .body(`%axiscube.store.soundmsg.d`)
    .button(`%gui.back`,"textures/ui/icons/back")
    .button(`${STORE_COLOR}%axiscube.store.action.view_in_store`,ICONS.store)
    for (let i of sounds) {
        form.button(`${currentSound == i ? '\ue124 ' : ''}${SOUNDMSG[i][0]}`)
    }
    form.show(player).then(async gg => { if (!gg.canceled) {
        if(!gg.selection){return;}

        if (gg.selection === 0) {
            formCustomize(player)
        } else if (gg.selection === 1) {
            formShowOffersByCategory(player,'soundmsg',false)
        } else {
            let currentSettings = getPlayerSettings(name)
            currentSettings.sel.soundmsg = sounds[gg.selection-2]
            playsound(sounds[gg.selection-2],player)
            await editPlayerSettings(name,currentSettings)
            formSetSoundmsg(player)
        }
    }})
}

export function formEditRegion(player,comment='') {
    let name = player.name
    let body = `${comment}%axiscube.profile.region.edit.d.header\n\n%axiscube.profile.region.edit.d\n* §bUS§r - %axiscube.profile.region.edit.d.example.us\n* §bRU§r - %axiscube.profile.region.edit.d.example.ru\n* §bEE§r - %axiscube.profile.region.edit.d.example.ee\n`
    const form = new ModalFormData()
    .title('%axiscube.profile.region')
    .textField(body,'%axiscube.profile.region.edit.placeholder')
    .show(player).then(gg => { if (!gg.canceled) {
        if(!gg.formValues){return;}

        let enteredCode = String(gg.formValues[0]).toUpperCase()
        if (REGION_NAMES[enteredCode] == undefined) {
            formEditRegion(player,'§c%axiscube.profile.region.edit.d.error\n§r\n')
            return
        } else {
            const form = new ActionFormData()
                .title('%axiscube.profile.region')
                .body(`%axiscube.profile.region.edit.confirm §b${REGION_NAMES[enteredCode]} [${enteredCode}]`)
                .button('%gui.confirm')
                .button('%gui.back')
                .button('%gui.close')
                .show(player).then(gg => {
                    if (gg.selection === 0) {
                        let playerSettings = getPlayerSettings(name)
                        playerSettings.region = REGION_CODES.indexOf(enteredCode)
                        editPlayerSettings(name,playerSettings)
                    } else if (gg.selection === 1) {
                        formEditRegion(player)
                    }
                })
        }
    }})
}

export function eliminatePlayerMessage(name) {
    let isPlayer = false
    let player
    if (typeof name == 'object') {
        isPlayer = true
        player = name
        name = name.name
    }
    let currentSettings = getPlayerSettings(name)
    let messageType = currentSettings.sel.elmsg
    if (messageType == -1) {
        let purc = getPurchasedItemsByCategory(name,'elmsg',true)
        purc.push(0)
        messageType = shuffle(purc)[0]
    }
    if (isPlayer) {
        tellraw({rawtext:[{translate:`axiscube.games.eliminated.t${messageType}`,with:[`${player.nameTag}`]}]})
    } else {
        tellraw({rawtext:[{translate:`axiscube.games.eliminated.t${messageType}`,with:[`${getPlayerColor(name)}${name}`]}]})
    }
    
}

export function playerElmsgList(player,showBackButton=true) {
    let name = player.name
    let items = getPurchasedItemsByCategory(name,'elmsg',true)
    let selArr = [ undefined, -1, 0 ]
    if (showBackButton) { selArr = [ undefined, undefined, -1, 0 ] }
    let currentSettings = getPlayerSettings(name)

    const form = new ActionFormData()
    .title('%axiscube.store.elmsg.s')
    .body(`%axiscube.store.elmsg.d`)
    if (showBackButton) {
        form.button('%gui.back',"textures/ui/icons/back")
    }
    form.button(`${STORE_COLOR}%axiscube.store.action.view_in_store`,ICONS.store)
    form.button(`${currentSettings.sel.elmsg == -1 ? '\ue124 ' : ''}%axiscube.store.action.random`,ICONS.dice)
    form.button({rawtext:[{text:`${currentSettings.sel.elmsg == 0 ? '\ue124 ' : ''}§r`},{translate:`axiscube.games.eliminated.t0`,with:[`§q${player.nameTag}`]}]})

    for (let item of items) {
        selArr.push(item)
        form.button({rawtext:[{text:`${currentSettings.sel.elmsg == item ? '\ue124 ' : ''}§r`},{translate:`axiscube.games.eliminated.t${item}`,with:[`§q${player.nameTag}`]}]})
    }
    form.show(player).then(async gg => {
        if(!gg.selection){return;}

        if ((gg.selection == 0 && !showBackButton) || gg.selection == 1 && showBackButton) {
            formShowOffersByCategory(player,'elmsg',false)
        } else if (showBackButton && gg.selection == 0) {
            formCustomize(player)
        } else if ((gg.selection > 0 && !showBackButton) || gg.selection > 1) {
            currentSettings.sel.elmsg = selArr[Number(gg.selection)]
            await editPlayerSettings(name,currentSettings)
            playerElmsgList(player,showBackButton)
        }
    })
}