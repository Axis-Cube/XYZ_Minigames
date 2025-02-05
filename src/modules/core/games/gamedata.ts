import { I_powerTP, runCMD } from '../../axisTools';
import { GAMEDATA_FW_FRONTLINE } from '#games/flagw/frontline';
import { GAMEDATA_FW_BRIDGES } from '#games/flagw/bridges';
import { GAMEDATA_BLOCKP } from '#games/blockp';
import { GAMEDATA_GLS } from '#games/sq_glass';
import { GAMEDATA_DRP } from '#games/dropper';
import { GAMEDATA_TNT } from '#games/tntrun';
import { GAMEDATA_HNS } from '#games/hns';
import { GAMEDATA_MNF } from '#games/mnf';
import { GAMEDATA_PVP } from '#games/pvp';
import { GAMEDATA_PRK } from '#games/prk';
import { boardMoney } from '#tunes/bank';
import { GAMEDATA_BW } from '#games/bw';
import { GAMEDATA_HG } from '#games/hg/game';

// GLOBAL

//#region GameData
export interface I_GameData{
    id: number,
    namespace: string,
    min_players: number
    tags: string[],
    team_data?: { teams: string[], spectator: boolean, icons: string, color_name: boolean },
    reset_player_color?: { [key: number]: boolean },
    confirm_begin?: { [key: number]: { warn_message: string, check: string | boolean } },
    joinable: { can_join: boolean, join_commands?: any[], prebegin_commands: any[], },
    loc: { [loc: number]: { gameplay?: { type: string, value: object } | any, spawn: I_powerTP, spawnpoint?: I_powerTP, newplayer?: I_powerTP, [key: string]: any, voidY?: number} },
    ends: { [end: string]: { msg?: any, cmd?: any } }
    time: { value: number, tick_function: Function, xp: boolean, actionbar_spec?: boolean, notify_times?: number[], events: { [key: number | string]: any[] | Function } },
    start_commands: any[] | Function,
    begin_commands: any[] | Function,
    stop_commands: any[] | Function,
    pre_commands?: string[],
    death_data: { disable_notify?: boolean, death_commands?: any[] | Function, killFunc?: Function, kill_reward?: number, },
    items?: { [item_id: string]: Function, },
    boards: any[]
}


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
//#endregion