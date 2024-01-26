import { system, world } from "@minecraft/server"
import { getGameArena, startTimer } from "./main"
import { GAMEDATA } from "./gamedata"
import { randomPlayerIcon, runCMD, setblock } from "../modules/axisTools"
import { COPYRIGHT } from "../const"


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

            break_y: [95, 55], //max, min
            loose_y: 35,

        },
    },
    ends: {},
    joinable: {
        can_join: false,
        join_commands: [
            'tag @s add tnt',
            'tag @s add tnt.member'
        ],
        prebegin_commands: [],
    },
    time: {
        value: 555,
        xp: true,
        tick_function: function(){},
        actionbar_spec: true,
        notify_times: [300, 180, 60],
        events: {
            't1': tntExtraTick
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
    stop_commands: [ ],
    boards: [
        ['tnt.display', '\ue195§6 %axiscube.tnt.name', true],
    ]
}

function tnt_main(){
    startTimer(8)
}

function tntExtraTick(){
    system.runInterval(()=>{
        let loc_data = GAMEDATA[8].loc[getGameArena()]


        for (const player of [...world.getPlayers()]) {
            let player_loc = player.location

            if (!player.hasTag('spec')) {
                if(player_loc.y <= loc_data.loose_y){
                    //Spectate
                    console.warn('spectator')
                }
                if(player_loc.y <= loc_data.break_y[0] && player_loc.y >= loc_data.break_y[1]){
                    let cords = [player_loc.x, player_loc.y-1, player.location.z]

                    system.runTimeout(()=>{runCMD(`setblock ${cords[0]} ${cords[1]} ${cords[2]} air replace`)},5)
                    
                }
            }

            //Break blocks

        }
    },3)
}

function tntTime(){

}