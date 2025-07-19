import {world} from "@minecraft/server";
import {
    actionbar,
    edScore,
    getScore,
    hasTag,
    onItemInteraction,
    playsound,
    randomInt,
    runCMD,
    runCMDs,
    shuffle,
    tellraw
} from "../modules/axisTools";
import isMoving from "../modules/playerMove";
import {stopGame} from "./main";
import {openJSON} from "../modules/easyform";
import {getPlayerColor} from "../tunes/profile";
import {addMoney} from "../tunes/bank";
import {ActionFormData} from "@minecraft/server-ui";
import {COPYRIGHT, SCOLOR, SYM} from "../const";
import {axisEval} from "../modules/evalSandbox";

// Hide And Seek

export const HNS_BLOCKS = [
    {
        id: 'cobblestone',
        name: 'tile.cobblestone.name',
        icon: 'textures/blocks/cobblestone',
    },
    {
        id: 'tnt',
        icon: 'textures/blocks/tnt_side',
        name: 'tile.tnt.name',
    },
    {
        id: 'coal_ore',
        name: 'tile.coal_ore.name',
        icon: 'textures/blocks/coal_ore',
    },
    {
        id: 'gold_ore',
        name: 'tile.gold_ore.name',
        icon: 'textures/blocks/gold_ore',
    },
    {
        id: 'crafting_table',
        icon: 'textures/blocks/crafting_table_front',
        name: 'tile.crafting_table.name',
    }
    // {
    //     id: 'barrel',
    //     name: 'tile.barrel.name',
    //     icon: 'textures/blocks/barrel_side',
    // },
    // {
    //     id: 'anvil',
    //     icon: 'textures/blocks/anvil_base',
    //     name: 'tile.anvil.name',
    // },
    // {
    //     id: 'decorated_pot',
    //     icon: 'textures/blocks/decorated_pot_side',
    //     name: 'tile.decorated_pot.name',
    // },
    // {
    //     id: 'furnace',
    //     icon: 'textures/blocks/furnace_front_on',
    //     name: 'tile.furnace.name',
    // },
];

export const GAMEDATA_HNS =  {
    id: 1,
    namespace: 'hns',
    min_players: 2,
    reset_player_color: {
        0: false
    },
    tags: [
        'hns',
        'hns.seeker',
        'hns.seeker.main',
        'hns.hider',
        'hns.hider.hidden',
        'hns.hider.last',
        'hns.pvptime'
    ],
    loc: {
        0: { //Ready for 1.5
            gameplay: '4058 19 4074',
            spawn: '4060 34 4061',
            spawnpoint: '4057 28 4102',
            seeker: '4057 28 4102'
        }
    },
    confirm_begin: {
        0: {
            warn_message: 'axiscube.games.startgame.confirm.d_line2.hns',
            check: false
        }
    },
    ends: {
        no_hiders: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.hns.no_hiders","with":{"rawtext":[{"selector":"@a[tag=hns.seeker.main]"},{"text":"+150${SYM}"}]}}]}`,
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=hns.seeker.main]'}]
        },
        no_seekers: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.hns.no_seekers","with":{"rawtext":[{"selector":"@a[tag=hns.hider]"},{"text":"+100${SYM}"}]}}]}`,
            cmd: [{'type':'money','sum': 100, 'target': '@a[tag=hns.hider]'}]
        },
        no_time: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.hns.no_time","with":{"rawtext":[{"selector":"@a[tag=hns.hider]"},{"text":"+100${SYM}"}]}}]}`,
            cmd: [{ type: 'money', sum: 100, target: '@a[tag=hns.hider]' }]
        }
    },
    time: {
        value: 421,
        tick_function: hnsTick,
        xp: true,
        actionbar_spec: true,
        notify_times: [ 180, 60 ],
        events: {
            350: [
                'tag @a add hns.pvptime',
                'tellraw @a[tag=hns.hider] {"rawtext":[{"translate":"axiscube.hns.hider_att"}]}',
                { type: 'lockslot', slot: 1, item: 'wooden_sword', target: '@a[tag=hns.hider]' },
                { type: 'armor', elements: {1:'netherite_helmet',3:'netherite_leggings',4:'netherite_boots'}, target: '@a[tag=hns.seeker]' },
            ]
        }
    },
    start_commands: [
        `execute as @a run scoreboard players random @s hns.block 0 ${HNS_BLOCKS.length-1}`,
        { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
        { type: 'lockslot', slot: 5, item: 'axiscube:hns_blockchooser' },
        { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
    ],
    joinable: {
        can_join: false,
        prebegin_commands: [
            `execute as @s run scoreboard players random @s hns.block 0 ${HNS_BLOCKS.length-1}`,
            { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
            { type: 'lockslot', slot: 5, item: 'axiscube:hns_blockchooser' },
            { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
        ]
    },
    begin_commands: [
        'scoreboard players set "§1" hns.display 9',
        'scoreboard players set "\ue193 §a%axiscube.hns.hiders:" hns.display 8',
        'scoreboard players set "§2" hns.display 6',
        'scoreboard players set "\ue194 §c%axiscube.hns.seekers:" hns.display 5',
        'scoreboard players set "§3" hns.display 1',
        `scoreboard players set "${COPYRIGHT}" hns.display 0`,
        'tag @r add hns.seeker.main',
        'tag @a[tag=!hns.seeker.main] add hns.hider',
        'tag @a[tag=hns.seeker.main] add hns.seeker',
        'scoreboard players set @a[tag=hns.seeker] data.gametemp 405',
        'event entity @a[tag=hns.hider] axiscube:hide_nametag',
        async () => {onBegin()},
        'gamerule pvp true',
        'tellraw @a { "rawtext": [ { "translate": "axiscube.hns.seeker_became","with": { "rawtext": [ { "selector": "@a[tag=hns.seeker.main]" } ] } } ] }',
        {type:'scoreset',value: 4, objective: 'hns.display',target: '@a[tag=hns.seeker]'},
        {type:'scoreset',value: 7, objective: 'hns.display',target: '@a[tag=hns.hider]'},
    ],
    death_data: {
        disable_notify: true,
        death_commands: function (player) {
            runCMD('clear @s')
            hnsDeath(player)
        },
        killFunc: hnsKiller,
        kill_reward: 10,
    },
    items: {
        'axiscube:hns_blockchooser': hnsBlockChoice,
        'axiscube:hns_blockslist': hnsBlockListUI,
        'axiscube:hns_taunt': hnsFormTaunts
    },
    stop_commands: [
        'execute as @a at @s run execute positioned as @s run scriptevent axiscube:eval unplaceBlock(player,true)'
    ],
    boards: [
        ['hns.display', '\ue192§6 %axiscube.hns.name', true],
        ['hns.timer'],
        ['hns.block'],
        ['hns.taunt'],
    ]
}

export function hnsBlockListUI(player) {
    const EasyFormObj: any = {
        'x': {
            title: "axiscube.hns.block_list",
            body: "%axiscube.hns.block_list.d",
            buttons: []
        }
    }
    for (const playerT of world.getPlayers()) {
        if (hasTag(playerT,'hns.hider')) {
            if (hasTag(playerT,'hns.hider.hidden')) {
                EasyFormObj.x.buttons.push({
                    button_name: {rawtext:[
                        {translate: HNS_BLOCKS[getScore(playerT,'hns.block')].name},
                        {text: '\n'},
                        {translate: 'axiscube.hns.block_sel.hidden', with: [playerT.name]},
                    ]},
                    on_click: [
                        {type:'cmd', value: `tellraw @s ${JSON.stringify({rawtext:[{translate: HNS_BLOCKS[getScore(playerT,'hns.block')].name},{text: ': '},{translate: 'axiscube.hns.block_sel.hidden', with: [`§a${getPlayerColor(playerT.name)}${playerT.name}§r`]}]})}`}
                    ],
                    icon: `${HNS_BLOCKS[getScore(playerT,'hns.block')].icon}`
                })
            } else {
                EasyFormObj.x.buttons.push({
                    button_name: {rawtext:[
                        {translate: HNS_BLOCKS[getScore(playerT,'hns.block')].name},
                        {text: '\n'},
                        {translate: 'axiscube.hns.block_sel.visible', with: [playerT.name]},
                    ]},
                    on_click: [
                        {type:'cmd', value: `tellraw @s ${JSON.stringify({rawtext:[{translate: HNS_BLOCKS[getScore(playerT,'hns.block')].name},{text: ': '},{translate: 'axiscube.hns.block_sel.visible', with: [`§a${getPlayerColor(playerT.name)}${playerT.name}§r`]}]})}`}
                    ],
                    icon: `textures/ui/icons/avatars_full/${randomInt(0,8)}`
                })
            }
        }
    }
    openJSON('x',player,EasyFormObj)
}

const HNS_TAUNTS = [
    {
        name: `%axiscube.hns.taunt.name.techy_oink`,
        icons: `textures/ui/icons/games/hns/taunt_techy`,
        eval: (player) => {
            let sounds = ['mob.piglin.jealous','mob.piglin.ambient','mob.piglin.retreat','mob.piglin.celebrate','mob.piglin.angry','mob.piglin.admiring_item','mob.pig.say']
            runCMD(`playsound ${shuffle(sounds)[0]} @a ~~~`,player)
            runCMD(`particle minecraft:soul_particle`,player)
        },
        cooldown: 5,
        reward: 1
    },
    {
        name: `%axiscube.hns.taunt.name.flame`,
        icons: '',
        eval: (player) => {
            runCMD(`playsound mob.blaze.death @a ~~~`,player)
            runCMD(`particle minecraft:mobflame_single ~~1~`,player)
        },
        cooldown: 5,
        reward: 1
    },
    {
        name: `%entity.evocation_fang.name`,
        icons: `textures/ui/icons/games/hns/taunt_fangs`,
        eval: (player) => {
            runCMDs([
                `summon evocation_fang ~1 ~-1 ~1`,
                `summon evocation_fang ~1 ~-1 ~-1`,
                `summon evocation_fang ~-1 ~-1 ~-1`,
                `summon evocation_fang ~-1 ~-1 ~1`
            ],player)
        },
        cooldown: 10,
        reward: 5
    },
    {
        name: `%item.totem.name`,
        icons: `textures/items/totem`,
        eval: (player) => {
            runCMDs([
                `playsound random.totem @a ~~~`,
                `particle minecraft:totem_particle`,
                `particle minecraft:totem_particle`,
                `particle minecraft:totem_particle ~~-1~`,
                `particle minecraft:totem_particle ~~-1~`
            ],player)
        },
        cooldown: 13,
        reward: 7
    },
    {
        name: `%axiscube.hns.taunt.name.boom`,
        icons: 'textures/blocks/tnt_side',
        eval: (player) => {
            runCMDs([
                `playsound random.explode @a ~~~`,
                'particle minecraft:huge_explosion_emitter'
            ],player)
        },
        cooldown: 34,
        reward: 17
    },
    {
        name: `%entity.lightning_bolt.name`,
        icons: '',
        eval: (player) => {
            runCMDs([
                `summon lightning_bolt ~ ~-10 ~`
            ],player)
        },
        cooldown: 35,
        reward: 25,
    },
    {
        name: '%axiscube.hns.taunt.name.growl',
        icons: '',
        eval: (player) => {
            runCMDs([
                'particle minecraft:trial_spawner_detection_ominous ~~-1~',
                'playsound mob.enderdragon.growl @a ~~~',
                ],player)
                },
                cooldown: 15,
                reward: 15,
    },
    {
        name: '%axiscube.hns.taunt.name.brewer',
            icons: '',
            eval: (player) => {
            let sounds = ['random.potion.brewed']
            runCMDs([
                'playsound random.potion.brewed @a ~~~',
                'particle minecraft:splash_spell_emitter ~~-1~'
            ],player)
        },
        cooldown: 5,
        reward: 1
    }
]

export function hnsFormTaunts(player) {
    const coldownTime = getScore(player,'hns.taunt')
    if (coldownTime > 0) {
        tellraw({rawtext:[{translate:'axiscube.hns.taunt.cooldown',with:[`${coldownTime/20}`]}]},player)
        return
    }
    onItemInteraction(player,true)
    const form = new ActionFormData()
    .title('%axiscube.hns.taunt.title')
    .body('%axiscube.hns.taunt.d')
    
    for (let i of HNS_TAUNTS) {
        form.button(`${i.name}\n${i.cooldown} sec | ${SCOLOR}${i.reward}${SYM}`,i.icons)
    }
    form.show(player).then( gg => { if (!gg.canceled) {
        if(!gg.selection){return;}

        edScore(player,'hns.taunt',HNS_TAUNTS[gg.selection].cooldown*20)
        addMoney(player.name,HNS_TAUNTS[gg.selection].reward)
        HNS_TAUNTS[gg.selection].eval(player)
    } })
}

export function hnsBlockChoice(player) {
    let result: any = []
    for (let i in HNS_BLOCKS) {
        let button_result: any = {}
        let thisBlock = HNS_BLOCKS[i]
        if (thisBlock.name == undefined) {
            button_result['button_name'] = `tile.${thisBlock.id}.name`
        } else {
            button_result['button_name'] = thisBlock.name
        }
        if (thisBlock.icon == undefined) {
            button_result['icon'] = `textures/blocks/${thisBlock.id}`
        } else {
            button_result['icon'] = thisBlock.icon
        }
        button_result['on_click'] = [{"type": "cmd","value": `scoreboard players set @s hns.block ${i}`}]
        result.push(button_result)
    }
    openJSON('hns_block',player,{hns_block: {
        title: '%axiscube.hns.block_sel',
        body: '%axiscube.hns.block_sel.d',
        buttons: result
    }})
}

export async function unplaceBlock(player,disableNotify=false) {
    const name = player.name;
    await edScore(`${player.nameTag}`,'hns.display',7,'set');
    await edScore(`§o${player.nameTag}`,'hns.display','','reset');
    await runCMD(`tag @s remove hns.hider.hidden`,player);
    await runCMD(`setblock ~~~ air`,`@e[name="place:${name}"]`)
    if (!disableNotify) {
        await runCMD(`titleraw @s actionbar {"rawtext":[{"text":"\ue158 §c"},{"translate":"axiscube.hns.moved"}]}`,player);
        await playsound(`random.shulkerboxopen`,player,0.5);
    }
    await runCMDs([
        {type: 'lockslot',item: 'air',slot: 9,target:'@s'},
        `kill @e[name="place:${name}"]`,
    ],player)
}

async function placeBlock(player) {
    const name = player.name
    const commands = [
        `execute if block ~ ~-1 ~ air run tag @s add hns.temp0`,
        `execute unless block ~ ~ ~ air run tag @s add hns.temp0`,
        `execute unless block ~ ~2 ~ air run tag @s add hns.temp0`,
    ]
    await runCMDs(commands,player)
    if (hasTag(player,'hns.temp0')) { await runCMD('tag @s remove hns.temp0',player); await runCMD(`titleraw @s actionbar {"rawtext":[{"text":"\ue158 §c"},{"translate":"axiscube.hns.placed.error"}]}`,player); return; };
    if (hasTag(player,'hns.hider.hidden')) { return };
    await edScore(player,'hns.timer');
    await edScore(`${player.nameTag}`,'hns.display','','reset');
    await edScore(`§o${player.nameTag}`,'hns.display',7);
    await runCMD(`titleraw @s actionbar {"rawtext":[{"text":"\ue193 §a"},{"translate":"axiscube.hns.placed"}]}`,player);
    await playsound(`random.anvil_land`,player,0.5);
    const commands2 = [
        {type: 'lockslot',item: 'axiscube:hns_taunt',slot: 9,target:'@s'},
        `summon axiscube:dummy "place:${name}" ${Math.floor(player.location.x)} ${Math.floor(player.location.y)} ${Math.floor(player.location.z)}`,
        `setblock ~~~ axiscube:hns_${HNS_BLOCKS[getScore(player,'hns.block')].id}`,
        `tp @s ${Math.floor(player.location.x)} ~1 ${Math.floor(player.location.z)}`,
        `tag @s add hns.hider.hidden`,
    ]
    await runCMDs(commands2,player)
}

export async function hnsDeath(player) {
    let hiderCommands = [
        `scoreboard players set "${player.nameTag}" hns.display 3`,
        `scoreboard players reset "§o${player.nameTag}" hns.display`,
        'tag @s add hns.seeker',
        'tag @a remove hns.hider.last',
        'tag @s add hns.hider.last',
        'tag @s remove hns.hider',
        'event entity @s axiscube:show_nametag'
    ]
    if(hasTag(player,'hns.hider')) {
        runCMDs(hiderCommands,player)
    }
    edScore(player,'data.gametemp',150)
}

export async function hnsKiller(killer,prey) {
    if (hasTag(prey,'hns.hider')) tellraw(`{"rawtext":[{"translate":"axiscube.hns.death","with":{"rawtext":[{"text":"${prey.name}"},{"text":"${getPlayerColor(killer.name)}${killer.name}"},{"translate":"${HNS_BLOCKS[getScore(prey,'hns.block')].name}"}]}}]}`,'@a')
}

export async function hnsTick() {
    let tickCommands = [
        `spawnpoint @a ${GAMEDATA_HNS.loc[0].spawnpoint}`,
        'stopsound @a game.player.die'
    ]
    runCMDs(tickCommands)
    let no_hiders = true
    let no_seekers = true
    for (const player of world.getPlayers()) {
        if (hasTag(player,'hns.hider')) {
            no_hiders = false
        } else if (hasTag(player,'hns.seeker')) {
            no_seekers = false
        }
        if (hasTag(player,'hns.hider') && !hasTag(player,'hns.hider.hidden')) {
            let hisTimer = getScore(player,'hns.timer')
            if (!isMoving(player)) {
                edScore(player,'hns.timer',5,'add')
                if (hisTimer >= 140) {
                    await placeBlock(player)
                } else if (hisTimer >= 120) {
                    actionbar('\ue158 §a█████ \ue193',player)
                } else if (hisTimer >= 100) {
                    actionbar('\ue158 §a████§c▓ \ue193',player)
                } else if (hisTimer >= 80) {
                    actionbar('\ue158 §a███§c▓▓ \ue193',player)
                } else if (hisTimer >= 60) {
                    actionbar('\ue158 §a██§c▓▓▓ \ue193',player)
                } else if (hisTimer >= 40) {
                    actionbar('\ue158 §a█§c▓▓▓▓ \ue193',player)
                } else if (hisTimer >= 20) {
                    actionbar('\ue158 §c▓▓▓▓▓ \ue193',player)
                }
             } else {
                if (hisTimer >= 20) {
                    playsound('beacon.activate',player,1,1.5)
                    await runCMD(`titleraw @s actionbar {"rawtext":[{"text":"\ue158 §c"},{"translate":"axiscube.hns.moved"}]}`,player)
                }
                await edScore(player,'hns.timer')
            }
        } else if (hasTag(player,'hns.hider.hidden')) {
            if (isMoving(player)) {
                runCMD('effect @s clear',player)
                await unplaceBlock(player)
            } else {
                runCMD('effect @s invisibility 1 0 true',player)
            }
        } else if (hasTag(player,'hns.seeker')) {
            let hisTime = getScore(player,'data.gametemp')
            if (hisTime > 0) {
                if (hasTag(player,'hns.seeker.main')) {
                    if (hisTime == 400) {
                        runCMD(`tellraw @a { "rawtext": [ { "translate": "axiscube.hns.seeker_sleep","with": ["${hisTime/20}"] } ] }`)
                    } else if (hisTime == 200) {
                        runCMD(`tellraw @a { "rawtext": [ { "translate": "axiscube.hns.seeker_sleep","with": ["${hisTime/20}"] } ] }`)
                    } else if (hisTime == 100) {
                        runCMD(`tellraw @a { "rawtext": [ { "translate": "axiscube.hns.seeker_sleep","with": ["${hisTime/20}"] } ] }`)
                    } else if (hisTime == 60) {
                        runCMD(`tellraw @a { "rawtext": [ { "translate": "axiscube.hns.seeker_sleep","with": ["${hisTime/20}"] } ] }`)
                    } else if (hisTime == 40) {
                        runCMD(`tellraw @a { "rawtext": [ { "translate": "axiscube.hns.seeker_sleep","with": ["${hisTime/20}"] } ] }`)
                    } else if (hisTime == 20) {
                        runCMD(`tellraw @a { "rawtext": [ { "translate": "axiscube.hns.seeker_sleep","with": ["${hisTime/20}"] } ] }`)
                    }
                }
                await edScore(player,'data.gametemp',5,'remove')
            } else if (hisTime == 0) {
                await edScore(player,'data.gametemp',5,'remove')
                let commands = [
                    `tellraw @a { "rawtext": [ { "translate": "axiscube.hns.seeker_is_free","with": ["${player.name}"] } ] }`,
                    { type: 'lockslot', slot: 9, item: 'axiscube:hns_blockslist', target: '@s' },
                    `tp @s ${GAMEDATA_HNS.loc[0].gameplay}`,
                    `tellraw @s {"rawtext":[{"translate":"axiscube.hns.block_list"}]}`,
                    { type: 'armor', elements: {1:'netherite_helmet',3:'netherite_leggings',4:'netherite_boots'}, target: '@s[tag=hns.pvptime]' },
                ]
                //await runCMD(`replaceitem entity @s slot.hotbar 0 iron_sword 1 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" },"minecraft:can_destroy":{"blocks":["axiscube:hns_tnt","axiscube:hns_anvil","axiscube:hns_coal_ore","axiscube:hns_crafting_table","axiscube:hns_furnace","axiscube:hns_gold_ore","axiscube:hns_decorated_pot"]}}`,player)
                await runCMD(`replaceitem entity @s slot.hotbar 0 iron_sword 1 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`,player)
                await runCMDs(commands,player)
                player.nameTag = `\ue191 ${player.nameTag}`
                for (const playerT of world.getPlayers()) {
                    if (hasTag(playerT,'hns.hider')) {
                        await runCMD(`tellraw "${player.name}" {"rawtext":[{"text":"- "},{"translate":"${HNS_BLOCKS[getScore(playerT,'hns.block')].name}"},{"text":" §7[${playerT.name}]"}]}`)
                    }
                }
                playsound('armor.equip_generic','@a')
            }
        }
        if (hasTag(player,'hns.hider') && getScore(player,'hns.taunt') > 0) {
            edScore(player,'hns.taunt',5,'remove')
        }
    }
    if (no_hiders) {
        await stopGame(1,'no_hiders')
        return
    } else if (no_seekers) {
        await stopGame(1,'no_seekers')
        return
    }
};

async function onBegin(){
    console.warn('onBegin')
    for (const playerT of world.getPlayers()) {
        if (hasTag(playerT,'hns.hider')) {
            await tellraw(`{"rawtext":[{"rawtext":[{"translate":"axiscube.hns.your_role","with":{"rawtext":[{"translate":"${HNS_BLOCKS[getScore(playerT,'hns.block')].name}"}]}}]}]}`,playerT)
        } else {
            axisEval('runCMD(`tp @a[tag=hns.seeker] ${GAMEDATA[1].loc[getGameArena()].seeker}`)')
        }
    }
}
