import { EquipmentSlot, ItemStack, system, world, EntityComponentTypes, Dimension } from "@minecraft/server"
import { COPYRIGHT, SYM } from "../../const"
import { edScore, getScore, hasTag, isPlayerinArea, playsound, powerTP, runCMD, runCMDs, sleep, tellraw } from "../../modules/axisTools"
import { GAMEDATA } from "../gamedata"
import { getGameArena, startGame, startTimer, stopGame } from "../main"
import { TEAMS2, getPlayerTeam, teamArray } from "../category_team"
import { MT_GAMES } from "../../modules/MultiTasking/instances"

export const GAMEDATA_FW_BRIDGES = { // fw_bridges READY FOR 1.5    
    id: 9,
    namespace: 'fw_bridges',
    min_players: 1,
    tags: [
        'fw_bridges',
        'fw_bridges.member',
        'fw_bridges.winnerteam',
        'fw_bridges.void',
        'blue',
        'red'
    ],
    team_data: {
        teams: TEAMS2,
        spectator: true,
        icons: 'heads',
        color_name: true
    },
    confirm_begin: {
        0: {
            warn_message: 'axiscube.games.startgame.confirm.d_line2.team',
            check: false//'teamcheck'
        }
    },
    loc: {
        0: { //Ready for 1.5
            gameplay: false,
            spawn: { type: 'range', value: [ [ 3027, 3011 ], [ 57, 57 ], [ 1016, 1000 ] ] },
            newplayer: '3018 57 1008',

            cleardata: {
                1: [ { x: 3085, y: -25, z:1043 }, { x: 2952, y: -25, z:973 } ],
            },
            level_low: -25,
            level_high: 55,

            red_hole: [[3057, 3, 1006],[3053, 1, 1010]],
            blue_hole: [[2984, 3, 1010],[2980, 1, 1006]]
        }
    },
    ends: {
        team_blue_win: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"TEAM BLUE WIN"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 150, 'target': '@a[tag=team.blue]'}]
        },
        team_red_win: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"TEAM RED WIN"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 150, 'target': '@a[tag=team.red]'}]
        },
        no_time: {
            msg: `{"rawtext":[{"translate":"axiscube.games.game_over.generic.one_team","with":{"rawtext":[{"translate":"$<WINNER_TEAM>"},{"text":"+100${SYM}"}]}}]}`,
            cmd : [{'type':'money','sum': 100, 'target': '@a[tag=fw_bridges.member]'}]
        },
    },
    joinable: {
        can_join: false,
        prebegin_commands: [],
    },
    time: {
        value: 500,
        tick_function: bridgeTick,
        xp: true,
        events: {}
    },
    start_commands: [
        () => {bridgeClear()},
        () => {bridgePrepair()},
        { type: 'lockslot', slot: 1, item: 'axiscube:begin_game' },
        { type: 'lockslot', slot: 9, item: 'axiscube:cancel_game' },
        { type: 'lockslot', slot: 5, item: 'axiscube:team_selection' },
    ],
    begin_commands: bridgeBegin,
    death_data: {
        death_commands: bridgeDeath
    },
    stop_commands: bridgeStop,
    boards: [
        ['fw_bridges.display', '\ue190§c %axiscube.fw_bridges.name', true],
    ]
}


const teams_info = {
    'blue': {
        spawn: {x:2994,y:8.5,z:1008},
        focus: "3055 6 1008",
        armor: {
            head: new ItemStack('axiscube:blue_leather_helmet'),
            chest: new ItemStack('axiscube:blue_leather_chestplate')
        },
    },
    'red': {
        spawn: {x:3043,y:8.5,z:1008},
        focus: "2982 6 1008",
        armor: {
            head: new ItemStack('axiscube:red_leather_helmet'),
            chest: new ItemStack('axiscube:red_leather_chestplate')
        }
    }
}
const BRIDGE_BLOCKS = [
    'blue_concrete',
    'red_concrete'
]

const BRIDGE_TEAMSCORES = {
    'red': 'red_command',
    'blue': 'blue_command'
}

export async function bridgeClear(){
    try{
        const clearData = GAMEDATA[9].loc[getGameArena()].cleardata
        const levelLow = GAMEDATA[9].loc[getGameArena()].level_low
        const levelHigh = GAMEDATA[9].loc[getGameArena()].level_high

        
        for(let d = 1; d<=Object.keys(clearData).length; d++){
            if (clearData.hasOwnProperty(d)){
                await runCMD(`tickingarea add ${clearData[d][0].x} ${clearData[d][0].y} ${clearData[d][0].z} ${clearData[d][1].x} ${clearData[d][1].y} ${clearData[d][1].z} flagw_bridges_${d} true`,undefined,true)
            }
        }
        runCMD('kill @e[type=item]')
        // SUPERCLEAN Systems v1 by Axiscube Inc. 
        for(let y = levelLow-1; y<=levelHigh;y+=2){
            for(let d = 1; d<=Object.keys(clearData).length; d++){
                if (clearData.hasOwnProperty(d)){
                    for(const block of BRIDGE_BLOCKS){
                        await sleep(2)
                        // clearData[d][0].y=y
                        // clearData[d][1].y=y+2
                        // DIM.fillBlocks(clearData[d][0],clearData[d][1],MinecraftBlockTypes.air,{matchingBlock:BlockPermutation.resolve(`minecraft:${block}`,{})})
                        runCMD(`fill ${clearData[d][0].x} ${y} ${clearData[d][0].z} ${clearData[d][1].x} ${y+2} ${clearData[d][1].z} air replace ${block}`, undefined,true)
                    }
                }
            }
        }
        return 0
    }catch(e){console.warn(e)}
}

let points = 7
async function bridgePrepair(){
    const teams = teamArray()
    edScore(COPYRIGHT,'fw_bridges.display',0)
    for (let i in teams) {
        const team = teams[i]
        edScore(`${BRIDGE_TEAMSCORES[team]}`,'fw_bridges.display',(Number(i)+1)*2)
        edScore(`§${i}`,'fw_bridges.display',(Number(i)+1)*2-1)
    }

    edScore('fw_br_red','data.gametemp',points)
    edScore('fw_br_blue','data.gametemp',points)
    //startTimer(9)
}


let all_blocks = `{"minecraft:can_place_on": {"blocks": ["acacia_button", "acacia_door", "acacia_fence", "acacia_fence_gate", "acacia_hanging_sign", "acacia_log", "acacia_pressure_plate", "acacia_stairs", "acacia_standing_sign", "acacia_trapdoor", "acacia_wall_sign", "activator_rail", "air", "allow", "amethyst_block", "amethyst_cluster", "ancient_debris", "andesite_stairs", "anvil", "azalea", "azalea_leaves", "azalea_leaves_flowered", "bamboo", "bamboo_block", "bamboo_button", "bamboo_door", "bamboo_double_slab", "bamboo_fence", "bamboo_fence_gate", "bamboo_hanging_sign", "bamboo_mosaic", "bamboo_mosaic_double_slab", "bamboo_mosaic_slab", "bamboo_mosaic_stairs", "bamboo_planks", "bamboo_pressure_plate", "bamboo_sapling", "bamboo_slab", "bamboo_stairs", "bamboo_standing_sign", "bamboo_trapdoor", "bamboo_wall_sign", "barrel", "barrier", "basalt", "beacon", "bed", "bedrock", "bee_nest", "beehive", "beetroot", "bell", "big_dripleaf", "birch_button", "birch_door", "birch_fence", "birch_fence_gate", "birch_hanging_sign", "birch_log", "birch_pressure_plate", "birch_stairs", "birch_standing_sign", "birch_trapdoor", "birch_wall_sign", "black_candle", "black_candle_cake", "black_carpet", "black_concrete", "black_glazed_terracotta", "black_shulker_box", "black_wool", "blackstone", "blackstone_double_slab", "blackstone_slab", "blackstone_stairs", "blackstone_wall", "blast_furnace", "blue_candle", "blue_candle_cake", "blue_carpet", "blue_concrete", "blue_glazed_terracotta", "blue_ice", "blue_shulker_box", "blue_wool", "bone_block", "bookshelf", "border_block", "brain_coral", "brewing_stand", "brick_block", "brick_stairs", "brown_candle", "brown_candle_cake", "brown_carpet", "brown_concrete", "brown_glazed_terracotta", "brown_mushroom", "brown_mushroom_block", "brown_shulker_box", "brown_wool", "bubble_column", "bubble_coral", "budding_amethyst", "cactus", "cake", "calcite", "calibrated_sculk_sensor", "camera", "campfire", "candle", "candle_cake", "carpet", "carrots", "cartography_table", "carved_pumpkin", "cauldron", "cave_vines", "cave_vines_body_with_berries", "cave_vines_head_with_berries", "chain", "chain_command_block", "cherry_button", "cherry_door", "cherry_double_slab", "cherry_fence", "cherry_fence_gate", "cherry_hanging_sign", "cherry_leaves", "cherry_log", "cherry_planks", "cherry_pressure_plate", "cherry_sapling", "cherry_slab", "cherry_stairs", "cherry_standing_sign", "cherry_trapdoor", "cherry_wall_sign", "cherry_wood", "chest", "chiseled_bookshelf", "chiseled_deepslate", "chiseled_nether_bricks", "chiseled_polished_blackstone", "chorus_flower", "chorus_plant", "clay", "coal_block", "coal_ore", "cobbled_deepslate", "cobbled_deepslate_double_slab", "cobbled_deepslate_slab", "cobbled_deepslate_stairs", "cobbled_deepslate_wall", "cobblestone", "cobblestone_wall", "cocoa", "command_block", "composter", "concrete", "concretePowder", "conduit", "copper_block", "copper_ore", "coral", "coral_block", "coral_fan", "coral_fan_dead", "coral_fan_hang", "coral_fan_hang2", "coral_fan_hang3", "cracked_deepslate_bricks", "cracked_deepslate_tiles", "cracked_nether_bricks", "cracked_polished_blackstone_bricks", "crafting_table", "crimson_button", "crimson_door", "crimson_double_slab", "crimson_fence", "crimson_fence_gate", "crimson_fungus", "crimson_hanging_sign", "crimson_hyphae", "crimson_nylium", "crimson_planks", "crimson_pressure_plate", "crimson_roots", "crimson_slab", "crimson_stairs", "crimson_standing_sign", "crimson_stem", "crimson_trapdoor", "crimson_wall_sign", "crying_obsidian", "cut_copper", "cut_copper_slab", "cut_copper_stairs", "cyan_candle", "cyan_candle_cake", "cyan_carpet", "cyan_concrete", "cyan_glazed_terracotta", "cyan_shulker_box", "cyan_wool", "dark_oak_button", "dark_oak_door", "dark_oak_fence", "dark_oak_fence_gate", "dark_oak_hanging_sign", "dark_oak_log", "dark_oak_pressure_plate", "dark_oak_stairs", "dark_oak_trapdoor", "dark_prismarine_stairs", "darkoak_standing_sign", "darkoak_wall_sign", "daylight_detector", "daylight_detector_inverted", "dead_brain_coral", "dead_bubble_coral", "dead_fire_coral", "dead_horn_coral", "dead_tube_coral", "deadbush", "decorated_pot", "deepslate", "deepslate_brick_double_slab", "deepslate_brick_slab", "deepslate_brick_stairs", "deepslate_brick_wall", "deepslate_bricks", "deepslate_coal_ore", "deepslate_copper_ore", "deepslate_diamond_ore", "deepslate_emerald_ore", "deepslate_gold_ore", "deepslate_iron_ore", "deepslate_lapis_ore", "deepslate_redstone_ore", "deepslate_tile_double_slab", "deepslate_tile_slab", "deepslate_tile_stairs", "deepslate_tile_wall", "deepslate_tiles", "deny", "detector_rail", "diamond_block", "diamond_ore", "diorite_stairs", "dirt", "dirt_with_roots", "dispenser", "double_cut_copper_slab", "double_plant", "double_stone_slab", "double_stone_slab2", "double_stone_slab3", "double_stone_slab4", "double_wooden_slab", "dragon_egg", "dried_kelp_block", "dripstone_block", "dropper", "emerald_block", "emerald_ore", "enchanting_table", "end_brick_stairs", "end_bricks", "end_gateway", "end_portal", "end_portal_frame", "end_rod", "end_stone", "ender_chest", "exposed_copper", "exposed_cut_copper", "exposed_cut_copper_slab", "exposed_cut_copper_stairs", "exposed_double_cut_copper_slab", "farmland", "fence", "fence_gate", "fire", "fire_coral", "fletching_table", "flower_pot", "flowering_azalea", "flowing_lava", "flowing_water", "frame", "frog_spawn", "frosted_ice", "furnace", "gilded_blackstone", "glass", "glass_pane", "glow_frame", "glow_lichen", "glowingobsidian", "glowstone", "gold_block", "gold_ore", "golden_rail", "granite_stairs", "grass", "grass_path", "gravel", "gray_candle", "gray_candle_cake", "gray_carpet", "gray_concrete", "gray_glazed_terracotta", "gray_shulker_box", "gray_wool", "green_candle", "green_candle_cake", "green_carpet", "green_concrete", "green_glazed_terracotta", "green_shulker_box", "green_wool", "grindstone", "hanging_roots", "hardened_clay", "hay_block", "heavy_weighted_pressure_plate", "honey_block", "honeycomb_block", "hopper", "horn_coral", "ice", "infested_deepslate", "info_update", "info_update2", "invisibleBedrock", "iron_bars", "iron_block", "iron_door", "iron_ore", "iron_trapdoor", "jigsaw", "jukebox", "jungle_button", "jungle_door", "jungle_fence", "jungle_fence_gate", "jungle_hanging_sign", "jungle_log", "jungle_pressure_plate", "jungle_stairs", "jungle_standing_sign", "jungle_trapdoor", "jungle_wall_sign", "kelp", "ladder", "lantern", "lapis_block", "lapis_ore", "large_amethyst_bud", "lava", "lava_cauldron", "leaves", "leaves2", "lectern", "lever", "light_block", "light_blue_candle", "light_blue_candle_cake", "light_blue_carpet", "light_blue_concrete", "light_blue_glazed_terracotta", "light_blue_shulker_box", "light_blue_wool", "light_gray_candle", "light_gray_candle_cake", "light_gray_carpet", "light_gray_concrete", "light_gray_shulker_box", "light_gray_wool", "light_weighted_pressure_plate", "lightning_rod", "lime_candle", "lime_candle_cake", "lime_carpet", "lime_concrete", "lime_glazed_terracotta", "lime_shulker_box", "lime_wool", "lit_blast_furnace", "lit_deepslate_redstone_ore", "lit_furnace", "lit_pumpkin", "lit_redstone_lamp", "lit_redstone_ore", "lit_smoker", "lodestone", "log", "log2", "loom", "magenta_candle", "magenta_candle_cake", "magenta_carpet", "magenta_concrete", "magenta_glazed_terracotta", "magenta_shulker_box", "magenta_wool", "magma", "mangrove_button", "mangrove_door", "mangrove_double_slab", "mangrove_fence", "mangrove_fence_gate", "mangrove_hanging_sign", "mangrove_leaves", "mangrove_log", "mangrove_planks", "mangrove_pressure_plate", "mangrove_propagule", "mangrove_roots", "mangrove_slab", "mangrove_stairs", "mangrove_standing_sign", "mangrove_trapdoor", "mangrove_wall_sign", "mangrove_wood", "medium_amethyst_bud", "melon_block", "melon_stem", "mob_spawner", "monster_egg", "moss_block", "moss_carpet", "mossy_cobblestone", "mossy_cobblestone_stairs", "mossy_stone_brick_stairs", "movingBlock", "mud", "mud_brick_double_slab", "mud_brick_slab", "mud_brick_stairs", "mud_brick_wall", "mud_bricks", "muddy_mangrove_roots", "mycelium", "nether_brick", "nether_brick_fence", "nether_brick_stairs", "nether_gold_ore", "nether_sprouts", "nether_wart", "nether_wart_block", "netherite_block", "netherrack", "netherreactor", "normal_stone_stairs", "noteblock", "oak_fence", "oak_hanging_sign", "oak_log", "oak_stairs", "observer", "obsidian", "ochre_froglight", "orange_candle", "orange_candle_cake", "orange_carpet", "orange_concrete", "orange_glazed_terracotta", "orange_shulker_box", "orange_wool", "oxidized_copper", "oxidized_cut_copper", "oxidized_cut_copper_slab", "oxidized_cut_copper_stairs", "oxidized_double_cut_copper_slab", "packed_ice", "packed_mud", "pearlescent_froglight", "pink_candle", "pink_candle_cake", "pink_carpet", "pink_concrete", "pink_glazed_terracotta", "pink_petals", "pink_shulker_box", "pink_wool", "piston", "pistonArmCollision", "pitcher_crop", "pitcher_plant", "planks", "podzol", "pointed_dripstone", "polished_andesite_stairs", "polished_basalt", "polished_blackstone", "polished_blackstone_brick_double_slab", "polished_blackstone_brick_slab", "polished_blackstone_brick_stairs", "polished_blackstone_brick_wall", "polished_blackstone_bricks", "polished_blackstone_button", "polished_blackstone_double_slab", "polished_blackstone_pressure_plate", "polished_blackstone_slab", "polished_blackstone_stairs", "polished_blackstone_wall", "polished_deepslate", "polished_deepslate_double_slab", "polished_deepslate_slab", "polished_deepslate_stairs", "polished_deepslate_wall", "polished_diorite_stairs", "polished_granite_stairs", "portal", "potatoes", "powder_snow", "powered_comparator", "powered_repeater", "prismarine", "prismarine_bricks_stairs", "prismarine_stairs", "pumpkin", "pumpkin_stem", "purple_candle", "purple_candle_cake", "purple_carpet", "purple_concrete", "purple_glazed_terracotta", "purple_shulker_box", "purple_wool", "purpur_block", "purpur_stairs", "quartz_block", "quartz_bricks", "quartz_ore", "quartz_stairs", "rail", "raw_copper_block", "raw_gold_block", "raw_iron_block", "red_candle", "red_candle_cake", "red_carpet", "red_concrete", "red_flower", "red_glazed_terracotta", "red_mushroom", "red_mushroom_block", "red_nether_brick", "red_nether_brick_stairs", "red_sandstone", "red_sandstone_stairs", "red_shulker_box", "red_wool", "redstone_block", "redstone_lamp", "redstone_ore", "redstone_torch", "redstone_wire", "reeds", "reinforced_deepslate", "repeating_command_block", "reserved6", "respawn_anchor", "sand", "sandstone", "sandstone_stairs", "sapling", "scaffolding", "sculk", "sculk_catalyst", "sculk_sensor", "sculk_shrieker", "sculk_vein", "seaLantern", "sea_pickle", "seagrass", "shroomlight", "shulker_box", "silver_glazed_terracotta", "skull", "slime", "small_amethyst_bud", "small_dripleaf_block", "smithing_table", "smoker", "smooth_basalt", "smooth_quartz_stairs", "smooth_red_sandstone_stairs", "smooth_sandstone_stairs", "smooth_stone", "sniffer_egg", "snow", "snow_layer", "soul_campfire", "soul_fire", "soul_lantern", "soul_sand", "soul_soil", "soul_torch", "sponge", "spore_blossom", "spruce_button", "spruce_door", "spruce_fence", "spruce_fence_gate", "spruce_hanging_sign", "spruce_log", "spruce_pressure_plate", "spruce_stairs", "spruce_standing_sign", "spruce_trapdoor", "spruce_wall_sign", "stained_glass", "stained_glass_pane", "stained_hardened_clay", "standing_banner", "standing_sign", "stickyPistonArmCollision", "sticky_piston", "stone", "stone_brick_stairs", "stone_button", "stone_pressure_plate", "stone_slab", "stone_slab2", "stone_slab3", "stone_slab4", "stone_stairs", "stonebrick", "stonecutter", "stonecutter_block", "stripped_acacia_log", "stripped_bamboo_block", "stripped_birch_log", "stripped_cherry_log", "stripped_cherry_wood", "stripped_crimson_hyphae", "stripped_crimson_stem", "stripped_dark_oak_log", "stripped_jungle_log", "stripped_mangrove_log", "stripped_mangrove_wood", "stripped_oak_log", "stripped_spruce_log", "stripped_warped_hyphae", "stripped_warped_stem", "structure_block", "structure_void", "suspicious_gravel", "suspicious_sand", "sweet_berry_bush", "tallgrass", "target", "tinted_glass", "tnt", "torch", "torchflower", "torchflower_crop", "trapdoor", "trapped_chest", "tripWire", "tripwire_hook", "tube_coral", "tuff", "turtle_egg", "twisting_vines", "undyed_shulker_box", "unlit_redstone_torch", "unpowered_comparator", "unpowered_repeater", "verdant_froglight", "vine", "wall_banner", "wall_sign", "warped_button", "warped_door", "warped_double_slab", "warped_fence", "warped_fence_gate", "warped_fungus", "warped_hanging_sign", "warped_hyphae", "warped_nylium", "warped_planks", "warped_pressure_plate", "warped_roots", "warped_slab", "warped_stairs", "warped_standing_sign", "warped_stem", "warped_trapdoor", "warped_wall_sign", "warped_wart_block", "water", "waterlily", "waxed_copper", "waxed_cut_copper", "waxed_cut_copper_slab", "waxed_cut_copper_stairs", "waxed_double_cut_copper_slab", "waxed_exposed_copper", "waxed_exposed_cut_copper", "waxed_exposed_cut_copper_slab", "waxed_exposed_cut_copper_stairs", "waxed_exposed_double_cut_copper_slab", "waxed_oxidized_copper", "waxed_oxidized_cut_copper", "waxed_oxidized_cut_copper_slab", "waxed_oxidized_cut_copper_stairs", "waxed_oxidized_double_cut_copper_slab", "waxed_weathered_copper", "waxed_weathered_cut_copper", "waxed_weathered_cut_copper_slab", "waxed_weathered_cut_copper_stairs", "waxed_weathered_double_cut_copper_slab", "weathered_copper", "weathered_cut_copper", "weathered_cut_copper_slab", "weathered_cut_copper_stairs", "weathered_double_cut_copper_slab", "web", "weeping_vines", "wheat", "white_candle", "white_candle_cake", "white_carpet", "white_concrete", "white_glazed_terracotta", "white_shulker_box", "white_wool", "wither_rose", "wood", "wooden_button", "wooden_door", "wooden_pressure_plate", "wooden_slab", "wool", "yellow_candle", "yellow_candle_cake", "yellow_carpet", "yellow_concrete", "yellow_flower", "yellow_glazed_terracotta", "yellow_shulker_box", "yellow_wool"]}}`
async function bridgeEquipment(){
    let all_blocks = []
    try{
        for (const player of [...world.getPlayers()]) {
            if (!player.hasTag('spec')) {
                const equipment = player.getComponent('equippable')
                if(hasTag(player, 'team.blue')){
                    equipment.setEquipment(EquipmentSlot.Head, teams_info['blue'].armor.head);
                    equipment.setEquipment(EquipmentSlot.Chest, teams_info['blue'].armor.chest)

                    runCMDs([
                        `give @s iron_sword`,
                        `give @s bow`,
                        `give @s iron_pickaxe`,
                        `give @s blue_concrete 128 0 ${all_blocks}`,
                        `give @s arrow 64`,
                    ],player)
                }
                else if(hasTag(player, 'team.red')){
                    equipment.setEquipment(EquipmentSlot.Head, teams_info['red'].armor.head);
                    equipment.setEquipment(EquipmentSlot.Chest, teams_info['red'].armor.chest)

                    runCMDs([
                        `give @s iron_sword`,
                        `give @s bow`,
                        `give @s iron_pickaxe`,
                        `give @s red_concrete 128 0 ${all_blocks}`,
                        `give @s arrow 64`,
                    ],player)
                }
            }}
    }catch(e){'[Bridges]'+console.warn(e), console.warn(e.stack)}
}

async function bridgeOtherIterations(){
    try{
        for (const player of [...world.getPlayers()]) {
            if (!player.hasTag('spec')) {
                const red_spawn = teams_info.red.spawn
                const blue_spawn = teams_info.blue.spawn
                if(hasTag(player, 'team.blue')){
                    runCMD(`spawnpoint @s ${blue_spawn.x} ${blue_spawn.y} ${blue_spawn.z}`,player)
                    
                }
                else if(hasTag(player, 'team.red')){
                    runCMD(`spawnpoint @s ${red_spawn.x} ${red_spawn.y} ${red_spawn.z}`,player)
                }
            }}
    }catch(e){console.warn(e)}
}

async function bridgeBegin(){

    const red_team = teams_info.red
    const blue_team = teams_info.blue

    const blue_spawn = blue_team.spawn
    const red_spawn = red_team.spawn
    runCMD(`tp @a[tag=team.blue] ${blue_spawn.x} ${blue_spawn.y} ${blue_spawn.z} facing ${blue_team.focus}`)
    runCMD(`tp @a[tag=team.red] ${red_spawn.x} ${red_spawn.y} ${red_spawn.z} facing ${red_team.focus}`)

    information()
    bridgeOtherIterations()
    bridgeEquipment()
    runCMD(`gamemode s @a[tag=!spec]`)
    system.runTimeout(()=>{
        runCMD(`title @a actionbar \ue198 PVP Enabled`)
        runCMD(`gamerule pvp true`)
    },100)
}

async function bridgeTick(){
    for (const player of [...world.getPlayers()]) {

        if (!player.hasTag('spec')) {
            const isInRedHole = isPlayerinArea(GAMEDATA[9].loc[getGameArena()].red_hole[0], GAMEDATA[9].loc[getGameArena()].red_hole[1], player)
            const isInBlueHole = isPlayerinArea(GAMEDATA[9].loc[getGameArena()].blue_hole[0], GAMEDATA[9].loc[getGameArena()].blue_hole[1], player)
            const blue_team = getScore('fw_br_blue','data.gametemp')
            const red_team = getScore('fw_br_red','data.gametemp')
            if(isInBlueHole){HoleHandlers('blue',player)}
            if(isInRedHole){HoleHandlers('red',player)}

            if(blue_team == 0 && red_team != 0){await WinHandle('red')}
            else if(red_team == 0 && blue_team != 0){await WinHandle('blue')}
        }
    }
}
let info = 0

async function information(){
    info = system.runInterval(()=>{
        runCMD(`titleraw @a title {"rawtext":[{"text":"ud0\'${"fw_points"+"\n"+"\ue127".repeat(getScore('fw_br_blue','data.gametemp'))+"\ue12e".repeat(points-getScore('fw_br_blue','data.gametemp'))+"\n"+"\ue125".repeat(getScore('fw_br_red','data.gametemp'))+"\ue12e".repeat(points-getScore('fw_br_red','data.gametemp'))}\'"}]}`)
        //runCMD(`titleraw @a[tag=red] title {"rawtext":[{"text":"ud0\'${"\ue127".repeat(getScore('fw_br_red','data.gametemp'))}\'"}]}`)
    },10)
    MT_GAMES.register(info)
}

async function HoleHandlers(color, player){
    if(hasTag(player,'team.blue') && color == 'red'){
        let score = getScore('fw_br_red','data.gametemp')
        edScore('fw_br_red','data.gametemp', score-1)
        player.teleport(teams_info['blue'].spawn)
        //Sound
        runCMD(`particle minecraft:knockback_roar_particle ${teams_info.blue.focus}`) //Red hole
        playsound('random.levelup', '@a[tag=team.blue]',0.5,0.5)
        playsound('ambient.weather.thunder', '@a[tag=team.red]',0.5,0.5)

    }else if(hasTag(player,'team.red') && color == 'blue'){
        let score = getScore('fw_br_blue','data.gametemp')
        edScore('fw_br_blue','data.gametemp', score-1)
        player.teleport(teams_info['red'].spawn)
        //Sound
        runCMD(`particle minecraft:knockback_roar_particle ${teams_info.red.focus}`) //Blue hole
        playsound('random.levelup', '@a[tag=team.red]',0.5,0.5)
        playsound('ambient.weather.thunder', '@a[tag=team.blue]',0.5,0.5)
    }//Other

    else if(hasTag(player,'team.red') && color == 'red'){
        let score = getScore('fw_br_red','data.gametemp')
        edScore('fw_br_red','data.gametemp', score-1)
        player.teleport(teams_info['red'].spawn)
        //Sound
        runCMD(`particle minecraft:knockback_roar_particle ${teams_info.blue.focus}`) //Red hole
        playsound('random.levelup', '@a[tag=team.blue]',0.5,0.5)
        playsound('ambient.weather.thunder', '@a[tag=team.red]',0.5,0.5)
    }else if(hasTag(player,'team.blue') && color == 'blue'){
        let score = getScore('fw_br_blue','data.gametemp')
        edScore('fw_br_blue','data.gametemp', score-1)
        player.teleport(teams_info['blue'].spawn)
        //Sound
        runCMD(`particle minecraft:knockback_roar_particle ${teams_info.red.focus}`) //Blue hole
        playsound('random.levelup', '@a[tag=team.red]',0.5,0.5)
        playsound('ambient.weather.thunder', '@a[tag=team.blue]',0.5,0.5)
    }
}
async function WinHandle(command){
    stopGame(9, `team_${command}_win`)
}

async function bridgeDeath(player){
    runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§c"},{"translate":"axiscube.bw.dead.t"}]}`,player)
    runCMD('gamemode spectator',player)
    system.runTimeout(() => {
        playsound('random.click',player)
        runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${3}"]}]}`,player)
    },20)
    system.runTimeout(() => {
        playsound('random.click',player)
        runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${2}"]}]}`,player)
    },40)
    system.runTimeout(() => {
        playsound('random.click',player)
        runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${1}"]}]}`,player)
    },60)
    system.runTimeout(()=>{
        playsound('random.click',player)
        runCMD(`titleraw @s actionbar {"rawtext":[{"text":"§r"},{"translate":"axiscube.bw.dead.respawn","with":["${0}"]}]}`,player)
        runCMD(`gamemode a @s`,player)
        player.teleport(teams_info[getPlayerTeam(player)].spawn)
    },80)
    
}

async function bridgeStop(){
    runCMD(`say stopped`)
    try{
        MT_GAMES.kill()
    }catch(e){console.warn(e,info)}
    runCMD(`title @a title ud0""`)
}
