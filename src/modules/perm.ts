import { nameToPlayer, rawtext, runCMD, tellraw } from "./axisTools"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { formPermLocalSettings, formPermSettings } from "#tunes/mapSettings"
import { DATABASE_IDS, ICONS } from "../const"
import { getPlayerColor } from "#tunes/profile"
import { world } from "@minecraft/server"
import { dbGetPlayerRecord, dbGetRecord, dbSetPlayerRecord, dbSetRecord } from "./cheesebase"
import { rawtextMessage } from "interfaces"

const PERM_DEF = ['\ue126 %axiscube.settings.perms.global.everyone','\ue12f %axiscube.settings.perms.global.mapmanager']
const PERM_DEF_LOC = ['%axiscube.settings.perms.local.default','\ue12f %axiscube.settings.perms.local.false','\ue126 %axiscube.settings.perms.local.true']
const MAINOP_CMD = '/scripevent axiscube:claimop'

const DB_DEFAULT = {
    start: true,
    stop: true,
    setting: true,
    pvp_activate: true,
    pvp_create: true,
    pvp_edit: true,
    pvp_remove: true
}


export const DB_S = '#'

export function getDefaultPlayerPerms() {
    let defaultLocalPerm = {}
    let globalPerms = getGlobalPerms()
    for (let i in globalPerms) {
        defaultLocalPerm[i] = -1
    }
    return defaultLocalPerm
}

export function getGlobalPerms() {
    let id: string = String(DATABASE_IDS['settings_perm'])
    return dbGetRecord(id, DB_DEFAULT)
}

export async function editGlobalPerms(obj) {
    let id: string = String(DATABASE_IDS['settings_perm'])
    await dbSetRecord(id,obj)
}

export function getPlayerPerms(name) {
    return dbGetPlayerRecord(name,DB_S,getDefaultPlayerPerms())
}

export async function editPlayerPerms(name,obj) {
    await dbSetPlayerRecord(name,DB_S,obj)
}

export function checkPerm(name,type) {
    if (typeof name == 'object') {
        if (isManager(name)) return true
        name = name.name
    }
    if (isManager(nameToPlayer(name))) return true
    let perms = getPlayerPerms(name)
    let perm = perms[type]
    if (perm == -1) { perm = getGlobalPerms()[type] }
    if (typeof perm === 'number') perm = Boolean(perm)
    return perm
}

/**
 * @param {import("@minecraft/server").Player} player
*/
export function isMainManager(player) {
    return player.hasTag('perm.op.main')
}

/**
 * @param {import("@minecraft/server").Player} player
*/
export function isManager(player) {
    return player.hasTag('perm.op') || player.hasTag('perm.op.temp') || player.hasTag('perm.op.main')
}

export function isTempManager(player) {
    return player.hasTag('perm.op.temp')
}

/**
 * @param {import("@minecraft/server").Player} player
*/
export function formGlobalPerms(player) {
    const name = player.name
    const perms: string[] = getGlobalPerms()
    const setable: string[] = []
    let newperms: any = {}

    const form = new ModalFormData()
    .title('%axiscube.settings.perms.global')

    for (let i in perms) {
        setable.push(i)
        form.dropdown(`%axiscube.perm.lz.${i}`,PERM_DEF,perms[i] ? 0 : 1)
    }
    form.show(player).then(async gg => { if (!gg.canceled) {
        if(!gg.formValues){return;}
        for (let i in setable) {
            newperms[setable[i]] = gg.formValues[i] == 0
        }
        await editGlobalPerms(newperms)
        formPermSettings(player)
    }})
}

/**
 * @param {import("@minecraft/server").Player} player
*/
export function formLocalPerms(player,name) {
    const perms = getPlayerPerms(name)
    const setable: string[] = []
    let newperms = {}

    const form = new ModalFormData()
    .title('%axiscube.settings.perms.local')

    for (let i in perms) {
        setable.push(i)
        form.dropdown(`%axiscube.perm.lz.${i}`,PERM_DEF_LOC,perms[i]+1)
    }
    form.show(player).then( async gg => { if (!gg.canceled) {
        if(!gg.formValues){return}

        for (let i in setable) {
            newperms[setable[i]] = Number(gg.formValues[i])-1
        }
        await editPlayerPerms(name,newperms)
        formPermSettingPlayer(player,name)
    }})
}

/**
 * @param {import("@minecraft/server").Player} player
*/
export function formPermSettingPlayer(player,name) {

    const isMapManager = isManager(nameToPlayer(name))
    const isMapTempManager = isTempManager(nameToPlayer(name))
    const isMapMainManager = isMainManager(nameToPlayer(name))

    const form = new ActionFormData()
    .title('%axiscube.settings.map')
    .button('%gui.back',ICONS.back)

    if (isMapManager) {
        if (isMapManager && !isMapMainManager && !isMapTempManager) {
            form.body({rawtext:[{translate:'axiscube.settings.perms.local.manager',with:[name]}]})
            form.button('%axiscube.settings.perms.local.revoke',ICONS.decrown)
        } else if (isMapMainManager) {
            form.body({rawtext:[{translate:'axiscube.settings.perms.local.manager.main',with:[name]}]})
            form.button('%axiscube.settings.perms.local.revoke.boss',ICONS.decrown)
        } else if (isMapTempManager) {
            form.body({rawtext:[{translate:'axiscube.settings.perms.local.manager.temp',with:[name]}]})
        }
    } else {
        form.body({rawtext:[{translate:'axiscube.settings.perms.local.not_manager',with:[name]}]})
        form.button('%axiscube.settings.perms.local.grant',ICONS.crown)
        form.button('%axiscube.settings.perms.local.configure',ICONS.settings)
    }


    form.show(player).then( gg => {
        if (gg.selection == 0) {
            formPermLocalSettings(player)
        } else if (isMapManager) {
            if (!isMapMainManager && !isMapTempManager) {
                if (gg.selection == 1 && isMainManager(player) && !nameToPlayer(name)?.isOp()) {
                    runCMD('tag @s remove perm.op',name)
                    tellraw({rawtext:[{translate:'axiscube.perm.op.revoked.by_leader.public',with:[`${getPlayerColor(name)}${name}`,`${getPlayerColor(player.name)}${player.name}`]}]})
                    tellraw({rawtext:[{translate:'axiscube.perm.op.revoked.generic',with:[`${getPlayerColor(player.name)}${player.name}`]}]},name)
                } else if (gg.selection == 1 && isMainManager(player) && nameToPlayer(name)?.isOp()) {
                    let disName = name
                    if (disName.includes(' ')) { disName = `"${name}"` }
                    const form = new ActionFormData()
                        .title('%gui.error')
                        .body({rawtext:[{translate:'axiscube.settings.perms.local.revoke.opped_error',with:[`§e/deop "${name}"§r`]}]})
                        .button('%gui.back',ICONS.back)
                        .show(player).then( gg => { if (gg.selection == 0) {formPermLocalSettings(player)}})
                } else if (gg.selection == 1 && !isMainManager(player)) {
                    formMainOpNeeded(player,0,()=>{formPermSettingPlayer(player,name)})
                }
            } else if (isMapMainManager) {
                formMainOpNeeded(player,1,()=>{formPermSettingPlayer(player,name)})
            }
        } else if (!isMapManager) {
            if (gg.selection == 1 && isMainManager(player)) {
                runCMD('tag @s add perm.op',name)
                tellraw({rawtext:[{translate:'axiscube.perm.op.granted.by_leader.public',with:[`${getPlayerColor(name)}${name}`,`${getPlayerColor(player.name)}${player.name}`]}]})
                tellraw({rawtext:[{translate:'axiscube.perm.op.granted.by_leader',with:[`${getPlayerColor(player.name)}${player.name}`]}]},name)
            } else if (gg.selection == 1 && !isMainManager(player)) {
                formMainOpNeeded(player,0,()=>{formPermSettingPlayer(player,name)})
            } else if (gg.selection == 2) formLocalPerms(player,name)
        }
    })
}


export function formMainOpNeeded(player,link=0,callback) {
    if (link == 0) {
        const form = new ActionFormData()
            .title('%axiscube.perm.denied')
            .body('§c%axiscube.perm.denied.op.main')
            .button('%axiscube.settings.perms.local.revoke.boss',ICONS.decrown)
            
            if (callback == undefined) {
                form.button('%gui.close',ICONS.den)
            } else {
                form.button('%gui.back',ICONS.back)
            }

            form.show(player).then( gg => {
                if (gg.selection == 0) {
                    formMainOpNeeded(player,1,()=>{formMainOpNeeded(player,0,callback)})
                } else if (gg.selection == 1) {
                    if (callback != undefined) {
                        callback()
                    }
                }
            })
    } else if (link == 1) {
        const form = new ActionFormData()
        .title('%axiscube.settings.perms.local.revoke.boss')
        if (callback == undefined) {
            form.button('%gui.close',ICONS.den)
        } else {
            form.button('%gui.back',ICONS.back)
        }
        form.button('%gui.continue',ICONS.act)
        let text = {rawtext:[{translate:'axiscube.perm.main_op.d'},{text:'\n\n'}]}
        let mainOp: string | undefined = undefined
        for (const playerT of [...world.getPlayers()]) {
            if (isMainManager(playerT)) mainOp = playerT.name
        }
        if (mainOp != undefined) {
            let raw: rawtextMessage = {translate:'axiscube.perm.main_op.d.has_leader',with:[mainOp]}
            text.rawtext.push(raw)
        } else {
            text.rawtext.push({translate:'axiscube.perm.main_op.d.no_leader'})
        }
        text.rawtext.push({text:'\n\n'})

        let raw: rawtextMessage = {translate:'axiscube.perm.main_op.d.final',with:[MAINOP_CMD]}
        text.rawtext.push(raw)
        form.body(text)
        form.show(player).then( gg => {
            if (gg.selection == 0) {
                if (callback != undefined) {
                    callback()
                }
            } else if (gg.selection == 1) {
                rawtext(MAINOP_CMD,player,'tr','e')
            }
        })
    }
}