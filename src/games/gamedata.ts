import {runCMD} from '../modules/axisTools'
import {boardMoney} from '../tunes/bank';
import {GAMEDATA_BW} from './bw';
import {GAMEDATA_HNS} from './hns';
import {GAMEDATA_MNF} from './mnf';
import {GAMEDATA_PVP} from './pvp';
import {GAMEDATA_GLS} from './sq_glass';
import {GAMEDATA_DRP} from './dropper';
import {GAMEDATA_BLOCKP} from './blockp';
import {GAMEDATA_TNT} from './tntrun';
import {GAMEDATA_FW_BRIDGES} from './flagw/bridges';
import {GAMEDATA_FW_FRONTLINE} from './flagw/frontline';
import {GAMEDATA_PRK} from './prk';
import {GAMEDATA_HG} from './hg';

// GLOBAL

export const GAMEDATA = {
    0: {
        id: 0,
        min_players: 0,
        tags: [ 'lobby' ],
        loc: { 0: { spawn: '-9925 39 -9925' } },
        start_commands: async function() {
            let commands = [
                'xp -1000000L @a',
                'clearspawnpoint @a',
                'gamerule pvp false',
                'gamerule falldamage false',
                'kill @e[type=axiscube:dummy]',
                'kill @e[type=thrown_trident]',
                'tickingarea remove_all',
                'kill @e[type=item]',
                'kill @e[type=arrow]',
                'event entity @a axiscube:show_nametag',
                'clear @a',
                'effect @a clear',
                'difficulty p',
                { type: 'lockslot', slot: 1, item: 'axiscube:menu' },
            ]
            await runCMD(commands)
            await boardMoney()
        },
        death_data: {
            death_commands: []
        },
    },
    1: GAMEDATA_HNS, // HIDE N SEEK
    2: GAMEDATA_BLOCKP, // BLOCKPARTY
    3: GAMEDATA_PVP, // PVP
    4: GAMEDATA_MNF, // Minefield
    5: GAMEDATA_BW, //Bedwars
    6: GAMEDATA_GLS, //Glass
    7: GAMEDATA_DRP, //Dropper
    8: GAMEDATA_TNT, //Tnt_Run
    9: GAMEDATA_FW_BRIDGES, //Flagwars Bridges
    10: GAMEDATA_FW_FRONTLINE, //Flagwars Frontline
    11: GAMEDATA_PRK, //Parkour
    12: GAMEDATA_HG //Hunger Games
}
//GAMEDATA[1].start_commands.push(`execute as @a run scoreboard players random @s hns.block 0 ${HNS_BLOCKS.length-1}`)
    // GAMEDATA[2].time.events = {

    // }