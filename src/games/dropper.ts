//Ready for Release
import { COPYRIGHT } from "#root/const";
import { Player, system, world } from "@minecraft/server";
import { randomPlayerIcon, runCMD, runCMDs, shuffle } from "#modules/axisTools";
import { getGameArena, startTimer, stopGame } from "#modules/core/games/main";
import { GAMEDATA, I_GameData } from "#modules/core/games/gamedata";
import { games_log } from "#modules/Logger/logger_env";

//#region Variables
let random_stages: number[] = []
let winner_list: {name: string, target:Player}[] = []
let players_count = 0
//#endregion

//#region Gamedata
export const GAMEDATA_DRP: I_GameData = { // Dropper
    id: 7,
    namespace: 'drp',
    min_players: 1,
    tags: [
        'drp',
        'drp.halfdead',
        'drp.winner',
        'drp.member'
    ],
    loc: {
        0: { 
            spawn: { type: 'range', value: [ [ 1539 , 1545 ], [ 120, 120 ], [ 487, 498 ] ] },
            //newplayer: { type: 'range', value: [ [ 1472 , 1478 ], [ 110, 110 ], [ 476, 478 ] ] },
            spawnpoint: { type: 'range', value: [ [ 1539 , 1545 ], [ 120, 120 ], [ 487, 498 ] ] },

            stages: {
                1:{
                    spawnpoint: "1472 110 476",
                    safe_y: 110,
                    win_y: 40
                },
                2:{
                    spawnpoint: "1506.71 110.25 462.61", 
                    safe_y: 110,
                    win_y: 40
                },
                3:{
                    spawnpoint: "1442.33 109.50 537.09", 
                    safe_y: 109,
                    win_y: 40
                },
                4:{
                    spawnpoint: "1524.51 110.00 509.88", 
                    safe_y: 110,
                    win_y: 39
                },
                5:{
                    spawnpoint: "1431.39 110.00 502.56", 
                    safe_y: 110,
                    win_y: 43
                },
                6:{
                    spawnpoint: "1492.96 110.00 447.46", 
                    safe_y: 110,
                    win_y: 39
                },
                7: {
                    spawnpoint: "1475.58 110.00 511.49",
                    safe_y: 110,
                    win_y: 40
                },
                8:{
                    spawnpoint: "1480.61 110.00 529.55", 
                    safe_y: 110,
                    win_y: 41
                },
                9:{
                    spawnpoint: "1439.22 111.00 471.93", 
                    safe_y: 111,
                    win_y: 44
                }
            }

        },
    },
    ends: {
        no_time: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.drp.no_time","with":{"rawtext":[{"selector":"@a[tag=drp.winner]"}]}}]},
            cmd: [{'type':'money','sum': 50, 'target': '@a[tag=drp.winner]'}]
        },
        no_players: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.drp.no_players","with":{"rawtext":[{"selector":"@a[tag=drp.winner]"}]}}]},
            cmd: giveAwards
        },
    },
    joinable: {
        can_join: false,
        join_commands: [
            'tag @s add drp',
            'tag @s add drp.member'
        ],
        prebegin_commands: [],
    },
    time: {
        value: 555,
        tick_function: drpTick,
        xp: true,
        actionbar_spec: true,
        notify_times: [300, 180, 60],
        events: {
            't1': drpTime
        }
    },
    start_commands: drp_main,
    begin_commands: [
        'tag @a add drp',
        'tag @a add drp.member',
        `scoreboard players set "${COPYRIGHT}" drp.display -9`,
        'scoreboard players set "§1" drp.display -8',
        {type:'scoreset',value: 1, objective: 'drp.display'},
        'scoreboard players set "§2" drp.display 999',
        `scoreboard players set "${randomPlayerIcon()} §a%axiscube.drp.scoreboard.stages" drp.display 998`,
    ],
    death_data: {},
    stop_commands: [
        'structure load drop_0 1547 120 485',
        'kill @e[type=snow_golem]'
    ],
    boards: [
        ['drp.display', '\ue195§6 %axiscube.drp.name', true],
    ]
}
//#endregion

//#region Functions
async function drp_main(max_stages = 3){
    random_stages = shuffle(Object.keys(GAMEDATA[7].loc[getGameArena()].stages).sort().map(Number))
    random_stages = random_stages.slice(0,max_stages)
    games_log.put('[DRP] Arenas: '+random_stages)
    await runCMDs([
        `structure load drop_${random_stages[0]} 1547 120 485`,
        `structure load drop_${random_stages[1]} 1547 120 490`,
        `structure load drop_${random_stages[2]} 1547 120 495`
    ])
    startTimer(7)
}

async function drpTick(){
    let temp_players = 0
    for (const player of [...world.getPlayers()]) {
        if (!player.hasTag('spec')) {
            temp_players += 1
            let stage = Number(player.getDynamicProperty('drp_stage'))
            if(GAMEDATA[7].loc[getGameArena()].stages[stage]==undefined){player.setDynamicProperty('drp_stage',random_stages[0])}
            if(player.isInWater && player.location.y <= GAMEDATA[7].loc[getGameArena()].stages[stage].win_y){await nextRound(player)}
            if((player.location.y < GAMEDATA[7].loc[getGameArena()].stages[stage].safe_y && player.isOnGround && player.isInWater==false)){
                player.kill()
            }

        }
    }
    players_count = temp_players

    if(players_count == 0){
        games_log.put('[DRP] Winners: '+JSON.stringify(winner_list.reverse()))
        runCMD(`titleraw @a title {"rawtext":[{"text":"ud0\'Winners: ${[...winner_list.reverse().map(plr => plr.name)].join(', ')}\'"}]}`)
        stopGame(7,'no_players')
    }

}

function drpTime(){
    for (const player of [...world.getPlayers()]) {
        player.clearDynamicProperties()
        player.setDynamicProperty('drp_stage',random_stages[0])
        runCMD(`tp "${player.name}" ${GAMEDATA[7].loc[getGameArena()].stages[random_stages[0]].spawnpoint}`)
        runCMD(`spawnpoint "${player.name}" ${GAMEDATA[7].loc[getGameArena()].stages[random_stages[0]].spawnpoint}`)
    }
}

async function nextRound(player){
    let stage_num = Number(player.getDynamicProperty('drp_stage'))
    if(GAMEDATA[7].loc[getGameArena()].stages[random_stages[random_stages.indexOf(stage_num)+1]] != undefined){
        stage_num=random_stages[random_stages.indexOf(stage_num)+1]
    }else{
        runCMDs([
            'tag @s add drp.winner',
            'tag @s remove drp.member',
            'tag @s add spec',
            'gamemode spectator',
            `tellraw @a {"rawtext":[{"translate":"axiscube.games.player_arrived","with":["${player.nameTag}"]}]}`,
        ],player)
        winner_list.push({name: player.name, target:player})
        games_log.put(JSON.stringify(winner_list))
    }
    player.setDynamicProperty('drp_stage',stage_num)
    runCMD(`scoreboard players set "${player.nameTag}" drp.display ${random_stages.indexOf(stage_num)+1}`)
    runCMD(`spawnpoint "${player.name}" ${GAMEDATA[7].loc[getGameArena()].stages[stage_num].spawnpoint}`)
    runCMD(`tp "${player.name}" ${GAMEDATA[7].loc[getGameArena()].stages[stage_num].spawnpoint}`)
}

async function giveAwards(){
    let winners = winner_list.reverse()
    for(let el in winners){
        switch (Number(el)){
            case 0:
                runCMDs([{'type':'money','sum': 100, 'target': '@s'}],winners[el].target)
            break;
            case 1:
                runCMDs([{'type':'money','sum': 50, 'target': '@s]'}],winners[el].target)
            break;
            default:
                runCMDs([{'type':'money','sum': 10, 'target': '@s'}],winners[el].target)
            break;
        }
    }
    await system.runTimeout(()=>{}, 60)
}
//#endregion