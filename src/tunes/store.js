import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { nerdMessage, playsound, rawtext, runCMD } from "../modules/axisTools"
import { magicIt } from "../modules/playerNameTag"
import { KILL_MESSAGES_SAMPLE_PREYNAME, playerKillmsgList } from "./killMessage"
import { SYM, CHAT_CODES, ICONS, SCOLOR } from "../const"
import { SOUNDMSG, formProfile, formSetSoundmsg, formSetcolor, playerElmsgList } from "./profile"
import { addMoney, getMoney } from "./bank"
import { GM_CHALLANGES, formGameChallenges } from "../games/chooser"
import { GAMEDATA } from "../games/gamedata"
import { dbGetPlayerRecord, dbSetPlayerRecord } from "../modules/cheesebase"

const DB_S = '$'
export const STORE_COLOR = '§5'
export const STORE_COLOR_LIGHT = '§u'
export const DB_DEFAULT = "[]"
export const CATEGORIES = ['setpack','killmsg','elmsg','colorname','emoji', 'soundmsg']

export const STORE_ITEMS = {
    0: { type: 'killmsg', localData: 1, price: -1, linked: 2, uid: '-66eb48ef' },
    1: { type: 'killmsg', localData: 2, price: 200, uid: '-8202a7' },
    2: { type: 'setpack', namespace: 'devpack', author: 'AxisCube', include: [0, 3, 8, 17, 25, 34], price: 1500, uid: 'a087576' },
    3: { type: 'colorname', localData: '§q', price: -1, linked: 2, uid: '213dc54' },
    4: { type: 'colorname', localData: '§k', price: 5000, uid: '4c195691' },
    5: { type: 'colorname', localData: '§d', linked: 11, price: -1, uid: '-6297602a' },
    6: { type: 'colorname', linked: 11, localData: '§u', price: -1, uid: '6b130197' },
    7: { type: 'colorname', localData: '§6', price: 500, uid: '-24f7cd85' },
    8: { type: 'colorname', localData: '§3', price: 500, linkeds: [2], uid: '-574d6bc4' },
    9: { type: 'colorname', localData: '§c', price: 500, uid: '765cf5fd' },
    10: { type: 'colorname', localData: '§9', price: 500, uid: '-6ea6719d' },
    11: { type: 'setpack', namespace: 'pinkpack', author: 'AxisCube', include: [5, 6, 16, 32], price: 1500, uid: '-6da7e41c' },
    12: { type: 'colorname', localData: '§n', price: 500, uid: '2cae51e5' },
    13: { type: 'colorname', localData: '§1', price: 500, uid: '-5a74c5a' },
    14: { type: 'colorname', localData: '§g', price: 500, uid: '-37fcea99' },
    15: { type: 'colorname', localData: '§0', linked: 31, price: -1, uid: 'd5ab209' },
    16: { type: 'killmsg', localData: 3, linked: 11, price: -1, uid: '-3ef2f63a' },
    17: { type: 'colorname', localData: '§a', price: -1, linked: 2, uid: '-71489479' },
    18: { type: 'colorname', localData: '§b', price: 500, uid: '-1536395' },
    19: { type: 'emoji', localData: `pepe`, price: -1, linked: 20, uid: '2a0c2f09' },
    20: { type: 'setpack', namespace: 'memepack', author: 'xdCube', include: [19, 21, 22, 23, 26, 33], price: 1500, uid: '-53b06f7e' },
    21: { type: 'emoji', localData: `peped`, price: -1, linked: 20, uid: '-5ba508a0' },
    22: { type: 'killmsg', localData: 4, price: -1, linked: 20, uid: '72055921' },
    23: { type: 'colorname', localData: '§2', price: -1, linked: 20, uid: '3fafbae2' },
    24: { type: 'soundmsg', localData: 'random.pop', price: 0, uid: 'c22e' },
    25: { type: 'soundmsg', localData: 'random.toast', price: -1, linked: 2, uid: '-24fb819c' },
    26: { type: 'soundmsg', localData: 'mob.player.oof', price: -1, linked: 20, uid: '-57511fdb' },
    27: { type: 'killmsg', localData: '5', price: 500, uid: '18a41109' },
    28: { type: 'soundmsg', localData: 'mob.evocation_illager.ambient', price: 666, uid: '-4e9736b8' },
    29: { type: 'soundmsg', localData: 'mob.villager.yes', price: 450, uid: '9faee1b' },
    30: { type: 'soundmsg', localData: 'mob.villager.no', price: 450, uid: '-4960ab4f' },
    31: { type: 'setpack', namespace: 'echopack', author: 'AxisCube', include: [15], price: -3, chalId: 0 },
    32: { type: 'elmsg', price: -1, linked: 11, localData: 1 },
    33: { type: 'elmsg', price: -1, linked: 20, localData: 2 },
    34: { type: 'elmsg', price: -1, linked: 2, localData: 3 },
    35: { type: 'setpack', namespace: 'glasspack', author: 'Lndrs_', include: [36], price: -3, chalId: 1 },
    36: { type: 'soundmsg', localData: 'random.orb', price: -1, linked: 35, uid: '-6faf497c' },
}

export function isOwned(id,name) {
    return ( [...getPurchasedItems(name)].map(String).indexOf(`${id}`) != -1)
}

export function getPrice(id,compact=false,name) {
    let price = getRawPrice(id)
    if (name && isOwned(id,name)) {
        return compact ? ' §q(%store.owned)' : '\n§q[%store.owned]'
    } else if (price == -1) {
        return compact ? ` ${STORE_COLOR}[%axiscube.store.price.set]` : `\n${STORE_COLOR}[%axiscube.store.price.set]`
    } else if (price == -2) {
        return compact ? ' §4[%axiscube.store.price.unvaliable]' : '\n§4[%axiscube.store.price.unvaliable]'
    } else if (price == -3) {
        return compact ? ' §t[%axiscube.store.price.challenge]' : '\n§t[%axiscube.store.price.challenge]'
    } else if (price == 0) {
        return compact ? ' §q(%store.free)' : '\n§q[%store.free]'
    } else {
        return compact ? ` ${STORE_COLOR}(${price}${SYM})` : `${STORE_COLOR}\n${price}${SYM}`
    }
}

export function getRawPrice(id) {
    let item = STORE_ITEMS[id]
    if (item.price == -1 || item.price == -2 || item.price == -3) return item.price
    if (item.uid == magicIt(`${id}${item.price*Math.E}`).toString(16)) {
        return item.price
    }
    return -2
}

export async function editItems(name,obj) {
    await dbSetPlayerRecord(name,DB_S,obj)
}

export async function addItem(name,id) {
    if (typeof id == 'string') id = Number(id)
    let purchased = getPurchasedItems(name)
    if (isOwned(id,name)) return
    purchased.push(Number(id))
    let ss = getSsData(name)
    ss[id.toString(36)] = generateTransferCode(id,name)
    //if (id == 11) { console.warn(typeof id, id.toString(36),ss[id.toString(36)],generateTransferCode(id,name)) }

    if (STORE_ITEMS[id].type == 'setpack') {
        for (let i of STORE_ITEMS[id].include) {
            if (!isOwned(i,name)) {
                purchased.push(Number(i))
                ss[i.toString(36)] = generateTransferCode(i,name)
            }
        }
    }
    await editSsData(name,ss)
    await editItems(name,purchased)
}

export function getSsData(name) {
    return dbGetPlayerRecord(name,`${DB_S}${DB_S}`,{})
}

export function editSsData(name,obj) {
    return dbSetPlayerRecord(name,`${DB_S}${DB_S}`,obj)
}

export function formShowCategories(player) {
    //runCMD('stopsound @s random.click',player)
    playsound('random.enderchestopen',player)
    const form = new ActionFormData()
    .title(`${STORE_COLOR}%axiscube.store`)
    .body(`${STORE_COLOR_LIGHT}%axiscube.store.category.choice`)
    .button(`${STORE_COLOR_LIGHT}%gui.back`,ICONS.back)
    form.button(`${STORE_COLOR_LIGHT}%axiscube.store.purchased.title (${getPurchasedItems(player.name).length})`,ICONS.store)
    form.button(`${STORE_COLOR_LIGHT}%axiscube.store.transfer`,ICONS.import)
    for (let cat of CATEGORIES) {
        form.button(`${STORE_COLOR}%axiscube.store.${cat}.s`,`textures/ui/icons/store/${cat}`)
    }
    form.show(player).then(gg => {
        if (gg.canceled) {
            //runCMD('stopsound @s random.click',player)
            playsound('random.enderchestclosed',player)
            return
        } else {
            if (gg.selection == 0) {formProfile(player); playsound('random.enderchestclosed',player); return }
            else if (gg.selection == 1) {formPurchasedItems(player); playsound('block.end_portal_frame.fill',player);return }
            else if (gg.selection == 2) { formItemsTransfer(player); return }
            //runCMD('stopsound @s random.click',player)
            formShowOffersByCategory(player,CATEGORIES[Number(gg.selection)-3])
            playsound('block.end_portal_frame.fill',player)
        }
        
    })
}

export function formItemsTransfer(player) {
    let purchased = []
    let hiddenItems = false
    for (let cat of CATEGORIES) {
        for (let it of getPurchasedItemsByCategory(player.name,cat,false)) {
            if (STORE_ITEMS[it].price != -1) {
                purchased.push(it)
            } else if (!hiddenItems) { hiddenItems = true }
        }
    }
    const form = new ActionFormData()
    .title(`%axiscube.store.transfer`)
    .body(`%axiscube.store.transfer.d`)
    .button(`${STORE_COLOR}%axiscube.store.action.backlink`,"textures/ui/icons/store/back")
    .button(`%axiscube.store.transfer.export`,ICONS.export)
    .button(`%axiscube.store.transfer.import`,ICONS.import)
    .show(player).then(gg => { if (!gg.canceled) {
        if (gg.selection == 0) {
            formShowCategories(player)
        } else if (gg.selection == 1) {
            const form2 = new ActionFormData()
            .title(`%axiscube.store.transfer.export`)
            if (hiddenItems) {
                form2.body(`%axiscube.store.transfer.export.d\n\n%axiscube.store.transfer.export.d.hidden`)
            } else {
                form2.body(`%axiscube.store.transfer.export.d`)
            }
            form2.button('%axiscube.store.transfer.export.all')
            for (let i of purchased) {
                placeProductButton(i,form2,false,player.name)
            }
            form2.show(player).then(gl => { if (!gl.canceled) {
                if (gl.selection == 0) {
                    const form3 = new ModalFormData()
                    .title('%axiscube.store.transfer.export')
                    .textField({rawtext:[{translate:'axiscube.store.transfer.export.code',with:[`${STORE_COLOR_LIGHT}${player.nameTag}§r`]}]},'x.y.z@abcd',generatePowerTransferCode(player.name))
                    .show(player).then(ggwp => { if (!ggwp.canceled) {formItemsTransfer(player)}} )
                } else {
                    let selected = purchased[Number(gl.selection-1)]
                    const form3 = new ModalFormData()
                    .title('%axiscube.store.transfer.export')
                    .textField({rawtext:[{translate:'axiscube.store.transfer.export.code',with:[`${STORE_COLOR_LIGHT}${player.nameTag}§r`]}]},'z@xxxxxx',`${selected.toString(36)}@${generateTransferCode(selected,player.name)}`)
                    .show(player).then(ggwp => { if (!ggwp.canceled) {formItemsTransfer(player)}} )
                }
            }})
        } else if (gg.selection == 2) {
            formImportItem(player)
        }
    }})
}

function generateTransferCode(id=0,name='Axisander') {
    return magicIt(`${name.toLowerCase()}_${id}`).toString(36)
}

function generatePowerTransferCode(name='Axisander',items) {
    if (items == undefined) {
        let str1 = ''
        let secSum = 0
        for (let cat of CATEGORIES) {
            for (let it of getPurchasedItemsByCategory(name,cat,false)) {
                if (STORE_ITEMS[it].price != -1) {
                    str1 = `${str1}.${it.toString(36)}`
                    secSum = secSum + magicIt(`${name.toLowerCase()}_${it}`)
                }
            }
        }
        return `${str1.slice(1)}@${secSum.toString(36)}`
    } else {
        let secSum = 0
        for (let it of items) {
            it = parseInt(it,36)
            if (STORE_ITEMS[it] && STORE_ITEMS[it].price != -1) {
                secSum = secSum + magicIt(`${name.toLowerCase()}_${it}`)
            } else if (STORE_ITEMS[it] == undefined) {
                return 0
            }
        }
        return secSum.toString(36)
    }
}

function formImportItem(player,comment='',tcode='') {
    const form = new ModalFormData()
    .title('%axiscube.store.transfer.import')
    .textField(`${comment}%axiscube.store.transfer.import`,'y@xxxxxx OR x.y.z@abcd',tcode)
    .show(player).then(gg => { if (!gg.canceled) {
        let code = gg.formValues[0].split('@')
        let id = parseInt(code[0],36)
        if (gg.formValues[0].split('.').length == 1) {
            if (STORE_ITEMS[id] == undefined) { formImportItem(player,'%axiscube.store.transfer.import.error.version\n\n§r',gg.formValues[0]); return }
            let key = code[1]
            if (key == generateTransferCode(id,player.name)) {
                const form2 = new ActionFormData()
                .title('%axiscube.store.transfer.import')
                .body('%axiscube.store.transfer.import.confirm')
                placeProductButton(id,form2,false,player.name)
                form2.button('axiscube.store.transfer.import.confirm.b')
                form2.show(player).then(async gl => { if (!gl.canceled) {
                    await addItem(player.name,id)
                    formPurchasedItems(player,'§a%axiscube.store.transfer.import.confirm.suc\n')
                }})
            } else {
                formImportItem(player,'%axiscube.store.transfer.import.error\n\n§r',gg.formValues[0])
            }
        } else {
            // let code = gg.formValues[0].split('@')
            let purc = code[0].split('.')
            let items = []
            for (let i of purc) {
                let id = parseInt(i,36)
                items.push(id)
                if (STORE_ITEMS[id] == undefined) {
                    formImportItem(player,'%axiscube.store.transfer.import.error.version\n\n§r',gg.formValues[0]);
                    return
                } else if (STORE_ITEMS[id].price == -1) {
                    formImportItem(player,'%axiscube.store.transfer.import.error\n\n§r',gg.formValues[0]);
                    return
                }
            }
            if (code[1] == generatePowerTransferCode(player.name,purc)) {
                const form2 = new ActionFormData()
                .title('%axiscube.store.transfer.import')
                .body('%axiscube.store.transfer.import.confirm')
                .button('axiscube.store.transfer.import.confirm.b')
                for (let id of items) {
                    placeProductButton(id,form2,false,player.name)
                }
                form2.show(player).then(async gl => { if (!gl.canceled) {
                    for (let id of items) {
                        await addItem(player.name,id)
                    }
                    formPurchasedItems(player,'§a%axiscube.store.transfer.import.confirm.suc\n')
                }})
            } else {
                formImportItem(player,'%axiscube.store.transfer.import.error\n\n§r',gg.formValues[0])
            }
        }
    }})
}

export function placeProductButton(id,form,showPrice=true,name) {
    switch (STORE_ITEMS[id].type) {
        case 'killmsg':
            form.button(showPrice ? {rawtext:[{text:`§r`},{translate:`axiscube.kill.t${STORE_ITEMS[id].localData}`,with:[`${STORE_COLOR_LIGHT}${KILL_MESSAGES_SAMPLE_PREYNAME[STORE_ITEMS[id].localData]}`,`${STORE_COLOR}${name}`]},{text:getPrice(id,true,name)}]} : {rawtext:[{text:`§r`},{translate:`axiscube.kill.t${STORE_ITEMS[id].localData}`,with:[`${STORE_COLOR_LIGHT}${KILL_MESSAGES_SAMPLE_PREYNAME[STORE_ITEMS[id].localData]}`,`${STORE_COLOR}${name}`]}]})
        break;
        case 'setpack':
            form.button(showPrice ? `%axiscube.store.product.${STORE_ITEMS[id].namespace}${getPrice(id,false,name)}` : `%axiscube.store.product.${STORE_ITEMS[id].namespace}`,`textures/ui/icons/store/products/${STORE_ITEMS[id].namespace}`)
        break;
        case 'colorname':
            form.button(showPrice ? `${STORE_ITEMS[id].localData}${name}§r${STORE_COLOR}${getPrice(id,false,name)}` : `${STORE_ITEMS[id].localData}${name}`)
        break;
        case 'emoji':
            form.button(showPrice ? `:${STORE_ITEMS[id].localData}: - ${CHAT_CODES[STORE_ITEMS[id].localData]}${getPrice(id,false,name)}` : `:${STORE_ITEMS[id].localData}: - ${CHAT_CODES[STORE_ITEMS[id].localData]}`)
        break;
        case 'soundmsg':
            form.button(showPrice ? `%axiscube.store.soundmsg.b §l${SOUNDMSG[STORE_ITEMS[id].localData][0]}§r${getPrice(id,false,name)}` : `%axiscube.store.soundmsg.b §l${SOUNDMSG[STORE_ITEMS[id].localData][0]}`)
        break;
        case 'elmsg':
            form.button(showPrice ? {rawtext:[{text:`§r`},{translate:`axiscube.games.eliminated.t${STORE_ITEMS[id].localData}`,with:[`${STORE_COLOR}${name}`]},{text:getPrice(id,true,name)}]} : {rawtext:[{text:`§r`},{translate:`axiscube.games.eliminated.t${STORE_ITEMS[id].localData}`,with:[`${STORE_COLOR}${name}`]}]})
        break;
    }
}

export function formItemInfo(itemId,player) {
    const item = STORE_ITEMS[itemId]
    item.price = getRawPrice(itemId)
    const name = player.name
    const isPurchased =  isOwned(itemId,name)
    const form = new ActionFormData()
        .title(`${STORE_COLOR}%axiscube.store.product_info`)
    if (item.type == 'setpack') {
        let text = {rawtext:[
            {text: `\n${STORE_COLOR_LIGHT}`},
            {translate: `axiscube.store.product.${item.namespace}`},
            {text: '§r\n\n'},
            {translate: `axiscube.store.product_info.author`,with:[`${STORE_COLOR_LIGHT}${item.author}`]},
            {text: '§r\n'},
            
        ]}
        if (item.price > 0) {
            text.rawtext.push({translate: `axiscube.store.product_info.price`,with:[`${SCOLOR}${item.price}${SYM}`]},)
        } else if (item.price == 0) {
            text.rawtext.push({translate: `axiscube.store.product_info.price`,with:{rawtext:[{translate:'store.free'}]}},)
        } else if (item.price == -2) {
            text.rawtext.push({translate: `axiscube.store.product_info.price`,with:{rawtext:[{translate:'axiscube.store.price.unvaliable'}]}},)
        } else if (item.price == -3) {
            text.rawtext.push({translate: `axiscube.store.product_info.price.challenge`,with:{rawtext:[{translate:GM_CHALLANGES[item.chalId].name},{translate:`axiscube.${GAMEDATA[GM_CHALLANGES[item.chalId].game].namespace}.name`}]}})
        }
        text.rawtext.push({text: '§r\n\n'})
        text.rawtext.push({translate: 'axiscube.store.product_info.setpack',with:[`${STORE_COLOR_LIGHT}${(item.include).length}§r`]})
        form.body(text)
        let buyText = `%skins.buy.buyButton${getPrice(itemId,true,name)}`
        if (isPurchased) {
            buyText = '%axiscube.store.transfer.export'
        } else if (item.price == 0) {
            buyText = '%store.redeem'
        } else if (item.price == -3) {
            buyText = '%axiscube.challenge.about'
        }

        form.button(buyText)
        form.button('%axiscube.store.product_info.setpack.button')
        for (let i of item.include) {
            placeProductButton(i,form,false,name)
        }
    /////////////////////////////////
    } else if (item.type == 'emoji'){
        try{
            let text = {rawtext:[
                {text: `\n${STORE_COLOR_LIGHT}`},
                {translate: `axiscube.store.product_info.emoji`,with:[`${CHAT_CODES[item.localData]} (:${item.localData}:)`]}, //Getting emoji by localdata
                {text: '§r\n\n'},

            ]}
            if (item.price > 0) {
                if (!isPurchased) form.button(`%skins.buy.buyButton${getPrice(itemId,true,name)}`)
                text.rawtext.push({translate: `axiscube.store.product_info.price`,with:[`${SCOLOR}${item.price}${SYM}`]},)
            } else if (item.price == 0) {
                if (!isPurchased) form.button(`%store.redeem`)
                text.rawtext.push({translate: `axiscube.store.product_info.price`,with:{rawtext:[{translate:'store.free'}]}},)
            } else if (item.price == -2) {
                if (!isPurchased) form.button('%axiscube.store.price.unvaliable')
                text.rawtext.push({translate: `axiscube.store.product_info.price`,with:{rawtext:[{translate:'axiscube.store.price.unvaliable'}]}},)
            } else if (item.price == -1) {
                placeProductButton(item.linked,form,true,name)
                text.rawtext.push({translate: `axiscube.store.product_info.price.setpack_only`,with:{rawtext:[{translate:`axiscube.store.product.${STORE_ITEMS[item.linked].namespace}`}]}},)
            }
            form.body(text)
            if (item.price >= 0) {
                let buyText = `%skins.buy.buyButton${getPrice(itemId,true,name)}`
                if (isPurchased) {
                    buyText = '§4>> %store.owned <<'
                } else if (item.price == 0) {
                    buyText = '%store.redeem'
                }
                form.button(buyText)
            }
        }catch(e){console.warn(e.stack)}
    //////////////////////////////////
    } else if (item.type == 'colorname' || item.type == 'killmsg' || item.type == 'soundmsg' || item.type == 'elmsg') {
        let text = {}
        if (item.type == 'colorname') {
            text = {rawtext:[
                {text: `\n${STORE_COLOR_LIGHT}`},
                {translate: `axiscube.store.product_info.colorname`,with:[`${item.localData}${name}§r`]},
                {text: '§r\n\n'},
                
            ]}
        } else if (item.type == 'killmsg') {
            text = {rawtext:[
                {text: `\n§r`},
                {translate:`axiscube.kill.t${item.localData}`,with:[`${STORE_COLOR_LIGHT}${KILL_MESSAGES_SAMPLE_PREYNAME[item.localData]}`,`${STORE_COLOR}${name}`]},
                {text: '§r\n\n'},
                {translate:`axiscube.kill.t${item.localData}.bow`,with:[`${STORE_COLOR_LIGHT}${KILL_MESSAGES_SAMPLE_PREYNAME[item.localData]}`,`${STORE_COLOR}${name}`]},
                {text: '§r\n\n'},
                {translate:`axiscube.kill.t${item.localData}.void`,with:[`${STORE_COLOR_LIGHT}${KILL_MESSAGES_SAMPLE_PREYNAME[item.localData]}`,`${STORE_COLOR}${name}`]},
                {text: '§r\n\n'},
            ]}
        } else if (item.type == 'elmsg') {
            text = {rawtext:[
                {text: `\n§r`},
                {translate:`axiscube.games.eliminated.t${item.localData}`,with:[`${STORE_COLOR}${name}`]},
                {text: '§r\n\n'},
            ]}
        } else if (item.type == 'soundmsg') {
            text = {rawtext:[]}
            runCMD('stopsound @s block.end_portal_frame.fill',player)
            playsound(item.localData,player)
        }
        
        if (item.price > 0) {
            if (!isPurchased) form.button(`%skins.buy.buyButton${getPrice(itemId,true,name)}`)
            text.rawtext.push({translate: `axiscube.store.product_info.price`,with:[`${SCOLOR}${item.price}${SYM}`]},)
        } else if (item.price == 0) {
            if (!isPurchased) form.button(`%store.redeem`)
            text.rawtext.push({translate: `axiscube.store.product_info.price`,with:{rawtext:[{translate:'store.free'}]}},)
        } else if (item.price == -2) {
            if (!isPurchased) form.button('%axiscube.store.price.unvaliable')
            text.rawtext.push({translate: `axiscube.store.product_info.price`,with:{rawtext:[{translate:'axiscube.store.price.unvaliable'}]}},)
        } else if (item.price == -1) {
            if (!isPurchased) placeProductButton(item.linked,form,true,name)
            text.rawtext.push({translate: `axiscube.store.product_info.price.setpack_only`,with:{rawtext:[{translate:`axiscube.store.product.${STORE_ITEMS[item.linked].namespace}`}]}},)
        }
        text.rawtext.push({text: '§r\n\n'})
        if (item.price >= 0 && item.linkeds) {
            if ((item.linkeds).length == 1) {
                if (!isPurchased) placeProductButton(item.linkeds[0],form,true,name)
                text.rawtext.push({translate: `axiscube.store.product_info.price.setpack_also`,with:{rawtext:[{translate:`axiscube.store.product.${STORE_ITEMS[item.linkeds[0]].namespace}`}]}},)
            } else {
                text.rawtext.push({translate: `axiscube.store.product_info.price.setpack_also_not1`})
                for (let i of item.linkeds) {
                    if (!isPurchased) placeProductButton(i,form,true,name)
                    text.rawtext.push({text: `\n * `})
                    text.rawtext.push({translate:`axiscube.store.product.${STORE_ITEMS[i].namespace}`})
                }
            }
        }
        if (isPurchased) {
            form.button('%axiscube.store.action.view')
        }
        form.body(text)
    }
    form.show(player).then(async gg => { if (!gg.canceled) {
        if (gg.selection == 0) {
            if (item.linked && ( !isPurchased && (item.type != 'setpack'))) { formItemInfo(item.linked,player);return }
            if (item.price <= getMoney(name) && item.price >= 0 && !isPurchased) {
                await addItem(name,itemId)
                playsound('mob.villager.yes',player)
                if (item.price > 0) addMoney(name,(-1)*item.price,true)
                formPurchasedItems(player,'axiscube.store.purchased.callback_notify')
            } else if (isPurchased) {
                if (item.type == 'killmsg') { playerKillmsgList(player); return }
                else if (item.type == 'setpack') {
                    let selected = itemId
                    const form3 = new ModalFormData()
                    .title('%axiscube.store.transfer.export')
                    .textField({rawtext:[{translate:'axiscube.store.transfer.export.code',with:[`${STORE_COLOR_LIGHT}${player.nameTag}§r`]}]},'z@xxxxxx',`${selected.toString(36)}@${generateTransferCode(selected,player.name)}`)
                    .show(player).then(ggwp => { if (!ggwp.canceled) {formItemsTransfer(player)}} )
                    return
                }
                else if (item.type == 'colorname') { formSetcolor(player); return }
                else if (item.type == 'soundmsg') { formSetSoundmsg(player); return }
                else if (item.type == 'elmsg') { playerElmsgList(player); return }
                formPurchasedItems(player)
            } else if (item.price == -2) {
                rawtext('axiscube.store.purchased.unv',name,'translate','c')
                playsound('mob.villager.no',player)
            } else if (item.price == -3) {
                formGameChallenges(player,item.chalId)
            } else {
                rawtext('axiscube.store.purchased.bomj',name,'translate','c')
                playsound('mob.villager.no',player)
                
            }
        } else {
            if (item.type == 'setpack' && gg.selection >= 2) {
                formItemInfo(item.include[Number(gg.selection)-2],player)
            } else {
                formItemInfo(item.linkeds[Number(gg.selection)-1],player)
            }
        }
    }})
}

export function formPurchasedItems(player,comment='',sort='date_newest') {
    const name = player.name
    let items = getPurchasedItems(name)
    if (sort == 'type') {
        items = []
        for (let i of CATEGORIES) {
            items = [...items,...getPurchasedItemsByCategory(player.name,i,false)]  
        }
    } else if (sort == 'date_newest') {
        items = items.reverse()
    }
    const form = new ActionFormData()
        .title(`${STORE_COLOR}%axiscube.store.purchased.title`)
        .button(`${STORE_COLOR}%axiscube.store.action.backlink`,'textures/ui/icons/store/back')
        if (items.length == 0) {
            form.body(`${STORE_COLOR_LIGHT}%axiscube.store.purchased.no_items`)
            form.button(`%axiscube.msg.nerd`,'textures/ui/icons/store/nerd')
        } else {
            form.body({rawtext:[{text:STORE_COLOR_LIGHT},{translate:'axiscube.store.purchased.d',with:[`${items.length}`]}]})
            form.button({rawtext:[{text:STORE_COLOR_LIGHT},{translate:'axiscube.store.sort',with:{rawtext:[{translate:`axiscube.store.sort.${sort}`}]}}]})
            for (let item of items) {
                //if (getPurchasedItems(name)) continue
                placeProductButton(item,form,false,name)
            }
        }
        
        form.show(player).then(gg => {
            if (gg.canceled) {
                //runCMD('stopsound @s random.click',player)
                playsound('random.enderchestclosed',player)
                return
            } else if (gg.selection == 0) {
                formShowCategories(player)
            } else if (gg.selection == 1 && items.length > 0) {
                if (sort == 'type') { formPurchasedItems(player,'','date_newest') }
                else if (sort == 'date_newest') { formPurchasedItems(player,'','date_oldest') }
                else if (sort == 'date_oldest') { formPurchasedItems(player,'','type') }
            } else if (gg.selection > 1 && items.length > 0) {
                formItemInfo(items[Number(gg.selection)-2],player)
            } else if (items.length == 0){
                //playsound('block.end_portal_frame.fill')
                nerdMessage(name)
            }
        })
}

export function formShowOffersByCategory(player,category,fromStrore=true) {
    const name = player.name
    const offers = getItemsByCategory(category)
    const offersToPurchase = []

    if (!fromStrore) playsound('random.enderchestopen',player)
    const form = new ActionFormData()
    .title(`${STORE_COLOR}%axiscube.store: %axiscube.store.${category}.s`)
    .body(`${STORE_COLOR_LIGHT}%axiscube.store.${category}.d`)
    .button(`${STORE_COLOR}%axiscube.store.action.backlink`,'textures/ui/icons/store/back')
    for (let offer of offers) {
        //if (getPurchasedItems(name)) continue
        placeProductButton(offer,form,true,name)
        offersToPurchase.push(offer)
    }
    form.show(player).then(gg => {
        if (gg.canceled) {
            //runCMD('stopsound @s random.click',player)
            playsound('random.enderchestclosed',player)
            return
        } else {
            playsound('block.end_portal_frame.fill',player)
            if (gg.selection == 0) {
                formShowCategories(player)
            } else {
                formItemInfo(offersToPurchase[Number(gg.selection)-1],player)
            }
            //runCMD('stopsound @s random.click',player)
        }
        
    })
}

export function getPurchasedItems(name) {
    let items = dbGetPlayerRecord(name,DB_S,DB_DEFAULT)
    let final = []
    for (let i of items) {
        if (generateTransferCode(i,name) == getSsData(name)[i.toString(36)]) {final.push(i)}
    }
    return final
}

export function getPurchasedItemsByCategory(name,category,returnLocalID=false) {
    let playerItems = getPurchasedItems(name)
    let final = []
    for (let i of playerItems) { if (STORE_ITEMS[i].type == category) {
        if (returnLocalID) {
            final.push(STORE_ITEMS[i].localData)
        } else {
            final.push(i)
        }
    }}
    return final
}

export function getItemsByCategory(category) {
    let categoryItems = []
    for (let i in STORE_ITEMS) {
        if (STORE_ITEMS[i].type === category) {
            categoryItems.push(i)
        }
    }
    return categoryItems
}

/**
 * Получение id эмодзи.
 *
 * @param {number} object Таблица с предметами.
 * @param {string} value Название эмодзи.
 * @return {number} id, id эмодзи.
 */
export function getEmojiItembyValue(object, value) {
    try{
        let id = Object.keys(object).find(key => object[key]['localData'] == value && object[key]['type'] == 'emoji')
        if (id == undefined){throw new Error('Not_found')}
        if (id != undefined){
            return id
        }
    }catch{ 
        return -1
    }
}
