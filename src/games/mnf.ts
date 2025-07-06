//FIELD ENGINE v0.2.5 by (AbstractScripts aka Lndrs_) License this so so. hmmm give 1000$ to us and unlock MIT license. Default license: idk
import { colorPercent, getScore, isPlayerinArea, playsound, randomInt, randomPlayerIcon, rawtext, runCMD, runCMDs } from "../modules/axisTools";
import { system, world } from "@minecraft/server";
import { GAMEDATA } from "./gamedata";
import { forceGameRestart, getGame, getGameArena, startTimer, stopGame } from "./main";
import { completeChallenge } from "./chooser";
import { ModalFormData } from "@minecraft/server-ui";
import { COPYRIGHT, DIM, SYM } from "../const";
import { eliminatePlayerMessage } from "../tunes/profile";
import { MT_GAMES } from "../modules/MultiTasking/instances";

let sleep_modifier = 5

export const GAMEDATA_MNF = { // Minefield
    id: 4,
    namespace: 'mnf',
    min_players: 1,
    tags: [
        'mnf',
        'mnf.halfdead',
        'mnf.winner',
        'mnf.member'
    ],
    loc: {
        0: { //Ready for 1.5
            gameplay: false,
            spawn: { type: 'range', value: [ [ 2537, 2503 ], [ 72, 72 ], [ 2503, 2504 ] ] },
            newplayer: { type: 'range', value: [ [ 2537, 2503 ], [ 72, 72 ], [ 2503, 2504 ] ] },
            spawnpoint: { type: 'range', value: [ [ 2537, 2503 ], [ 72, 72 ], [ 2503, 2504 ] ] },

            field_from: [2502, 72, 2508],
            field_to: [2541, 72, 2595],
            field_block: 'heavy_weighted_pressure_plate',

            startpos: 2504,
            startpos_type: 'z',

            prestart_barrier_from: '2541 72 2507',
            prestart_barrier_to: '2502 82 2507',

            winpos_from: [2541, 80, 2601],
            winpos_to: [2502, 72, 2597]
        },
        //1: { //Ready for 1.5
        //    gameplay: false,
        //    spawn: { type: 'range', value: [ [ 2456, 2460 ], [ 56, 56 ], [ 2502, 2509 ] ] },
        //    newplayer: { type: 'range', value: [ [ 2456, 2460 ], [ 56, 56 ], [ 2502, 2509 ] ] },
        //    spawnpoint: { type: 'range', value: [ [ 2456, 2460 ], [ 56, 56 ], [ 2502, 2509 ] ] },

        //    field_from: [2489, 56, 2513],
        //    field_to: [2430, 56, 2565],
        //    field_block: 'heavy_weighted_pressure_plate',

        //    startpos: 2512,
        //    startpos_type: 'z',

        //    prestart_barrier_from: '2489 56 2512',
        //    prestart_barrier_to: '2428 66 2512',

        //    winpos_from: [2489,56,2569],
        //    winpos_to: [2429,66,2567]
        //}
    },
    ends: {
        no_time: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.mnf.no_time","with":{"rawtext":[{"selector":"@a[tag=mnf.winner]"},{"text":`+150${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=mnf.winner]'}]
        },
        no_time_winners: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.mnf.no_time_winners","with":{"rawtext":[{"selector":"@a[tag=mnf.winner]"},{"text":`+150${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=mnf.winner]'}]
        },
        no_players: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.mnf.no_players","with":{"rawtext":[{"selector":"@a[tag=mnf.winner]"},{"text":`+150${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=mnf.winner]'}]
        },
        no_players_h: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.generic.no_players"}]},
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=mnf.winner]'}]
        }
    },
    joinable: {
        can_join: true,
        join_commands: [
            'tag @s add mnf',
            'tag @s add mnf.member'
        ],
        prebegin_commands: [],
    },
    time: {
        value: 555,
        tick_function: mnfTick,
        xp: true,
        actionbar_spec: true,
        notify_times: [300, 180, 60],
        events: {
            't1': mnfRemoveBarrier
        }
    },
    start_commands: fieldPlace,
    begin_commands: [
        'tag @a add mnf',
        'tag @a add mnf.member',
        `scoreboard players set "${COPYRIGHT}" mnf.display -9`,
        'scoreboard players set "§1" mnf.display -8',
        {type:'scoreset',value: 1, objective: 'mnf.display'},
        'scoreboard players set "§2" mnf.display 999',
        `scoreboard players set "${randomPlayerIcon()} §a%axiscube.scoreboard.players" mnf.display 998`,
    ],
    death_data: {
        death_commands: (player) => {
            if (getScore('diff','data') == 3) {
                eliminatePlayerMessage(player.name)
                runCMDs([
                    {type:'scoreset',value: -5, objective: 'mnf.display',action: 'set',target: player.name},
                    'tag @s remove mnf.member',
                    'tag @s add spec',
                    'gamemode spectator'
                ],player)
            }
        }
    },
    stop_commands: [],
    boards: [
        ['mnf.display', '\ue195§6 %axiscube.mnf.name', true],
    ]
}

function getRandomNum(min, max) {return Math.random() * (max - min) + min;}

function ObjRange(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

function ex_callback(){
    console.warn('Push event catched')
}

async function sleep(n){
    system.runTimeout(()=>{Promise.resolve(0)},n)
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

export class Field {

    from: number[];
    to: number[];
    bombs: number;
    step: number;
    verify_cords: any[]
    event: null


    /**
    * @param {Object} from Начальная координата
    * @param {Object} to Конечная координата
    * @example Field([x,y,z],[x,y,z]): Boolean
    */
    constructor (from, to){
        this.from = from
        this.to = to
        this.bombs = 0
        this.step = 0
        this.verify_cords = []
        this.event = null
    }

    /**
    * @param {Number} percent Начальная координата
    * @example <Field>.generate(20)
    * @returns {Promise}
    */
    async generate(percent=20) {
        if (percent <= 100){
            try{
                //throw new Error('s')
                let x: number[] = []
                let z: number[] = []

                //Block range ex [10,-3]
                let t_x: any = []
                let t_z: any = []

                let final_coords: string[] = []

                t_x.push(Math.max(this.from[0], this.to[0]));t_x.push(Math.min(this.from[0], this.to[0]))
                t_z.push(Math.max(this.from[2], this.to[2]));t_z.push(Math.min(this.from[2], this.to[2]))
                //2x and 2z

                //console.warn(`[MN S1] ${t_x} ${t_z}`)
                let BlocksToFill = (Math.abs(t_x[0] - t_x[1])+1) * (Math.abs(t_z[0] - t_z[1])+1)
                BlocksToFill = Math.ceil(BlocksToFill * (percent/100))
                this.bombs = BlocksToFill

                //console.warn(`[MN S2] ${BlocksToFill}`)
                x = ObjRange(Math.abs(t_x[0]-t_x[1])+1,t_x[1])
                z = ObjRange(Math.abs(t_z[0]-t_z[1])+1,t_z[1])

                //Combine x and z the shuffle
                final_coords = x.flatMap(d => z.map(v => d + '.' + v))
                final_coords =  shuffle(final_coords)

                this.verify_cords = final_coords

                for(let i=0; i<BlocksToFill; i++){
                    //console.warn(BlocksToFill)
                    //console.warn(i)
                    t_x = Number(final_coords[i].split('.')[0])
                    t_z = Number(final_coords[i].split('.')[1])
                    this.step = i
                    if (DIM.getBlock({x:t_x,y:((this.from[1])-1),z:t_z})?.typeId != 'minecraft:air') {
                        if (DIM.getBlock({x:t_x,y:((this.from[1])),z:t_z})?.typeId == 'minecraft:air') {
                            runCMD(`fill ${t_x} ${this.from[1]} ${t_z} ${t_x} ${this.to[1]} ${t_z} heavy_weighted_pressure_plate replace air`)
                            await sleep(sleep_modifier)
                        } else if (DIM.getBlock({x:t_x,y:((this.from[1])+1),z:t_z})?.typeId == 'minecraft:air') {
                            runCMD(`fill ${t_x} ${this.from[1]+1} ${t_z} ${t_x} ${this.to[1]+1} ${t_z} heavy_weighted_pressure_plate replace air`)
                            await sleep(sleep_modifier)
                        }
                        
                    } else {
                        let testC = 1
                        while(world.getDimension('overworld').getBlock({x:t_x,y:((this.from[1])-testC),z:t_z})?.typeId == 'minecraft:air') {
                            testC = testC + 1
                        }
                        await runCMD(`fill ${t_x} ${this.from[1]-testC+1} ${t_z} ${t_x} ${this.to[1]-testC+1} ${t_z} heavy_weighted_pressure_plate replace air`)
                        await sleep(sleep_modifier)
                    }
                }

                return Promise.resolve(0)
            }catch(e){
                console.error(`[MN] ERROR STACK: ${e.stack} ERROR: ${e}`) 
                runCMD('say Error catched when game loading. Restarting game...')
                let temp_arena = getGameArena()
                let temp_diff = getScore('diff','data')
                await stopGame(getGame())
                //await forceGameRestart(4,temp_arena)
                
            }
        }else{
            console.error('[MN] fillPercent value must be <= 100')
        }
    };

    /**
    * @example <Field>.destroy()
    */
    async destroy(){
        for (let i = -5; i < 2; i++) {
            await runCMD(`fill ${this.from[0]} ${this.from[1]+i} ${this.from[2]} ${this.to[0]} ${this.to[1]+i} ${this.to[2]} air replace heavy_weighted_pressure_plate`)
        }
    };

    /**
    * @example <Field>.getStatus()
    * @returns {Object}
    */
    getStatus(){
        return [this.bombs, this.step]
    }

    //    /**
    //* @example <Field>.linkEvent(callback / function(){})
    //* @returns {Boolean}
    //*/
    //linkEvent(callback=ex_callback){
    //    this.unlinkEvent()
    //    this.event = world.afterEvents.pressurePlatePush.subscribe(pp => {
    //        let plate_cords = []
    //        plate_cords.push(pp.block.x); plate_cords.push(pp.block.z)
    //
    //        if (this.verify_cords.indexOf(plate_cords.join('.')) < this.bombs && this.verify_cords.indexOf(plate_cords.join('.')) != -1){
    //            callback()
    //        }else{return false}
    //    })
    //}
    //
    ///**
    //* @example <Field>.unlinkEvent()
    //* @returns {null}
    //*/
    //unlinkEvent(){
    //    try{
    //        world.afterEvents.pressurePlatePush.unsubscribe(this.event)
    //    }catch{}
    //}
}
let field: Field = new Field([0,0,0],[0,0,0])
export async function fieldPlace() {
    field = new Field(GAMEDATA[4].loc[getGameArena()].field_from,GAMEDATA[4].loc[getGameArena()].field_to)
    runCMD(`fill ${GAMEDATA[4].loc[getGameArena()].prestart_barrier_from} ${GAMEDATA[4].loc[getGameArena()].prestart_barrier_to} barrier`)
    const diff = getScore('diff','data')
    runCMD(`title @a actionbar \ue134 Preparing Engine... It's take a while`)
    await field.destroy()
    system.runTimeout(()=>{
        if (diff == 0) {
            field.generate(45)
        } else if (diff == 1) {
            field.generate(50)
        } else if (diff == 2) {
            field.generate(55)
        } else if (diff == 3) {
            field.generate(65)
        }
        //field.generate(20+10*getScore('diff','data'))
        let status = system.runInterval(() => {
            let fieldStatus = field.getStatus()
            console.warn(fieldStatus)
            if (fieldStatus[0] == fieldStatus[1] || fieldStatus[0] == fieldStatus[1]-1 || fieldStatus[0] == fieldStatus[1]+1) {
                startTimer(4)
                runCMD(`titleraw @a actionbar {"rawtext":[{"translate":"axiscube.mnf.field_engine.status","with":["${fieldStatus[0]}","${fieldStatus[0]}","§q100"]}]}`)
                if (diff == 3) {
                    rawtext('axiscube.mnf.hardcore','@a','tr','c\ue121 §l')
                }
                system.clearRun(status)
            } else {
                runCMD(`titleraw @a actionbar {"rawtext":[{"translate":"axiscube.mnf.field_engine.status","with":["${fieldStatus[1]}","${fieldStatus[0]}","§${colorPercent(fieldStatus[1]/fieldStatus[0])}${(100*(fieldStatus[1]/fieldStatus[0])).toFixed(2)}"]}]}`)
            }
        },5
        )
        MT_GAMES.register(status)
    },50)
}

export function mnfRemoveBarrier() {
    runCMD(`fill ${GAMEDATA[4].loc[getGameArena()].prestart_barrier_from} ${GAMEDATA[4].loc[getGameArena()].prestart_barrier_to} air`)
}

export function mnfTick() {
    let countNoWins = 0
    let countWins = 0
    let diff = getScore('diff','data')
    let countMembers = 0
    for (const player of [...world.getPlayers()]) {
        if (!player.hasTag('spec')) {
            const isInWinnerArea = isPlayerinArea(GAMEDATA[4].loc[getGameArena()].winpos_from,GAMEDATA[4].loc[getGameArena()].winpos_to,player)
            if (isInWinnerArea) {
                runCMDs([
                    'tag @s add mnf.winner',
                    'tag @s remove mnf.member',
                    'tag @s add spec',
                    'gamemode spectator',
                    `tellraw @a {"rawtext":[{"translate":"axiscube.games.player_arrived","with":["${player.nameTag}"]}]}`,
                    {type:'scoreset',value: 500, objective: 'mnf.display',action: 'set',target: player.name}
                ],player)
                if (diff == 3) {
                    completeChallenge(player,0)
                }
            }
        }
        if (!player.hasTag('spec')) {
            countNoWins += 1
            runCMDs([
                {type:'scoreset',value: `${Math.floor(player.location[GAMEDATA[4].loc[getGameArena()].startpos_type])-GAMEDATA[4].loc[getGameArena()].startpos}`, objective: 'mnf.display',action: 'set',target: player.name}
            ])
        }
        if (player.hasTag('mnf.member')) {
            countMembers += 1
        } else if (player.hasTag('mnf.winner')) {
            countWins += 1
        }
    }
    //Если сложность не хардкор и никто не выиграл // если хардкор и больше одного выигрыша

    if(!(countMembers > 0)){
        switch (diff){
            case 3: // Hardcore
                if(countWins > 0){
                    field.destroy()
                    stopGame(4, 'no_players_h')
                }
                else{
                    field.destroy()
                    stopGame(4, 'no_players_h')
                }
            break;
            default:
                field.destroy()
                stopGame(4, 'no_players')
            break;
        }
    }
}

export function mnfCheckPoint(block,player) {
    runCMD(`playsound random.screenshot @a ${block.x} ${block.y} ${block.z} 1 1.5`)
    runCMD(`particle minecraft:wither_boss_invulnerable ${block.x} ${block.y} ${block.z}`)
    runCMD('tag @s add mnf.halfdead',player)
    if (GAMEDATA[4].loc[getGameArena()].startpos_type == 'z') {
        runCMD(`spawnpoint @s ${player.location.x} ~ ${GAMEDATA[4].loc[getGameArena()].startpos}`,player)
    } else if (GAMEDATA[4].loc[getGameArena()].startpos_type == 'x') {
        runCMD(`spawnpoint @s ${GAMEDATA[4].loc[getGameArena()].startpos} ~ ${player.location.z}`,player)
    }
}

export async function mnfPlateEvent(block) {
    let commands = [
        `playsound random.explode @a ${block.x} ${block.y} ${block.z} 0.7 1.7 0.15`,
        `particle axiscube:smoke_puff ${block.x} ${block.y+1} ${block.z}`,
        `effect @a[r=3,x=${block.x},y=${block.y},z=${block.z}] blindness 1 1`
    ]
    if (randomInt(1,10) < 5) { commands.push(`setblock ${block.x} ${block.y} ${block.z} air destroy`) }
    commands.push(`kill @a[r=3,x=${block.x},y=${block.y},z=${block.z},tag=!spec]`)
    commands.push(`kill @a[tag=mnf.halfdead,r=10,x=${block.x},y=${block.y},z=${block.z},tag=!spec]`)
    commands.push(`tag @a[tag=mnf.halfdead,r=10,x=${block.x},y=${block.y},z=${block.z}] remove mnf.halfdead`)
    runCMDs(commands)
}

export async function mnDefuseUse(player,block) {
    if(block.typeId == 'minecraft:heavy_weighted_pressure_plate'){
        try{            
            if(block.permutation.getState("redstone_signal") == 1){
                await playsound('dig.chain',player)
                await runCMD(`clear @s axiscube:mn_defuse 0 1`,player);
                // FIXME mnDefuseForm(player,block)
                // runCMD(`particle minecraft:electric_spark_particle ${block.x} ${block.y+1} ${block.z}`,player);
                // runCMD(`playsound mob.evocation_illager.cast_spell @a[r=2] ~~~ 0.3 3`,player)
                // runCMD(`fill ${block.x} ${block.y} ${block.z} ${block.x} ${block.y} ${block.z} air replace heavy_weighted_pressure_plate`);
            } else {
                await playsound('use.chain',player)
                await runCMD(`particle minecraft:villager_angry ${block.x} ${block.y} ${block.z}`)
                rawtext('axiscube.mnf.defuse.hover_error',player,'tr','c')
            }
        }catch(e){console.warn(e);}
    }
}

let simple = [1,2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499]
export function createNum(difficulty=100){
    let n1 = randomInt(1,difficulty)
    let n2 = randomInt(1,difficulty)
    while(n2%2==0){n2=randomInt(1,difficulty)}
    while(simple.indexOf(Number(n1))!=-1){n1 = randomInt(1,difficulty)}
    while(simple.indexOf(Number(n2))!=-1){n2 = randomInt(1,difficulty)}
    let n1d;
    let n2d; 
    for(let i = 2; i< Math.sqrt(n1)+1;i++){
        if(n1%i == 0){
            n1d = i
            break;
        }
    }
    for(let i = 2; i< Math.sqrt(n2)+1;i++){
        if(n2%i == 0){
            n2d = i
            break;
        }
    }
    let multiply1=randomInt((Math.ceil(n1/n1d)), Math.floor(difficulty/n1d))
    let multiply2=randomInt((Math.ceil(n2/n2d)), Math.floor(difficulty/n2d))
    let mx1 = multiply1 * n1d; 
    let mx2 = multiply2 * n1d; 
    let summ = n1+n2 
    return [summ, n1d, n2d, mx1, mx2]
    /*
    * summ - Ответ который нужно получить
    * n1d - Шаг у первого слайдера
    * n2d - Шаг у второго слайдера
    * mx1 - Максимальный порог первого слайдера
    * mx2 - Максимальный порог второго слайдера
    * Логично что шаг это и есть минимальные значения
    */
}

/* FIXME
export function mnDefuseForm(player,block) {
    const arr = createNum(50)
    const form = new ModalFormData()
    .title(`%axiscube.mnf.defuse.form.title`)
    .slider({rawtext:[{translate:'axiscube.mnf.defuse.form.task',with:[`${arr[0]}`]},{text:'\n\n'},{translate:'axiscube.mnf.defuse.form.num1'}]},0,arr[3],arr[1],arr[1])
    .slider('%axiscube.mnf.defuse.form.num2',0,arr[4],arr[2],arr[2])
    .show(player).then( gg => {
        if(gg.canceled) return;
        if(!gg.formValues){return;}

        let slider1: number = Number(gg.formValues[0])
        let slider2: number = Number(gg.formValues[1])

        if(slider1+slider2 == arr[0]){
            runCMD(`tag @a[r=2,x=${block.x},y=${block.y},z=${block.z}] remove mnf.halfdead`)
            runCMD(`particle minecraft:electric_spark_particle ${block.x} ${block.y+1} ${block.z}`,player);
            runCMD(`playsound mob.evocation_illager.cast_spell @a[r=2] ~~~ 0.3 3`,player)
            runCMD(`setblock ${block.x} ${block.y} ${block.z} air destroy`);
        }else{
            rawtext('axiscube.mnf.defuse.boom',player,'tr')
            mnfPlateEvent(block)
        }
    })
}
*/

// world.beforeEvents.itemUseOn.subscribe(ev => {
//     if(ev.itemStack.typeId == 'axiscube:mn_defuse' && ev.block.typeId == 'minecraft:heavy_weighted_pressure_plate'){
//         try{
//             const block = ev.block
            
//                 if(block.permutation.getState("redstone_signal") == 1){
//                     runCMD(`execute as "${player.name}" at "${player.name}" run particle minecraft:electric_spark_particle ${block.x} ${block.y+1} ${block.z}`);
//                     runCMD(`execute as "${player.name}" at "${player.name}" run playsound mob.evocation_illager.cast_spell @a[r=2] ~~~ 0.3 3`)
//                     runCMD(`fill ${block.x} ${block.y} ${block.z} ${block.x} ${block.y} ${block.z} air replace heavy_weighted_pressure_plate`);
//                     runCMD(`clear "${player.name}" axiscube:mn_defuse 0 1`);
//                 }
//         }catch(e){console.warn(e);}
//     }
// })

async function mnfStop(){
    await MT_GAMES.kill()
}