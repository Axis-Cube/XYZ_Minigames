//Блоки иногда не пропадают там где надо, наверное из-за Math.round
//Если diff 0 значит игра одиночная
import {system, world} from "@minecraft/server"
import {getGameArena, startTimer, stopGame} from "./main"
import {GAMEDATA} from "./gamedata"
import {getScore, randomPlayerIcon, runCMDs} from "../modules/axisTools"
import {COPYRIGHT, SYM} from "../const"
import {games_log} from "../modules/Logger/logger_env"


export const GAMEDATA_TNT = { // Tnt_run
    id: 8,
    namespace: 'tnt',
    min_players: 1,
    tags: [
        'tnt',
        'tnt.halfdead',
        'tnt.winner',
        'tnt.member'
    ],
    loc: {
        0: { 
            gameplay: false,//-507.38 95.00 -991.19
            spawn: { type: 'range', value: [ [ -507 , -507 ], [ 95, 95 ], [ -991, -991  ] ] },
            //newplayer: { type: 'range', value: [ [ 1472 , 1478 ], [ 110, 110 ], [ 476, 478 ] ] },
            spawnpoint: { type: 'range', value: [ [ -507 , -507 ], [ 95, 95 ], [ -991, -991  ] ] },

            a:"-527 94 -974 -475 94 -1026",
            floors: 2,
            floor_x: [-527, -475], //floor_from floor_to ...  //DONT MODIFY
            floor_y: [94, 74, 54], // floor1_y floor2_y
            floor_z: [-974, -1026], //floor_from floor_to ... //DONT MODIFY


            break_y: [95, 55], //max, min
            loose_y: 35,

        },
    },
    ends: {
        no_time: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.tnt.no_time","with":{"rawtext":[{"selector":"@a[tag=tnt.member]"},{"text":`+150${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=tnt.member]'}],
        },
        no_players: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.tnt.no_players","with":{"rawtext":[{"selector":"@a[tag=tnt.member]"},{"text":`+150${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=tnt.member]'}]
        }
    },
    joinable: {
        can_join: false,
        join_commands: [
            'tag @s add tnt',
            'tag @s add tnt.member'
        ],
        prebegin_commands: [],
    },
    time: {
        value: 300,
        xp: true,
        tick_function: function(){},
        actionbar_spec: true,
        events: {
            "t1": tntExtraTick,
        }
    },
    start_commands: tnt_main,
    begin_commands: [
        'tag @a add tnt',
        'tag @a add tnt.member',
        `scoreboard players set "${COPYRIGHT}" tnt.display -9`,
        'scoreboard players set "§1" tnt.display -8',
        {type:'scoreset',value: 1, objective: 'tnt.display'},
        'scoreboard players set "§2" tnt.display 999',
        `scoreboard players set "${randomPlayerIcon()} §a%axiscube.scoreboard.players" tnt.display 998`,
    ],
    death_data: {},
    stop_commands: onStop,
    boards: [
        ['tnt.display', '\ue195§6 %axiscube.tnt.name', true],
    ]
}

async function generate_floors(){
    const arn_info = GAMEDATA[8].loc[getGameArena()]
    const floors_x = arn_info.floor_x
    const floors_y = arn_info.floor_y
    const floors_z = arn_info.floor_z
    await runCMDs([
        `fill ${floors_x[0]} ${floors_y[0]} ${floors_z[0]} ${floors_x[1]} ${floors_y[0]} ${floors_z[1]} green_concrete replace air`,
        `fill ${floors_x[0]} ${floors_y[1]} ${floors_z[0]} ${floors_x[1]} ${floors_y[1]} ${floors_z[1]} green_concrete replace air`,
        `fill ${floors_x[0]} ${floors_y[2]} ${floors_z[0]} ${floors_x[1]} ${floors_y[2]} ${floors_z[1]} green_concrete replace air`
    ])
}

async function tnt_main(){
    try{
        startTimer(8)
    }catch(e){console.warn(e)}
}



let ex_tick = 0


async function tntExtraTick(){
    await generate_floors()
    runCMDs([
        'tag @a add tnt',
        'tag @a add tnt.member',
    ])

    let loc_data = GAMEDATA[8].loc[getGameArena()]
    let diff = getScore('diff','data')
    ex_tick = system.runInterval(()=>{
        for (const player of [...world.getPlayers()]) {
            let countNoWins = 0
            let countWins = 0
            let countMembers = 0
            let player_loc = player.location

            if (!player.hasTag('spec')) {
                if(player_loc.y <= loc_data.loose_y){
                    //Spectate
                    runCMDs([
                        'tag @s remove tnt.member',
                        'tag @s add spec',
                        'gamemode spectator',
                    ],player)
                }
                if(player_loc.y <= loc_data.break_y[0] && player_loc.y >= loc_data.break_y[1]){
                    //let cords = [Math.round(player_loc.x), player_loc.y-1, Math.round(player.location.z)]
                    let cords = [player_loc.x, player_loc.y-1, player.location.z]
                    system.runTimeout(()=>{runCMDs([
                        `fill ${cords[0]} ${cords[1]} ${cords[2]-1} ${cords[0]} ${cords[1]} ${cords[2]+1} air replace green_concrete`,
                        `fill ${cords[0]-1} ${cords[1]} ${cords[2]} ${cords[0]+1} ${cords[1]} ${cords[2]} air replace green_concrete`
                        ],player)
                    },10)
                    
                }
            }

            //Break blocks

        
            
            if (!player.hasTag('spec')) {
                countNoWins = countNoWins + 1
            }
            if (player.hasTag('tnt.member')) {
                countMembers = countMembers + 1
            } else if (player.hasTag('tnt.winner')) {
                countWins = countWins + 1
            }
            if ((diff != 0 && countMembers == 1) || (diff == 0 && countMembers == 0)) {
                tntStop('no_players') //Winner 
            }
        }

    },2)

}

async function tntStop(reason){
    system.clearRun(ex_tick)
    await generate_floors()
    stopGame(8,reason)
}
async function onStop(){
    games_log.put(`[TntRun] onStop commands executed §2sucessfully§r`)
    system.clearRun(ex_tick)
    system.runTimeout(()=>{
        generate_floors()
    },10)
    
}