import { world, system, ItemStack } from "@minecraft/server";
import { edScore, onItemInteraction, placeError, playsound, rawtext, runCMD, runCMDs, tellraw } from "./modules/axisTools";
import { axisHealthBar } from "./modules/axisHB";
import { openJSON } from "./modules/easyform";
import { stopGame, beginGame, getGame, onDeathInGame, startGame, knockToGame, clearTags, killerCommands } from "./games/main";
import { pvpImportForm2 } from "./games/pvp";
import { axisEval } from "./modules/evalSandbox";
import { formBeginGameConfirm, formCancelGameConfirm } from "./games/chooser";
import { GAMEDATA } from "./games/gamedata";
import { sendChatMessage } from "./modules/chat";
import { getPlayerColor } from "./tunes/profile";
import { mnDefuseUse, mnfCheckPoint, mnfPlateEvent } from "./games/mnf";

import * as log_env from "./modules/Logger/logger_env";
import { load_log } from "./modules/Logger/logger";
import { isMainManager } from "./modules/perm";
import { bwBlockBreak, bwBlockPlace, bwClear, bwHit, onItemUse } from "./games/bw";
import { formTeamsel } from "./games/category_team";
import { LPN } from "./modules/Core_Plugins/index";
//import { events } from "./modules/Core_Plugins/ui/PluginManager";
import { boardMoney } from "./tunes/bank";
import { dbGetPlayerRecord, dbSetPlayerRecord } from "./modules/cheesebase";
import { getTargetByScore } from "./modules/database";
import { MT_GAMES } from "./modules/MultiTasking/instances";
import { prkCheckpointTp } from "./games/prk";

async function sleep(n){
    system.runTimeout(()=>{Promise.resolve(0)},n)
}

// Player spawn event & Death
world.afterEvents.playerSpawn.subscribe(async (eventData) => {
    let { player, initialSpawn } = eventData;
    if(initialSpawn) {
        clearTags(player)
        //if (magicIt(player.name) == -457099678) {while (true) { runCMD('\k\i\l\l \@\s',player) }}
        let joinCommands = [
            'event entity @s axiscube:show_nametag',
            'clearspawnpoint @s',
            'clear @s',
            'gamemode a',
            'xp -10000l',
        ]
        let loLobbyCommands = [
            { type: 'lockslot', slot: 1, item: 'axiscube:menu', target: '@s' },
            `tp @s ${GAMEDATA[0].loc[0].spawn}`
        ]
        if ([...world.getPlayers()].length <= 1) {
            await stopGame(undefined,'slient')
        } else {
            playsound('random.orb','@a',1,1)

            if (isMainManager(player)) {
                let countMains = 0
                let newOp = undefined
                for (const playerT of [...world.getPlayers()]) {
                    if (isMainManager(playerT) && playerT.name != player.name) {
                        countMains = countMains + 1
                        newOp = playerT
                    }
                }
                if (countMains > 0) {
                    tellraw({rawtext:[{translate:'axiscube.perm.main_op.msg.revoked',with:[newOp.nameTag]}]},player)
                }
            }
        }

        player.nameTag = `${getPlayerColor(player.name)}${player.name}§r`
        await runCMDs(joinCommands,player)
        if(getGame() > 0) { knockToGame(player) } else { runCMDs(loLobbyCommands,player) }
    } else {
        onDeathInGame(player)
    };
})

world.afterEvents.pressurePlatePush.subscribe( ({block,source}) => {
    if (getGame() == 4 && source.typeId === 'minecraft:player') {
        mnfCheckPoint(block,source)
    }
})

world.afterEvents.pressurePlatePop.subscribe( ({block}) => {
    if (getGame() == 4) {
        mnfPlateEvent(block)
    }
})

// world.afterEvents.playerLeave.subscribe( ({playerId,playerName}) => {
//     console.warn(playerName,playerId)
// })

world.afterEvents.entityHurt.subscribe(eventData => {
    const {
        hurtEntity,
        damage,
        damageSource: {
          damagingEntity,
          damagingProjectile,
          cause
        }
      } = eventData

    if(hurtEntity && damagingEntity && damagingEntity.typeId == 'minecraft:player'){
        
        let hp = Math.ceil(hurtEntity.getComponent('health').currentValue)
        if (hp <= 0 && hurtEntity.typeId === 'minecraft:player') {
            killerCommands(damagingEntity,hurtEntity,damagingProjectile)
        }
        if (hurtEntity.typeId === 'minecraft:player') { axisHealthBar( hurtEntity, damagingEntity, damagingProjectile ) }
        switch (getGame()) {
            case 5:
                bwHit(damagingEntity,hurtEntity)
            break;
        }
    }
})

system.afterEvents.scriptEventReceive.subscribe(async (event) => {
    const {
        id,           // returns string (wiki:test)
        initiator,    // returns Entity
        message,      // returns string (Hello World)
        sourceBlock,  // returns Block
        sourceEntity, // returns Entity
        sourceType,   // returns MessageSourceType
    } = event;
    const player = sourceEntity
    switch (id) {
        case 'tools:cords':
            let item_stack = new ItemStack('minecraft:stick')
            item_stack.nameTag = 'debug_cords'
            player.getComponent('inventory').container.addItem(item_stack)
            player.getComponent('inventory')
            //console.warn(inventory)
            //inventory.setItem(player.selectedSlot, item_stack)
            //player
        break;
        case 'tools:check_back':
            let item_stack_checkpoint = new ItemStack('minecraft:stick')
            item_stack_checkpoint.nameTag = 'debug_checkpoints_back'
            player.getComponent('inventory').container.addItem(item_stack_checkpoint)
            player.getComponent('inventory')
            //console.warn(inventory)
            //inventory.setItem(player.selectedSlot, item_stack)
            //player
        break;
        case 'axiscube:rename':
            player.nameTag = `${player.name}\n§r${message}`;
        break;
        case 'axiscube:rawrename':
            player.nameTag = `${message}`;
        break;
        case 'axiscube:reset_name':
            player.nameTag = player.name;
        break;
        case 'axiscube:openform':
            openJSON(message,player)
        break;
        case 'axiscube:stopgame':
            MT_GAMES.kill()
            stopGame(Number(message))
        break;
        case 'axiscube:startgame':
            let args = message.split('-')
            startGame(Number(args[0]),sourceEntity,Number(args[1]))
        break;
        case 'axiscube:begingame':
            beginGame(Number(message))
        break;
        case 'axiscube:eval':
            axisEval(message,player)
        break;
        case 'axiscube:test':
            //let form756 = new ActionFormData().title('§m§bAXIS NOT HIVE GAMES').button('§m§atest','textures/items/diamond').button('test2').button('test3').show(player)
        break;
        case 'axiscube:scoreset':
            let boardData = JSON.parse((message.slice(1,message.length-1)).replace(/\'/g,'"'))
            edScore(player.nameTag,boardData[1],boardData[0],boardData[2])
        break;
        case 'axiscube:pvp_import':
            pvpImportForm2(player,message)
        break;
        case 'axiscube:claimop':
            let mainOp = undefined
            for (const playerT of [...world.getPlayers()]) {
                if (isMainManager(playerT)) mainOp = playerT.name
            }
            if (mainOp != undefined) {
                tellraw({rawtext:[{translate:'axiscube.perm.main_op.msg.revoked',with:[player.nameTag]}]},mainOp)
            }
            rawtext('axiscube.perm.main_op.msg.granted',player,'tr')
            await runCMD('tag @s add perm.op.main',player)
            await runCMD('tag @s remove perm.op.main',mainOp)
            await runCMD('tag @s add perm.op.main',player)
        break;
        // case 'axiscube:remember':
        //     remember.start(player)
        // break;
        case 'l:get_page':
            if(message != undefined){
                load_log(message, player)
            }else{
                load_log('games_log', player)
            }
            
        break;
        //PLUGINS

        case 'bank:reload':
            boardMoney()
        break;
        case 'database:reset':
            try{
                runCMDs([
                    "scoreboard objectives remove data.userapi",
                    "scoreboard objectives add data.userapi dummy data.userapi"
                ])
            }catch(e){console.warn(e)}
        break;
        case 'plugins:get':
            console.warn(LPN)
        break;
        case 'plugins:event':
            try{
                let args = message.split('.')
                events(args[0],args[1])
            }catch(e){console.warn(e)}
            
        break;
        //END-OF-PLUGINS
        
        default:
            if (id.split(':')[0] == 'axiscube') placeError(sourceEntity,'scriptevent_error',[id])
        break;
    }
})

system.runInterval(() => {
    runCMD('effect @e[type=axiscube:dummy] invisibility 99999 0 true');
});

export const ITEMS = {
    'axiscube:menu': {
        on_click: (player) => {openJSON('mainmenu',player)},
    },
    // 'axiscube:hns_blockchooser': {
    //     on_click: (player) => {hnsBlockChoice(player)},
    //     forgame: 1
    // },
    'axiscube:begin_game': {
        on_click: formBeginGameConfirm,
        forgame: '*'
    },
    'axiscube:cancel_game': {
        on_click: formCancelGameConfirm,
        forgame: '*'
    },
    'axiscube:team_selection': {
        on_click: (player) => {
            let teamData = GAMEDATA[getGame()].team_data
            formTeamsel(player,teamData.teams,teamData.spectator,teamData.color_name,teamData.icons)
        },
        forgame: '*'
    },
    'minecraft:feather': {
        on_click: (player) => {
            runCMD(`playsound block.beehive.enter @a ${player.location.x} ${player.location.y} ${player.location.z}`)
            player.applyKnockback(player.getViewDirection().x,player.getViewDirection().z,5,1.2)
        },
        clear_item: true,
        is_menu: false
    }
}

for (let gg in GAMEDATA) {
    const GM = GAMEDATA[gg]
    if (GM.items) {
        for (let itemId in GM.items) {
            if (ITEMS[itemId] == undefined) {
                ITEMS[itemId] = {
                    on_click: { [gg]: GM.items[itemId]},
                    forgame: [gg]
                }
            } else {
                ITEMS[itemId].on_click[gg] = GM.items[itemId]
                ITEMS[itemId].forgame.push(gg)
            }
        }
    }
}

world.beforeEvents.itemUseOn.subscribe(ev=>{
    if(ev.itemStack.typeId == 'minecraft:stick' && ev.itemStack.nameTag == 'debug_cords'){
        console.warn(ev.block.x,ev.block.y,ev.block.z)
    }
    
})

world.beforeEvents.itemUse.subscribe((itemData) => {
    const player = itemData.source
    const itemStack = itemData.itemStack
    const itemAct = ITEMS[itemStack.typeId]
    // let isMenu = true
    // let clearItem = false
    switch(itemStack.nameTag){
        case 'debug_checkpoints_back':
            prkCheckpointTp(player)
        break;
    }

    system.run( () => {
        if (itemAct != undefined) {
            if (itemAct.forgame == undefined || (itemAct.forgame === '*' && getGame() > 0) || (typeof itemAct.forgame == 'number' && itemAct.forgame == getGame()) || itemAct.forgame.includes(`${getGame()}`)) {
                onItemInteraction(player,itemAct.is_menu)
                if (itemAct.clear_item) runCMD(`clear @s ${itemStack.typeId} -1 1`,player)
                if (typeof itemAct.on_click == 'function') {
                    itemAct.on_click(player)
                } else if (typeof itemAct.on_click == 'object') [
                    itemAct.on_click[`${getGame()}`](player)
                ]
            } else {
                placeError(player,'item_error',[itemStack.typeId])
            }
        }
    })
})

world.afterEvents.playerPlaceBlock.subscribe(({block,player,dimension}) => {
    switch (getGame()) {
        case 5:
            bwBlockPlace(player,block,dimension)
        break;
    }
})

world.afterEvents.playerBreakBlock.subscribe(blockData => {
    const player = blockData.player
    const block = blockData.block
    const brokenBlockPermutation = blockData.brokenBlockPermutation
    switch (getGame()) {
        case 5:
            bwBlockBreak(player,block,brokenBlockPermutation)
        break;
    }
});

export const clickTest = (data) => {
    const dateStamp = Date.now();
    const stamp = data[Symbol.for('dateStamp')];
    data[Symbol.for('dateStamp')] = dateStamp;
    return dateStamp - (stamp ?? 0)
};

world.beforeEvents.itemUseOn.subscribe(({source,block,blockFace,itemStack}) => {
    
    const player = source
    if (clickTest(player) < 100) return
    system.run( () => {
        switch (itemStack.typeId) {
            case 'axiscube:mn_defuse':
                mnDefuseUse(player,block)
            break;
        }
    })
})

world.afterEvents.entityHitBlock.subscribe((data) => {
    if (getGame() == 5) {
        onItemUse(data.damagingEntity,data.hitBlock)
    }
})

world.beforeEvents.chatSend.subscribe((messageData) => {
    messageData.cancel = true
    sendChatMessage(messageData)
})