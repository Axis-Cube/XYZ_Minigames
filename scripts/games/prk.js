import { system, world } from "@minecraft/server";
import { COPYRIGHT, DIM, SYM } from "../const";
import { actionbar, getScore, playsound, randomPlayerIcon, runCMD } from "../modules/axisTools";
import { startTimer, stopGame } from "./main";
import { MT_GAMES } from "../modules/MultiTasking/instances";

let timer = 300

export const GAMEDATA_PRK = { // Dropper
    id: 11,
    namespace: 'prk',
    min_players: 1,
    tags: [
        'prk',
        'prk.halfdead',
        'prk.winner',
        'prk.member'
    ],
    loc: {
        0: { 
            gameplay: false,//-37 1 -2092   -41 1 -2089
            spawn: { type: 'range', value: [ [ -37 , -41 ], [ 2, 2 ], [ -2092, -2089 ] ] },
            //newplayer: { type: 'range', value: [ [ 1472 , 1478 ], [ 110, 110 ], [ 476, 478 ] ] },
            spawnpoint: { type: 'range', value: [ [ -37 , -41 ], [ 2, 2 ], [ -2092, -2089 ] ] }
        },
        1: {
            gameplay: false,//-3 -9 -2083 -3 - 9 -2078
            spawn: { type: 'range', value: [ [ 3 , -3 ], [ -9, -9 ], [ -2083, -2078 ] ] },
            //newplayer: { type: 'range', value: [ [ 1472 , 1478 ], [ 110, 110 ], [ 476, 478 ] ] },
            spawnpoint: { type: 'range', value: [ [ 3 , -3 ], [ -9, -9 ], [ -2083, -2078 ] ] }
        }
    },
    ends: {
        no_time: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.prk.no_time","with":{"rawtext":[{"selector":"@a[tag=prk.winner]"},{"text":`+150${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 80, 'target': '@a[tag=prk.winner]'}]
        },
        no_players: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.prk.no_players","with":{"rawtext":[{"selector":"@a[tag=prk.winner]"},{"text":`+150${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 80, 'target': '@a[tag=prk.winner]'}]
        },
    },
    joinable: {
        can_join: false,
        join_commands: [
            'tag @s add prk',
            'tag @s add prk.member'
        ],
        prebegin_commands: [],
    },
    time: {
        value: timer,
        tick_function: prkTick,
        xp: true,
        actionbar_spec: true,
        notify_times: [300, 180, 60],
        events: {
            't1': prkTime
        }
    },
    start_commands: prk_main,
    begin_commands: [
        'tag @a add prk',
        'tag @a add prk.member',
        `scoreboard players set "${COPYRIGHT}" prk.display -9`,
        'scoreboard players set "§1" prk.display -8',
        {type:'scoreset',value: 1, objective: 'prk.display'},
        'scoreboard players set "§2" prk.display 999',
        `scoreboard players set "${randomPlayerIcon()} §a%axiscube.scoreboard.players" prk.display 998`,
    ],
    death_data: {},
    stop_commands: prkOnStop,
    boards: [
        ['prk.display', '\ue195§6 %axiscube.prk.name', true],
    ]
}
let winners = []

async function setCheckpoint(player){
    try{
        let p_loc = player.location
        let block_loc = {x: p_loc.x, y:Math.round((Number(p_loc.y)-1)), z:p_loc.z}
        let checkpoint_loc = DIM.getBlock(block_loc).location
        if(DIM.getBlock(block_loc).typeId == 'minecraft:gold_block'){
            if(player.getDynamicProperty('prk_checkpoint') == undefined || player.getDynamicProperty('prk_checkpoint') != `${checkpoint_loc.x} ${(checkpoint_loc.y)+1} ${checkpoint_loc.z}`){
                player.setDynamicProperty('prk_checkpoint',`${checkpoint_loc.x} ${(checkpoint_loc.y)+1} ${checkpoint_loc.z}`)
                actionbar('\ue115 Checkpoint created!', player.name)
                playsound('random.orb', player.name)
            }else{
                let vel = player.getVelocity()
                if(vel.x != 0 && vel.z != 0)
                actionbar('\ue116 Checkpoint already created!', player.name)
            }
        }
    }catch{}
}

async function WinHandler(player){
    try{
        let p_loc = player.location
        let block_loc = {x: p_loc.x, y:Math.round((Number(p_loc.y)-1)), z:p_loc.z}
        if(DIM.getBlock(block_loc).typeId == 'minecraft:diamond_block'){
            winners.push({name:player.name, time:(timer - getScore('time','data.gametemp'))})
            player.addTag('prk.winner')
            player.addTag('spec')
            player.removeTag('prk.member')
            runCMD(`gamemode spectator ${player.name}`)
        }
    }catch{}
}

export async function prkCheckpointTp(player){
    let checkpoint = player.getDynamicProperty('prk_checkpoint')
    runCMD(`tp ${player.name} ${checkpoint}`)
}

async function prk_main(){
    winners = []
    for (const player of [...world.getPlayers()]) {
        player.clearDynamicProperties()
    }
    startTimer(11)
}
async function prkTick(){
    let playersCount = 0
    let playersWin = 0

    for (const player of [...world.getPlayers()]) {
        if (!player.hasTag('spec')) {
            setCheckpoint(player)
            WinHandler(player)
        }
        if (player.hasTag('prk.member')) {
            playersCount = playersCount + 1
        } else if (player.hasTag('prk.winner')) {
            playersWin = playersWin + 1
        }
        if (playersCount == 0) {
            prkStop('no_players') //Winner 
        }
    }
    

}

async function prkTime(){

}

async function prkStop(reason){
    let w_names = []
    winners.map(itm => {w_names.push(itm.name)})
    runCMD(`titleraw @a title {"rawtext":[{"text":"ud0\'Winners: ${w_names}\'"}]}`)
    stopGame(11,reason)

}

async function prkOnStop(){
    for (const player of [...world.getPlayers()]) {
        player.clearDynamicProperties()
    }
    runCMD(`title @a title ud0""`)
}
