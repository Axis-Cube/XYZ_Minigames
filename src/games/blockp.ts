import { world } from "@minecraft/server";
import { actionbar, colorPercent, edScore, getScore, hasTag, playsound, powerTP, randomInt, randomPlayerIcon, rawtext, runCMD, runCMDs, setTickTimeout } from "#modules/axisTools";
import { getGameArena, startTimer, stopGame } from "#root/modules/core/games/main";
import { COPYRIGHT, SYM } from "#root/const";
import { eliminatePlayerMessage } from "#tunes/profile";
import { axisEval } from "#modules/evalSandbox";


//#region Constants
export const BLOCKP_TIMES = [
    0,
    5.5, 5.5, 5.5, 5.0, 5.0, 5.0,
    4.5, 4.5, 4.5, 4.5, 4.0, 4.0,
    4.0, 4.0, 4.0, 4.0, 4.0, 4.0,
    3.5, 3.5, 3.5, 3.5, 3.5, 3.5,
    3.0, 3.0, 3.0, 3.0, 3.0, 3.0,
    3.0, 3.0, 3.0, 3.0, 3.0, 3.0,
    3.0, 3.0, 3.0, 3.0, 3.0, 3.0,
    2.5, 2.5, 2.5, 2.5, 2.5, 2.5,
    2.0, 2.0, 2.0, 2.0, 2.0, 2.0,
    1.5, 1.5, 1.5, 1.5, 1.5, 1.5
]

export const BLOCKP_TIMES_SUM = Math.ceil(BLOCKP_TIMES.reduce((partialSum, a) => partialSum + a, 0)) + (6 * BLOCKP_TIMES.length)

const BLOCKP_PLATFORMS = [
    ['brown_wool', 'light_gray_wool', 'black_wool', 'white_wool', 'gray_wool'],
    ['yellow_wool', 'red_wool', 'pink_wool'],
    ['yellow_wool', 'orange_wool', 'pink_wool', 'light_blue_wool', 'red_wool', 'purple_wool', 'blue_wool'],
    ['cyan_wool', 'black_wool', 'purple_wool', 'red_wool', 'yellow_wool', 'pink_wool', 'lime_wool'],
    ['red_wool', 'pink_wool', 'purple_wool'],
    ['light_gray_wool', 'gray_wool', 'black_wool'],
    ['green_wool', 'white_wool', 'red_wool', 'black_wool'],
    ['light_blue_wool', 'green_wool', 'brown_wool'],
    ['light_blue_wool', 'red_wool', 'white_wool', 'green_wool'],
    ['lime_wool', 'red_wool'],
    ['lime_wool', 'red_wool', 'light_blue_wool', 'yellow_wool', 'blue_wool']
]

const BLOCKP_BLOCKS = [
    'black_wool',
    'blue_wool',
    'brown_wool',
    'cyan_wool',
    'gray_wool',
    'green_wool',
    'light_blue_wool',
    'light_gray_wool',
    'lime_wool',
    'magenta_wool',
    'orange_wool',
    'pink_wool',
    'purple_wool',
    'red_wool',
    'white_wool',
    'yellow_wool',
]

const BLOCKP_COLORS = {
    'black_wool': 'r',
    'blue_wool': '9',
    'brown_wool': 'n',
    'cyan_wool': '3',
    'gray_wool': '8',
    'green_wool': '2',
    'light_blue_wool': 'b',
    'light_gray_wool': '7',
    'lime_wool': 'a',
    'magenta_wool': '5',
    'orange_wool': '6',
    'pink_wool': 'd',
    'purple_wool': 'u',
    'red_wool': 'c',
    'white_wool': '7',
    'yellow_wool': 'e',
}

const BLOCKP_COLORNAMES = {
    'black_wool': 'color.black',
    'blue_wool': 'color.blue',
    'brown_wool': 'item.fireworksCharge.brown',
    'cyan_wool': 'item.fireworksCharge.cyan',
    'gray_wool': 'color.gray',
    'green_wool': 'color.green',
    'light_blue_wool': 'item.fireworksCharge.lightBlue',
    'light_gray_wool': 'item.fireworksCharge.silver',
    'lime_wool': 'item.fireworksCharge.lime',
    'magenta_wool': 'item.fireworksCharge.magenta',
    'orange_wool': 'item.fireworksCharge.orange',
    'pink_wool': 'item.fireworksCharge.pink',
    'purple_wool': 'item.fireworksCharge.purple',
    'red_wool': 'color.red',
    'white_wool': 'color.white',
    'yellow_wool': 'color.yellow',
}
//#endregion

//#region Gamedata
export const GAMEDATA_BLOCKP = { // BLOCK PARTY
    id: 2,
    namespace: 'blockp',
    min_players: 1,
    tags: [
        'blockp',
        'blockp.member'
    ],
    loc: {
        0: { //Ready for 1.5
            gameplay: false,
            spawn: { type: 'range', value: [[2510, 2520], [52, 52], [2710, 2730]] },
            newplayer: { type: 'range', value: [[2510, 2520], [52, 52], [2710, 2730]] },
            spawnpoint: '2517 56 2693',
            floorLevel: 50,
            platform: `2500 50 2700`,
            platform1: `2534 50 2734`
        }
    },
    ends: {
        no_time: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.no_time","with":{"rawtext":[{"selector":"@a[tag=blockp.member]"},{"text":"+150${SYM}"}]}}]}`,
            cmd: [{ 'type': 'money', 'sum': 150, 'target': '@a[tag=blockp.member]' }]
        },
        no_players: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.no_players"}]}`
        },
        one_player: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_player","with":{"rawtext":[{"selector":"@a[tag=blockp.member]"},{"text":"+150${SYM}"}]}}]}`,
            cmd: [{ 'type': 'money', 'sum': 150, 'target': '@a[tag=blockp.member]' }]
        }
    },
    joinable: {
        can_join: true,
        join_commands: [
            'tag @s add blockp.member',
            (player) => { placeAirBag(player, false) },
            'scoreboard players set @s blockp.display 3'
        ],
        prebegin_commands: [],
    },
    time: {
        tick_function: blockpTick,
        value: BLOCKP_TIMES_SUM,
        xp: false,
        events: {
            't3': [() => { axisEval('runCMD(`structure load blockp_plate1003 ${GAMEDATA[2].loc[getGameArena()].platform}`)') }],
            't2': [() => { axisEval('runCMD(`structure load blockp_plate1002 ${GAMEDATA[2].loc[getGameArena()].platform}`)') }],
            't1': [() => { axisEval('runCMD(`structure load blockp_plate1001 ${GAMEDATA[2].loc[getGameArena()].platform}`)') }],
        }
    },
    start_commands: function () {
        runCMD('effect @a night_vision 30 0 true')
        startTimer(2)
    },
    begin_commands: [
        'tag @a add blockp.member',
        'scoreboard players set "plate.time" data.gametemp 0',
        'scoreboard players set "plate.id.prev" data.gametemp 1000',
        'scoreboard players set "plate.id" data.gametemp 0',
        `scoreboard players set "${COPYRIGHT}" blockp.display 0`,
        'scoreboard players set "§1" blockp.display 1',
        { type: 'scoreset', value: 3, objective: 'blockp.display' },
        'scoreboard players set "§2" blockp.display 5',
        `scoreboard players set "${randomPlayerIcon()} §a%axiscube.scoreboard.players" blockp.display 4`,

    ],
    death_data: {
        death_commands: []
    },
    items: {
        'axiscube:blockp_totem': placeAirBag
    },
    stop_commands: async function () {
        await runCMD(`structure load blockp_intro ${GAMEDATA_BLOCKP.loc[0].platform}`)
        try { placePlatform(1000) } catch (e) { console.warn(e) }
    },
    boards: [
        ['blockp.display', '\ue195§c %axiscube.blockp.name', true],
    ]
}
//#endregion

//#region Functions

export async function placePlatform(plateID = 0) {
    runCMD(`structure load blockp_plate${plateID} ${GAMEDATA_BLOCKP.loc[0].platform}`)

    if (plateID < 1000) { playsound('ui.loom.take_result', '@a') }
}

export async function placeAirBag(player, itemUse = true) {
    const plateTime = getScore('plate.time', 'data.gametemp')
    const plateID = getScore('plate.id', 'data.gametemp')
    const plateLevel = getScore('plate.lvl', 'data.gametemp')
    const blockInd = getScore('plate.blockindex', 'data.gametemp')
    const plateTimeSec = Math.floor(plateTime / 20) + (1 / (20 / (plateTime % 20)))
    if (plateTimeSec > BLOCKP_TIMES[plateLevel] && itemUse) {
        await rawtext('axiscube.blockp.bonus.rescue_plate', player, 'translate', 'c')
        return
    }
    if (itemUse && plateTimeSec < 0) {
        rawtext('axiscube.blockp.bonus.rescue_plate', player, 'translate', 'c')
        return
    }
    await runCMD(`clear @s axiscube:blockp_totem -1 1`, player)
    await runCMD(`fill ~-1 ${GAMEDATA_BLOCKP.loc[0].floorLevel} ~-1 ~1 ${GAMEDATA_BLOCKP.loc[0].floorLevel} ~1 ${BLOCKP_PLATFORMS[plateID][blockInd]} replace wool`, player, true)
    await runCMD(`tp @s ~ ~1 ~`, player)
    await playsound('block.end_portal_frame.fill', player)
}

export async function delPlatform(plateID = 0, blockIndex = 0) {
    for (let i in BLOCKP_BLOCKS) {
        if (BLOCKP_PLATFORMS[plateID][blockIndex] != BLOCKP_BLOCKS[i]) {
            runCMD(`fill ${GAMEDATA_BLOCKP.loc[0].platform} ${GAMEDATA_BLOCKP.loc[0].platform1} air replace ${BLOCKP_BLOCKS[i]}`)
        }
    }
    playsound('bottle.dragonbreath')
}

export async function blockpTick() {
    let countMembers = 0 //Alive Players
    for (const player of world.getPlayers()) {
        if (Math.floor(player.location.y) == 45 && !hasTag(player, 'spec')) {
            await runCMDs([
                `tp @s ${GAMEDATA_BLOCKP.loc[getGameArena()].spawnpoint}`,
                'tag @s remove blockp.member',
                'tag @s add spec',
                'execute as @s run particle axiscube:spiral ~~~',
                'scoreboard players reset @s blockp.display',
                { type: 'scoreset', value: '', objective: 'blockp.display', action: 'reset', target: player.name },
                { type: 'sound', target: '@a', sound: 'random.screenshot', p: 1.5, v: 1 },
                'clear @s',
                'gamemode spectator'
            ], player)
            await eliminatePlayerMessage(player.name)
            await edScore(`\ue114 §c${player.name}`, 'blockp.display', 3)
            setTickTimeout(() => { edScore(`\ue114 §c${player.name}`, 'blockp.display', 2) }, 20)
        }
        if (!hasTag(player, 'spec')) {
            countMembers = countMembers + 1
        }
    }
    // STOP GAMES
    if (countMembers == 1 && [...world.getPlayers()].length != 1) {
        stopGame(2, 'one_player')
    } else if (countMembers == 0) {
        stopGame(2, 'no_players')
    }
    // COMMANDS
    let every5Ticks = ['effect @a[tag=blockp.member] speed 756 0 true', 'effect @a night_vision 30 0 true']
    runCMDs(every5Ticks)
    blockp5ticks()
}
//#endregion

//#region Events
export async function blockp5ticks() {
    const plateTime = getScore('plate.time', 'data.gametemp')
    const plateID = getScore('plate.id', 'data.gametemp')
    const plateLevel = getScore('plate.lvl', 'data.gametemp')
    const plateIDprev = getScore('plate.id.prev', 'data.gametemp')
    const blockInd = getScore('plate.blockindex', 'data.gametemp')
    const plateTimeSec = Math.floor(plateTime / 20) + (1 / (20 / (plateTime % 20)))
    //console.warn(plateTime,plateTimeSec,BLOCKP_TIMES[plateLevel],BLOCKP_TIMES[plateLevel] != 0)
    if (plateTimeSec == -3) {
        let randomPlateID = randomInt(0, BLOCKP_PLATFORMS.length - 1)
        while (randomPlateID == plateIDprev) {
            randomPlateID = randomInt(0, BLOCKP_PLATFORMS.length - 1)
        }
        let randomBlockIndex = randomInt(0, BLOCKP_PLATFORMS[randomPlateID].length - 1)
        //rawtext(`plate - ${randomPlateID}, ind - ${randomBlockIndex}, block - ${BLOCKP_PLATFORMS[randomPlateID][randomBlockIndex]}`)
        placePlatform(randomPlateID)
        await edScore('plate.blockindex', 'data.gametemp', randomBlockIndex)
        await edScore('plate.id.prev', 'data.gametemp', randomPlateID)
        await edScore('plate.id', 'data.gametemp', randomPlateID)
        await edScore('plate.lvl', 'data.gametemp', 1, 'add')
        await edScore('plate.time', 'data.gametemp', 20 * (BLOCKP_TIMES[plateLevel + 1] + 3))
        await edScore(`${COPYRIGHT}`, 'blockp.display', (-1) * (randomPlateID))
        // Bonus
        let bonusChance = randomInt(1, 100)
        if (bonusChance >= 80) {
            let pos = await powerTP({ type: 'range', value: [[2510, 2520], [51, 51], [2710, 2730]] }, undefined, undefined, 'pos')
            await runCMD(`structure load blockp_bonus0 ${pos}`)
        }

    } else if (plateTimeSec > BLOCKP_TIMES[plateLevel] && BLOCKP_TIMES[plateLevel] != 0) {
        actionbar(`§2${BLOCKP_TIMES[plateLevel].toFixed(3)}`)
    } else if (plateTimeSec <= BLOCKP_TIMES[plateLevel] && BLOCKP_TIMES[plateLevel] != 0) {
        //console.warn(plateTimeSec,BLOCKP_TIMES[plateLevel])
        if (plateTimeSec == BLOCKP_TIMES[plateLevel]) {
            let commands = [
                'scoreboard players set "\ue196 §6%axiscube.blockp.target_color" blockp.display 7',
                'scoreboard players set "§3" blockp.display 8',
                `scoreboard players set "§${BLOCKP_COLORS[BLOCKP_PLATFORMS[plateID][blockInd]]}%${BLOCKP_COLORNAMES[BLOCKP_PLATFORMS[plateID][blockInd]]}" blockp.display 6`, 'title @s title §c', `titleraw @s subtitle {"rawtext":[{"text":"§${BLOCKP_COLORS[BLOCKP_PLATFORMS[plateID][blockInd]]}"},{"translate":"${BLOCKP_COLORNAMES[BLOCKP_PLATFORMS[plateID][blockInd]]}"}]}`,
                { 'type': 'lockslot', 'item': BLOCKP_PLATFORMS[plateID][blockInd], 'slot': 5 }]
            //scoreboard players set "" blockp.display 6
            playsound('note.pling')
            runCMDs(commands, '@a', true)
        }
        if (plateTimeSec > 0) {
            if (plateTime % 20 === 0 && plateTimeSec != BLOCKP_TIMES[plateLevel]) playsound('random.click')
            actionbar(`§${colorPercent(plateTimeSec / BLOCKP_TIMES[plateLevel])}${plateTimeSec.toFixed(3)}`)
        } else if (plateTimeSec == 0) {
            let commands = [
                'scoreboard players reset "\ue196 §6%axiscube.blockp.target_color" blockp.display',
                'scoreboard players reset "§3" blockp.display',
                `scoreboard players reset "§${BLOCKP_COLORS[BLOCKP_PLATFORMS[plateID][blockInd]]}%${BLOCKP_COLORNAMES[BLOCKP_PLATFORMS[plateID][blockInd]]}" blockp.display`,
                'clear @a wool',
                'kill @e[type=item]',
                'execute as @a[tag=!spec] run scriptevent axiscube:eval addMoney(name,5)'
            ]
            runCMDs(commands)
            actionbar(`§40.000`, '@a[tag=spec]')
            delPlatform(plateID, blockInd)
        }

    }
    edScore('plate.time', 'data.gametemp', 5, 'remove')
}
//#endregion