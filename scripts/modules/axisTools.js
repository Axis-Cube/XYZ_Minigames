import { Player, world, system, GameMode } from "@minecraft/server";
import { axisEval } from "./evalSandbox";
import { scoreboardTeamcolor } from "../games/category_team";
import { GAMEDATA } from "../games/gamedata";
import { getGame } from "../games/main";
import { DIM } from "../const";
import { command_log } from "./Logger/logger_env";

/**
 * Gets the Gamemode of a player
 * @author Smell of Curry
 * @param {Player} player player to get
 * @returns {GameMode}
 * @example if (getGamemode(player) == "creative") return;
 */
export function getGamemode(player) {
    return Object.values(GameMode).find((g) => [...world.getPlayers({ name: player.name, gameMode: g })].length);
}

export function nameToPlayer(name) {
    for (const player of [...world.getPlayers()]) {
        if (player.name == name) return player
    }
    return undefined
}

export function onItemInteraction(player,isMenu=true) {
    if (isMenu) playsound('random.pop2',player)
}

export function nerdMessage(name) {
    for (let i = 0; i != 6; i ++) {
        setTickTimeout( () => {
            runCMD('titleraw @s actionbar {"rawtext":[{"text":"\ue1e3 "},{"translate":"axiscube.msg.nerd.typing"}]}',name)
            playsound('mob.villager.yes',name)
            rawtext(`axiscube.msg.nerd.say.t${i}`,name,'translate')
        }, (40*i)+1 )
    }
    setTickTimeout( () => {
        playsound('mob.villager.yes',name)
        tellraw(`{"rawtext":[{"text":"§bH T T P S ("},{"translate":"accessibility.text.colon"},{"text":") ("},{"translate":"accessibility.text.forwardSlash"},{"text":") ("},{"translate":"accessibility.text.forwardSlash"},{"text":") D I S C O R D ("},{"translate":"accessibility.text.period.url"},{"text":") C O M ("},{"translate":"accessibility.text.forwardSlash"},{"text":") I N V I T E ("},{"translate":"accessibility.text.forwardSlash"},{"text":") W a T p w W 2 e Q 8"}]}`,name)
        //rawtext(`% %accessibility.text.forwardSlash  accessibility.text.period.url C O M %accessibility.text.forwardSlash I N V I T E %accessibility.text.forwardSlash W a T p w W 2 e Q 8`,name)
    }, 40*6 )
}

export function getTargetByScore(score=0,objectiveId='data',ifNothing=undefined) {
    const oB = world.scoreboard.getObjective(objectiveId)
    for (let trg of [...oB.getParticipants()]) {
        if (oB.getScore(trg) === score) {
            return trg.displayName
        }
    }
    return ifNothing
}

/**
 * Gets the score recorded for {displayName} on {objective}
 * @param {String} target or entity on the scoreboard
 * @param {String} objectiveId Objective Identifer to get from
 * @param {Boolean} useZero If the return should be NaN if its not found or 0.
 * @returns {Number} Score that Was recorded for {Player} on {Objective}
 * @example getScore(player, "objective"): number
 */
export function getScore(target, objectiveId, useZero = true) {
    try {
        const oB = world.scoreboard.getObjective(objectiveId)
        if (typeof target != 'string') { target = target.name }
        return oB.getScore(oB.getParticipants().find(pT => pT.displayName == target))
    } catch {
        return useZero ? 0 : NaN
    }
}

export async function edScore(target, objective='data', value=0, operator='set') {
    if (typeof target == 'object') { target = target.name }
    if (!target.startsWith('@')) {target = `"${target}"`}
    await runCMD(`scoreboard players ${operator} ${target} ${objective} ${value}`,undefined,true)
}

/**
 * Fires 1 second delay,
 * @param {() => void} callback
 * @param {number} tick
 * @example setTickTimeout(() => { /* code *\/ }, 20)
*/
export function setTickTimeout(callback, tick) {
    const id = system.runInterval(() => {
      callback();
      system.clearRun(id);
    }, tick);
}

export function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

export function getItemAmounts(player, items) {
    const inv = player.getComponent('inventory')?.container;
    if (!inv) return;
    const counts = {};
    for (let id of items) {
      counts[id] = 0;
    }
    for (let i = 0; i < inv.size; i++) {
      const item = inv.getItem(i);
      if (!item) continue;
      const itemId = item.typeId.replace('minecraft:', '')
      const id = items.find(v => itemId == v.replace('minecraft:', ''))
      if (id) counts[id] += item.amount;
    }
    return counts;
}

export function placeError(player,errorCode='unknown',errorDetails=[]) {
    errorDetails = JSON.stringify(errorDetails)
    tellraw(`{"rawtext":[{"translate":"axiscube.error.generic","with":{"rawtext":[{"text":"${errorCode.toUpperCase()}"},{"translate":"axiscube.error.${errorCode.toLowerCase()}","with":${errorDetails}}]}}]}`,player)
}

export function randomInt(min=1, max=2) { return Math.floor(Math.random() * (max - min + 1) + min) }

export async function playsound(sound,player='@a',volume=1,pitch=1) {
    await runCMD(`playsound ${sound} @s ~~~ ${volume} ${pitch}`,player)
}

export function axlog(msg) {
    console.warn(`[AxisLog] ${msg}`)
}

export function setblock(x,y,z,id){
    runCMD(`setblock ${x} ${y} ${z} ${id}`)
}

export async function rawtext(text,name='@a',type='text',color='r') {
    if (type == 'tr') type = 'translate'
    text = text.replace(/\"/g, '\u005c\"')
    await tellraw(`{"rawtext":[{"text":"§${color}"},{"${type}":"${text}"}]}`,name)
}

export function actionbar(text,name='@a',color='r') {
    runCMD(`title @s actionbar §${color}${text}`,name)
}

/**
 * @param {import("@minecraft/server").RawMessage} rawtext
*/
export async function tellraw(rawtext,name='@a',type) {
    if (typeof rawtext == 'object') rawtext = JSON.stringify(rawtext)
    if (type == undefined)  { await runCMD(`tellraw @s ${rawtext}`,name,true)} 
    else if (type == 'actionbar' || type == 'act')  { await runCMD(`titleraw @s actionbar${rawtext}`,name,true)} 
}

export function hasTag(source, tag){
    return source.getTags().indexOf(tag) != -1
  }

/**
 * @param {String} command
 * @param {import("@minecraft/server").Player} source
 * @param {Boolean} needLog
*/
export async function runCMD(command, source, needLog = false){
    if (command == undefined) { return }
    else if (typeof command === 'object') { runCMDs(command,source,needLog); return }
    else if (typeof command === 'function') { command(source); return }
    else if (command.startsWith('/')) command = command.slice(1)
    try {
        if (source == undefined) {
            await DIM.runCommandAsync(command)
        } else if (typeof source == 'object') {
            await source.runCommandAsync(command)
            return
        } else if (typeof source == 'string' && source.startsWith('@')) {
            await DIM.runCommandAsync(`execute as ${source} at @s run execute positioned as @s run ${command}`)
            return
        } else if (typeof source == 'string' && !source.startsWith('@')) {
            await DIM.runCommandAsync(`execute as "${source}" at @s run execute positioned as @s run ${command}`)
            return
        }
    } catch(error) {
        if (needLog) {
            console.error(`Command: '${command}'\nError: ${error}`)
        }
        command_log.put(`Command: '${command}'\nError: ${error}`)
    }
};

export function randomPlayerIcon() {
    let icons = ['\ue151','\ue152','\ue153','\ue154','\ue155','\ue156','\ue157','\ue158']
    return icons[randomInt(0,icons.length-1)]
}

export async function powerTP(pos='0 10 0',player='@a',target='@s',action='tp') {
    if (typeof pos === 'string') {
        if (action == 'pos') return pos
        await runCMD(`${action} ${target} ${pos}`,player)
        return
    } else if (pos === false) {
        return
    } else if (typeof pos === 'object') {
        switch (pos.type) {
            case 'range':
                if (player === '@a') {
                    for (const playerT of world.getPlayers()) {
                        let rPos = `${randomInt(pos.value[0][0],pos.value[0][1])} ${randomInt(pos.value[1][0],pos.value[1][1])} ${randomInt(pos.value[2][0],pos.value[2][1])}`
                        await runCMD(`${action} @s ${rPos}`,playerT)
                    }
                    return
                }
                let rPos = `${randomInt(pos.value[0][0],pos.value[0][1])} ${randomInt(pos.value[1][0],pos.value[1][1])} ${randomInt(pos.value[2][0],pos.value[2][1])}`
                if (action == 'pos') return rPos
                await runCMD(`${action} ${target} ${rPos}`,player)
            return;
            case 'arr':
                if (player === '@a') {
                    const plrs2 = [...world.getPlayers()]
                    let poss = pos.value
                    while (poss < plrs2.length) {
                        poss = [...poss,...poss]
                    }

                    let xPos = shuffle(poss)
                    for (const i in plrs2) {
                        const playerT = plrs2[i]
                        await runCMD(`${action} @s ${xPos[i]}`,playerT)
                    }
                    return
                }
                let xPos = shuffle(pos.value)[0]
                if (action == 'pos') return xPos
                await runCMD(`${action} ${target} ${xPos}`,player)
            return;
            case 'bytag':
                const plrs = [...world.getPlayers()]
                for (let tag in pos.value) {
                    for (let player of plrs) {
                        if (player.hasTag(tag)) {
                            powerTP(pos.value[tag],player)
                        }
                    }
                }
            return;
            case 'disable':
            return;
        }
    }
}

export function colorPercent(percent) {
    percent = Math.floor(percent*100)
    let result = 'r'
    if (percent >= 90) {
        result = '2'
    } else if (percent >= 70) {
        result = 'a'
    } else if (percent >= 50) {
        result = 'e'
    } else if (percent >= 30) {
        result = 'g'
    } else if (percent >= 20) {
        result = '6'
    } else if (percent >= 10) {
        result = 'c'
    } else if (percent < 10) {
        result = '4'
    }
    return result
}

/**
 * @param {Array} commands
 * @param {import("@minecraft/server").Player} source
 * @param {Boolean} needLog
*/
export async function runCMDs(commands, source, needLog = false){
    if (commands == undefined) return
    if (typeof commands == 'function') commands(source)
    for (let i in commands) {
        let thisCommand = commands[i]
        if (typeof thisCommand == 'string') {
            await runCMD(thisCommand,source,needLog)
        } else if (typeof thisCommand == 'object') {
            let target = thisCommand.target
            let target2 = target
            if (target == undefined) { target = '@a'; target2 = '@s' }
            if (target.startsWith('@s')) { target2 = target; target = source }
            switch (thisCommand.type) {
                case 'lockslot':
                    await runCMD(`replaceitem entity ${target2} slot.hotbar ${thisCommand.slot-1} ${thisCommand.item} 1 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`,target)
                break;
                case 'armor':
                    const elements = ['slot.armor.head','slot.armor.chest','slot.armor.legs','slot.armor.feet']
                    //replaceitem entity @s slot.armor.head
                    for (let i in thisCommand.elements) {
                        await runCMD(`replaceitem entity ${target2} ${elements[i-1]} 0 ${thisCommand.elements[i]} 1 0 {"minecraft:item_lock":{ "mode": "lock_in_inventory" }}`,target)
                    }
                break;
                case 'sound':
                    await runCMD(`playsound ${thisCommand.sound} ${target2} ~~~ ${thisCommand.v} ${thisCommand.p}`,target)
                break;
                case 'tp':
                    await powerTP(thisCommand.value,target,target2,thisCommand.action)
                break;
                case 'eval':
                    axisEval(thisCommand.value)
                break;
                case 'test':
                    let testSource = getScore(thisCommand.testsource[0],thisCommand.testsource[1])
                    runCMDs(thisCommand.value[testSource],source,needLog)
                break;
                case 'timeout':
                    setTickTimeout( () => { runCMDs(thisCommand.value,source,needLog) }, thisCommand.delay )
                break;
                //{type: 'colorscore', score: 3, objective: 'pvp.display'},
                case 'colorscore':
                    scoreboardTeamcolor(thisCommand.score,thisCommand.objective,GAMEDATA[getGame()].team_data.teams)
                break;
                case 'money':
                    runCMD(`scriptevent axiscube:eval addMoney(name,${thisCommand.sum},${thisCommand.slient})`,target)
                break;
                case 'scoreset':
                    if (thisCommand.value == '') thisCommand.value = "''"
                    if (thisCommand.action == undefined) thisCommand.action = 'set'
                    runCMD(`scriptevent axiscube:scoreset "[${thisCommand.value},'${thisCommand.objective}','${thisCommand.action}']"`,target)
                break;
            }
        } else if (typeof thisCommand == 'function') {
            thisCommand()
        }
        
    }
};

function ObjRange(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

export function isPlayerinArea(x1,x2,player){
    try{
        let cx = [];let cy = [];let cz = []
        let cordsx = [];let cordsy = [];let cordsz = []


        cx.push(Math.max(x1[0], x2[0])); cx.push(Math.min(x1[0], x2[0]))
        cy.push(Math.max(x1[1], x2[1])); cy.push(Math.min(x1[1], x2[1]))
        cz.push(Math.max(x1[2], x2[2])); cz.push(Math.min(x1[2], x2[2]))

        let xn = cx[0] - cx[1]
        let yn = cy[0] - cy[1]
        let zn = cz[0] - cz[1]

        cordsx = ObjRange(xn+1, cx[1])
        cordsy = ObjRange(yn+1, cy[1])
        cordsz = ObjRange(zn+1, cz[1])

        let px = Math.floor(player.location.x)
        let py = Math.floor(player.location.y)
        let pz = Math.floor(player.location.z)

        if(cordsx.indexOf(px) != -1 && cordsy.indexOf(py) != -1 && cordsz.indexOf(pz) != -1){
            return true
        }else{
            return false
        }
    }catch(e){}

}

export async function sleep(n){
    system.runTimeout(()=>{Promise.resolve(0)},n)
}

/**

* @returns {import("@minecraft/server").Vector3}
*/
export function array3ToVector3(array3) {
    return {x:array3[0],y:array3[1],z:array3[2]}
}

/**

* @returns {import("@minecraft/server").Vector3}
*/
export function vector3ToArray3(vector3) {
    return [vector3.x,vector3.y,vector3.z]
}