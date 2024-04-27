import { COPYRIGHT, ICONS, MINECRAFT_DIFFICULTIES, MINECRAFT_DIFFICULTIES_NAME, SYM } from "../const"
import { edScore, getScore, getTargetByScore, hasTag, placeError, playsound, randomPlayerIcon, rawtext, runCMD, runCMDs, setTickTimeout } from "../modules/axisTools"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import { getGameType, stopGame } from "./main"
import { world } from "@minecraft/server"
import { TEAMS, TEAM_COLORS, TEAM_NOTEAMSELECTOR, getPlayerTeam, teamArray } from "./category_team"
import { checkPerm } from "../modules/perm"
import { magicIt } from "../modules/playerNameTag"
import { dbGetRecord, dbRemoveRecord, dbSetRecord } from "../modules/cheesebase"

export const GAMEDATA_PVP = { // PVP
    id: 3,
    reset_player_color: {
        1: true
    },
    namespace: 'pvp',
    min_players: 2,
    tags: [
        'pvp',
        'pvp.member',
        'pvp.winnerteam'
    ],
    team_data: {
        teams: TEAMS,
        spectator: true,
        icons: 'heads',
        color_name: true
    },
    confirm_begin: {
        0: {
            warn_message: '',
            check: false
        },
        1: {
            warn_message: 'axiscube.games.startgame.confirm.d_line2.team',
            check: 'teamcheck'
        }
    },
    loc: {
        0: {
            gameplay: { type: 'arr', value: [ '-982 1 1018', '-1001 1 996', '-977.05 0.00 985.41', '-982.66 7.00 1013.89', '-1013.51 8.00 1011.40', '-1008.63 7.00 984.06', '-983.24 7.00 1012.80', '-981.53 1.00 1012.49' ] },
            spawn: '-1000 15 1000',
            newplayer: '-1000 15 1000',
            spawnpoint: '-1000 15 1000',
        },
        1: {
            gameplay: { type: 'arr', value: [ '2098.42 1.00 2066.68', '2078.26 5.00 2073.46', '2101.70 8.00 2090.70', '2084.58 1.00 2031.12', '2077.53 -3.00 2043.50', '2073.29 1.00 2008.03', '2094.11 -3.00 2007.17', '2103.54 8.00 2026.22' ] },
            spawn: '2090 11 2063',
            newplayer: '2090 11 2063',
            spawnpoint: '2090 11 2063',
        }
    },
    ends: {
        no_time: {
            cmd : [{'type':'money','sum': 100, 'target': '@a[tag=pvp.member]'}]
        },
        one_player: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_player","with":{"rawtext":[{"selector":"@a[tag=pvp.member]"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 100, 'target': '@a[tag=pvp.member]'}]
        },
        one_duel_player: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.pvp.one_duel_player","with":{"rawtext":[{"selector":"@a[tag=pvp.member]"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 100, 'target': '@a[tag=pvp.member]'}]
        },
        one_team: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"$<WINNER_TEAM>"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 100, 'target': '@a[tag=pvp.winnerteam]'}]
        }
    },
    joinable: {
        can_join: false,
        prebegin_commands: [
            { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
            { type: 'lockslot', slot: 5, item: 'axiscube:pvp_settingkit' },
            { type: 'lockslot', slot: 6, item: 'axiscube:setting_game' },
            { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
            { type: 'test', testsource: ['type','data'], value: {
                1: [
                    { type: 'lockslot', slot: 4, item: 'axiscube:team_selection' },
                ]
            }},
        ],
    },
    time: {
        value: 99999,
        tick_function: pvpTick,
        xp: false,
        events: {
            t0: [ 'gamerule pvp true' ]
        }
    },
    start_commands: [
        { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
        { type: 'lockslot', slot: 5, item: 'axiscube:pvp_settingkit' },
        { type: 'lockslot', slot: 6, item: 'axiscube:setting_game' },
        { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
        { type: 'test', testsource: ['type','data'], value: {
            1: [
                { type: 'lockslot', slot: 4, item: 'axiscube:team_selection' },
            ]
        }},
    ],
    begin_commands: [
        'scoreboard players set "§1" pvp.display 1',
        'scoreboard players set "§2" pvp.display 5',
        { type: 'test', testsource: ['type','data'], value: {
            0: [
                {type:'scoreset',value: 3, objective: 'pvp.display'},
                `scoreboard players set "${randomPlayerIcon()} §a%axiscube.scoreboard.players" pvp.display 4`,
            ],
            1: [
                `tag ${TEAM_NOTEAMSELECTOR} add spec`,
                'gamemode spectator @a[tag=spec]',
                {type: 'colorscore', score: 3, objective: 'pvp.display'},
                `scoreboard players set "${randomPlayerIcon()} §a%axiscube.scoreboard.players" pvp.display 4`,
            ]
        }},
        { type: 'test', testsource: ['pvp.nametag','settings'], value: {
            1: [
                'event entity @a axiscube:hide_nametag',
            ]
        }},
        { type: 'test', testsource: ['pvp.falldamage','settings'], value: {
            1: [
                'gamerule falldamage true',
            ]
        }},
        'tag @a add pvp.member',
        () => {pvpSetkit()},
        `scoreboard players set "${COPYRIGHT}" pvp.display 0`,
        {type: 'eval', value:'startTimer(3)'}
    ],
    death_data: {
        death_commands: [
            //{ type: 'sound', target: '@a', sound: 'mob.skeleton.death', p: 1, v: 1 },
            'clear @s',
            'tag @s remove pvp.member',
            'tag @s add spec',
            'gamemode spectator'
        ],
        kill_reward: 10,
        killFunc: pvpKiller
    },
    items: {
        'axiscube:setting_game': pvpSettingGame,
        'axiscube:pvp_settingkit': pvpSettingKit
    },
    stop_commands: [],
    boards: [
        ['pvp.display', '\ue197§b %axiscube.pvp.name', true],
    ]
}

const DB_NAME = 'pvp.kitdata'

const PVP_KITSUIT = {
    armor: {
        head: [
            'air',
            'leather_helmet',
            'golden_helmet',
            'chainmail_helmet',
            'iron_helmet',
            'diamond_helmet',
            'netherite_helmet',
            'turtle_helmet'
        ],
        chest: [
            'air',
            'leather_chestplate',
            'golden_chestplate',
            'chainmail_chestplate',
            'iron_chestplate',
            'diamond_chestplate',
            'netherite_chestplate'
        ],
        legs: [
            'air',
            'leather_leggings',
            'golden_leggings',
            'chainmail_leggings',
            'iron_leggings',
            'diamond_leggings',
            'netherite_leggings'
        ],
        feet: [
            'air',
            'leather_boots',
            'golden_boots',
            'chainmail_boots',
            'iron_boots',
            'diamond_boots',
            'netherite_boots'
        ]
    },
    weapon: {
        sword: [
            'air',
            'wooden_sword',
            'golden_sword',
            'stone_sword',
            'iron_sword',
            'diamond_sword',
            'netherite_sword',
            'trident',
            'stick',
            'fire_charge'
        ],
        bow: [
            'air',
            'bow',
            'crossbow'
        ],
        arrow: 128
    },
    meal: {
        golden_carrot: 64,
        golden_apple: 32,
        enchanted_golden_apple: 8
    },
    offhand: {
        in_slot: [
            'air',
            'shield',
            'totem_of_undying'
        ],
        shield: 1,
        totem_of_undying: 3
    }
}

const PVP_ICONS = {
    armor: {
        head: {
            0: ['\ue178','textures/ui/icons/items/air_helmet'],
            1: ['\ue16c','textures/ui/icons/items/leather_helmet'],
            2: ['\ue164','textures/items/gold_helmet'],
            3: ['\ue170','textures/items/chainmail_helmet'],
            4: ['\ue168','textures/items/iron_helmet'],
            5: ['\ue160','textures/items/diamond_helmet'],
            6: ['\ue174','textures/items/netherite_helmet'],
            7: ['\ue17d','textures/items/turtle_helmet']
        },
        chest: {
            0: ['\ue179','textures/ui/icons/items/air_chestplate'],
            1: ['\ue16d','textures/ui/icons/items/leather_chestplate'],
            2: ['\ue165','textures/items/gold_chestplate'],
            3: ['\ue171','textures/items/chainmail_chestplate'],
            4: ['\ue169','textures/items/iron_chestplate'],
            5: ['\ue161','textures/items/diamond_chestplate'],
            6: ['\ue175','textures/items/netherite_chestplate']
        },
        legs: {
            0: ['\ue17a','textures/ui/icons/items/air_leggings'],
            1: ['\ue16e','textures/ui/icons/items/leather_leggings'],
            2: ['\ue166','textures/items/gold_leggings'],
            3: ['\ue172','textures/items/chainmail_leggings'],
            4: ['\ue16a','textures/items/iron_leggings'],
            5: ['\ue162','textures/items/diamond_leggings'],
            6: ['\ue176','textures/items/netherite_leggings']
        },
        feet: {
            0: ['\ue17b','textures/ui/icons/items/air_boots'],
            1: ['\ue16f','textures/ui/icons/items/leather_boots'],
            2: ['\ue167','textures/items/gold_boots'],
            3: ['\ue173','textures/items/chainmail_boots'],
            4: ['\ue16b','textures/items/iron_boots'],
            5: ['\ue163','textures/items/diamond_boots'],
            6: ['\ue177','textures/items/netherite_boots']
        }
    },
    weapon: {
        sword: {
            0: ['\ue17c','textures/ui/icons/items/air_sword'],
            1: ['\ue183','textures/items/wood_sword'],
            2: ['\ue184','textures/items/gold_sword'],
            3: ['\ue182','textures/items/stone_sword'],
            4: ['\ue185','textures/items/iron_sword'],
            5: ['\ue180','textures/items/diamond_sword'],
            6: ['\ue181','textures/items/netherite_sword'],
            7: ['\ue189','textures/items/trident'],
            8: ['\ue18a','textures/items/stick'],
            9: ['\idk','textures/items/fire_charge']
        },
        bow: {
            0: ['\ue17e','textures/ui/icons/items/air_bow'],
            1: ['\ue18c','textures/items/bow_standby'],
            2: ['\ue186','textures/items/crossbow_standby']
        },
        arrow: ['\ue17f', 'textures/items/arrow']
    },
    meal: {
        golden_carrot: ['\ue18b', 'textures/items/carrot_golden'],
        golden_apple: ['\ue188', 'textures/items/apple_golden'],
        enchanted_golden_apple: ['\ue187', 'textures/ui/icons/items/enchanted_golden_apple']
    },
    offhand: {
        shield: ['\ue18d', 'textures/ui/icons/items/shield'],
        totem_of_undying: ['\ue18e', 'textures/items/totem'],
        in_slot: [
            ['\ue18f'],
            ['\ue18d'],
            ['\ue18e']
        ]
    }
}

export const PVP_KITTEMP = {
    1: {
        name: 'Max Kit',
        author: 'Anna indev',
        icon: 'textures/ui/icons/games/pvp/kit_max',
        suit: {
            armor: {
                head: 6,
                chest: 6,
                legs: 6,
                feet: 6
            },
            weapon: {
                sword: 6,
                bow: 1,
                arrow: 64
            },
            meal: {
                golden_carrot: 32,
                golden_apple: 3,
                enchanted_golden_apple: 1
            },
            offhand: {
                in_slot: 2,
                shield: 1,
                totem_of_undying: 1
            }
        }
    },
    2: {
        name: 'Nothing set',
        author: 'Axisander',
        icon: 'textures/ui/icons/games/pvp/kit_nothingset',
        suit: {
            armor: {
                head: 0,
                chest: 0,
                legs: 0,
                feet: 0
            },
            weapon: {
                sword: 0,
                bow: 0,
                arrow: 0
            },
            meal: {
                golden_carrot: 8,
                golden_apple: 1,
                enchanted_golden_apple: 0
            },
            offhand: {
                in_slot: 0,
                shield: 0,
                totem_of_undying: 0
            }
        }
    },
    3: {
        name: 'Tank Kit',
        author: 'Anna indev',
        icon: 'textures/ui/icons/games/pvp/kit_tank',
        suit: {
            armor: {
                head: 5,
                chest: 5,
                legs: 5,
                feet: 5
            },
            weapon: {
                sword: 5,
                bow: 0,
                arrow: 0
            },
            meal: {
                golden_carrot: 0,
                golden_apple: 0,
                enchanted_golden_apple: 0
            },
            offhand: {
                in_slot: 0,
                shield: 0,
                totem_of_undying: 0
            }
        }
    },
    4: {
        name: 'AquaSet',
        author: 'Anna indev',
        icon: 'textures/ui/icons/games/pvp/kit_seakit',
        suit: {
            armor: {
                head: 7,
                chest: 4,
                legs: 3,
                feet: 3
            },
            weapon: {
                sword: 7,
                bow: 0,
                arrow: 0
            },
            meal: {
                golden_carrot: 16,
                golden_apple: 2,
                enchanted_golden_apple: 0
            },
            offhand: {
                in_slot: 0,
                shield: 0,
                totem_of_undying: 0
            }
        }
    }
}

export const PVP_VOIDSET = {
    name: 'Unknown set',
    author: 'Unknown',
    icon: 'textures/block/barrier',
    suit: {
        armor: {
            head: 0,
            chest: 0,
            legs: 0,
            feet: 0
        },
        weapon: {
            sword: 0,
            bow: 0,
            arrow: 0
        },
        meal: {
            golden_carrot: 0,
            golden_apple: 0,
            enchanted_golden_apple: 0
        },
        offhand: {
            in_slot: 0,
            shield: 0,
            totem_of_undying: 0
        }
    }
}

export function cutName(str,name) {
    if (!str) { str = `${name}'s Kit`}
    if (str.length > 30) {
        str = str.slice(0,30)
    }
    str = str.replace(/\"/g,"``").replace(/\'/g,"`").replace(/\\/g,"/").replace(/\%/g,"%%")
    return str
}

export async function pvpSetkit(player='@a',t=getPVPselectedSet()) {
    const obj = pvpExportKit(t).suit
    // ARMOR
    for (let slot in PVP_KITSUIT.armor) {
        await runCMD(`replaceitem entity @s slot.armor.${slot} 0 ${PVP_KITSUIT.armor[slot][obj.armor[slot]]} 1`,player)
    }
    // SWORD
    let itemSword = PVP_KITSUIT.weapon.sword[obj.weapon.sword]
    await runCMD(`replaceitem entity @s slot.hotbar 0 ${itemSword} 1`,player)
    // BOW && ARROWS
    let itemBow = PVP_KITSUIT.weapon.bow[obj.weapon.bow]
    let slotBow = 1
    let countArrow = obj.weapon.arrow
    if (itemSword == 'air') { slotBow = 0 }
    if (countArrow != 0) { await runCMD(`replaceitem entity @s slot.hotbar ${slotBow} ${itemBow} 1`,player) }
    if (itemBow != 'air') { await runCMD(`replaceitem entity @s slot.inventory 0 arrow ${countArrow}`,player) }
    // Shield && Totem && Lefthand
    let countTotem = obj.offhand.totem_of_undying
    let enableTotem = Boolean(countTotem)
    let enableShield = Boolean(obj.offhand.shield)
    let whatItemOffhand = PVP_KITSUIT.offhand.in_slot[obj.offhand.in_slot]
    if (enableShield || enableTotem) {
        if (whatItemOffhand == 'totem_of_undying') {
            countTotem = countTotem-1
            await runCMD(`replaceitem entity @s slot.weapon.offhand 0 totem_of_undying 1`,player)
        } else if (whatItemOffhand == 'shield') {
            await runCMD(`replaceitem entity @s slot.weapon.offhand 0 shield 1`,player)
        } else if (enableShield) {
            await runCMD(`give @s shield 1`,player)
        }
        await runCMD(`give @s totem_of_undying ${countTotem}`,player)
    }
    // Meal
    let countGapple = obj.meal.golden_apple
    let countCarrot = obj.meal.golden_carrot
    let countEnapple = obj.meal.enchanted_golden_apple
    await runCMD(`give @s golden_apple ${countGapple}`,player)
    await runCMD(`give @s enchanted_golden_apple ${countEnapple}`,player)
    await runCMD(`give @s golden_carrot ${countCarrot}`,player)
}

export async function pvpImportKit(object,t=0) {
    if (typeof object == 'string') { JSON.parse(object) }
    await dbSetRecord(t,object,DB_NAME)
}

export function pvpExportKit(t=0) {
    return dbGetRecord(t,PVP_VOIDSET,DB_NAME)
}

export function getPVPsetsList() {
    return dbGetRecord(-756,[0],DB_NAME)
}

export async function editPVPsetsList(newdata) {
    await dbSetRecord(-756,newdata,DB_NAME)
}

export function getPVPselectedSet() {
    return dbGetRecord(-756756,{sel:0},DB_NAME).sel
}

export async function editPVPselectedSet(newsel) {
    await dbSetRecord(-756756,{sel:newsel},DB_NAME)
}

async function pvpRemoveKit(t,name) {
    let pvpsets = getPVPsetsList()
    const SET_SELECTION = getPVPselectedSet()
    if (pvpsets.length == 1) {
        rawtext('axiscube.pvp.kitset.del.error',name,'translate','c')
        return false
    }
    dbRemoveRecord(t,DB_NAME)
    let newsets = []
    for (let i of pvpsets) {
        if (i != t) { newsets.push(i) }
    }
    if (SET_SELECTION == t) {
        editPVPselectedSet(newsets[0])
    }
    await editPVPsetsList(newsets)
    return true
}

export async function pvpAddSet(player,obj) {
    let name = player.name
    if (obj) {
        obj.author = `${obj.author}, ${name}`
    } else {
        obj = PVP_VOIDSET
        obj.author = name
        obj.name = `${name}\`s Kit`
    }
    let pvpsets = getPVPsetsList()
    let newId = pvpsets.length+1
    pvpsets.push(newId)
    editPVPsetsList(pvpsets)
    await pvpImportKit(obj,newId)
    playsound('armor.equip_iron',player)
    pvpEditKitset(player,newId,obj)
}

function pvpIconKit(obj) {
    let result = ''
    for (let slot in obj.suit.armor) {
        result = `${result}${PVP_ICONS.armor[slot][obj.suit.armor[slot]][0]}`
    }
    result = `${result} ${PVP_ICONS.weapon.sword[obj.suit.weapon.sword][0]}`
    result = `${result}${PVP_ICONS.weapon.bow[obj.suit.weapon.bow][0]}`
    return result
}

export function pvpSettingKit(player) {

    const SET_SELECTION = getPVPselectedSet()
    const SETS = getPVPsetsList()

    const form = new ActionFormData()
    .title('%axiscube.pvp.kitset.management')
    .body(`%axiscube.pvp.kitset.list`)
    
    for(let i of SETS) {
        let isThisSel = ''
        let thisObj = pvpExportKit(i)
        let thisIco = pvpIconKit(thisObj)
        let setName = thisObj.name
        if (SET_SELECTION == i) { isThisSel = '\ue124 ' }
        form.button(`${setName}\n${isThisSel}${thisIco}`)
    }
    form.button('%axiscube.pvp.kitset.create_new',ICONS.add)
    form.button('%axiscube.pvp.kitset.templates','textures/items/wild_armor_trim_smithing_template')

    form.show(player).then(gg => { if (gg.selection != undefined) {
            if (gg.selection < SETS.length) { pvpShowKitInfo(player,SETS[gg.selection]) }
            else if (gg.selection == SETS.length) { pvpCreateKit(player) }
            else if (gg.selection == SETS.length+1) { pvpTemplatesMenu(player) }
    } })
}

export function pvpCreateKit(player) {

    const form = new ActionFormData()
    .title('%axiscube.pvp.kitset.create_new')
    .body(`%axiscube.pvp.kitset.create_new.d`)
    .button(`%axiscube.pvp.kitset.create_new.my_own`,ICONS.add)
    .button(`%axiscube.pvp.kitset.import`,ICONS.import)
    
    for (let tempId in PVP_KITTEMP) {
        const kitTemp = PVP_KITTEMP[tempId]
        form.button(`${kitTemp.name}\n%axiscube.pvp.kitset.templates.author: ${kitTemp.author}`,kitTemp.icon)
    }
    form.show(player).then(async gg => {
        if (gg.selection == 0) {
            if (checkPerm(player.name,'pvp_create')) {
                pvpAddSet(player)
            } else {
                rawtext('axiscube.perm.denied.generic',player,'translate','c')
            }
        } else if (gg.selection == 1) {
            pvpImportForm(player)
        } else if (gg.selection > 1) {
            pvpShowKitInfo(player,0,1,PVP_KITTEMP[Number(gg.selection)-1])
        }
    })
}

export function pvpEditKitset(player,t,obj=pvpExportKit(t)) {
    const form = new ModalFormData()
    .title('%axiscube.pvp.kitset.edit')
    .textField('%axiscube.pvp.kitset.export.kitname',`${player.name}'s Kit`,obj.name)
    // HEAD
    let headArmorArr = []
    let headC = 0
    for (let item in PVP_KITSUIT.armor.head) {
        let rawName = PVP_KITSUIT.armor.head[item]
        let finalName = `${PVP_ICONS.armor.head[headC][0]} %item.${rawName}.name`
        headArmorArr.push(finalName)
        headC = headC+1
    }
    form.dropdown('\n%itemGroup.name.helmet',headArmorArr,obj.suit.armor.head)

    // PLATE
    let chestArmorArr = []
    let chestC = 0
    for (let item in PVP_KITSUIT.armor.chest) {
        let rawName = PVP_KITSUIT.armor.chest[item]
        let finalName = `${PVP_ICONS.armor.chest[chestC][0]} %item.${rawName}.name`
        chestArmorArr.push(finalName)
        chestC = chestC+1
    }
    form.dropdown('%itemGroup.name.chestplate',chestArmorArr,obj.suit.armor.chest)

    // LEGS
    let legsArmorArr = []
    let legsC = 0
    for (let item in PVP_KITSUIT.armor.legs) {
        let rawName = PVP_KITSUIT.armor.legs[item]
        let finalName = `${PVP_ICONS.armor.legs[legsC][0]} %item.${rawName}.name`
        legsArmorArr.push(finalName)
        legsC = legsC+1
    }
    form.dropdown('%itemGroup.name.leggings',legsArmorArr,obj.suit.armor.legs)
    
    // BOOTS
    let feetArmorArr = []
    let feetC = 0
    for (let item in PVP_KITSUIT.armor.feet) {
        let rawName = PVP_KITSUIT.armor.feet[item]
        let finalName = `${PVP_ICONS.armor.feet[feetC][0]} %item.${rawName}.name`
        feetArmorArr.push(finalName)
        feetC = feetC+1
    }
    form.dropdown('%itemGroup.name.boots',feetArmorArr,obj.suit.armor.legs)

    // SWORD
    let swordArr = []
    let swordC = 0
    for (let item in PVP_KITSUIT.weapon.sword) {
        let rawName = PVP_KITSUIT.weapon.sword[item]
        let finalName = `${PVP_ICONS.weapon.sword[swordC][0]} %item.${rawName}.name`
        swordArr.push(finalName)
        swordC = swordC+1
    }
    form.dropdown('%itemGroup.name.sword',swordArr,obj.suit.weapon.sword)
    
    // BOW
    let bowArr = []
    let bowC = 0
    for (let item in PVP_KITSUIT.weapon.bow) {
        let rawName = PVP_KITSUIT.weapon.bow[item]
        let finalName = `${PVP_ICONS.weapon.bow[bowC][0]} %item.${rawName}.name`
        bowArr.push(finalName)
        bowC = bowC+1
    }
    form.dropdown('%item.bow.name',bowArr,obj.suit.weapon.bow)
    form.slider(`\n${PVP_ICONS.weapon.arrow[0]} %item.arrow.name`,0,128,1,obj.suit.weapon.arrow)
    
    // Lefthand
    form.slider(`\n${PVP_ICONS.offhand.totem_of_undying[0]} %item.totem.name`,0,5,1,obj.suit.offhand.totem_of_undying)
    form.toggle(`${PVP_ICONS.offhand.shield[0]} %item.shield.name`,Boolean(obj.suit.offhand.shield))
    let leftItArr = []
    let leftItC = 0
    for (let item in PVP_KITSUIT.offhand.in_slot) {
        let rawName = PVP_KITSUIT.offhand.in_slot[item]
        rawName = rawName == 'totem_of_undying' ? 'totem' : rawName
        let finalName = `${PVP_ICONS.offhand.in_slot[leftItC][0]} %item.${rawName}.name`
        leftItArr.push(finalName)
        leftItC = leftItC+1
    }
    form.dropdown('%axiscube.pvp.kitset.edit.offhand',leftItArr,obj.suit.offhand.in_slot)
    form.slider(`\n${PVP_ICONS.meal.golden_carrot[0]} %item.golden_carrot.name`,0,64,1,obj.suit.meal.golden_carrot)
    form.slider(`\n${PVP_ICONS.meal.golden_apple[0]} %item.golden_apple.name`,0,32,1,obj.suit.meal.golden_apple)
    form.slider(`\n${PVP_ICONS.meal.enchanted_golden_apple[0]} %item.appleEnchanted.name`,0,8,1,obj.suit.meal.enchanted_golden_apple)

    form.show(player).then(async gg => { if (!gg.canceled) {
        let [ sName, dHead, dChest, dLegs, dFeet, dSword, dBow, dArrow, dTotem, dShield, dLefthand, dCarrot, dApple, dEnapple ] = gg.formValues
        obj.name = cutName(sName,player.name)
        obj.suit.armor.head = dHead
        obj.suit.armor.chest = dChest
        obj.suit.armor.legs = dLegs
        obj.suit.armor.feet = dFeet
        obj.suit.weapon.sword = dSword
        obj.suit.weapon.bow = dBow
        obj.suit.weapon.arrow = dArrow
        obj.suit.offhand.totem_of_undying = dTotem
        obj.suit.offhand.shield = dShield ? 1 : 0
        obj.suit.offhand.in_slot = dLefthand
        obj.suit.meal.golden_carrot = dCarrot
        obj.suit.meal.golden_apple = dApple
        obj.suit.meal.enchanted_golden_apple = dEnapple
        await pvpImportKit(obj,t)
        pvpSettingKit(player)
    } })
}

export function pvpTemplatesMenu(player) {
    const form = new ActionFormData()
    .title('%axiscube.pvp.kitset.templates')
    .body(`%axiscube.pvp.kitset.templates.list`)
    .button(`%axiscube.pvp.kitset.import`,ICONS.import)
    
    for (let tempId in PVP_KITTEMP) {
        const kitTemp = PVP_KITTEMP[tempId]
        form.button(`${kitTemp.name}\n%axiscube.pvp.kitset.templates.author: ${kitTemp.author}`,kitTemp.icon)
    }
    form.show(player).then(async gg => { if (gg.selection != undefined) {
        if (gg.selection == 0) { pvpImportForm(player) }
        else if (gg.selection > 0) {
            pvpShowKitInfo(player,0,1,PVP_KITTEMP[Number(gg.selection)])
        }
    }})
}

export function pvpShowKitInfo(player,t=0,infotypeind=0,obj=pvpExportKit(t)) {
    const infotype = ['created','demo','noperm'][infotypeind]
    const IS_SELECTED = t == getPVPselectedSet()

    const form = new ActionFormData()

    if (infotype == 'created') {
        form.title(`${obj.name}`)
    } else if (infotype == 'demo') {
        form.title('%axiscube.pvp.kitset.create_new')
    }

    
    if (infotype == 'created') {
        form.body(`${obj.name}\n%axiscube.pvp.kitset.templates.author: ${obj.author}\n\n%axiscube.pvp.kitset.this_manage`)
    } else if (infotype == 'demo') {
        form.body(`${obj.name}\n%axiscube.pvp.kitset.templates.author: ${obj.author}`)
    }
    if(!IS_SELECTED && infotype == 'created') {
        form.button(`%axiscube.pvp.kitset.activate`,ICONS.act)
    }
    if (infotype == 'demo') {
        form.button(`%axiscube.pvp.kitset.create_this`,ICONS.add)
    }
    if (infotype == 'created') {
        form.button(`%axiscube.pvp.kitset.export`,ICONS.export)
        form.button(`%gui.delete`,ICONS.del)
        form.button(`%gui.edit`,ICONS.edit)
    }
    form.button(`%axiscube.pvp.kitset.contain`)
    // CONTAIN
    for (let slot in PVP_KITSUIT.armor) {
        form.button(`%item.${PVP_KITSUIT.armor[slot][obj.suit.armor[slot]]}.name`,`${PVP_ICONS.armor[slot][obj.suit.armor[slot]][1]}`)
    }
    form.button(`%item.${PVP_KITSUIT.weapon.sword[obj.suit.weapon.sword]}.name`,`${PVP_ICONS.weapon.sword[obj.suit.weapon.sword][1]}`)
    form.button(`%item.${PVP_KITSUIT.weapon.bow[obj.suit.weapon.bow]}.name`,`${PVP_ICONS.weapon.bow[obj.suit.weapon.bow][1]}`)
    if (obj.suit.weapon.arrow) {
        form.button(`%item.arrow.name (x${obj.suit.weapon.arrow})`,PVP_ICONS.weapon.arrow[1])
    }
    if (obj.suit.offhand.totem_of_undying) {
        form.button(`%item.totem.name (x${obj.suit.offhand.totem_of_undying})`,PVP_ICONS.offhand.totem_of_undying[1])
    }
    if (obj.suit.offhand.shield) {
        form.button(`%item.shield.name`,PVP_ICONS.offhand.shield[1])
    }
    if (obj.suit.meal.golden_carrot) {
        form.button(`%item.golden_carrot.name (x${obj.suit.meal.golden_carrot})`,PVP_ICONS.meal.golden_carrot[1])
    }
    if (obj.suit.meal.golden_apple) {
        form.button(`%item.golden_apple.name (x${obj.suit.meal.golden_apple})`,PVP_ICONS.meal.golden_apple[1])
    }
    if (obj.suit.meal.enchanted_golden_apple) {
        form.button(`%item.appleEnchanted.name (x${obj.suit.meal.enchanted_golden_apple})`,PVP_ICONS.meal.enchanted_golden_apple[1])
    }
    // result.meal.golden_apple = getScore(`t${t}.meal.golden_apple`,'pvp.kitdata')
    // result.meal.golden_carrot = getScore(`t${t}.meal.golden_carrot`,'pvp.kitdata')
    // result.meal.enchanted_golden_apple = getScore(`t${t}.meal.enchanted_golden_apple`,'pvp.kitdata')
    form.show(player).then(async gg => { if (gg.selection != undefined) {
        if (infotype == 'created') {
            if ( (gg.selection == 0 && !IS_SELECTED) ) {
                if (checkPerm(player.name,'pvp_activate')) {
                    editPVPselectedSet(t)
                    playsound('armor.equip_iron',player)
                    pvpSettingKit(player)
                } else {
                    rawtext('axiscube.perm.denied.generic',player,'translate','c')
                }
            } else if ( (gg.selection == 1 && !IS_SELECTED) || (gg.selection == 0 && IS_SELECTED) ) {
                pvpExportForm(player,t)
            } else if ( (gg.selection == 2 && !IS_SELECTED) || (gg.selection == 1 && IS_SELECTED) ) {
                if (checkPerm(player.name,'pvp_remove')) {
                    if (await pvpRemoveKit(t,player.name)) {
                        pvpSettingKit(player)
                    }
                    
                } else {
                    rawtext('axiscube.perm.denied.generic',player,'translate','c')
                }
            } else if ( (gg.selection >= 3 && !IS_SELECTED) || (gg.selection >= 2 && IS_SELECTED) ) {
                if (checkPerm(player.name,'pvp_edit')) {
                    pvpEditKitset(player,t,obj)
                } else {
                    rawtext('axiscube.perm.denied.generic',player,'translate','c')
                }
            }
        } else if (infotype == 'demo') {
            if (gg.selection == 0) {
                if (checkPerm(player.name,'pvp_create')) {
                    pvpAddSet(player,obj)
                } else {
                    rawtext('axiscube.perm.denied.generic',player,'translate','c')
                }
            }
        }
    } })
}

export async function pvpExportForm(player,t=0) {
    let generated = pvpExportKit(t)
    const form = new ModalFormData()
    .title('%axiscube.pvp.kitset.export')
    .textField('%axiscube.pvp.kitset.export.kitname',`${player.name}'s Kit`,generated.name)
    .textField('%axiscube.pvp.kitset.templates.author',player.name,generated.author)
    .show(player).then(gg => { if (!gg.canceled) {
        generated.author = gg.formValues[1]
        generated.name = gg.formValues[0]
        const form2 = new ModalFormData()
        .title('%axiscube.pvp.kitset.export')
        form2.textField('\n%axiscube.pvp.kitset.export.kitname.suc\n\n','{}',JSON.stringify(generated))
        form2.show(player).then(gg => {})
    }})
}

export async function pvpImportForm(player) {
    const IMPORT_COMMAND = '/scriptevent axiscube:pvp_import <KIT JSON>'
    const IMPORT_COMMAND_EX = `/scriptevent axiscube:pvp_import {"name":"Axisander's Kit","author":"Axisander","suit":{"armor":{"head":3,"chest":1,"legs":4,"feet":2},"weapon":{"sword":3,"bow":1,"arrow":16},"offhand":{"totem_of_undying":0,"shield":0,"in_slot":0},"meal":{"golden_apple":1,"golden_carrot":12,"enchanted_golden_apple":0}}}`
    const form = new ActionFormData()
    .title('%axiscube.pvp.kitset.import')
    .body(`\n§c%axiscube.pvp.kitset.import.warn\n§r\n%axiscube.pvp.kitset.import.enter\n§b${IMPORT_COMMAND}`)
    .button('%gui.continue')
    .button('gui.cancel')
    .show(player).then(gg => { if (gg.selection == 0) {
        rawtext(`§b${IMPORT_COMMAND}\n`,player)
        rawtext(`For example: §e${IMPORT_COMMAND_EX}\n`,player)
    }})
}

export async function pvpImportForm2(player,message) {
    try {
        let imported = JSON.parse(message)
        for (let type in PVP_KITSUIT) {
            for (let slot in PVP_KITSUIT[type]) {
                if (typeof imported.suit[type][slot] != "number") {
                    placeError(player,'pvp_json_reader_error',[`NotNumberData`])
                    return
                } else if (typeof imported.suit[type][slot] == "number") {
                    if (imported.suit[type][slot] > 128) {
                        placeError(player,'pvp_json_reader_error',[`TooBigInt`])
                        return
                    } else if (Math.ceil(imported.suit[type][slot]) != imported.suit[type][slot]) {
                        placeError(player,'pvp_json_reader_error',[`FloatNumDetected`])
                        return
                    }
                }
            }
        }

        pvpShowKitInfo(player,0,1,imported)
    } catch(error) {
        placeError(player,'javascript_error',['\n',`${error.name}: ${error.message}`,error.stack])
        rawtext('',player)
        placeError(player,'pvp_json_reader_error',[`JS_${error.name}`])
    }
}

export async function pvpTick() {

    const settingsEnchLoyalty = getScore('pvp.ench.loyalty','settings')
    const settingsEnchInfinity = getScore('pvp.ench.infinity','settings')
    const settingsDifficulty = getScore('pvp.difficulty','settings')

    let tickCommands = [
        `difficulty ${MINECRAFT_DIFFICULTIES[settingsDifficulty]}`
    ]

    if (settingsEnchLoyalty) runCMD(`enchant @a[hasitem={location=slot.weapon.mainhand,item=trident}] loyalty ${settingsEnchLoyalty}`)
    if (settingsEnchInfinity) runCMD(`enchant @a[hasitem={location=slot.weapon.mainhand,item=bow}] infinity ${settingsEnchInfinity}`)

    runCMDs(tickCommands)

    const gameType = getGameType()
    if (gameType == 0) {
        // STOP GAME SYSTEM
        let countMembers = 0
        for (const player of world.getPlayers()) {
            if (hasTag(player,'pvp.member')) {
                countMembers = countMembers + 1
            }
        }
        // STOP GAMES
        if (countMembers == 1) {
            stopGame(3,'one_player')
        }
    } else if (gameType == 1) {
        let teams = teamArray()
        if (teams.length === 1) {
            runCMD(`tag @a[tag=team.${teams[0]}] add pvp.winnerteam`)
            stopGame(3,'one_team',{'winner_team': `axiscube.teamgame.team.${teams[0]}`})
        }
    }
}

export async function pvpKiller(killer,prey) {
    let killCommander = [
        `tag "${prey.name}" remove pvp.member`,
        //`scoreboard players reset "${prey.name}"`,
        `playsound mob.skeleton.death @a ${Math.floor(prey.location.x)} ${Math.floor(prey.location.y)} ${Math.floor(prey.location.z)} 1 1 0.7`,
    ]
    if (getGameType() == 0) {
        edScore(prey.nameTag,'pvp.display','','reset')
        edScore(`\ue114 §c${prey.name}`,'pvp.display',3,'set')
        setTickTimeout( () => { edScore(`\ue114 §c${prey.name}`,'pvp.display',2) }, 20 )
    } else if (getGameType() == 1) {
        edScore(`${TEAM_COLORS[getPlayerTeam(prey)]}${prey.name}`,'pvp.display','','reset')
        edScore(`\ue113 §7${prey.name}`,'pvp.display',3,'set')
        setTickTimeout( () => { edScore(`\ue113 §7${prey.name}`,'pvp.display',2) }, 20 )
    } 
    const settingsRegen = getScore('pvp.regen','settings')
    if (settingsRegen) runCMDs([
        'effect @s regeneration 2 255 false',
        'playsound random.potion.brewed @s'
    ],killer)

    runCMDs(killCommander)
}

export async function pvpSettingGame(player) {
    
    const Tiers1 = ['%options.off','%options.on']
    const Tiers3 = ['%options.off','%enchantment.level.1','%enchantment.level.2','%enchantment.level.3']

    const settingsRegen = getScore('pvp.regen','settings')
    const settingsEnchLoyalty = getScore('pvp.ench.loyalty','settings')
    const settingsEnchInfinity = getScore('pvp.ench.infinity','settings')
    const settingsDifficulty = getScore('pvp.difficulty','settings')
    const settingsNametag = getScore('pvp.nametag','settings')
    const settingsFalldamage = getScore('pvp.falldamage','settings')

    const form = new ModalFormData()
    .title('%axiscube.settings.game')
    .toggle('%axiscube.settings.pvp.regen',Boolean(settingsRegen))
    .toggle('%axiscube.settings.nametag',Boolean(settingsNametag))
    .toggle('%axiscube.settings.falldamage',Boolean(settingsFalldamage))
    .dropdown(`%options.difficulty`,MINECRAFT_DIFFICULTIES_NAME,settingsDifficulty)
    .dropdown(`\n${PVP_ICONS.weapon.sword[7][0]} %enchantment.tridentLoyalty`,Tiers3,settingsEnchLoyalty)
    .dropdown(`\n${PVP_ICONS.weapon.bow[1][0]} %enchantment.arrowInfinite`,Tiers1,settingsEnchInfinity)

    form.show(player).then(gg => { if (!gg.canceled) {
        let [ setRegen, setNametag, setFalldamaage,setDifficulty , setEnchLoyalty, setEnchInfinity ] = gg.formValues
        edScore('pvp.regen','settings',setRegen ? 1 : 0)
        edScore('pvp.nametag','settings',setNametag ? 1 : 0)
        edScore('pvp.falldamage','settings',setFalldamaage ? 1 : 0)
        edScore('pvp.difficulty','settings',setDifficulty)
        edScore('pvp.ench.loyalty','settings',setEnchLoyalty)
        edScore('pvp.ench.infinity','settings',setEnchInfinity)
    }})
}
