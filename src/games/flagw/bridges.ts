import { EquipmentSlot, ItemStack, system, world, EntityComponentTypes, Dimension } from "@minecraft/server"
import { allBlocks, COPYRIGHT, SYM } from "../../const"
import { edScore, getScore, hasTag, isPlayerinArea, playsound, powerTP, runCMD, runCMDs, sleep, tellraw } from "../../modules/axisTools"
import { GAMEDATA } from "../gamedata"
import { getGameArena, startGame, startTimer, stopGame } from "../main"
import { TEAMS2, getPlayerTeam, teamArray } from "../category_team"
import { MT_GAMES } from "../../modules/MultiTasking/instances"

export const GAMEDATA_FW_BRIDGES = { // fw_bridges READY FOR 1.5    
    id: 9,
    namespace: 'fw_bridges',
    min_players: 1,
    tags: [
        'fw_bridges',
        'fw_bridges.member',
        'fw_bridges.winnerteam',
        'fw_bridges.void',
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
        0: { //Ready for 1.5
            gameplay: false,
            spawn: { type: 'range', value: [ [ 3027, 3011 ], [ 57, 57 ], [ 1016, 1000 ] ] },
            newplayer: '3018 57 1008',

            cleardata: {
                1: [ { x: 3085, y: -25, z:1043 }, { x: 2952, y: -25, z:973 } ],
            },
            level_low: -25,
            level_high: 55,

            red_hole: [[3057, 3, 1006],[3053, 1, 1010]],
            blue_hole: [[2984, 3, 1010],[2980, 1, 1006]]
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
            cmd : [{'type':'money','sum': 100, 'target': '@a[tag=fw_bridges.member]'}]
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
        () => {bridgeClear()},
        () => {bridgePrepair()},
        { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
        { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
        { type: 'lockslot', slot: 5, item: 'axiscube:team_selection' },
    ],
    begin_commands: bridgeBegin,
    death_data: {
        death_commands: bridgeDeath
    },
    stop_commands: bridgeStop,
    boards: [
        ['fw_bridges.display', '\ue190§c %axiscube.fw_bridges.name', true],
    ]
}


const teams_info = {
    'blue': {
        spawn: {x:2994,y:8.5,z:1008},
        focus: "3055 6 1008",
        armor: {
            head: new ItemStack('axiscube:blue_leather_helmet'),
            chest: new ItemStack('axiscube:blue_leather_chestplate')
        },
    },
    'red': {
        spawn: {x:3043,y:8.5,z:1008},
        focus: "2982 6 1008",
        armor: {
            head: new ItemStack('axiscube:red_leather_helmet'),
            chest: new ItemStack('axiscube:red_leather_chestplate')
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
        const clearData = GAMEDATA[9].loc[getGameArena()].cleardata
        const levelLow = GAMEDATA[9].loc[getGameArena()].level_low
        const levelHigh = GAMEDATA[9].loc[getGameArena()].level_high

        
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
                        await sleep(2)
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

let points = 7
async function bridgePrepair(){
    const teams = teamArray()
    for (let i in teams) {
        const team = teams[i]
        edScore(`${BRIDGE_TEAMSCORES[team]}`,'fw_bridges.display',(Number(i)+1)*2)
        edScore(`§${i}`,'fw_bridges.display',(Number(i)+1)*2-1)
    }

    edScore('fw_br_red','data.gametemp',points)
    edScore('fw_br_blue','data.gametemp',points)
    //startTimer(9)
}
//{"minecraft:can_place_on": 
//{"minecraft:can_destroy":{"blocks":["blue_concrete"]}}

async function bridgeEquipment(){
    let all_blocks = []
    try{
        for (const player of [...world.getPlayers()]) {
            if (!player.hasTag('spec')) {
                const equipment = player.getComponent('equippable')
                if(hasTag(player, 'team.blue')){
                    equipment?.setEquipment(EquipmentSlot.Head, teams_info['blue'].armor.head);
                    equipment?.setEquipment(EquipmentSlot.Chest, teams_info['blue'].armor.chest)

                    runCMDs([
                        `give @s iron_sword`,
                        `give @s bow`,
                        `give @s iron_pickaxe 1 0 {"minecraft:can_destroy":{"blocks":["blue_concrete", "red_concrete"]}}`,
                        `give @s blue_concrete 128 0 {"minecraft:can_place_on":${allBlocks}}`,
                        `give @s arrow 64`,
                    ],player)
                }
                else if(hasTag(player, 'team.red')){
                    equipment?.setEquipment(EquipmentSlot.Head, teams_info['red'].armor.head);
                    equipment?.setEquipment(EquipmentSlot.Chest, teams_info['red'].armor.chest)

                    runCMDs([
                        `give @s iron_sword`,
                        `give @s bow`,
                        `give @s iron_pickaxe 1 0 {"minecraft:can_destroy":{"blocks":["blue_concrete", "red_concrete"]}}`,
                        `give @s red_concrete 128 0 {"minecraft:can_place_on":${allBlocks}}`,
                        `give @s arrow 64`,
                    ],player)
                }
            }}
    }catch(e){'[Bridges]'+console.warn(e), console.warn(e.stack)}
}

async function bridgeOtherIterations(){
    try{
        for (const player of [...world.getPlayers()]) {
            if (!player.hasTag('spec')) {
                const red_spawn = teams_info.red.spawn
                const blue_spawn = teams_info.blue.spawn
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

    const red_team = teams_info.red
    const blue_team = teams_info.blue

    const blue_spawn = blue_team.spawn
    const red_spawn = red_team.spawn
    runCMD(`tp @a[tag=team.blue] ${blue_spawn.x} ${blue_spawn.y} ${blue_spawn.z} facing ${blue_team.focus}`)
    runCMD(`tp @a[tag=team.red] ${red_spawn.x} ${red_spawn.y} ${red_spawn.z} facing ${red_team.focus}`)

    information()
    bridgeOtherIterations()
    bridgeEquipment()
    runCMD(`gamemode a @a[tag=!spec]`)
    system.runTimeout(()=>{
        runCMD(`title @a actionbar \ue198 PVP Enabled`)
        runCMD(`gamerule pvp true`)
    },100)
}

async function bridgeTick(){
    for (const player of [...world.getPlayers()]) {

        if (!player.hasTag('spec')) {
            const isInRedHole = isPlayerinArea(GAMEDATA[9].loc[getGameArena()].red_hole[0], GAMEDATA[9].loc[getGameArena()].red_hole[1], player)
            const isInBlueHole = isPlayerinArea(GAMEDATA[9].loc[getGameArena()].blue_hole[0], GAMEDATA[9].loc[getGameArena()].blue_hole[1], player)
            const blue_team = getScore('fw_br_blue','data.gametemp')
            const red_team = getScore('fw_br_red','data.gametemp')
            if(isInBlueHole){HoleHandlers('blue',player)}
            if(isInRedHole){HoleHandlers('red',player)}

            if(blue_team == 0 && red_team != 0){await WinHandle('red')}
            else if(red_team == 0 && blue_team != 0){await WinHandle('blue')}
        }
    }
}
let info = 0

async function information(){
    info = system.runInterval(()=>{
        runCMD(`titleraw @a title {"rawtext":[{"text":"ud0\'${"§4Red: "+"\ue125".repeat(points-getScore('fw_br_blue','data.gametemp'))+"\ue12e".repeat(getScore('fw_br_blue','data.gametemp'))+"\n"+"§9Blu: "+"\ue127".repeat(points-getScore('fw_br_red','data.gametemp'))+"\ue12e".repeat(getScore('fw_br_red','data.gametemp'))}\'"}]}`)
        //runCMD(`titleraw @a[tag=red] title {"rawtext":[{"text":"ud0\'${"\ue127".repeat(getScore('fw_br_red','data.gametemp'))}\'"}]}`)
    },10)
    MT_GAMES.register(info)
}

async function HoleHandlers(color, player){
    if(hasTag(player,'team.blue') && color == 'red'){
        let score = getScore('fw_br_red','data.gametemp')
        edScore('fw_br_red','data.gametemp', score-1)
        player.teleport(teams_info['blue'].spawn)
        //Sound
        runCMD(`particle minecraft:knockback_roar_particle ${teams_info.blue.focus}`) //Red hole
        playsound('random.levelup', '@a[tag=team.blue]',0.5,0.5)
        playsound('ambient.weather.thunder', '@a[tag=team.red]',0.5,0.5)

    }else if(hasTag(player,'team.red') && color == 'blue'){
        let score = getScore('fw_br_blue','data.gametemp')
        edScore('fw_br_blue','data.gametemp', score-1)
        player.teleport(teams_info['red'].spawn)
        //Sound
        runCMD(`particle minecraft:knockback_roar_particle ${teams_info.red.focus}`) //Blue hole
        playsound('random.levelup', '@a[tag=team.red]',0.5,0.5)
        playsound('ambient.weather.thunder', '@a[tag=team.blue]',0.5,0.5)
    }//Other

    else if(hasTag(player,'team.red') && color == 'red'){
        let score = getScore('fw_br_red','data.gametemp')
        edScore('fw_br_red','data.gametemp', score-1)
        player.teleport(teams_info['red'].spawn)
        //Sound
        runCMD(`particle minecraft:knockback_roar_particle ${teams_info.blue.focus}`) //Red hole
        playsound('random.levelup', '@a[tag=team.blue]',0.5,0.5)
        playsound('ambient.weather.thunder', '@a[tag=team.red]',0.5,0.5)
    }else if(hasTag(player,'team.blue') && color == 'blue'){
        let score = getScore('fw_br_blue','data.gametemp')
        edScore('fw_br_blue','data.gametemp', score-1)
        player.teleport(teams_info['blue'].spawn)
        //Sound
        runCMD(`particle minecraft:knockback_roar_particle ${teams_info.red.focus}`) //Blue hole
        playsound('random.levelup', '@a[tag=team.red]',0.5,0.5)
        playsound('ambient.weather.thunder', '@a[tag=team.blue]',0.5,0.5)
    }
}
async function WinHandle(command){
    stopGame(9, `team_${command}_win`)
}

async function bridgeDeath(player){
    runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§c"},{"translate":"axiscube.bw.dead.t"}]}`,player)
    runCMD('gamemode spectator',player)
    system.runTimeout(() => {
        playsound('random.click',player)
        runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${3}"]}]}`,player)
    },20)
    system.runTimeout(() => {
        playsound('random.click',player)
        runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${2}"]}]}`,player)
    },40)
    system.runTimeout(() => {
        playsound('random.click',player)
        runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${1}"]}]}`,player)
    },60)
    system.runTimeout(()=>{
        playsound('random.click',player)
        runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${0}"]}]}`,player)
        runCMD(`gamemode a @s`,player)
        player.teleport(teams_info[getPlayerTeam(player)].spawn)
    },80)
    
}

async function bridgeStop(){
    try{
        MT_GAMES.kill()
    }catch(e){console.warn(e,info)}
    runCMD(`title @a title ud0""`)
}
