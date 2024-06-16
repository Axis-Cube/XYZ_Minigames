import { EntityInventoryComponent, ItemStack, system, world } from "@minecraft/server";
import { COPYRIGHT, DIM, SYM, upgradeArmor, upgradeItems, upgradesBlocked } from "../const";
import { edScore, getScore, getSlotsByItemName, playsound, randomPlayerIcon, runCMD, runCMDs, safeZone, safeZoneDamage } from "../modules/axisTools";
import { startTimer, stopGame } from "./main";
import { MT_GAMES } from "../modules/MultiTasking/instances";
import { chests } from "./hg_chests";
import { games_log } from "../modules/Logger/logger_env";

export const GAMEDATA_HG = { // Hunger Games
    id: 12,
    namespace: 'hg',
    min_players: 2,
    tags: [
        'hg',
        'hg.halfdead',
        'hg.winner',
        'hg.member'
    ],
    loc: {
        0: { 
            gameplay: false,//-3115 10 -3064
            spawn: { type: 'arr', value: ['-3011 11.5 -3000', '-3010 11.5 -3004', '-3004 11.5 -3010', '-3000 11.5 -3011', '-2996 11.5 -3010', '-2990 11.5 -3004', '-2989 11.5 -3000', '-2990 11.5 -2996', '-2996 11.5 -2990', '-3000 11.5 -2989', '-3004 11.5 -2990', '-3010 11.5 -2996'], facing: '-3000 11 -3000'},
            //newplayer: { type: 'range', value: [ [ 1472 , 1478 ], [ 110, 110 ], [ 476, 478 ] ] },
            spawnpoint: {type: 'arr', value: ['-3011 11.5 -3000', '-3010 11.5 -3004', '-3004 11.5 -3010', '-3000 11.5 -3011', '-2996 11.5 -3010', '-2990 11.5 -3004', '-2989 11.5 -3000', '-2990 11.5 -2996', '-2996 11.5 -2990', '-3000 11.5 -2989', '-3004 11.5 -2990', '-3010 11.5 -2996']},
        },
    },
    ends: {
        //no_time: {
        //    msg: {"rawtext":[{"translate":"axiscube.games.game_over.hg.no_time","with":{"rawtext":[{"selector":"@a[tag=hg.winner]"},{"text":`+80${SYM}`}]}}]},
        //    cmd: [{'type':'money','sum': 80, 'target': '@a[tag=hg.winner]'}]
        //},
        no_players: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.hg.no_players","with":{"rawtext":[{"selector":"@a[tag=hg.winner]"},{"text":`+100${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 100, 'target': '@a[tag=hg.winner]'}]
        },
    },
    joinable: {
        can_join: false,
        join_commands: [
            'tag @s add hg',
            'tag @s add hg.member'
        ],
        prebegin_commands: [],
    },
    time: {
        value: 10000,
        tick_function: hgTick,
        xp: false,
        actionbar_spec: true,
        notify_times: [300, 180, 60],
        events: {
            't1': hgTime
        }
    },
    start_commands: hg_main,
    begin_commands: [
        `scoreboard players set safe_zone data.gametemp 170`,
        'tag @a add hg',
        'tag @a add hg.member',
        `gamerule naturalregeneration false`,
        `gamerule falldamage true`,
        `scoreboard players set "${COPYRIGHT}" hg.display -9`,
        'scoreboard players set "§1" hg.display -8',
        {type:'scoreset',value: 1, objective: 'hg.display'},
        'scoreboard players set "§2" hg.display 999',
        `scoreboard players set "${randomPlayerIcon()} §a%axiscube.scoreboard.players_alive" hg.display 998`,
    ],
    pre_commands: [
        `inputpermission set @a movement disabled`
    ],
    death_data: {
        death_commands: [
            'clear @s',
            'tag @s remove hg.member',
            'tag @s add spec',
            'gamemode spectator'
        ],
    },
    stop_commands: onStop,
    boards: [
        ['hg.display', '\ue195§6 %axiscube.hg.name', true],
    ]
}
let zone;
async function hg_main(){
    await loadChests(chests, 1)
    startTimer(12)

    zone = system.runInterval(async () => {
        let r = (getScore('safe_zone','data.gametemp')) ? getScore('safe_zone','data.gametemp') : 100;
        let loc3 = {x:-3000,y:25,z:-3000}
        let points = await safeZone(loc3, r, r*2, 11)
    
    
        let foreach_counter = 0;
        points.forEach(async (pos) => {
                foreach_counter++
                try{
                    world.getDimension("overworld").spawnParticle('axiscube:green_border_dust',pos);
                }catch{}
                if(foreach_counter >= points.length){
                    safeZoneDamage(loc3,r)
                }
        },);
    },20)
    MT_GAMES.register(zone)
}

async function hgTick(){
    let playersCount = 0
    for (const player of [...world.getPlayers()]) {
        if (!player.hasTag('spec') && player.hasTag('hg.member')) {
            playersCount = playersCount + 1
        }
    }
    if(playersCount == 1){
        for (const player of [...world.getPlayers()]) {
            if (!player.hasTag('spec') && player.hasTag('hg.member')) {
                player.addTag('hg.winner')
                stopGame(12, 'no_players')
            }
        }
    }
}

let timers;
async function hgTime(){
    runCMDs([
        `inputpermission set @a movement enabled`,
    ])
    system.runTimeout(()=>{
        runCMDs([
        'gamerule pvp true',
        'title @a actionbar \ue197 Pvp Enabled',
        playsound('respawn_anchor.charge','@a',0.5, 0.7)
        ])
    },140)//7 sec
    try{
        edScore('safe_zone','data.gametemp',170)
        edScore('zone_shrink', 'data.gametemp',150)
        edScore('chests_update', 'data.gametemp',200)

        
        timers = system.runInterval(async ()=>{
            let zone_size = getScore('safe_zone','data.gametemp')
            let chests_time = getScore('chests_update', 'data.gametemp')
            if(chests_time > 0){
                edScore('chests_update', 'data.gametemp',chests_time-1)
            }else if(chests_time == 0){
                edScore('chests_update', 'data.gametemp',-1)
                await loadChests(chests)
                edScore('chests_update', 'data.gametemp',250)
            }else{}

            let zone_shrink = getScore('zone_shrink', 'data.gametemp')
            if(zone_shrink > 0){
                edScore('zone_shrink', 'data.gametemp',zone_shrink-1)
            }else if(zone_shrink == 0){
                edScore('zone_shrink', 'data.gametemp',150)
                if(zone_size > 10){
                    await edScore('safe_zone', 'data.gametemp', zone_size-30)
                }else{
                    await edScore('safe_zone', 'data.gametemp', 3)
                }
            }
        },20)
        MT_GAMES.register(timers)
        information()
    }catch(e){console.warn(e)}
}

async function hgStop(msg){
    stopGame(12, msg)
}

async function onStop(){
    games_log.put(`[HG] onStop commands executed §2sucessfully§r`)
    await MT_GAMES.kill()
    runCMDs([
        `inputpermission set @a movement enabled`,
        'gamerule naturalregeneration true',
        'gamerule falldamage false',
        'fog @a remove zone_fog'
    ])
}

export async function loadChests(chests, info=0) {
    try{
        let j = 0
        let chests_length = Object.keys(chests).length
        for(let i in chests){
            j++
            await DIM.runCommandAsync(`setblock ${i} chest ["minecraft:cardinal_direction":"${chests[i]}"] replace`)
            DIM.runCommandAsync(`loot insert ${i} loot "chest/hg"`)
            if(j%5==0 && info == 1){
                runCMD(`title @a actionbar \ue134 Preparing Game... ${j}/${chests_length} chests loaded`)
            }
        }
        if(info == 1){
            runCMD(`title @a actionbar \ue115 Game Loaded!`)
        }
        console.warn('Chests loaded!')
    }catch(e){console.warn(e)}
}

async function getNextUpgrade(material, type){
    if(upgradeItems.material.indexOf(material) != -1 && upgradeItems.material[upgradeItems.material.indexOf(material)+1]){
        return upgradeItems.material[upgradeItems.material.indexOf(material)+1]+'_'+type
    }else if( upgradeArmor.material.indexOf(material) != -1 && Number(upgradeArmor.material[upgradeArmor.material.indexOf(material)+1]) != 0){
        return upgradeArmor.material[upgradeArmor.material.indexOf(material)+1]+'_'+type
    }
}

let info;
async function information(){
    info = system.runInterval(()=>{
        let chests_update = getScore('chests_update', 'data.gametemp')
        let zone_shrink = getScore('zone_shrink', 'data.gametemp')

        runCMD(`titleraw @a title {"rawtext":[{"text":"ud0\'${"\ue101 Chests Update: "+ ((chests_update == -1)?"Updating":chests_update) }\n${"\ue135 Zone Shrink: "+ ((zone_shrink == -1)?"Updating":zone_shrink) }\'"}]}`)
        //runCMD(`titleraw @a[tag=red] title {"rawtext":[{"text":"ud0\'${"\ue127".repeat(getScore('fw_br_red','data.gametemp'))}\'"}]}`)
    },10)
    MT_GAMES.register(info)
}

export async function upgradeItem(player){
    let inv = await player.getComponent(EntityInventoryComponent.componentId)
    let container = inv.container
    let slot = player.selectedSlot
    try{
        //console.log(container.getItem(0), slot)
        let item = container.getItem(slot)?.typeId;
        if(item === undefined){
            item = player.getDynamicProperty('hg:lst')
        }
        let item_properties = {
            type: item.split('_')[1],
            material: item.split('_')[0]
        }
        //Errors block
        if(upgradesBlocked.includes(item_properties.type)){throw new Error('12_0')}
        if(item_properties.type == undefined){throw new Error('12_1')}
        //
        
        let slotswithitem = getSlotsByItemName(inv, item)
        if(slotswithitem.length >= 2){
            let next_update: string | undefined = await getNextUpgrade(item_properties.material, item_properties.type)
            if(next_update == undefined){return;}
            let new_item = new ItemStack(next_update, 1)

            container.setItem(slotswithitem[0], undefined)
            container.setItem(slotswithitem[1], undefined)
            container.setItem(slot, new_item)
            playsound('armor.equip_chain', player)
        }else{throw new Error('12_2')}
    }catch(e){
        playsound('block.false_permissions', player)
        switch(e.message){
            case '12_0':
                console.log('This item Blocked and can not be upgraded')
            break;
            case '12_1':
                console.log('Item Id is Not defined')
            break;
            case '12_2':
                console.log('You need tho items with Identical Id')
            break;
            case '12_3':
                console.log('Undefined Item In container')
            break;
            default:
                console.log('Undefined error')
                console.log(e.stack, e.message)
            break;
        }
    }

}