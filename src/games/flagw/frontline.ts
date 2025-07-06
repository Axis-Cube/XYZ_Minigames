import {
    EntityEquippableComponent,
    EntityInventoryComponent,
    EquipmentSlot,
    ItemStack,
    Player,
    system,
    world
} from "@minecraft/server"
import {COPYRIGHT, DIM, SYM} from "../../const"
import {edScore, hasTag, runCMD, runCMDs, sleep} from "../../modules/axisTools"
import {GAMEDATA} from "../gamedata"
import {getGameArena, stopGame} from "../main"
import {getPlayerTeam, teamArray, TEAMS2} from "../category_team"
import {MT_GAMES, MT_INFO} from "../../modules/MultiTasking/instances"
import {axisInfo} from "modules/axisInfo"

let ArrowHurtEvent;

export const GAMEDATA_FW_FRONTLINE = { // fw_frontline    
    id: 10,
    namespace: 'fw_frontline',
    min_players: 2,
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
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"BLUE"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 150, 'target': '@a[tag=team.blue]'}]
        },
        team_red_win: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"RED"},{"text":"+100${SYM}"}]}}]}`,
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
        tick_function: frontlineTick,
        xp: true,
        events: {}
    },
    start_commands: [
        () => {frontlinePrepair()},
        { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
        { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
        { type: 'lockslot', slot: 5, item: 'axiscube:team_selection' },
    ],
    begin_commands: frontlineBegin,
    death_data: {
        death_commands: expansionHandler
    },
    stop_commands: frontlineStop,
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
const FRONTLINE_BLOCKS = [
    'minecraft:blue_concrete',
    'minecraft:red_concrete'
]

const FRONTLINE_TEAMSCORES = {
    'red': 'red_command',
    'blue': 'blue_command'
}

export async function frontlineClear(){
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
                    for(const block of FRONTLINE_BLOCKS){
                        await sleep(2)
                        runCMD(`fill ${clearData[d][0].x} ${y} ${clearData[d][0].z} ${clearData[d][1].x} ${y+2} ${clearData[d][1].z} air replace ${block}`, undefined,true)
                    }
                }
            }
        }
        return 0
    }catch(e){console.warn(e)}
}

let points //start territory - end territory x
let projHitBlock
async function frontlinePrepair(){
    projHitBlock = world.afterEvents.projectileHitBlock.subscribe(ev => {
        try{
            let x = Math.trunc(ev.location.x)
            let y = Math.trunc(ev.location.y)
            let z = Math.trunc(ev.location.z)
            ev.projectile.remove()
            switch(FRONTLINE_BLOCKS.indexOf(ev.getBlockHit().block.typeId)){
                case -1:
                break;
                default:
                    runCMD(`fill ${x-1} ${y-1} ${z-1} ${x+1} ${y+1} ${z+1} air replace blue_concrete`, undefined,true)
                    runCMD(`fill ${x-1} ${y-1} ${z-1} ${x+1} ${y+1} ${z+1} air replace red_concrete`, undefined,true)
                break;
            }
        }catch{}
    })
    //Отсчет от синих
    points = 32
    let arn = getGameArena()
    const teams = teamArray()
    edScore(COPYRIGHT,'fw_frontline.display',0)
    for (let i in teams) {
        const team = teams[i]
        edScore(`${FRONTLINE_TEAMSCORES[team]}`,'fw_frontline.display',(Number(i)+1)*2)
        edScore(`§${i}`,'fw_frontline.display',(Number(i)+1)*2-1)
    }

    //2010 2069 - Z OF MAP
    try{
        system.runTimeout(()=>{
            runCMD(`fill ${teams_info[arn].red.base} ${teams_info[arn].floor_y} 2010 ${teams_info[arn].red.start_red_x} ${teams_info[arn].floor_y} 2069 red_concrete_powder replace blue_concrete_powder`,undefined,true) //red team
            runCMD(`fill ${teams_info[arn].blue.base} ${teams_info[arn].floor_y} 2010 ${teams_info[arn].blue.start_blue_x} ${teams_info[arn].floor_y} 2069 blue_concrete_powder replace red_concrete_powder`,undefined,true)
            frontlineClear()
        },70)
    }catch(e){console.warn(e)}

    edScore('fw_fl_points','data.gametemp',points)
    //startTimer(9)
}

async function bridgeEquipment(){
    try{
        let arn = getGameArena()

        //Enchantments
        //@minecraft/vanilla-data (Not released) [/bundles/vanilla_data]

        for (const player of [...world.getPlayers()] as Player[]) {
            if (!player.hasTag('spec')) {
                const equipment = player.getComponent('equippable') as EntityEquippableComponent;
                let inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
                if (inventory && inventory.container) {
                    inventory.container.addItem(new ItemStack("minecraft:bow"))
                }
                if(hasTag(player, 'team.blue')){
                    equipment?.setEquipment(EquipmentSlot.Head, teams_info[arn].blue.armor.head);
                    equipment?.setEquipment(EquipmentSlot.Chest, teams_info[arn].blue.armor.chest);
                    
                    runCMDs([
                        `give @s iron_pickaxe 1 0 {"minecraft:can_destroy":{"blocks":["blue_concrete"]}}`,
                        `give @s blue_concrete 32 0 {"minecraft:can_place_on":{"blocks":["blue_concrete_powder", "blue_concrete", "red_concrete"]}}`
                    ],player)

                }
                else if(hasTag(player, 'team.red')){
                    equipment?.setEquipment(EquipmentSlot.Head, teams_info[arn].red.armor.head);
                    equipment?.setEquipment(EquipmentSlot.Chest, teams_info[arn].red.armor.chest)

                    runCMDs([
                        `give @s iron_pickaxe 1 0 {"minecraft:can_destroy":{"blocks":["red_concrete"]}}`,
                        `give @s red_concrete 32 0 {"minecraft:can_place_on":{"blocks":["red_concrete_powder", "red_concrete", "blue_concrete"]}}`
                    ],player)
                }
            }
        }
            
    }catch(e){console.warn(e);}
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
let ItemsGiveProcess = 0;
async function frontlineBegin(){
    let arn = getGameArena()
    const red_team = teams_info[arn].red
    const blue_team = teams_info[arn].blue

    const blue_spawn = blue_team.spawn
    const red_spawn = red_team.spawn
    runCMD(`gamemode a @a[tag=!spec]`)
    runCMD(`tp @a[tag=team.blue] ${blue_spawn.x} ${blue_spawn.y} ${blue_spawn.z} facing ${blue_team.focus}`)
    runCMD(`tp @a[tag=team.red] ${red_spawn.x} ${red_spawn.y} ${red_spawn.z} facing ${red_team.focus}`)


    let tmp_id = system.runInterval(()=>{
        axisInfo.replace(points)
    },10)
    MT_INFO.register(tmp_id)

    //let system.runInterval(() => {

    bridgeOtherIterations()
    bridgeEquipment()

    system.runTimeout(()=>{
        runCMD(`title @a actionbar \ue198 PVP Enabled`)
        runCMD(`gamerule pvp true`)
    },100)

    ArrowHurtEvent = world.afterEvents.projectileHitEntity.subscribe(ev => {
        if((hasTag(ev.source, "team.blue") != hasTag(ev.getEntityHit().entity, "team.blue")) || (hasTag(ev.source, "team.red") != hasTag(ev.getEntityHit().entity, "team.red") )){
            ev.getEntityHit().entity?.kill()
        }
    })

    ItemsGiveProcess = system.runInterval(()=>{
        runCMD(`give @a arrow`)
        runCMD(`give @a[tag=team.red] red_concrete 3 0 {"minecraft:can_place_on":{"blocks":["red_concrete_powder", "red_concrete"]}}`)
        runCMD(`give @a[tag=team.blue] blue_concrete 3 0 {"minecraft:can_place_on":{"blocks":["blue_concrete_powder", "blue_concrete"]}}`)
    },100)
    MT_GAMES.register(ItemsGiveProcess)
}

async function frontlineTick(){
    for (const player of [...world.getPlayers()]) {
        if (!player.hasTag('spec')) {
            if(getPlayerTeam(player)=='red'){
                if(DIM.getBlock({x:player.location.x, y:teams_info[getGameArena()].floor_y, z:player.location.z})?.typeId=='minecraft:blue_concrete_powder'){
                    player.teleport({x:teams_info[getGameArena()].blue.base-points-1, y:player.location.y, z:player.location.z})
                }
            }else{
                if(DIM.getBlock({x:player.location.x, y:teams_info[getGameArena()].floor_y, z:player.location.z})?.typeId=='minecraft:red_concrete_powder'){
                    player.teleport({x:teams_info[getGameArena()].blue.base-points+1, y:player.location.y, z:player.location.z})
                }
                
            }
            if(points <= 0){await WinHandle('red')}
            else if(points>=64){await WinHandle('blue')}
        }
    }
}

async function expansionHandler(player){
    let playersRed = world.getPlayers({"tags": ["team.red"]}).length
    let playersBlue = world.getPlayers({"tags": ["team.blue"]}).length

    let expansionModifierRed = Math.floor(6/playersRed) + 1
    let expansionModifierBlue = Math.floor(6/playersBlue) + 1

    let arn = getGameArena()
    let command = getPlayerTeam(player)
    let pre_points = points
    if(command == 'red'){
        points += expansionModifierBlue
        runCMD(`fill ${teams_info[arn].blue.base-points} ${teams_info[arn].floor_y} 2010 ${teams_info[arn].blue.base-pre_points} ${teams_info[arn].floor_y} 2069 blue_concrete_powder replace red_concrete_powder`,undefined,true)
    }
    else{
        points -= expansionModifierRed
        runCMD(`fill ${teams_info[arn].blue.base-points} ${teams_info[arn].floor_y} 2010 ${teams_info[arn].blue.base-pre_points} ${teams_info[arn].floor_y} 2069 red_concrete_powder replace blue_concrete_powder`,undefined,true)
    }
}

async function WinHandle(command){
    stopGame(10, `team_${command}_win`)
}

async function frontlineStop() {
    try {
        world.afterEvents.projectileHitBlock.unsubscribe(projHitBlock)
    } catch { }
    try {
        MT_GAMES.kill()
        world.afterEvents.projectileHitEntity.unsubscribe(ArrowHurtEvent)
        axisInfo.erase()
    } catch (e) { console.warn(e) }
    

}