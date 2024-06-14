import { Player, system, world } from '@minecraft/server';
import { edScore, getScore, hasTag, playsound, powerTP, randomInt, randomPlayerIcon, rawtext, runCMD, runCMDs, setTickTimeout, tellraw } from '../modules/axisTools'
import { GAMEDATA } from './gamedata';
import { killMessage } from '../tunes/killMessage';
//import { formTeamsel } from './category_team';
import { getPlayerColor } from '../tunes/profile';
import { checkPerm, isManager, isTempManager } from '../modules/perm';
import { games_log } from '../modules/Logger/logger_env';

/**
* @returns {Number}
*/
export function getGame() {
    return getScore('mg','data');
};
/**
* @returns {Number}
*/
export function getGameType() {
    return getScore('type','data');
};
/**
* @returns {Number}
*/
export function getGameStage() {
    return getScore('stg','data');
};
/**
* @returns {Number}
*/
export function getGameArena() {
    return getScore('arn','data');
};

let GAMETAGS = [ 'spec', 'temp.killer', 'temp.prey', 'team.red', 'team.green', 'team.blue', 'team.yellow', 'team.purple', 'team.orange', 'team.pink', 'team.cyan', 'team.lime', 'team.black' ];
for (let i in GAMEDATA) { GAMETAGS = GAMETAGS.concat(GAMEDATA[i].tags) };
let GAMEBOARDS = [ 'data.gametemp' ];
for (let i in GAMEDATA) {
    for (let j in GAMEDATA[i].boards) {
        GAMEBOARDS = GAMEBOARDS.concat(GAMEDATA[i].boards[j][0]);
    };
};

export async function forceGameRestart(id=getGame(),arn=getGameArena(),diff=0){
    const thisGame = GAMEDATA[id]
    if (thisGame.min_players > [...world.getPlayers()].length) {
        tellraw(`{"rawtext":[{"translate":"axiscube.games.startgame.no_players","with":{"rawtext":[{"translate":"axiscube.${thisGame.namespace}.name"},{"text":"${thisGame.min_players}"}]}}]}`)
        return
    }
    if (thisGame.reset_player_color != undefined && thisGame.reset_player_color[getGameType()] == true) {
        for (const playerT of world.getPlayers()) {
            playerT.nameTag = playerT.name;
        };
    }
    await clearTags();
    let commands = [
        'clear @a',
        `title @a title ud0""`,
        `scoreboard players set mg data ${id}`,
        `scoreboard players set diff data ${diff}`,
        { type:'tp', value: thisGame.loc[arn].spawn },
        { type:'tp', value: thisGame.loc[arn].spawnpoint, action: 'spawnpoint' },
        'scoreboard objectives add data.gametemp dummy "data.gametemp"',
        'scoreboard objectives remove lobby.display',
        `scoreboard players set time data.gametemp ${thisGame.time.value}`,
    ]
    await runCMDs(commands)
    if (thisGame.time.xp) {
        await runCMD(`xp ${thisGame.time.value}l @a`)
    }
    for(let i in thisGame.boards) {
        let thisBoard = thisGame.boards[i]
        if (thisBoard[1] == undefined) { thisBoard[1] = thisBoard[0] }
        await runCMD(`scoreboard objectives add ${thisBoard[0]} dummy "${thisBoard[1]}"`)
        if (thisBoard[2] == true) { await runCMD(`scoreboard objectives setdisplay sidebar ${thisBoard[0]}`) }
    }
    await runCMDs(thisGame.start_commands)
}

/**
 * Starting game with specified id
 * @param {number} id - Game id
 * @param {Player} player - Player Target
 * @param {number} arn - Arena
 * @returns {void}
 */
export async function startGame( id, player, arn = getGameArena() ) {
    const thisGame = GAMEDATA[id]
    if (!checkPerm(player.name,'start')) { rawtext('axiscube.perm.denied.start',player.name,'translate','c'); return }
    if (getGame() != 0) { rawtext('axiscube.games.startgame.already',player,'translate'); return }
    if (thisGame.min_players > [...world.getPlayers()].length && getScore('testrun', 'settings') != 2) {
        tellraw(`{"rawtext":[{"translate":"axiscube.games.startgame.no_players","with":{"rawtext":[{"translate":"axiscube.${thisGame.namespace}.name"},{"text":"${thisGame.min_players}"}]}}]}`)
        return
    }
    if (thisGame.reset_player_color != undefined && thisGame.reset_player_color[getGameType()] == true) {
        for (const playerT of world.getPlayers()) {
            playerT.nameTag = playerT.name;
        };
    }
    await clearTags();
    try{await runCMDs(thisGame.pre_commands)}catch{}
    let commands = [
        'clear @a',
        `title @a title ud0""`,
        `scoreboard players set mg data ${id}`,
        `scoreboard players set arn data ${arn}`,
        { type:'tp', value: thisGame.loc[arn].spawn},
        { type:'tp', value: thisGame.loc[arn].spawnpoint, action: 'spawnpoint' },
        'scoreboard objectives add data.gametemp dummy "data.gametemp"',
        'scoreboard objectives remove lobby.display',
        `scoreboard players set time data.gametemp ${thisGame.time.value}`,
        `tellraw @a {"rawtext":[{"translate":"axiscube.games.startgame","with":{"rawtext":[{"text":"${player.nameTag}"},{"translate":"axiscube.${thisGame['namespace']}.name"}]}}]}`,
        `tellraw @a {"rawtext":[{"translate":"axiscube.${thisGame['namespace']}.d"}]}`
    ]
    await runCMDs(commands)
    if (thisGame.time.xp) {
        await runCMD(`xp ${thisGame.time.value}l @a`)
    }
    for(let i in thisGame.boards) {
        let thisBoard = thisGame.boards[i]
        if (thisBoard[1] == undefined) { thisBoard[1] = thisBoard[0] }
        await runCMD(`scoreboard objectives add ${thisBoard[0]} dummy "${thisBoard[1]}"`)
        if (thisBoard[2] == true) { await runCMD(`scoreboard objectives setdisplay sidebar ${thisBoard[0]}`) }
    }
    await runCMDs(thisGame.start_commands)
};

/**
 * Starts game times
 * @param {number} id - Game id
 * @returns {void}
 */
export async function startTimer(id=getGame()) {
    try{
        await edScore('startgame.timer','data.gametemp',5)
        const intTimer = system.runInterval(async () => {
            const thisStage = getScore('startgame.timer','data.gametemp')
            if (thisStage == 5) {
                await edScore('startgame.timer','data.gametemp',1,'remove')
            } else if (thisStage == 4) {
                await runCMDs(GAMEDATA[id].time.events.t3)
                await runCMD('titleraw @a title {"rawtext":[{"text":"§a"},{"translate":"axiscube.games.startgame.startmsg.t3"}]}')
                await edScore('startgame.timer','data.gametemp',1,'remove')
                await playsound('note.pling','@a',1,0.5)
            } else if (thisStage == 3) {
                await runCMDs(GAMEDATA[id].time.events.t2)
                await runCMD('titleraw @a title {"rawtext":[{"text":"§g"},{"translate":"axiscube.games.startgame.startmsg.t2"}]}')
                await edScore('startgame.timer','data.gametemp',1,'remove')
                await playsound('note.pling','@a')
            } else if (thisStage == 2) {
                await runCMDs(GAMEDATA[id].time.events.t1)
                switch(getGame()) {
                    case 2:
                        await runCMD('titleraw @a title {"rawtext":[{"text":"§c"},{"translate":"axiscube.games.startgame.startmsg.t1.blockp"}]}')
                    break;
                    case 3:
                        await runCMD('titleraw @a title {"rawtext":[{"text":"§c"},{"translate":"axiscube.games.startgame.startmsg.t1.pvp"}]}')
                    break;
                    default:
                        await runCMD('titleraw @a title {"rawtext":[{"text":"§c"},{"translate":"axiscube.games.startgame.startmsg.t1"}]}')
                        break;
                    }
                await edScore('startgame.timer','data.gametemp',1,'remove')
                await playsound('note.pling','@a',1,2)
            } else if (thisStage == 1) {
                await edScore('startgame.timer','data.gametemp','','reset')
                if (GAMEDATA[id].time.events.t0) {
                    runCMDs(GAMEDATA[id].time.events.t0)
                } else {
                    await beginGame(id)
                }
                await playsound('mob.blaze.hit','@a',1,0.7)
                system.clearRun(intTimer)
                return
            } else {
                system.clearRun(intTimer)
            }
        }, 20)
    }catch(e){
        games_log.put(e)
    }
}

system.runInterval(() => {
    const gameID = getGame();
    if (getGameStage() == 1) {
        GAMEDATA[gameID].time.tick_function()
        // switch(gameID) {
        //     case 1:
        //         hnsTick();
        //     break;
        //     case 2:
        //         blockpTick();
        //     break;
        //     case 3:
        //         pvpTick()
        //     break;
        //     case 4:
        //         mnfTick()
        //     break;
        //     case 5:
        //         bwTick()
        //     break;
        // };
    };
},5);

system.runInterval(async () => {
    if (getGameStage() == 1) {
        const gameID = getGame();
        const time = getScore('time','data.gametemp')
        const time_sec = time % 60
        const time_min = Math.floor(time/60)
        if (!isNaN(time) && getScore('time','data.gametemp') > 0) {
            await edScore('time','data.gametemp',1,'remove')
            if (GAMEDATA[gameID].time.xp) {
                await runCMD(`xp -1l @a`)
            }
            if (GAMEDATA[gameID].time.notify_times && GAMEDATA[gameID].time.notify_times.indexOf(time) != -1) {
                playsound('random.click')
                tellraw(`{"rawtext":[{"translate":"axiscube.games.time.point.s","with":["${time_min}"]}]}`)
            }
            if (GAMEDATA[gameID].time.actionbar_spec) {
                if (time_min == 0) {
                    await runCMD(`titleraw @a[tag=spec] actionbar {"rawtext":[{"translate":"axiscube.games.time.only_sec","with":["${time_sec}"]}]}`)
                } else {
                    await runCMD(`titleraw @a[tag=spec] actionbar {"rawtext":[{"translate":"axiscube.games.time","with":["${time_sec}","${time_min}"]}]}`)
                }
                
            }
            if (GAMEDATA[gameID].time.events && GAMEDATA[gameID].time.events[time] != undefined) {
                await runCMDs(GAMEDATA[gameID].time.events[time])
            }
        } else {
            if (gameID != 4) {
                await stopGame(gameID,'no_time')
            } else {
                let winners = 0
                for (let playerT of [...world.getPlayers()]) {
                    if (playerT.hasTag('mnf.winner')) winners = winners + 1
                }
                if (winners == 0) {
                    await stopGame(gameID,'no_time')
                } else {
                    await stopGame(gameID,'no_time_winners')
                }
            }
        }
    };
    let countOps = 0
    let countTrueOps = 0
    for (let player of [...world.getPlayers()]) {
        if (player.isOp() && !player.hasTag('perm.op')) {
            runCMD('tag @s add perm.op',player)
            rawtext('axiscube.perm.op.granted.auto',player,'tr')
        }
        if (isManager(player)) countOps = countOps + 1
        if (isManager(player) && !isTempManager(player)) countTrueOps = countTrueOps + 1
    }
    if (countOps == 0) {
        const newOp = [...world.getPlayers()][0]
        runCMD('tag @s add perm.op.temp',newOp)
        tellraw(`{"rawtext":[{"translate":"axiscube.perm.new_temp","with":["${getPlayerColor(newOp.name)}${newOp.name}"]}]}`)
        rawtext('axiscube.perm.op.granted.temp',newOp,'tr')
    } else if (countTrueOps < countOps && countTrueOps != 0) {
        let tempOp = [...world.getPlayers()][0]
        for (let player of [...world.getPlayers()]) {
            if (isTempManager(player)) {tempOp = player}
        }
        runCMD('tag @s remove perm.op.temp',tempOp)
        tellraw(`{"rawtext":[{"translate":"axiscube.perm.true_leader_comeback","with":["${getPlayerColor(tempOp.name)}${tempOp.name}"]}]}`)
        rawtext('axiscube.perm.op.revoked.generic',tempOp,'tr')
    }

},20);

/**
 * Clear game tags
 * @param {Player} player - Player Target
 * @returns {void}
 */
export async function clearTags(player: Player | string='@a') {
    for (let i in GAMETAGS) {
        await runCMD(`tag @s remove ${GAMETAGS[i]}`,player);
    };
};

/**
 * Stop game with specified id
 * @param {number} id - Game id
 * @param {string} finishType - Finish type
 * @returns {void}
 */
export async function stopGame(id=getGame(),finishType='slient',finishVariables:any = undefined) {
    try{
        if (getGame() == 0 && finishType != 'slient') return
        await edScore('mg','data');
        await edScore('stg','data');
        await edScore('arn','data');
        await edScore('type','data');
        for (const player of world.getPlayers()) {
            player.nameTag = `${getPlayerColor(player.name)}${player.name}§r`;
        };
        if (finishType != 'slient') {
            playsound('axiscube.gameover')
            let message = GAMEDATA[id].ends[finishType].msg
            if (finishVariables != undefined) {
                for (let i in finishVariables) {
                    message = message.replace(`$<${i.toUpperCase()}>`,finishVariables[i])
                }
            }
            await rawtext('=-=-=-=-=-=-=-=','@a','text','b')
            await rawtext('axiscube.games.game_over','@a','translate')
            await tellraw(message)
            await runCMDs(GAMEDATA[id].ends[finishType].cmd)
            await rawtext('=-=-=-=-=-=-=-=','@a','text','b');
            let duration = (GAMEDATA[id].time.value) - getScore('time','data.gametemp')
            let durationMinutes = Math.floor(duration/60)
            let durationSeconds = Math.floor(duration % 60)
            if (durationMinutes == 0) {
                await tellraw(`{"rawtext":[{"translate":"axiscube.games.game_over.duration.zero_minutes","with":["${durationSeconds}"]}]}`)
            } else if (durationMinutes == 1) {
                await tellraw(`{"rawtext":[{"translate":"axiscube.games.game_over.duration.one_minute","with":["${durationSeconds}"]}]}`)
            } else {
                await tellraw(`{"rawtext":[{"translate":"axiscube.games.game_over.duration","with":["${durationMinutes}","${durationSeconds}"]}]}`)
            }
        };
        for (let i in GAMEBOARDS) {
            await runCMD(`scoreboard objectives remove ${GAMEBOARDS[i]}`);
        };
        await clearTags();
        await runCMDs(GAMEDATA[id].stop_commands);
        await runCMDs(GAMEDATA[0].start_commands);
        if (finishType = 'slient') {
            setTickTimeout(() => { runCMD(`tp @a ${GAMEDATA[0].loc[0].spawn}`); runCMD('gamemode a @a') },20);
        } else {
            setTickTimeout(() => { runCMD(`tp @a ${GAMEDATA[0].loc[0].spawn}`); runCMD('gamemode a @a') },60);
        };
    }catch(e){
        games_log.put(e)
    }
};

export async function beginGame( id=getGame(), arn=getGameArena() ) {
    if (getGameStage() == 1) return
    await runCMD('clear @a');
    await powerTP(GAMEDATA[id].loc[arn].gameplay,'@a')
    
    await runCMDs(GAMEDATA[id].begin_commands);
    await edScore('stg','data',1);
};

export function onDeathInGame( player, id=getGame() ) {
    if (id == 0) { powerTP(GAMEDATA[0].loc[0].spawn,player) }
    runCMDs(GAMEDATA[id].death_data.death_commands,player)
}

export async function killerCommands(killer,prey,projectile) {
    if (!GAMEDATA[getGame()].death_data.disable_notify) { killMessage(killer,prey,projectile) }
    if (typeof GAMEDATA[getGame()].death_data.killFunc == 'function') GAMEDATA[getGame()].death_data.killFunc(killer,prey)
}

export async function knockToGame( player, id=getGame(), arn=getGameArena() ) {
    if (getGameStage() != 0) {
        if (GAMEDATA[id].joinable.can_join) {
            if (!GAMEDATA[id].joinable.disable_tp) {
                await powerTP(GAMEDATA[id].loc[arn].newplayer,player)
            }
            await powerTP(GAMEDATA[id].loc[arn].spawnpoint,player,'@s','spawnpoint')
            await runCMD(`tag @s add ${GAMEDATA[id].namespace}`,player)
            await runCMD('gamemode a',player)
            runCMDs(GAMEDATA[id].joinable.join_commands,player)
            await tellraw(`{"rawtext":[{"translate":"axiscube.games.new_player.can_join","with":{"rawtext":[{"translate":"axiscube.${GAMEDATA[id].namespace}.name"}]}}]}`,player)
            await tellraw(`{"rawtext":[{"translate":"axiscube.${GAMEDATA[id].namespace}.d"}]}`,player)
        } else {
            await runCMD('gamemode spectator',player)
            await runCMD('tag @s add spec',player)
            await tellraw(`{"rawtext":[{"translate":"axiscube.games.new_player","with":{"rawtext":[{"translate":"axiscube.${GAMEDATA[id].namespace}.name"}]}}]}`,player)
            await powerTP(GAMEDATA[id].loc[arn].newplayer,player)
            await powerTP(GAMEDATA[id].loc[arn].spawnpoint,player,'@s','spawnpoint')
            return
        }
    } else {
        await tellraw(`{"rawtext":[{"translate":"axiscube.games.lucky_new_player","with":["${player.name}"]}]}`)
        await runCMDs(GAMEDATA[id].joinable.prebegin_commands,player)
        await powerTP(GAMEDATA[id].loc[arn].spawn,player)
        await powerTP(GAMEDATA[id].loc[arn].spawnpoint,player,'spawnpoint')
    }
}