import { EquipmentSlot, ItemStack, system, world, EntityComponentTypes, Dimension } from "@minecraft/server"
import { COPYRIGHT, SYM } from "../../const"
import { edScore, getScore, hasTag, isPlayerinArea, playsound, powerTP, runCMD, runCMDs, sleep, tellraw } from "../../modules/axisTools"
import { GAMEDATA } from "../gamedata"
import { getGameArena, startGame, startTimer, stopGame } from "../main"
import { TEAMS2, getPlayerTeam, teamArray } from "../category_team"
import { MT_GAMES } from "../../modules/MultiTasking/instances"

export const GAMEDATA_FW_FRONTLINE = { // fw_frontline    
    id: 10,
    namespace: 'fw_frontline',
    min_players: 1,
    tags: [
        'fw_frontline',
        'fw_frontline.member',
        'fw_frontline.winnerteam',
        'fw_frontline.void',
        'blue',
        'red'
    ],
    team_data: {
        teams: TEAMS2,
        spectator: true,
        icons: 'heads',
        color_name: true
    },
    confirm_begin: {
        0: {
            warn_message: 'axiscube.games.startgame.confirm.d_line2.team',
            check: false//'teamcheck'
        }
    },
    loc: {
        0: {

            //2051.50 118.00 2039.50
            gameplay: false,
            spawn: { type: 'range', value: [ [ 2044, 2054 ], [ 118, 118 ], [ 2046, 2030 ] ] }, //2044.45 118.00 2046.50 2054.54 118.00 2030.67
            newplayer: '2051.50 118.00 2039.50',

            cleardata: {
                1: [ { x: 2083, y: 80, z:2069 }, { x: 2014, y: 80, z:2010 } ],
            },
            level_low: 80,
            level_high: 117,
            //commands
        }
    },
    ends: {
        team_blue_win: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"TEAM BLUE WIN"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 150, 'target': '@a[tag=team.blue]'}]
        },
        team_red_win: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"TEAM RED WIN"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 150, 'target': '@a[tag=team.red]'}]
        },
        no_time: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"$<WINNER_TEAM>"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 100, 'target': '@a[tag=fw_frontline.member]'}]
        },
    },
    joinable: {
        can_join: false,
        prebegin_commands: [],
    },
    time: {
        value: 500,
        tick_function: bridgeTick,
        xp: true,
        events: {}
    },
    start_commands: [
        () => {bridgePrepair()},
        { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
        { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
        { type: 'lockslot', slot: 5, item: 'axiscube:team_selection' },
    ],
    begin_commands: bridgeBegin,
    death_data: {
        death_commands: expansionHandler
    },
    stop_commands: bridgeStop,
    boards: [
        ['fw_frontline.display', '\ue190§c %axiscube.fw_frontline.name', true],
    ]
}


const teams_info = {
    0:{
        floor_y: 85,

        'blue': {
            spawn: {x:2088,y:87.5,z:2039},
            focus: "2009 89 2040",
            armor: {
                head: new ItemStack('axiscube:blue_leather_helmet'),
                chest: new ItemStack('axiscube:blue_leather_chestplate')
            },
            start_blue_x: 2049,
            base: 2081,
        },
        'red': {
            spawn: {x:2009,y:87.5,z:2040},
            focus: "2088 89 2039",
            armor: {
                head: new ItemStack('axiscube:red_leather_helmet'),
                chest: new ItemStack('axiscube:red_leather_chestplate')
            },
            base: 2016,
            start_red_x: 2048,
        }
    }
}
const BRIDGE_BLOCKS = [
    'blue_concrete',
    'red_concrete'
]

const BRIDGE_TEAMSCORES = {
    'red': 'red_command',
    'blue': 'blue_command'
}

export async function bridgeClear(){
    try{
        const clearData = GAMEDATA[10].loc[getGameArena()].cleardata
        const levelLow = GAMEDATA[10].loc[getGameArena()].level_low
        const levelHigh = GAMEDATA[10].loc[getGameArena()].level_high

        
        for(let d = 1; d<=Object.keys(clearData).length; d++){
            if (clearData.hasOwnProperty(d)){
                await runCMD(`tickingarea add ${clearData[d][0].x} ${clearData[d][0].y} ${clearData[d][0].z} ${clearData[d][1].x} ${clearData[d][1].y} ${clearData[d][1].z} flagw_bridges_${d} true`,undefined,true)
            }
        }
        runCMD('kill @e[type=item]')
        // SUPERCLEAN Systems v1 by Axiscube Inc. 
        for(let y = levelLow-1; y<=levelHigh;y+=2){
            for(let d = 1; d<=Object.keys(clearData).length; d++){
                if (clearData.hasOwnProperty(d)){
                    for(const block of BRIDGE_BLOCKS){
                        await sleep(800)
                        // clearData[d][0].y=y
                        // clearData[d][1].y=y+2
                        // DIM.fillBlocks(clearData[d][0],clearData[d][1],MinecraftBlockTypes.air,{matchingBlock:BlockPermutation.resolve(`minecraft:${block}`,{})})
                        runCMD(`fill ${clearData[d][0].x} ${y} ${clearData[d][0].z} ${clearData[d][1].x} ${y+2} ${clearData[d][1].z} air replace ${block}`, undefined,true)
                    }
                }
            }
        }
        return 0
    }catch(e){console.warn(e)}
}

let points //start territory - end territory x
async function bridgePrepair(){
    points = 0
    let arn = getGameArena()
    const teams = teamArray()
    edScore(COPYRIGHT,'fw_frontline.display',0)
    for (let i in teams) {
        const team = teams[i]
        edScore(`${BRIDGE_TEAMSCORES[team]}`,'fw_frontline.display',(Number(i)+1)*2)
        edScore(`§${i}`,'fw_frontline.display',(Number(i)+1)*2-1)
    }

    //2010 2069 - Z OF MAP
    try{
        system.runTimeout(()=>{
            runCMD(`fill ${teams_info[arn].red.base} ${teams_info[arn].floor_y} 2010 ${teams_info[arn].red.start_red_x} ${teams_info[arn].floor_y} 2069 red_concrete_powder replace blue_concrete_powder`,undefined,true) //red team
            runCMD(`fill ${teams_info[arn].blue.base} ${teams_info[arn].floor_y} 2010 ${teams_info[arn].blue.start_blue_x} ${teams_info[arn].floor_y} 2069 blue_concrete_powder replace red_concrete_powder`,undefined,true)
            bridgeClear()
        },50)
    }catch(e){console.warn(e)}

    edScore('fw_fl_points','data.gametemp',points)
    //startTimer(9)
}

async function bridgeEquipment(){
    try{
        let arn = getGameArena()
        for (const player of [...world.getPlayers()]) {
            if (!player.hasTag('spec')) {
                const equipment = player.getComponent('equippable')
                if(hasTag(player, 'team.blue')){
                    equipment.setEquipment(EquipmentSlot.Head, teams_info[arn].blue.armor.head);
                    equipment.setEquipment(EquipmentSlot.Chest, teams_info[arn].blue.armor.chest)

                    runCMDs([
                        `give @s iron_sword`,
                        `give @s bow`,
                        `give @s iron_pickaxe`,
                        `give @s blue_concrete 32`,
                    ],player)
                }
                else if(hasTag(player, 'team.red')){
                    equipment.setEquipment(EquipmentSlot.Head, teams_info[arn].red.armor.head);
                    equipment.setEquipment(EquipmentSlot.Chest, teams_info[arn].red.armor.chest)

                    runCMDs([
                        `give @s iron_sword`,
                        `give @s bow`,
                        `give @s iron_pickaxe`,
                        `give @s red_concrete 32`,
                    ],player)
                }
            }}
    }catch(e){console.warn(e)}
}

async function bridgeOtherIterations(){
    try{
        let arn = getGameArena()
        for (const player of [...world.getPlayers()]) {
            if (!player.hasTag('spec')) {
                const red_spawn = teams_info[arn].red.spawn
                const blue_spawn = teams_info[arn].blue.spawn
                if(hasTag(player, 'team.blue')){
                    runCMD(`spawnpoint @s ${blue_spawn.x} ${blue_spawn.y} ${blue_spawn.z}`,player)
                    
                }
                else if(hasTag(player, 'team.red')){
                    runCMD(`spawnpoint @s ${red_spawn.x} ${red_spawn.y} ${red_spawn.z}`,player)
                }
            }}
    }catch(e){console.warn(e)}
}

async function bridgeBegin(){
    let arn = getGameArena()
    const red_team = teams_info[arn].red
    const blue_team = teams_info[arn].blue

    const blue_spawn = blue_team.spawn
    const red_spawn = red_team.spawn
    runCMD(`tp @a[tag=team.blue] ${blue_spawn.x} ${blue_spawn.y} ${blue_spawn.z} facing ${blue_team.focus}`)
    runCMD(`tp @a[tag=team.red] ${red_spawn.x} ${red_spawn.y} ${red_spawn.z} facing ${red_team.focus}`)

    information()
    bridgeOtherIterations()
    bridgeEquipment()
    system.runTimeout(()=>{
        runCMD(`title @a actionbar \ue198 PVP Enabled`)
        runCMD(`gamerule pvp true`)
    },100)
}

async function bridgeTick(){
    for (const player of [...world.getPlayers()]) {

        if (!player.hasTag('spec')) {
            //const blue_team = getScore('fw_fl_blue','data.gametemp')
            //const red_team = getScore('fw_fl_red','data.gametemp')
//
            ////если захватили поле то выигрыщ
            //if(points < -32){await WinHandle('blue')}
            //else if(red_team > && blue_team != 0){await WinHandle('red')}
        }
    }
}
let info = 0

async function information(){
    info = system.runInterval(()=>{
        runCMD(`titleraw @a title {"rawtext":[{"text":"ud0\'${"temp"+"\n"+points}\'"}]}`)
        //runCMD(`titleraw @a[tag=red] title {"rawtext":[{"text":"ud0\'${"\ue127".repeat(getScore('fw_br_red','data.gametemp'))}\'"}]}`)
    },10)
    MT_GAMES.register(info)
}

async function expansionHandler(player){
    let arn = getGameArena()
    let command = getPlayerTeam(player)
    if(command == 'red'){
        points -= 4
        //console.warn(`fill ${teams_info[arn].blue.start_blue_x+points+4} ${teams_info[arn].floor_y} 2010 ${teams_info[arn].blue.start_blue_x-points} ${teams_info[arn].floor_y} 2069 blue_concrete_powder`)
        //runCMD(`fill ${teams_info[arn].blue.start_blue_x+points+4} ${teams_info[arn].floor_y} 2010 ${teams_info[arn].blue.start_blue_x-points} ${teams_info[arn].floor_y} 2069 blue_concrete_powder`,undefined,true)
    }
    else{
        points += 4
        //runCMD(`fill ${teams_info[arn].red.start_red_x+points-4} ${teams_info[arn].floor_y} 2010 ${teams_info[arn].red.start_red_x+points} ${teams_info[arn].floor_y} 2069 red_concrete_powder`,undefined,true)
    }
}

async function WinHandle(command){
    stopGame(10, `team_${command}_win`)
}

async function bridgeDeath(player){
    runCMD('gamemode spectator',player)
    runCMD(`gamemode a @s`,player)
    
}

async function bridgeStop(){
    runCMD(`say stopped`)
    try{
        MT_GAMES.kill()
    }catch(e){console.warn(e,info)}
    runCMD(`title @a title ud0""`)
}
