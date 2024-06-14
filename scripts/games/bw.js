import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { actionbar, array3ToVector3, edScore, getGamemode, getItemAmounts, getScore, hasTag, nameToPlayer, playsound, rawtext, runCMD, runCMDs, setTickTimeout, sleep, tellraw, vector3ToArray3 } from "../modules/axisTools";
import { COPYRIGHT, DATABASE_IDS, DIM, ICONS, MINECRAFT_PICKAXES, SYM } from "../const";
import { TEAMS4, getPlayerTeam, teamArray, teamCheck } from "./category_team";
import { Block, BlockPermutation, Dimension, Player, system, world, EquipmentSlot, ItemStack } from "@minecraft/server";
import { GAMEDATA } from "./gamedata";
import { getGameArena, stopGame } from "./main";
import { DataBase } from "../modules/database";
import { haveVoidMessage, knockVoidMessage } from "../tunes/killMessage";
import { editPlayerGamedata, eliminatePlayerMessage, getPlayerGamedata } from "../tunes/profile";
import { dbGetRecord, dbSetRecord } from "../modules/cheesebase";
import { checkPerm } from "../modules/perm";
export const GAMEDATA_BW = {
    id: 5,
    reset_player_color: {
        0: true
    },
    namespace: 'bw',
    min_players: 1,
    tags: [
        'bw',
        'bw.member',
        'bw.winnerteam',
        'bw.void'
    ],
    team_data: {
        teams: TEAMS4,
        spectator: true,
        icons: 'heads',
        color_name: true
    },
    confirm_begin: {
        0: {
            warn_message: 'axiscube.games.startgame.confirm.d_line2.team',
            check: false //'teamcheck'
        }
    },
    loc: {
        0: {
            gameplay: { type: 'bytag', value: {
                    'team.red': { type: 'arr', value: ['13165 25 13088', '13168 25 13089', '13162 27 13094', '13164 27 13083', '13160 25 13089'] },
                    'team.green': { type: 'arr', value: ['13091 25 13165', '13090 25 13160', '13096 27 13164', '13085 27 13161', '13094 26 13167'] },
                    'team.yellow': { type: 'arr', value: ['13090 25 13015', '13091 25 13019', '13085 27 13016', '13087 26 13013', '13096 27 13018'] },
                    'team.blue': { type: 'arr', value: ['13015 25 13093', '13019 25 13091', '13019 27 13087', '13012 26 13096', '13016 27 13098'] },
                } },
            spawn: '13090 61 13090',
            newplayer: '13090 46 13090',
            spawnpoint: '13090 46 13090',
            level_low: 9,
            level_high: 59,
            cleardata: {
                1: [{ x: 13090, y: 0, z: 13091 }, { x: 13189, y: 0, z: 13189 }],
                2: [{ x: 13089, y: 0, z: 13091 }, { x: 12991, y: 0, z: 13189 }],
                3: [{ x: 13089, y: 0, z: 13090 }, { x: 12991, y: 0, z: 12991 }],
                4: [{ x: 13090, y: 0, z: 13090 }, { x: 13189, y: 0, z: 12991 }],
                // 1: [3090, 0, 3091, 3189, 0, 3189],
                // 2: [3089, 0, 3091, 2991, 0, 3189],
                //3: [3089, 0, 3090, 2991, 0, 2991],
                //4: [3090, 0, 3090, 3189, 0, 2991]
            },
            beds_c: {
                '13166;25;13092': 'red',
                '13165;25;13092': 'red',
                '13087;25;13166': 'green',
                '13087;25;13165': 'green',
                '13094;25;13015': 'yellow',
                '13094;25;13014': 'yellow',
                '13014;25;13089': 'blue',
                '13015;25;13089': 'blue',
            },
            beds: {
                red: {
                    pos: [13165, 25, 13092],
                    structure: 'bw_bed_red',
                    deg: 0
                },
                blue: {
                    pos: [13014, 25, 13089],
                    structure: 'bw_bed_blue',
                    deg: 0
                },
                green: {
                    pos: [13087, 25, 13165],
                    structure: 'bw_bed_green',
                    deg: 0
                },
                yellow: {
                    pos: [13094, 25, 13014],
                    structure: 'bw_bed_yellow',
                    deg: 0
                },
            },
            gens: {
                copper_ingot: [
                    // green
                    [13088, 26, 13169],
                    [13092, 27, 13178],
                    [13103, 27, 13158],
                    // blue
                    [13011, 26, 13090],
                    [13022, 27, 13105],
                    [13002, 27, 13094],
                    // yellow
                    [13093, 26, 13011],
                    [13083, 27, 13005],
                    [13078, 27, 13022],
                    // red
                    [13169, 26, 13091],
                    [13178, 27, 13087],
                    [13157, 27, 13077],
                ],
                iron_ingot: [
                    // green
                    [13076, 27, 13167],
                    [13089, 28, 13135],
                    // blue
                    [13013, 27, 13078],
                    [13045, 28, 13088],
                    // yellow
                    [13105, 27, 13013],
                    [13091, 28, 13045],
                    // red
                    [13167, 27, 13103],
                    [13135, 28, 13091],
                ],
                gold_ingot: [
                    [13053, 26, 13126], // green - blue
                    [13053, 26, 13054], // blue - yellow
                    [13126, 26, 13053], // yellow - red
                    [13127, 26, 13126], // red - green
                    // Center
                    [13087, 41, 13095],
                    [13093, 35, 13095],
                    [13093, 29, 13094]
                ],
                amethyst_shard: [
                    [13087, 35, 13085],
                    [13093, 41, 13085]
                ],
                echo_shard: [
                    [13090, 29, 13090]
                ]
            },
            arena_from: [13189, 59, 13189],
            arena_to: [12991, 8, 12991]
        }
    },
    ends: {
        no_time: {
            cmd: [{ 'type': 'money', 'sum': 100, 'target': '@a[tag=pvp.member]' }]
        },
        one_team: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"$<WINNER_TEAM>"},{"text":"+100${SYM}"}]}}]}`,
            cmd: [{ 'type': 'money', 'sum': 100, 'target': '@a[tag=bw.winnerteam]' }]
        }
    },
    joinable: {
        can_join: false,
        prebegin_commands: [
            { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
            { type: 'lockslot', slot: 6, item: 'axiscube:setting_game' },
            { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
            { type: 'lockslot', slot: 5, item: 'axiscube:team_selection' },
            { type: 'lockslot', slot: 4, item: 'axiscube:bw_kitsel' },
        ],
    },
    time: {
        value: 99999,
        tick_function: bwTick,
        xp: false,
        events: {
            t0: ['gamerule pvp true']
        }
    },
    start_commands: [
        () => { bwClear(); },
        { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
        { type: 'lockslot', slot: 6, item: 'axiscube:setting_game' },
        { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
        { type: 'lockslot', slot: 5, item: 'axiscube:team_selection' },
        { type: 'lockslot', slot: 4, item: 'axiscube:bw_kitsel' },
    ],
    begin_commands: bwBegin,
    death_data: {
        death_commands: bwDeath,
        kill_reward: 10,
        killFunc: bwKiller
    },
    items: {
        'axiscube:bw_kitsel': bwSettingKit,
        'axiscube:setting_game': bwSettingGame
    },
    stop_commands: [],
    boards: [
        ['bw.display', '\ue190§c %axiscube.bw.name', true],
    ]
};
const BW_BLOCKS = [
    'end_stone',
    'web',
    'obsidian',
    'planks',
    'chest',
    'concrete',
    'ladder'
];
const BW_BLOCKS_T = [
    'chest',
    'end_stone',
    'web',
    'planks',
    'obsidian',
    'white_concrete',
    'blue_concrete',
    'red_concrete',
    'yellow_concrete',
    'green_concrete',
    'ladder',
];
const BW_BLOCKS_DROPC = {
    'chest': true,
    'end_stone': MINECRAFT_PICKAXES,
    'planks': true,
    'obsidian': ['diamond_pickaxe', 'netherite_pickaxe'],
    'white_concrete': MINECRAFT_PICKAXES,
    'blue_concrete': MINECRAFT_PICKAXES,
    'red_concrete': MINECRAFT_PICKAXES,
    'yellow_concrete': MINECRAFT_PICKAXES,
    'green_concrete': MINECRAFT_PICKAXES,
    'ladder': true,
};
const UNICODES = {
    'copper_ingot': '\ue146',
    'iron_ingot': '\ue143',
    'gold_ingot': '\ue142',
    'amethyst_shard': '\ue144',
    'echo_shard': '\ue147'
};
const COLORS = {
    'copper_ingot': '§n',
    'iron_ingot': '§8',
    'gold_ingot': '§6',
    'amethyst_shard': '§u',
    'echo_shard': '§t'
};
export const BW_TEAMSCORES = {
    red: `\ue19e %axiscube.teamgame.team.red`,
    blue: `\ue19c %axiscube.teamgame.team.blue`,
    yellow: `\ue19b %axiscube.teamgame.team.yellow`,
    green: `\ue19d %axiscube.teamgame.team.green`,
    red_des: `\ue19f %axiscube.teamgame.team.red`,
    blue_des: `\ue19f %axiscube.teamgame.team.blue`,
    yellow_des: `\ue19f %axiscube.teamgame.team.yellow`,
    green_des: `\ue19f %axiscube.teamgame.team.green`
};
const DB_NAME = 'settings';
export const DB_DEFAULT = {
    gen: {
        copper_ingot: 5 * 20,
        iron_ingot: 5 * 20,
        gold_ingot: 7 * 20,
        amethyst_shard: 12 * 20,
        echo_shard: 15 * 20,
    },
    limits: {
        echo_shard: 3,
        amethyst_shard: 3,
        gold_ingot: 5,
        iron_ingot: 8,
        copper_ingot: 8,
    },
    upgprice: {
        amethyst_shard: 4,
        gold_ingot: 4,
        iron_ingot: 3,
        copper_ingot: 2,
    },
    enable_upgrade: true
};
const BW_GEN_SOUNDS = {
    'amethyst_shard': 'hit.amethyst_block',
    'gold_ingot': 'note.chime',
    'iron_ingot': 'use.chain',
    'copper_ingot': 'use.copper',
    'echo_shard': 'place.sculk_shrieker',
};
const BW_NOTPLACEABLE_BLOCKS = [
    'barrier',
    'waxed_cut_copper',
    'iron_block',
    'gold_block',
    'budding_amethyst',
    'stonebrick',
    'sculk_catalyst'
];
let buffer_killdata = {};
let buffer_kit = {};
const BW_SETS = {
    0: {
        name: '%axiscube.bw.kit.miner',
        body: '%item.stone_pickaxe.name & %howtoplay.blocks (x5)',
        icon: 'textures/ui/icons/games/bw/kit_miner',
        getfun: (player) => {
            runCMD('give @s iron_pickaxe', player);
            runCMD(`give @s ${getPlayerTeam(player)}_concrete 5`, player);
        }
    },
    1: {
        name: '%axiscube.bw.kit.sworder',
        body: '%howtoplay.weapons.header.1 & %item.chainmail_helmet.name',
        icon: 'textures/ui/icons/games/bw/kit_sworder',
        getfun: (player) => {
            runCMD('give @s wooden_sword', player);
            const equipment = player.getComponent("minecraft:equipment_inventory");
            equipment.setEquipment(EquipmentSlot.head, new ItemStack('minecraft:chainmail_helmet', 1));
        }
    },
    2: {
        name: '%axiscube.bw.kit.builder',
        body: '%howtoplay.blocks (x10) & %item.wooden_pickaxe.name',
        icon: 'textures/ui/icons/games/bw/kit_builder',
        getfun: (player) => {
            runCMD('give @s wooden_pickaxe', player);
            runCMD(`give @s ${getPlayerTeam(player)}_concrete 10`, player);
            equipment.setEquipment(EquipmentSlot.head, new ItemStack('minecraft:golden_helmet', 1));
        }
    }
};
/**
 * @param {import("@minecraft/server").Player} player
*/
export function bwSettingKit(player) {
    const name = player.name;
    const selected = getPlayerGamedata(name, 5, 'kitsel');
    const form = new ActionFormData()
        .title('%axiscube.bw.kit.title')
        .body('%axiscube.bw.kit.d');
    for (let k in BW_SETS) {
        let kit = BW_SETS[k];
        form.button(`${k == selected ? '\ue124 ' : ''}${kit.name}\n${kit.body}`, kit.icon);
    }
    form.show(player).then(gg => {
        if (gg.canceled)
            return;
        editPlayerGamedata(name, 5, 'kitsel', gg.selection);
    });
}
/**
 * @param {import("@minecraft/server").Player} player
*/
export function bwGiveKitstart(player) {
    const name = player.name;
    let dt = new Date();
    let time = Math.ceil(dt.getTime() / 1000);
    if (buffer_kit[player.name] + 30 >= time) {
        tellraw({ rawtext: [{ translate: 'axiscube.bw.kit.cooldown', with: [`${(buffer_kit[player.name] + 30 - time)}`] }] }, player);
        return;
    }
    buffer_kit[player.name] = time;
    const selected = BW_SETS[getPlayerGamedata(name, 5, 'kitsel')];
    selected.getfun(player);
}
export async function bwBegin() {
    const arn = getGameArena();
    bwClear();
    runCMD('gamerule pvp true');
    runCMD('gamemode survival @a');
    for (let player of world.getPlayers()) {
        if (getPlayerTeam(player) == undefined || player.hasTag('spec')) {
            player.addTag('spec');
            runCMD('gamemode spectator', player);
        }
        else {
            bwGiveKitstart(player);
        }
    }
    const teams = teamArray();
    edScore(COPYRIGHT, 'bw.display', 0);
    for (let i in teams) {
        const team = teams[i];
        edScore(`${BW_TEAMSCORES[team]}`, 'bw.display', (Number(i) + 1) * 2);
        edScore(`§${i}`, 'bw.display', (Number(i) + 1) * 2 - 1);
    }
}
export function bwPlaceBed(team = 'green') {
    const bedData = GAMEDATA_BW.loc[getGameArena()].beds[team];
    runCMD(`structure load ${bedData.structure} ${bedData.pos[0]} ${bedData.pos[1]} ${bedData.pos[2]} ${bedData.deg}_degrees`);
}
export async function bwClear() {
    const arn = getGameArena();
    const clearData = GAMEDATA_BW.loc[arn].cleardata;
    const levelLow = GAMEDATA_BW.loc[arn].level_low;
    const levelHigh = GAMEDATA_BW.loc[arn].level_high;
    for (let d = 1; d <= Object.keys(clearData).length; d++) {
        if (clearData.hasOwnProperty(d)) {
            await runCMD(`tickingarea add ${clearData[d][0].x} ${clearData[d][0].y} ${clearData[d][0].z} ${clearData[d][1].x} ${clearData[d][1].y} ${clearData[d][1].z} bw_${d} true`, undefined, true);
        }
    }
    runCMD('kill @e[type=item]');
    // SUPERCLEAN Systems v1 by Axiscube Inc. 
    for (let y = levelLow - 1; y <= levelHigh; y += 2) {
        await sleep(1);
        for (let d = 1; d <= Object.keys(clearData).length; d++) {
            if (clearData.hasOwnProperty(d)) {
                for (const block of BW_BLOCKS) {
                    console.warn(`fill ${clearData[d][0].x} ${y} ${clearData[d][0].z} ${clearData[d][1].x} ${y + 2} ${clearData[d][1].z} air replace ${block}`);
                    runCMD(`fill ${clearData[d][0].x} ${y} ${clearData[d][0].z} ${clearData[d][1].x} ${y + 2} ${clearData[d][1].z} air replace ${block}`, undefined, true);
                }
            }
        }
    }
    for (let team of TEAMS4) {
        bwPlaceBed(team);
    }
    //
}
export function bwHit(damagingEntity, hurtEntity) {
    let dt = new Date();
    let time = dt.getTime() / 1000;
    buffer_killdata[hurtEntity.name] = {};
    buffer_killdata[hurtEntity.name].source = damagingEntity;
    buffer_killdata[hurtEntity.name].time = time;
}
export async function bwKiller(killer, prey) {
}
/**
 * @param {import("@minecraft/server").Player} player
*/
export async function bwDeath(player) {
    if (!bwCheckBed(getPlayerTeam(player)) && !player.hasTag('spec')) {
        eliminatePlayerMessage(player);
        player.addTag('spec');
        runCMD('gamemode spectator', player);
        playsound('mob.elderguardian.hit');
        if (!teamArray().includes(getPlayerTeam(player))) {
            edScore(`${BW_TEAMSCORES[`${team}_des`]}`, 'bw.display', '', 'reset');
        }
        return;
    }
    else if (player.hasTag('spec')) {
        return;
    }
    runCMD(`titleraw @s title {"rawtext":[{"text":"§c"},{"translate":"axiscube.bw.dead.t"}]}`, player);
    runCMD('gamemode spectator', player);
    setTickTimeout(() => {
        playsound('random.click', player);
        runCMD(`titleraw @s subtitle {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${3}"]}]}`, player);
    }, 20);
    setTickTimeout(() => {
        playsound('random.click', player);
        runCMD(`titleraw @s subtitle {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${2}"]}]}`, player);
    }, 40);
    setTickTimeout(() => {
        playsound('random.click', player);
        runCMD(`titleraw @s subtitle {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${1}"]}]}`, player);
    }, 60);
    setTickTimeout(async () => {
        await runCMD('clear @s', player);
        playsound('random.click', player);
        runCMD('gamemode s', player);
        player.removeTag('bw.void');
        runCMD(`tp ${GAMEDATA_BW.loc[getGameArena()].gameplay.value[`team.${getPlayerTeam(player)}`].value[0]}`, player);
        runCMD(`titleraw @s subtitle {"rawtext":[{"text":"§a"}]}`, player);
        runCMD(`titleraw @s title {"rawtext":[{"text":"§a"},{"translate":"axiscube.bw.dead.respawned"}]}`, player);
        bwGiveKitstart(player);
    }, 80);
}
export function bwGetSettings() {
    return dbGetRecord(DATABASE_IDS['bw_settings'], DB_DEFAULT, DB_NAME);
}
export function bwSetSettings(data) {
    return dbSetRecord(DATABASE_IDS['bw_settings'], data, DB_NAME);
}
export function getResInterval(resourceTypeId) {
    return bwGetSettings().gen[resourceTypeId];
}
let tickCount = 0;
export function bwSettingGame(player, l = 0) {
    if (l == 0) {
        const form = new ActionFormData()
            .title(`%axiscube.bw.name`)
            .body('%menu.settings')
            .button(`%axiscube.bw.settings.gens`, 'textures/ui/icons/games/bw/gens')
            .button(`controls.reset`, ICONS.den)
            .show(player).then(gg => {
            if (gg.selection == 0) {
                bwSettingGame(player, 1);
            }
            else if (gg.selection == 1) {
                if (!checkPerm(player.name, 'setting'))
                    true;
                playsound('random.break', player);
                bwSetSettings(DB_DEFAULT);
            }
        });
    }
    else if (l == 1) {
        let currentSettings = bwGetSettings();
        const form = new ActionFormData()
            .title(`%menu.settings`)
            .body('%axiscube.bw.settings.gens')
            .button(`gui.back`, ICONS.back)
            .button(`%gui.edit: %axiscube.bw.settings.genspeed`, ICONS.edit)
            .button(`%gui.edit: %axiscube.bw.settings.splimits`, ICONS.edit)
            .button(`%axiscube.bw.settings.upgrade`, ICONS.settings)
            .button('%axiscube.bw.settings.gens.current');
        for (let item in DB_DEFAULT.gen) {
            form.button(`%item.${item}.name:\n${currentSettings.gen[item] / 20} sec | Max: ${currentSettings.limits[item]}`, `textures/items/${item}`);
        }
        // .button('item.copper_ingot.name','textures/items/copper_ingot')
        // .button('item.iron_ingot.name','textures/items/iron_ingot')
        // .button('item.gold_ingot.name','textures/items/gold_ingot')
        // .button('item.amethyst_shard.name','textures/items/amethyst_shard')
        form.show(player).then(async (gg) => {
            if (gg.selection == 0) {
                bwSettingGame(player, 0);
            }
            else if (gg.selection == 1 || gg.selection > 3) {
                bwSettingGame(player, 2);
            }
            else if (gg.selection == 2) {
                bwSettingGame(player, 3);
            }
            else if (gg.selection == 3) {
                if (!checkPerm(player.name, 'setting'))
                    true;
                bwSettingGame(player, 4);
            }
        });
    }
    else if (l == 2) {
        if (!checkPerm(player.name, 'setting'))
            true;
        let currentSettings = bwGetSettings();
        const formEdit = new ModalFormData()
            .title('%axiscube.bw.settings.gens');
        for (let item in DB_DEFAULT.gen) {
            formEdit.slider(`${UNICODES[item]} %item.${item}.name (%gui.default: ${DB_DEFAULT.gen[item] / 20})`, 1, 30, 1, currentSettings.gen[item] / 20);
        }
        formEdit.show(player).then(async (gl) => {
            if (!gl.canceled) {
                let i = 0;
                for (let item in DB_DEFAULT.gen) {
                    currentSettings.gen[item] = gl.formValues[i] * 20;
                    i++;
                }
                await bwSetSettings(currentSettings);
                bwSettingGame(player, 1);
            }
        });
    }
    else if (l == 3) {
        if (!checkPerm(player.name, 'setting'))
            true;
        let currentSettings = bwGetSettings();
        const formEdit = new ModalFormData()
            .title('%axiscube.bw.settings.splimits');
        for (let item in DB_DEFAULT.gen) {
            formEdit.slider(`${UNICODES[item]} %item.${item}.name (%gui.default: ${DB_DEFAULT.limits[item]})`, 1, 64, 1, currentSettings.limits[item]);
        }
        formEdit.show(player).then(async (gl) => {
            if (!gl.canceled) {
                let i = 0;
                for (let item in DB_DEFAULT.gen) {
                    currentSettings.limits[item] = gl.formValues[i];
                    i++;
                }
                await bwSetSettings(currentSettings);
                bwSettingGame(player, 1);
            }
        });
    }
    else if (l == 4) {
        let currentSettings = bwGetSettings();
        const formEdit = new ModalFormData()
            .title('%axiscube.bw.settings.upgrade')
            .toggle('%axiscube.bw.settings.upgrade.toggle', currentSettings.enable_upgrade);
        for (let item in DB_DEFAULT.upgprice) {
            formEdit.slider(`${UNICODES[item]} %item.${item}.name (%gui.default: ${DB_DEFAULT.upgprice[item]})`, 1, 64, 1, currentSettings.upgprice[item]);
        }
        formEdit.show(player).then(async (gl) => {
            if (!gl.canceled) {
                currentSettings.enable_upgrade = gl.formValues[0];
                let i = 1;
                for (let item in DB_DEFAULT.gen) {
                    currentSettings.upgprice[item] = gl.formValues[i];
                    i++;
                }
                await bwSetSettings(currentSettings);
                bwSettingGame(player, 1);
            }
        });
    }
}
const BW_GENBLOCKS = {
    waxed_cut_copper: 'copper_ingot',
    iron_block: 'iron_ingot',
    gold_block: 'gold_ingot',
    budding_amethyst: 'amethyst_shard'
};
const BW_GEN_STRUCTURES = {
    amethyst_shard: 'bw_res_amethyst',
    gold_ingot: 'bw_res_gold_ingot',
    iron_ingot: 'bw_res_iron_ingot',
    copper_ingot: 'bw_res_copper_ingot',
    echo_shard: 'bw_res_echo',
};
const DB2_NAME = 'data.gametemp';
const DB2_DEFAULT = {
    copper_ingot: {},
    iron_ingot: {},
    gold_ingot: {},
    amethyst_shard: {},
    echo_shard: {}
};
function bwGetItemAmountPerSpawn(res, cord, isBlock = false) {
    if (isBlock)
        cord[1] = cord[1] + 1;
    let currentAm = dbGetRecord('genupg', DB2_DEFAULT, DB2_NAME);
    if (currentAm == DB2_DEFAULT || currentAm[res][`${cord[0]};${cord[1]};${cord[2]}`] == undefined)
        return 1;
    return currentAm[res][`${cord[0]};${cord[1]};${cord[2]}`];
}
/**
 * @param {import("@minecraft/server").Player} player
 * @param {import("@minecraft/server").Block} block
*/
export function onItemUse(player, block) {
    const res = BW_GENBLOCKS[block.typeId.split(':')[1]];
    if (res != undefined) {
        if (nameToPlayer(player.name).isSneaking) {
            if (!bwGetSettings().enable_upgrade) {
                tellraw({ rawtext: [{ translate: 'axiscube.bw.gen.upgrade.disabled' }] }, player, 'act');
                return;
            }
            let currentAmount = bwGetItemAmountPerSpawn(res, vector3ToArray3(block.location), true);
            let upgPrice = bwGetSettings().upgprice[res] * (currentAmount + 1);
            const form = new ActionFormData()
                .title('axiscube.bw.gen.upgrade')
                .body({ rawtext: [{ translate: 'axiscube.bw.gen.upgrade.d', with: ['\n\n', `${currentAmount}`, `${getResInterval(res) / 20}`] }] })
                .button({ rawtext: [{ translate: 'axiscube.bw.gen.upgrade.button', with: [`${currentAmount + 1}`] }, { text: `\n§t${upgPrice} ${UNICODES['echo_shard']}` }] })
                .show(player).then(gg => {
                if (gg.selection == 0 && upgPrice <= getItemAmounts(player, ['echo_shard'])['echo_shard']) {
                    let currentAm = dbGetRecord('genupg', DB2_DEFAULT, DB2_NAME);
                    currentAm[res][`${block.x};${block.y + 1};${block.z}`] = currentAmount + 1;
                    dbSetRecord('genupg', currentAm, DB2_NAME);
                    runCMD(`clear @s echo_shard -1 ${upgPrice}`, player);
                }
                else if (gg.selection == 0) {
                    rawtext('axiscube.bw.shop.no_res', player, 'tr', 'c');
                }
            });
        }
        else {
            tellraw({ rawtext: [{ translate: 'axiscube.bw.gen.upgrade.err' }] }, player, 'act');
        }
    }
}
export async function generateRes(resourceTypeId) {
    const arena = getGameArena();
    for (let cord of GAMEDATA_BW.loc[arena].gens[resourceTypeId]) {
        let spawnHere = true;
        let ents = DIM.getEntitiesAtBlockLocation(array3ToVector3(cord));
        for (let ent of ents) {
            if (ent.typeId == 'minecraft:item') {
                const itemStack = ent.getComponent('minecraft:item').itemStack;
                if (itemStack.amount < 2 || itemStack.typeId.split(':')[1] != resourceTypeId) {
                    continue;
                }
                else if (itemStack.amount >= bwGetSettings().limits[resourceTypeId]) {
                    spawnHere = false;
                }
            }
            else if (ent.typeId == 'minecraft:player') {
                system.runTimeout(() => {
                    let res_amounts = getItemAmounts(ent, ["copper_ingot", "amethyst_shard", "gold_ingot", "iron_ingot", "echo_shard"]);
                    //let current_res = `§6${res_amounts.copper_ingot} \ue186 §8${res_amounts.iron_ingot} \ue166 §g${res_amounts.gold_ingot} \ue165 §5${res_amounts.amethyst_shard} \ue167 §t${res_amounts.echo_shard} \ue168`
                    //res_amounts[resourceTypeId] = res_amounts[resourceTypeId] + 1
                    res_amounts = `§6${res_amounts.copper_ingot} ${UNICODES['copper_ingot']} §r| §8${res_amounts.iron_ingot} ${UNICODES['iron_ingot']} §r| §g${res_amounts.gold_ingot} ${UNICODES['gold_ingot']} §r | §u${res_amounts.amethyst_shard} ${UNICODES['amethyst_shard']} §r | §t${res_amounts.echo_shard} ${UNICODES['echo_shard']}`;
                    actionbar(res_amounts, ent);
                }, 5);
            }
        }
        if (!spawnHere)
            continue;
        //DIM.spawnItem(new ItemStack(`minecraft:${resourceTypeId}`,bwGetItemAmountPerSpawn(resourceTypeId,cord)),array3ToVector3(cord))
        await runCMD(`playsound ${BW_GEN_SOUNDS[resourceTypeId]} @a ${cord[0]} ${cord[1]} ${cord[2]} 0.5`);
        for (let i = 0; i < bwGetItemAmountPerSpawn(resourceTypeId, cord); i++) {
            await runCMD(`structure load ${BW_GEN_STRUCTURES[resourceTypeId]} ${cord[0]} ${cord[1]} ${cord[2]}`, undefined, true);
        }
    }
}
export async function bwTick() {
    tickCount += 5;
    // GEN ENGINE
    for (let res in GAMEDATA_BW.loc[getGameArena()].gens) {
        //console.warn(tickCount % getResInterval(res) == 0,tickCount,getResInterval(res),tickCount % getResInterval(res),res)
        if (tickCount % getResInterval(res) == 0)
            generateRes(res);
    }
    for (const player of world.getPlayers()) {
        if (Math.floor(player.location.y) == 8 && !hasTag(player, 'bw.void')) {
            let dt = new Date();
            let time = dt.getTime() / 1000;
            player.addTag('bw.void');
            runCMD('particle axiscube:spiral', player);
            if (buffer_killdata[player.name] != undefined && (time - Number(buffer_killdata[player.name].time)) < 7) {
                knockVoidMessage(buffer_killdata[player.name].source, player);
                delete buffer_killdata[player.name];
            }
            else {
                haveVoidMessage(player);
            }
            player.kill();
        }
    }
    if (!teamCheck()) {
        let teams = teamArray();
        if (teams.length == 0) {
            stopGame();
        }
        else if (teams.length == 1) {
            await runCMD(`tag @a[tag=team.${teams[0]}] add bw.winnerteam`);
            stopGame(3, 'one_team', { 'winner_team': `axiscube.teamgame.team.${teams[0]}` });
        }
    }
    let commands = [
        `enchant @a[hasitem={location=slot.weapon.mainhand,item=axiscube:baseball_bat}] knockback 1`,
        'kill @e[type=item,y=8,dy=8,x=0,dx=100000,z=0,dz=100000]'
    ];
    runCMDs(commands);
}
function bwCheckBed(team) {
    const cord = GAMEDATA_BW.loc[getGameArena()].beds[team].pos;
    return DIM.getBlock(array3ToVector3(cord)).typeId == 'minecraft:bed';
}
function bwBreakBed(team, player) {
    playsound('mob.enderdragon.growl', `@a[tag=!team.${team}]`);
    playsound('mob.enderdragon.death', `@a[tag=team.${team}]`);
    edScore(`${BW_TEAMSCORES[`${team}_des`]}`, 'bw.display', getScore(`${BW_TEAMSCORES[team]}`, 'bw.display'), 'set');
    edScore(`${BW_TEAMSCORES[team]}`, 'bw.display', '', 'reset');
    runCMDs([
        `titleraw @a[tag=team.${team}] title {"rawtext":[{"text":"§4"},{"translate":"axiscube.bw.bed.destroy.preyteam.title"}]}`,
        `titleraw @a[tag=team.${team}] subtitle {"rawtext":[{"translate":"axiscube.bw.bed.destroy.preyteam.subtitle"}]}`
    ]);
    tellraw({ rawtext: [{ translate: 'axiscube.bw.bed.destroy', with: { rawtext: [{ translate: `axiscube.teamgame.team.${team}` }, { text: `${player.nameTag}` }] } }] });
}
/**
* @param {Player} player
* @param {Block} block
* @param {BlockPermutation} brokenBlockPermutation
*/
export function bwBlockBreak(player, block, brokenBlockPermutation) {
    if (brokenBlockPermutation.type.id == 'minecraft:bed') {
        const bedTeam = GAMEDATA_BW.loc[getGameArena()].beds_c[`${block.x};${block.y};${block.z}`];
        if (bedTeam == getPlayerTeam(player)) {
            bwPlaceBed(bedTeam);
        }
        else {
            bwBreakBed(bedTeam, player);
        }
    }
    else if (BW_BLOCKS_T.indexOf(brokenBlockPermutation.type.id.split(':')[1]) == -1 && getGamemode(player) != 'creative') {
        //runCMD(`kill @e[type=item,x=${block.location.x},y=${block.location.y},z=${block.location.z},r=2]`)
        player.dimension.getBlock(block.location).setPermutation(brokenBlockPermutation);
    }
    else if (getGamemode(player) != 'creative') {
        const equipment = player.getComponent("minecraft:equipment_inventory");
        const mainhand = equipment.getEquipment(EquipmentSlot.mainhand).typeId.split(':')[1];
        const blockId = brokenBlockPermutation.type.id.split(':')[1];
        if (BW_BLOCKS_DROPC[blockId] === true || BW_BLOCKS_DROPC[blockId].includes(mainhand)) {
            DIM.spawnItem(new ItemStack(brokenBlockPermutation.type.id, 1), block.location);
        }
    }
}
/**
* @param {Player} player
* @param {Block} block
* @param {Dimension} dimension
*/
export function bwBlockPlace(player, block, dimension) {
    let downBlock = dimension.getBlock({ x: block.location.x, y: block.location.y - 1, z: block.location.z });
    if ((!BW_BLOCKS_T.includes(block.typeId.split(':')[1]) || BW_NOTPLACEABLE_BLOCKS.includes(downBlock.typeId.split(':')[1])) && getGamemode(player) != 'creative') {
        runCMD(`setblock ${block.x} ${block.y} ${block.z} air destroy`);
    }
}
const BW_EQUIPMENT_REGEX = ['leather.+', 'chainmail.+', 'iron.+', 'diamond.+', 'netherite.+']; // Сразу все вещи
/**
* @param {Player} player
* @param {Block} block
* @param {Dimension} dimension
*/
export async function bwEquipmentCheck(player, id = 'minecraft:leather_helmet', slot = EquipmentSlot.head) {
    try {
        let temp_regex = undefined; //Temp regexp
        let pre = undefined; //
        let element = undefined; //Armor element
        const equipment = player.getComponent("minecraft:equipment_inventory");
        try {
            element = equipment.getEquipment(slot);
            if (element == undefined) {
                pre = -1;
            }
            else {
                element = element.typeId;
                for (let i in BW_EQUIPMENT_REGEX) {
                    temp_regex = new RegExp(BW_EQUIPMENT_REGEX[i]);
                    if (temp_regex.test(element) != false) {
                        pre = i;
                    }
                }
            }
        }
        catch (e) {
            return;
        }
        for (let i in BW_EQUIPMENT_REGEX) {
            temp_regex = new RegExp(BW_EQUIPMENT_REGEX[i]);
            //console.warn(i, pre)
            if (temp_regex.test(id) != false && pre != undefined && i > pre) {
                //console.warn(`[EQ] EQUIPPED ${id} to ${player.name}`)
                equipment.setEquipment(slot, new ItemStack(id, 1));
                return;
            }
        }
        runCMD(`give ${player.name} ${id}`);
        //console.warn(`[EQ] ${id} < ${element}`)
    }
    catch (e) {
        //console.error(e, e.stack)
    }
}
const CAN_DESTROY = ''; //'{"minecraft:can_destroy":{"blocks":["planks","web","obsidian","sandstone","end_stone","ice", "ladder"]}}'
const CAN_PLACE = ''; //'{"can_place_on":{"blocks":["stone", "wool", "podzol", "planks", "dirt", "grass", "log", "leaves", "leaves2", "log2", "sandstone", "bedrock", "bed", "wooden_slab", "wood","obsidian","web","stripped_spruce_log","end_stone","mycelium","spruce_stairs","basalt","polished_basalt","smooth_basalt","ladder","tallgrass","stone_block_slab","stone_block_slab2","stone_block_slab3","stone_block_slab4","concrete","stained_glass","stained_glass_pane","torch","slime","stained_hardened_clay","stone_stairs","verdant_froglight","sand","lantern","deadbush","deepslate_brick_slab","cobbled_deepslate_slab","bookshelf","ice"]}}'
const bwShopData = {
    1: [
        {
            name: '%item.stick.name (%enchantment.knockback)',
            icon: 'textures/items/baseball_bat',
            price: 64,
            id: 'axiscube:baseball_bat',
            material: 'copper_ingot',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'stone_sword',
            price: 5,
            material: 'iron_ingot',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'iron_sword',
            price: 7,
            material: 'gold_ingot',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'diamond_sword',
            price: 7,
            material: 'amethyst_shard',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'arrow',
            price: 8,
            material: 'gold_ingot',
            buy: { type: 'slider', amount: 12 }
        },
        {
            id: 'bow',
            icon: 'textures/items/bow_standby',
            price: 10,
            material: 'gold_ingot',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            name: '%item.bow.name (%enchantment.arrowDamage %enchantment.level.3)',
            icon: 'textures/items/bow_pulling_1',
            price: 10,
            material: 'amethyst_shard',
            buy: { type: 'structure', value: 'bw_item_bow3' }
        },
        {
            name: '%item.bow.name (%enchantment.arrowKnockback %enchantment.level.1)',
            icon: 'textures/items/bow_pulling_2',
            price: 10,
            material: 'amethyst_shard',
            buy: { type: 'structure', value: 'bw_item_bow_punch' }
        }
    ],
    2: [
        {
            name: '%howtoplay.armor (%item.leather.name)',
            icon: 'textures/ui/icons/items/leather_set.png',
            price: 20,
            material: 'copper_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:leather_helmet', EquipmentSlot.head);
                    bwEquipmentCheck(player, 'minecraft:leather_chestplate', EquipmentSlot.chest);
                    bwEquipmentCheck(player, 'minecraft:leather_leggings', EquipmentSlot.legs);
                    bwEquipmentCheck(player, 'minecraft:leather_boots', EquipmentSlot.feet);
                } }
        },
        {
            id: 'leather_helmet',
            icon: 'textures/ui/icons/items/leather_helmet.png',
            price: 5,
            material: 'copper_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:leather_helmet', EquipmentSlot.head);
                } }
        },
        {
            id: 'leather_chestplate',
            icon: 'textures/ui/icons/items/leather_chestplate.png',
            price: 5,
            material: 'copper_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:leather_chestplate', EquipmentSlot.chest);
                } }
        },
        {
            id: 'leather_leggings',
            icon: 'textures/ui/icons/items/leather_leggings.png',
            price: 5,
            material: 'copper_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:leather_leggings', EquipmentSlot.legs);
                } }
        },
        {
            id: 'leather_boots',
            icon: 'textures/ui/icons/items/leather_boots.png',
            price: 5,
            material: 'copper_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:leather_boots', EquipmentSlot.feet);
                } }
        },
        {
            name: '%howtoplay.armor (%tile.chain.name)',
            icon: 'textures/ui/icons/items/chainmail_set.png',
            price: 22,
            material: 'iron_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:chainmail_helmet', EquipmentSlot.head);
                    bwEquipmentCheck(player, 'minecraft:chainmail_chestplate', EquipmentSlot.chest);
                    bwEquipmentCheck(player, 'minecraft:chainmail_leggings', EquipmentSlot.legs);
                    bwEquipmentCheck(player, 'minecraft:chainmail_boots', EquipmentSlot.feet);
                } }
        },
        {
            id: 'chainmail_helmet',
            price: 5,
            material: 'iron_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:chainmail_helmet', EquipmentSlot.head);
                } }
        },
        {
            id: 'chainmail_chestplate',
            price: 7,
            material: 'iron_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:chainmail_chestplate', EquipmentSlot.chest);
                } }
        },
        {
            id: 'chainmail_leggings',
            price: 6,
            material: 'iron_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:chainmail_leggings', EquipmentSlot.legs);
                } }
        },
        {
            id: 'chainmail_boots',
            price: 5,
            material: 'iron_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:chainmail_boots', EquipmentSlot.feet);
                } }
        },
        {
            id: 'iron_helmet',
            price: 5,
            material: 'gold_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:iron_helmet', EquipmentSlot.head);
                } }
        },
        {
            id: 'iron_chestplate',
            price: 6,
            material: 'gold_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:iron_chestplate', EquipmentSlot.chest);
                } }
        },
        {
            id: 'iron_leggings',
            price: 5,
            material: 'gold_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:iron_leggings', EquipmentSlot.legs);
                } }
        },
        {
            id: 'iron_boots',
            price: 4,
            material: 'gold_ingot',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:iron_boots', EquipmentSlot.feet);
                } }
        },
        {
            id: 'diamond_helmet',
            price: 4,
            material: 'amethyst_shard',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:diamond_helmet', EquipmentSlot.head);
                } }
        },
        {
            id: 'diamond_chestplate',
            price: 4,
            material: 'amethyst_shard',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:diamond_chestplate', EquipmentSlot.chest);
                } }
        },
        {
            id: 'diamond_leggings',
            price: 4,
            material: 'amethyst_shard',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:diamond_leggings', EquipmentSlot.legs);
                } }
        },
        {
            id: 'diamond_boots',
            price: 4,
            material: 'amethyst_shard',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:diamond_boots', EquipmentSlot.feet);
                } }
        },
        {
            id: 'netherite_helmet',
            price: 6,
            material: 'amethyst_shard',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:netherite_helmet', EquipmentSlot.head);
                } }
        },
        {
            id: 'netherite_chestplate',
            price: 6,
            material: 'amethyst_shard',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:netherite_chestplate', EquipmentSlot.chest);
                } }
        },
        {
            id: 'netherite_leggings',
            price: 6,
            material: 'amethyst_shard',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:netherite_leggings', EquipmentSlot.legs);
                } }
        },
        {
            id: 'netherite_boots',
            price: 6,
            material: 'amethyst_shard',
            buy: { type: 'eval', value: (player) => {
                    bwEquipmentCheck(player, 'minecraft:netherite_boots', EquipmentSlot.feet);
                } }
        }
    ],
    3: [
        {
            id: '{{TEAM}}_concrete',
            name: '%tile.concrete.{{TEAM}}.name',
            price: 5,
            material: 'copper_ingot',
            icon: 'textures/blocks/concrete_{{TEAM}}',
            buy: { type: 'slider', amount: 8, another_item_data: `2 ${CAN_PLACE}` }
        },
        {
            id: 'end_stone',
            price: 5,
            material: 'iron_ingot',
            buy: { type: 'slider', amount: 8, another_item_data: `0 ${CAN_PLACE}` }
        },
        {
            id: 'planks',
            price: 5,
            material: 'iron_ingot',
            icon: 'textures/blocks/planks_oak',
            buy: { type: 'slider', amount: 8, another_item_data: `0 ${CAN_PLACE}` }
        },
        {
            id: 'ladder',
            price: 5,
            material: 'iron_ingot',
            icon: 'textures/blocks/ladder',
            buy: { type: 'slider', amount: 4, another_item_data: `0 ${CAN_PLACE}` }
        },
        {
            id: 'web',
            price: 3,
            material: 'gold_ingot',
            buy: { type: 'slider', amount: 1, another_item_data: `0 ${CAN_PLACE}` }
        },
        {
            id: 'obsidian',
            price: 4,
            material: 'amethyst_shard',
            buy: { type: 'slider', amount: 1, another_item_data: `0 ${CAN_PLACE}` }
        }
    ],
    4: [
        {
            id: 'chest',
            price: 4,
            name: '%tile.chest.name',
            material: 'iron_ingot',
            icon: 'textures/blocks/chest_front',
            buy: { type: 'item' }
        },
        {
            id: 'snowball',
            price: 3,
            material: 'gold_ingot',
            buy: { type: 'slider', amount: 2 }
        },
        {
            id: 'feather',
            name: '%item.feather.name (%enchantment.knockback)',
            price: 3,
            icon: 'textures/items/feather',
            material: 'amethyst_shard',
            buy: { type: 'slider', amount: 1 }
        },
        {
            id: 'ender_pearl',
            price: 6,
            material: 'amethyst_shard',
            buy: { type: 'slider', amount: 1 }
        },
        {
            id: 'gold_ingot',
            price: 1,
            material: 'amethyst_shard',
            buy: { type: 'slider', amount: 3 }
        },
        {
            id: 'iron_ingot',
            price: 1,
            material: 'gold_ingot',
            buy: { type: 'slider', amount: 3 }
        },
        {
            id: 'potion',
            name: '%potion.jump.name (%enchantment.level.2)',
            price: 4,
            material: 'amethyst_shard',
            icon: 'textures/items/potion_bottle_jump',
            buy: { type: 'item', itemId: 11 }
        },
        {
            id: 'potion',
            name: '%potion.damageBoost.name (%enchantment.level.2)',
            price: 4,
            material: 'amethyst_shard',
            icon: 'textures/items/potion_bottle_damageBoost',
            buy: { type: 'item', itemId: 33 }
        },
        {
            id: 'potion',
            name: '%potion.moveSpeed.name (%enchantment.level.2)',
            price: 4,
            material: 'amethyst_shard',
            icon: 'textures/items/potion_bottle_moveSpeed',
            buy: { type: 'item', itemId: 16 }
        }
    ],
    5: [
        {
            id: 'wooden_pickaxe',
            name: '%item.wooden_pickaxe.name',
            price: 4,
            material: 'copper_ingot',
            icon: 'textures/items/wood_pickaxe',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'stone_pickaxe',
            name: '%item.stone_pickaxe.name',
            price: 4,
            material: 'iron_ingot',
            icon: 'textures/items/stone_pickaxe',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'iron_pickaxe',
            name: '%item.iron_pickaxe.name',
            price: 5,
            material: 'gold_ingot',
            icon: 'textures/items/iron_pickaxe',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'diamond_pickaxe',
            name: '%item.diamond_pickaxe.name',
            price: 4,
            material: 'amethyst_shard',
            icon: 'textures/items/diamond_pickaxe',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'netherite_pickaxe',
            name: '%item.netherite_pickaxe.name',
            price: 6,
            material: 'amethyst_shard',
            icon: 'textures/items/netherite_pickaxe',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'iron_axe',
            name: '%item.iron_axe.name',
            price: 6,
            material: 'gold_ingot',
            icon: 'textures/items/iron_axe',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'diamond_axe',
            name: '%item.diamond_axe.name',
            price: 6,
            material: 'amethyst_shard',
            icon: 'textures/items/diamond_axe',
            buy: { type: 'item', components: CAN_DESTROY }
        },
        {
            id: 'netherite_axe',
            name: '%item.netherite_axe.name',
            price: 8,
            material: 'amethyst_shard',
            icon: 'textures/items/netherite_axe',
            buy: { type: 'item', components: CAN_DESTROY }
        }
    ]
};
function check_res(check_res_count, check_res_price, check_res_if = '', check_res_else = '§c') {
    if (check_res_count >= check_res_price) {
        return check_res_if;
    }
    else {
        return check_res_else;
    }
}
/**
 * @param {import("@minecraft/server").Player} player
*/
export function formBWshop(player, linkto = 0, comment = '') {
    let name = player.name;
    let res_amounts = getItemAmounts(player, ["copper_ingot", "amethyst_shard", "gold_ingot", "iron_ingot", "echo_shard"]);
    //let current_res = `§6${res_amounts.copper_ingot} \ue186 §8${res_amounts.iron_ingot} \ue166 §g${res_amounts.gold_ingot} \ue165 §5${res_amounts.amethyst_shard} \ue167 §t${res_amounts.echo_shard} \ue168`
    let current_res = `§6${res_amounts.copper_ingot} ${UNICODES['copper_ingot']} §8${res_amounts.iron_ingot} ${UNICODES['iron_ingot']} §g${res_amounts.gold_ingot} ${UNICODES['gold_ingot']} §u${res_amounts.amethyst_shard} ${UNICODES['amethyst_shard']}`;
    if (comment != '') {
        current_res = `${comment}\n${current_res}`;
    }
    switch (linkto) {
        case 0:
            playsound('mob.villager.haggle', player);
            const shopCategories = new ActionFormData()
                .title("%axiscube.bw.shop")
                .body(current_res)
                .button("%howtoplay.weapons", "textures/items/gold_sword")
                .button("%howtoplay.armor", "textures/items/chainmail_chestplate")
                .button("%howtoplay.blocks", "textures/blocks/wool_colored_white")
                .button("%axiscube.bw.shop.other", "textures/items/potion_bottle_moveSpeed")
                .button("%axiscube.bw.shop.tools", "textures/items/potion_bottle_moveSpeed");
            //.button("%axiscube.bw.shop.upgrade", "textures/items/echo_shard")
            shopCategories.show(player).then(gg => {
                if (gg.selection != undefined) {
                    formBWshop(player, gg.selection + 1);
                }
            });
            break;
        default:
            if (comment == '') {
                if (linkto == 1) {
                    playsound('smithing_table.use', player);
                }
                else if (linkto == 2) {
                    playsound('armor.equip_leather', player);
                }
                else if (linkto == 3) {
                    playsound('use.ancient_debris', player);
                }
                else if (linkto == 4) {
                    playsound('random.potion.brewed', player);
                }
            }
            let clickedCategory = bwShopData[linkto];
            const formOfClickedCategory = new ActionFormData()
                .title("%axiscube.bw.shop")
                .body(current_res)
                .button('%gui.back', ICONS.back);
            for (let i in clickedCategory) {
                let thisButton = clickedCategory[i];
                let itemIcon = thisButton.icon;
                let itemName = thisButton.name;
                if (itemIcon)
                    itemIcon = itemIcon.replaceAll('{{TEAM}}', getPlayerTeam(player));
                if (itemName)
                    itemName = itemName.replaceAll('{{TEAM}}', getPlayerTeam(player));
                if (itemIcon == undefined && linkto == 3) {
                    itemIcon = `textures/blocks/${thisButton.id}`;
                }
                else if (itemIcon == undefined) {
                    itemIcon = `textures/items/${thisButton.id}`;
                }
                if (itemName == undefined && linkto == 3) {
                    itemName = `%tile.${thisButton.id}.name`;
                }
                else if (itemName == undefined) {
                    itemName = `%item.${thisButton.id}.name`;
                }
                if (thisButton.buy.amount != undefined) {
                    itemName = `${itemName} (x${thisButton.buy.amount})`;
                }
                formOfClickedCategory.button(`${check_res(res_amounts[thisButton.material], thisButton.price)}${itemName}\n §l${COLORS[thisButton.material]} ${thisButton.price} §r${UNICODES[thisButton.material]}`, itemIcon);
            }
            formOfClickedCategory.show(player).then(async (gg) => {
                if (gg.selection == 0) {
                    formBWshop(player, 0);
                }
                else if (gg.selection != undefined) {
                    let clickedItem = clickedCategory[gg.selection - 1];
                    let comment = '';
                    if (res_amounts[clickedItem.material] >= clickedItem.price) {
                        let resToClear = clickedItem.price;
                        switch (clickedItem.buy.type) {
                            case 'structure':
                                await runCMD(`structure load ${clickedItem.buy.value} ~~~`, name);
                                break;
                            case 'item':
                                let itemTypeName = clickedItem.buy.value;
                                if (itemTypeName == undefined) {
                                    itemTypeName = clickedItem.id;
                                }
                                let forRun = `give "${name}" ${itemTypeName}`;
                                // ${clickedItem.buy.amount} ${clickedItem.buy.itemId} ${clickedItem.buy.components}
                                if (clickedItem.buy.amount != undefined) {
                                    forRun = `${forRun} ${clickedItem.buy.amount}`;
                                }
                                else {
                                    forRun = `${forRun} 1`;
                                }
                                if (clickedItem.buy.itemId != undefined) {
                                    forRun = `${forRun} ${clickedItem.buy.itemId}`;
                                }
                                else {
                                    forRun = `${forRun} 0`;
                                }
                                if (clickedItem.buy.components != undefined) {
                                    forRun = `${forRun} ${clickedItem.buy.components}`;
                                }
                                await runCMD(forRun);
                                break;
                            case 'cmds':
                                runCMDs(clickedItem.buy.value[i], name);
                                break;
                            case 'eval':
                                clickedItem.buy.value(player);
                                break;
                            case 'slider':
                                let item_max = (res_amounts[clickedItem.material]) / (clickedItem.price);
                                let item_bill = Math.floor(item_max);
                                item_bill = item_bill * (clickedItem.price);
                                item_max = Math.floor(item_max);
                                item_max = (clickedItem.buy.amount) * item_max;
                                let itemName = clickedItem.name;
                                if (itemName == undefined && linkto == 3) {
                                    itemName = `%tile.${clickedItem.id}.name`;
                                }
                                else if (itemName == undefined) {
                                    itemName = `%item.${clickedItem.id}.name`;
                                }
                                const bw_shop_sliderform = new ModalFormData()
                                    .title('%skins.buy.buyButton')
                                    //.slider(`${itemName}`, 10, 1000, 10, 10)
                                    .slider(`${itemName.replaceAll('{{TEAM}}', getPlayerTeam(player))}`, clickedItem.buy.amount, item_max, clickedItem.buy.amount, clickedItem.buy.amount);
                                await bw_shop_sliderform.show(player).then(gg => {
                                    let [item_count] = gg.formValues;
                                    resToClear = item_count / (clickedItem.buy.amount) * (clickedItem.price);
                                    let another_item_data = clickedItem.buy.another_item_data;
                                    if (another_item_data == undefined) {
                                        another_item_data = '';
                                    }
                                    runCMD(`give "${name}" ${clickedItem.id.replaceAll('{{TEAM}}', getPlayerTeam(player))} ${item_count} ${another_item_data}`);
                                });
                                break;
                        }
                        playsound('mob.villager.yes', name);
                        await runCMD(`clear "${name}" ${clickedItem.material} -1 ${resToClear}`);
                        comment = '§a%axiscube.bw.shop.good_deal';
                    }
                    else {
                        playsound('mob.villager.no', name);
                        comment = '§c%axiscube.bw.shop.no_res';
                    }
                    formBWshop(player, linkto, comment);
                }
            });
            break;
    }
}
