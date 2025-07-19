import {COPYRIGHT, SYM} from "../const";
import {GameMode, system, world} from "@minecraft/server";
import {enchancedRandom, getScore, isPlayerinArea, randomPlayerIcon, runCMD, runCMDs} from "../modules/axisTools";
import {GAMEDATA} from "./gamedata";
import {getGameArena, startTimer, stopGame} from "./main";
import {completeChallenge} from "./chooser";
import {eliminatePlayerMessage} from "tunes/profile";

export const GAMEDATA_GLS = { // Glass
    id: 6,
    namespace: 'gls',
    min_players: 1,
    tags: [
        'gls',
        'gls.halfdead',
        'gls.winner',
        'gls.member'
    ],
    loc: {
        0: { //Ready for 1.5
            gameplay: false,
            spawn: { type: 'range', value: [ [ -499 , -506 ], [ 37, 37 ], [ -552, -556 ] ] },
            newplayer: { type: 'range', value: [ [ -499 , -506 ], [ 37, 37 ], [ -552, -556 ] ] },
            spawnpoint: { type: 'range', value: [ [ -499 , -506 ], [ 37, 37 ], [ -552, -556 ] ] },

            stage_count: 18,
            platforms_y: 36,

            //stage_n: [[[x,z],[x,z]],[[x,z],[x,z]]]
            stages: {
                1: [[[-505,-548],[-507,-550]], [[-500,-548],[-502,-550]]],
                2: [[[-505,-543],[-507,-545]], [[-500,-543],[-502,-545]]],
                3: [[[-505,-538],[-507,-540]], [[-500,-538],[-502,-540]]],
                4: [[[-505,-533],[-507,-535]], [[-500,-533],[-502,-535]]],
                5: [[[-505,-528],[-507,-530]], [[-500,-528],[-502,-530]]],
                6: [[[-505,-523],[-507,-525]], [[-500,-523],[-502,-525]]],
                7: [[[-505,-518],[-507,-520]], [[-500,-518],[-502,-520]]],
                8: [[[-505,-513],[-507,-515]], [[-500,-513],[-502,-515]]],
                9: [[[-505,-508],[-507,-510]], [[-500,-508],[-502,-510]]],
                10: [[[-505,-503],[-507,-505]], [[-500,-503],[-502,-505]]],
                11: [[[-505,-498],[-507,-500]], [[-500,-498],[-502,-500]]],
                12: [[[-505,-493],[-507,-495]], [[-500,-493],[-502,-495]]],
                13: [[[-505,-488],[-507,-490]], [[-500,-488],[-502,-490]]],
                14: [[[-505,-483],[-507,-485]], [[-500,-483],[-502,-485]]],
                15: [[[-505,-478],[-507,-480]], [[-500,-478],[-502,-480]]],
                16: [[[-505,-473],[-507,-475]], [[-500,-473],[-502,-475]]],
                17: [[[-505,-468],[-507,-470]], [[-500,-468],[-502,-470]]],
                18: [[[-505,-463],[-507,-465]], [[-500,-463],[-502,-465]]],
            },

            field_block: 'glass',

            startpos: -552,
            startpos_type: 'z',

            prestart_barrier_from: '-508 41 -552',
            prestart_barrier_to: '-499 37 -552',

            clear_floor_from: "-497 1 -553",
            clear_floor_to:   "-507 1 -459",

            winpos_from: [-497, 36, -461],
            winpos_to: [-508, 39, -455],

            loose_from: [-477, 2, -455],
            loose_to: [-522, 0, -557]
        },
    },
    ends: {
        no_time: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.gls.no_time","with":{"rawtext":[{"selector":"@a[tag=gls.winner]"},{"text":`+150${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=gls.winner]'}]
        },
        no_players: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.gls.no_players","with":{"rawtext":[{"selector":"@a[tag=gls.winner]"},{"text":`+150${SYM}`}]}}]},
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=gls.winner]'}]
        },
        no_players_h: {
            msg: {"rawtext":[{"translate":"axiscube.games.game_over.generic.no_players"}]},
            cmd: [{'type':'money','sum': 150, 'target': '@a[tag=gls.winner]'}]
        }
    },
    joinable: {
        can_join: true,
        join_commands: [
            'tag @s add gls',
            'tag @s add gls.member'
        ],
        prebegin_commands: [],
    },
    time: {
        value: 555,
        tick_function: glsTick,
        xp: true,
        actionbar_spec: true,
        notify_times: [300, 180, 60],
        events: {
            't1': glsTime
        }
    },
    start_commands: gls_main,
    begin_commands: [
        'tag @a add gls',
        'tag @a add gls.member',
        `effect @a slowness 99999 1 true`,
        `scoreboard players set "${COPYRIGHT}" gls.display -9`,
        'scoreboard players set "§1" gls.display -8',
        {type:'scoreset',value: 1, objective: 'gls.display'},
        'scoreboard players set "§2" gls.display 999',
        `scoreboard players set "${randomPlayerIcon()} §a%axiscube.scoreboard.players_lives" gls.display 998`,
    ],
    death_data: {
        death_commands: (player) => {
            if (getScore('diff','data') == 3) {
                eliminatePlayerMessage(player.name)
                runCMDs([
                    {type:'scoreset',value: -5, objective: 'gls.display',action: 'set',target: player.name},
                    'tag @s remove gls.member',
                    'tag @s add spec',
                    'gamemode spectator'
                ],player)
            }
        }
    },
    stop_commands: [ ],
    boards: [
        ['gls.display', '\ue1a6§6 %axiscube.gls.name', true],
    ]
}



async function gls_generate(){
    const f_block = GAMEDATA[6].loc[getGameArena()].field_block
    const platform_y = GAMEDATA[6].loc[getGameArena()].platforms_y
    for(let el in GAMEDATA[6].loc[getGameArena()].stages){
        system.runTimeout(()=>{
            runCMD(`fill ${GAMEDATA[6].loc[getGameArena()].stages[el][0][0][0]} ${platform_y} ${GAMEDATA[6].loc[getGameArena()].stages[el][0][0][1]} ${GAMEDATA[6].loc[getGameArena()].stages[el][0][1][0]} ${platform_y} ${GAMEDATA[6].loc[getGameArena()].stages[el][0][1][1]} ${f_block}`,undefined,true)
            runCMD(`fill ${GAMEDATA[6].loc[getGameArena()].stages[el][1][0][0]} ${platform_y} ${GAMEDATA[6].loc[getGameArena()].stages[el][1][0][1]} ${GAMEDATA[6].loc[getGameArena()].stages[el][1][1][0]} ${platform_y} ${GAMEDATA[6].loc[getGameArena()].stages[el][1][1][1]} ${f_block}`,undefined,true)
        },5)
    }
}

async function gls_main(){
    let game_lives = 3
    switch(getScore('diff','data')){
        case 0:
            game_lives = 10
        break;
        case 1:
            game_lives = 7
        break;
        case 2:
            game_lives = 5
        break;
        case 3:
            game_lives = 1
        break;
        default:
        break;
    }
    
    runCMD(`fill ${GAMEDATA[6].loc[getGameArena()].prestart_barrier_from} ${GAMEDATA[6].loc[getGameArena()].prestart_barrier_to} barrier`)
    loose_area = []
    normal_area = []

    //Push Loose cords
    let random = enchancedRandom(GAMEDATA[6].loc[getGameArena()].stage_count)
    random.forEach((num, index) => {
        let negativeInt = (num == 0)?1:0
        loose_area.push(GAMEDATA[6].loc[getGameArena()].stages[index+1][num])
        normal_area.push(GAMEDATA[6].loc[getGameArena()].stages[index+1][negativeInt])
    })

    for (const player of [...world.getPlayers()]) {
        player.clearDynamicProperties()
        player.setDynamicProperty('gls_lives', game_lives)
    }

    system.runTimeout(()=>{
        gls_generate()
    },20)
    startTimer(6)
}

function glsTime(){
    runCMD(`fill ${GAMEDATA[6].loc[getGameArena()].prestart_barrier_from} ${GAMEDATA[6].loc[getGameArena()].prestart_barrier_to} air replace barrier`)
    //Add Barriers
}

let loose_area: any[] = []
let normal_area: any[] = []

function glsTick(){
    let countNoWins = 0
    let countWins = 0
    let diff = getScore('diff','data')
    let countMembers = 0
    for (const player of [...world.getPlayers({excludeGameModes:[GameMode.Spectator]})]) {
        if (!player.hasTag('spec')) {
            const lives = Number(player.getDynamicProperty('gls_lives'))
            const isInWinnerArea = isPlayerinArea(GAMEDATA[6].loc[getGameArena()].winpos_from,GAMEDATA[6].loc[getGameArena()].winpos_to,player)
            const isInLooseArea = isPlayerinArea(GAMEDATA[6].loc[getGameArena()].loose_from,GAMEDATA[6].loc[getGameArena()].loose_to,player)
            const platform_y = GAMEDATA[6].loc[getGameArena()].platforms_y
            const player_y = platform_y+1
            if(isInLooseArea){
                if(lives != 1){
                    player.setDynamicProperty('gls_lives', lives-1)
                    player.teleport({x:-500,y:37,z:-554})
                }else{
                    runCMDs([
                        'tag @s remove gls.member',
                        'tag @s add spec',
                        'gamemode spectator',
                    ],player)
                }

            }
            if (isInWinnerArea) {
                if(diff == 3){completeChallenge(player,1)}
                runCMDs([
                    'tag @s add gls.winner',
                    'tag @s remove gls.member',
                    'tag @s add spec',
                    'gamemode spectator',
                    `tellraw @a {"rawtext":[{"translate":"axiscube.games.player_arrived","with":["${player.nameTag}"]}]}`,
                    {type:'scoreset',value: 500, objective: 'gls.display',action: 'set',target: player.name}
                ],player)
            }

            
            for(let el in loose_area){
                const area_x_1 = loose_area[el][0][0]
                const area_z_1 = loose_area[el][0][1]
                const area_x_2 = loose_area[el][1][0]
                const area_z_2 = loose_area[el][1][1]
                if(isPlayerinArea([area_x_1,player_y,area_z_1],[area_x_2,player_y,area_z_2],player)){
                    runCMD(`fill ${area_x_1} ${platform_y} ${area_z_1} ${area_x_2} ${platform_y} ${area_z_2} air destroy`)
                }
                if(isPlayerinArea([normal_area[el][0][0],player_y,normal_area[el][0][1]],[normal_area[el][1][0],player_y,normal_area[el][1][1]],player)){
                    runCMD(`fill ${area_x_1} ${platform_y} ${area_z_1} ${area_x_2} ${platform_y} ${area_z_2} air destroy`)
                }
            }
        }
        if (!player.hasTag('spec')) {
            countNoWins = countNoWins + 1
            runCMDs([
                {type:'scoreset',value: `${player.getDynamicProperty('gls_lives')}`, objective: 'gls.display',action: 'set',target: player.name}
            ])
        }else{
            runCMDs([
                {type:'scoreset',value: `0`, objective: 'gls.display',action: 'set',target: player.name}
            ])
        }

        if (player.hasTag('gls.member')) {
            countMembers = countMembers + 1
        } else if (player.hasTag('gls.winner')) {
            countWins = countWins + 1
        }
        //console.warn()
    }

    if(!(countMembers > 0)){
        switch (diff){
            case 3: // Hardcore
                if(countWins > 0){
                    stopGame(6, 'no_players_h')
                }
                else{
                    stopGame(6, 'no_players_h')
                }
            break;
            default:
                stopGame(6, 'no_players')
            break;
        }
    }
}