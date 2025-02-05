import { EntityComponentTypes, ItemStack, system, world } from "@minecraft/server";
import { COPYRIGHT, DIM, SYM } from "#root/const";
import { actionbar, getScore, playsound, randomPlayerIcon, runCMD } from "#modules/axisTools";
import { beginGame, getGameArena, startTimer, stopGame } from "#modules/core/games/main";
import { GAMEDATA, I_GameData } from "#modules/core/games/gamedata";

//#region Variables
let timer = 300
let winners: {name: string, time: number}[] = []
//#endregion

//#region Gamedata
export const GAMEDATA_PRK: I_GameData = { // Parkour
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
        0: { //Mansion 
            spawn: { type: 'range', value: [ [ -37 , -41 ], [ 2, 2 ], [ -2092, -2089 ] ] },
            //newplayer: { type: 'range', value: [ [ 1472 , 1478 ], [ 110, 110 ], [ 476, 478 ] ] },
            spawnpoint: { type: 'range', value: [ [ -37 , -41 ], [ 2, 2 ], [ -2092, -2089 ] ] },
            barrier: ["-37 2 -2088", "-41 4 -2088"],
            voidY: -10
        },
        1: {
            spawn: { type: 'range', value: [ [ 3 , -3 ], [ -9, -9 ], [ -2083, -2078 ] ] },
            spawnpoint: { type: 'range', value: [ [ 3 , -3 ], [ -9, -9 ], [ -2083, -2078 ] ] },
            barrier: ["2 -9 -2070", "-2 -7 -2070"],
            voidY: -15
        },
        2: {
            spawn: { type: 'range', value: [ [ 39 , 41 ], [ -8, -8 ], [ -2088, -2083 ] ] },
            spawnpoint: { type: 'range', value: [ [ 39 , 41 ], [ -8, -8 ], [ -2088, -2083 ] ] },
            barrier: ["41 -5 -2081","35 -8 -2081"],
            voidY: -20
        },
        3: { //Candy World
            spawn: { type: 'range', value: [ [ 86 , 77 ], [ -8, -8 ], [ -2083, -2088 ] ] },
            spawnpoint: { type: 'range', value: [ [ 86 , 77 ], [ -8, -8 ], [ -2083, -2088 ] ] },
            barrier: ["89 -8 -2080", "75 -5 -2080"],
            voidY: -30
        },
        4: { //Matrix
            spawn: { type: 'range', value: [ [ 130 , 126 ], [ -5, -5 ], [ -2090, -2084 ] ] },
            spawnpoint: { type: 'range', value: [ [ 130 , 126 ], [ -5, -5 ], [ -2090, -2084 ] ] },
            barrier: ["131 -5 -2081", "125 -1 -2081"],
            voidY: -18
        },
        5: { // FIXME
            spawn: { type: 'range', value: [ [ 179 , 174 ], [ 0, 0 ], [ -2086, -2081 ] ] },
            spawnpoint: { type: 'range', value: [ [ 179 , 174 ], [ 0, 0 ], [ -2086, -2081 ] ] },
            barrier: ["131 -5 -2081", "125 -1 -2081"],
            voidY: -30
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
            't1': prkTime,
            't0': async function (){
                await beginGame(11)

                let item = new ItemStack('axiscube:back_to_checkpoint');
                for (const player of [...world.getPlayers()]) {
                    player.getComponent(EntityComponentTypes.Inventory)?.container?.setItem(8 ,item);
                }
            }
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
//#endregion

//#region Functions
async function setCheckpoint(player){
    try{
        let p_loc = player.location
        let block_loc = {x: p_loc.x, y:Math.round((Number(p_loc.y)-1)), z:p_loc.z}
        let checkpoint_loc = DIM.getBlock(block_loc)?.location

        if(DIM.getBlock(block_loc)?.typeId == 'minecraft:gold_block' && checkpoint_loc){
            if(player.getDynamicProperty('prk_checkpoint') == undefined || player.getDynamicProperty('prk_checkpoint') != `${checkpoint_loc.x} ${(checkpoint_loc.y)+1} ${checkpoint_loc.z}`){
                player.setDynamicProperty('prk_checkpoint',`${checkpoint_loc.x} ${(checkpoint_loc.y)+1} ${checkpoint_loc.z}`)
                runCMD(`spawnpoint "${player.name}" ${checkpoint_loc.x} ${(checkpoint_loc.y)+1} ${checkpoint_loc.z}`)
                actionbar('\ue115 Checkpoint created!', player.name)
                playsound('random.orb', player.name)
            }else{
                let vel = player.getVelocity()
                if(vel.x == 0 && vel.z == 0){
                    actionbar('\ue12f Checkpoint already created!', player.name)
                }
            }
        }
    }catch{}
}

async function WinHandler(player){
    try{
        let p_loc = player.location
        let block_loc = {x: p_loc.x, y:Math.round((Number(p_loc.y)-1)), z:p_loc.z}
        if(DIM.getBlock(block_loc)?.typeId == 'minecraft:diamond_block'){
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
    runCMD(`tp "${player.name}" ${checkpoint}`)
}

async function prk_main(){
    runCMD(`fill ${GAMEDATA[11].loc[getGameArena()].barrier[0]} ${GAMEDATA[11].loc[getGameArena()].barrier[1]} barrier`)
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
        if (!player.hasTag('spec') && player.hasTag('prk.member')) {
            if(player.location.y <= -30){ player.kill() }
            setCheckpoint(player)
            WinHandler(player)
            playersCount++
        }
        if ( player.hasTag('prk.winner')){playersWin++}
    }

    if (playersCount == 0 && playersWin == 0) {
        prkStop('no_players') //Winner 
    }else if(playersCount == 0 && playersWin > 0){
        prkStop('no_players')
    }
    
}

async function prkTime(){
    runCMD(`fill ${GAMEDATA[11].loc[getGameArena()].barrier[0]} ${GAMEDATA[11].loc[getGameArena()].barrier[1]} air`)
}

async function prkStop(reason){
    let w_names: string[] = []
    winners.map(itm => {w_names.push(itm.name)})
    runCMD(`titleraw @a title {"rawtext":[{"text":"ud0\'Winners: ${w_names.join(', ')}\'"}]}`)
    stopGame(11,reason)

}

async function prkOnStop(){
    for (const player of [...world.getPlayers()]) {
        player.clearDynamicProperties()
    }
    await system.runTimeout(()=>{}, 60)
    runCMD(`title @a title ud0""`)
}
//#endregion