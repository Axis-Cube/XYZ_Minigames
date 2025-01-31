import { Player, world, system, GameMode, Entity, Vector3 } from "@minecraft/server";
import { axisEval } from "#modules/evalSandbox";
import { scoreboardTeamcolor } from "#root/modules/core/games/category_team";
import { GAMEDATA } from "#root/modules/core/games/gamedata";
import { getGame } from "#root/modules/core/games/main";
import { DB_A, DIM, map_id } from "#root/const";
import { command_log } from "#modules/Logger/logger_env";
import { dbGetPlayerRecord } from "#modules/cheesebase";

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

export function getTargetByScore(score=0,objectiveId='data',ifNothing: object | string | undefined=undefined) {
    const oB: any = world.scoreboard.getObjective(objectiveId)
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
        const oB: any = world.scoreboard.getObjective(objectiveId)
        if (typeof target != 'string') { target = target.name }
        return oB.getScore(oB.getParticipants().find(pT => pT.displayName == target))
    } catch {
        return useZero ? 0 : NaN
    }
}

export async function edScore(target, objective='data', value: any=0, operator='set') {
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
    const counts: any = {};
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

export function placeError(player,errorCode='unknown',errorDetails: any = []) {
    errorDetails = JSON.stringify(errorDetails)
    tellraw(`{"rawtext":[{"translate":"axiscube.error.generic","with":{"rawtext":[{"text":"${errorCode.toUpperCase()}"},{"translate":"axiscube.error.${errorCode.toLowerCase()}","with":${errorDetails}}]}}]}`,player)
}

export function randomInt(min=1, max=2) { return Math.floor(Math.random() * (max - min + 1) + min) }

export async function playsound(sound,player: Entity | string='@a',volume=1,pitch=1) { await runCMD(`playsound ${sound} @s ~~~ ${volume} ${pitch}`,player) }

export function setblock(x: string | number, y: string | number, z: string | number, id: string | number){ runCMD(`setblock ${x} ${y} ${z} ${id}`) }

export async function rawtext(text,name: string | Player ='@a',type='text',color='r') {
    if (type == 'tr') type = 'translate'
    text = text.replace(/\"/g, '\u005c\"')
    await tellraw(`{"rawtext":[{"text":"§${color}"},{"${type}":"${text}"}]}`,name)
}

export function actionbar(text,name: any='@a',color='r') { runCMD(`title @s actionbar §${color}${text}`,name) }

/**
 * @param {import("@minecraft/server").RawMessage} rawtext
*/
export async function tellraw(rawtext,name: string | Player ='@a',type: any = undefined) {
    if (typeof rawtext == 'object') rawtext = JSON.stringify(rawtext)
    if (type == undefined)  { await runCMD(`tellraw @s ${rawtext}`,name,true)} 
    else if (type == 'actionbar' || type == 'act')  { await runCMD(`titleraw @s actionbar${rawtext}`,name,true)} 
}

export function hasTag(source: any, tag:string){ return source.getTags().indexOf(tag) != -1 }

/**
 * @param {String} command
 * @param {import("@minecraft/server").Player} source
 * @param {Boolean} needLog
*/
export async function runCMD(command, source: any = undefined, needLog = false){
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

export async function powerTP(pos:any='0 10 0',player:any='@a',target='@s', action='tp') {
    if (typeof pos === 'string') {
        if (action == 'pos') return pos
            await runCMD(`${action} ${target} ${pos}`,player)
        return
    } else if (pos === false) {
        return
    } else if (typeof pos === 'object') {
        switch (pos.type) {
            case 'range':
                let rPos = `${randomInt(pos.value[0][0],pos.value[0][1])} ${randomInt(pos.value[1][0],pos.value[1][1])} ${randomInt(pos.value[2][0],pos.value[2][1])}`
                if (action == 'pos'){return rPos}
                if (player === '@a') {
                    for (const playerT of world.getPlayers()) {
                        let rPos = `${randomInt(pos.value[0][0],pos.value[0][1])} ${randomInt(pos.value[1][0],pos.value[1][1])} ${randomInt(pos.value[2][0],pos.value[2][1])}`
                        await runCMD(`${action} @s ${rPos}`,playerT)
                    }
                    return
                }
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
                    if(pos.facing != undefined){
                        for (const i in plrs2) {
                            const playerT = plrs2[i]
                            await runCMD(`${action} @s ${xPos[i]} facing ${pos.facing}`,playerT)
                        }
                    }else{
                        for (const i in plrs2) {
                            const playerT = plrs2[i]
                            await runCMD(`${action} @s ${xPos[i]}`,playerT)
                        }
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
 * Execute commands array in 'overworld' DIM
 * @param {Array} commands
 * @param {import("@minecraft/server").Player} source
 * @param {Boolean} needLog
*/
export async function runCMDs(commands, source: any = undefined, needLog = false){
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
                        await runCMD(`replaceitem entity ${target2} ${elements[Number(i)-1]} 0 ${thisCommand.elements[i]} 1 0 {"minecraft:item_lock":{ "mode": "lock_in_inventory" }}`,target)
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
                    runCMD(`scriptevent axiscube:eval addMoney(name,${thisCommand.sum},${thisCommand.silent})`,target)
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


/**
* If player in area returns true
* @author Axisander
* @param {number} size
* @param {number} startAt
* @returns {number[]}
*/
function ObjRange(size:number , startAt = 0) { return [...Array(size).keys()].map(i => i + startAt); }

/**
* If player in area returns true
* @author Axisander
* @param {Array} x1
* @param {Array} x2
* @param {Player} player
* @returns {Boolean}
*/

export function isPlayerinArea(x1:number[] = [0,0,0],x2:number[] = [0,0,0],player:any = undefined){
    try{
        if(player==undefined){throw new Error("Player Not Defined")}

        let cx: number[] = [];let cy: number[] = [];let cz: number[] = []
        let cordsx: number[] = [];let cordsy: number[] = [];let cordsz: number[] = []


        cx.push(Math.max(x1[0], x2[0])); cx.push(Math.min(x1[0], x2[0]))
        cy.push(Math.max(x1[1], x2[1])); cy.push(Math.min(x1[1], x2[1]))
        cz.push(Math.max(x1[2], x2[2])); cz.push(Math.min(x1[2], x2[2]))

        let xn = cx[0] - cx[1]
        let yn = cy[0] - cy[1]
        let zn = cz[0] - cz[1]

        cordsx = ObjRange(xn+1, cx[1])
        cordsy = ObjRange(yn+1, cy[1])
        cordsz = ObjRange(zn+1, cz[1])

        let px: number = Math.floor(player.location.x)
        let py: number = Math.floor(player.location.y)
        let pz: number = Math.floor(player.location.z)

        if(cordsx.indexOf(px) != -1 && cordsy.indexOf(py) != -1 && cordsz.indexOf(pz) != -1){
            return true
        }else{
            return false
        }
    }catch(e){}

}

export function sleep(tick:number = 1) { return new Promise<void>((resolve) => system.runTimeout(() => resolve(), tick)); }

/**
* @returns {import("@minecraft/server").Vector3}
*/
export function array3ToVector3(array3) { return {x:array3[0],y:array3[1],z:array3[2]} }

/**
* @returns {import("@minecraft/server").Vector3}
*/
export function vector3ToArray3(vector3) { return [vector3.x,vector3.y,vector3.z] }

/**
* Get value by key in json
* @author Lndrs_
* @param {Object} object
* @param {String} value
* @returns {String}
*/
export function getKeyByValue(object, value) { return Object.keys(object).find(key => object[key] === value); }

export function getSlotsByItemName(inv, typeId){
    let inv_size = inv.inventorySize
    let container = inv.container
    let items: number[] = []

    for(let i = 0; i<inv_size; i++){
        try{
            if(container.getSlot(i).typeId == typeId){items.push(i)}
        }catch{continue}
    }

    return items
}



/**
* Gets the Gamemode of a player
* @author Lndrs_
* @param {loc3} loc3 Vector3 of zone center
* @param {Number} radius Radius of zone
* @param {Number} numPoints Count of particles
* @returns {null}
* @example if (getGamemode(player) == "creative") return;
*/
export async function safeZone(loc3: Vector3, radius: number = 100, numPoints: number = 20, miny: number= loc3.y, step: number= 10){
    const points: Vector3[] = [];

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI; // Calculate the angle for each particle
        const offsetX = Math.cos(angle) * radius;
        const offsetZ = Math.sin(angle) * radius;
        for(let y = loc3.y; y>=miny; y-=step){
            const pointsPos = {
                x: loc3.x + offsetX,
                y: y,
                z: loc3.z + offsetZ
            };
            points.push(pointsPos);
        }
    }
    return points
    
}

/**
* Damage player if safe_zone is not reached
* @author Lndrs_
* @param {Array} loc3 Vector3 of zone center
* @param {Number} radius Radius of zone
* @returns {null}
*/
export function safeZoneDamage(loc3, radius) {
    let ploc;
    for (const player of [...world.getPlayers({excludeGameModes: [GameMode.spectator, GameMode.creative]})]) {
        ploc = player.location
        let r = radius
        var dist_points = (ploc.x - loc3.x) * (ploc.x - loc3.x) + (ploc.z - loc3.z) * (ploc.z - loc3.z); // a=p b=p x=c y=c r=r
        r *= r;
        if (dist_points < r) {
            //console.warn('true');
            try{
                DIM.runCommandAsync(`fog ${player?.name} remove zone_fog`)
            }catch{}
        } else {
            try{
                DIM.runCommandAsync(`fog ${player?.name} push minecraft:fog_crimson_forest zone_fog`)
            }catch{}
            if(player?.getDynamicProperty('last_zone_damage') && (Date.now().valueOf() - Number(player?.getDynamicProperty('last_zone_damage')) >= 5000)){
                player?.setDynamicProperty('last_zone_damage', Date.now())
                player?.applyDamage(5)
            }else if (!player?.getDynamicProperty('last_zone_damage')){
                player?.setDynamicProperty('last_zone_damage', Date.now())
            }
        }
    }
}


export const cryptWithSalt = (salt, text) => { const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0)); const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2); const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code); return text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join(""); };
export const decryptWithSalt = (salt, encoded) => { const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0)); const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code); return encoded.match(/.{1,2}/g).map((hex) => parseInt(hex, 16)).map(applySaltToChar).map((charCode) => String.fromCharCode(charCode)).join(""); };

/**
* Update MapID
* @author Lndrs_
* @returns {null}
*/
export const updateMapID = ()=>{edScore('map_id','settings',randomInt(10000,99999))}

/**
* Get short version of player nick
* @author Lndrs_
* @param {String} nick
* @returns {String}
*/
export const shortNick = async (nick) => { let short_nick: string[] = []
    for(let i=0;i<nick.length;i++){ if(i%2==0&&nick[i]!=' '){short_nick.push(nick[i])}; }
    return short_nick.join('')
}

/**
* If player is admin return true
* @author Lndrs_
* @param {Player} player
* @returns {Boolean}
*/
export async function isAdmin(player){
    let short_nick = await shortNick(player.name)
    let flag = dbGetPlayerRecord(short_nick,DB_A)[0]
    if(flag != undefined && decryptWithSalt(map_id.toString(), flag) == short_nick){return true}else{return false}
}


/**
 * Улучшенный рандом для 0 и 1
 * @param {number} n Количество рандомных чисел в массиве
 * @returns {number[]}
 * @example enchancedRandom(7) -> [0,1,1,0,0,1,0]
 */
export function enchancedRandom(n: number): number[]{
    let numS: string = ""
    let answer: number[] = []
    while(numS.length < n){
        numS = numS + Math.random().toString().replace('0.', '')
    }
    if(numS.length > n){numS = numS.slice(0,n)}
    [...numS].forEach(char => {if(Number(char) < 5){answer.push(0)}else{answer.push(1)}})

    return answer
}