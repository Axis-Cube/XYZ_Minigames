import { world } from "@minecraft/server";
import { getScore } from "modules/axisTools";
export const DB_A = '%';
export const map_id = getScore('map_id', 'settings');
export const SYM = '\ue131';
export const SCOLOR = '§u';
export const COPYRIGHT = '§bwww.mcxyz.ru';
export const MAP_NAME = '§l§cA§qxi§9s §4M§ci§6n§gi §eG§aa§bm§9e§us§r';
export const MINECRAFT_PICKAXES = ['wooden_pickaxe', 'stone_pickaxe', 'iron_pickaxe', 'diamond_pickaxe', 'netherite_pickaxe'];
export const MINECRAFT_DIFFICULTIES = ['peaceful', 'easy', 'normal', 'hard'];
export const MINECRAFT_DIFFICULTIES_NAME = ['%options.difficulty.peaceful', '%options.difficulty.easy', '%options.difficulty.normal', '%options.difficulty.hard'];
export const DIM = world.getDimension('overworld');
export const CHAT_CODES = {
    cat: '\ue1e0',
    pepe: '\ue1e1',
    peped: '\ue1e2',
    sym: SYM,
    s: '§',
    nerd: '\ue1e3'
};
export const DATABASE_IDS = {
    settings_perm: 2001,
    bw_settings: 1005,
};
export const CHAT_CODES_AV = {
    pepe: true,
    peped: true,
};
export const REGION_CODES = [
    "UN", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AN", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CS", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"
];
export const REGION_NAMES = {
    UN: "the Earth", AF: "Afghanistan", AX: "Aland Islands", AL: "Albania", DZ: "Algeria", AS: "American Samoa", AD: "Andorra", AO: "Angola", AI: "Anguilla", AQ: "Antarctica", AG: "Antigua and Barbuda", AR: "Argentina", AM: "Armenia", AW: "Aruba", AU: "Australia", AT: "Austria", AZ: "Azerbaijan", BS: "Bahamas", BH: "Bahrain", BD: "Bangladesh", BB: "Barbados", BY: "Belarus", BE: "Belgium", BZ: "Belize", BJ: "Benin", BM: "Bermuda", BT: "Bhutan", BO: "Bolivia", BQ: "Bonaire, Sint Eustatius and Saba", BA: "Bosnia and Herzegovina", BW: "Botswana", BV: "Bouvet Island", BR: "Brazil", IO: "British Indian Ocean Territory", BN: "Brunei Darussalam", BG: "Bulgaria", BF: "Burkina Faso", BI: "Burundi", KH: "Cambodia", CM: "Cameroon", CA: "Canada", CV: "Cape Verde", KY: "Cayman Islands", CF: "Central African Republic", TD: "Chad", CL: "Chile", CN: "China", CX: "Christmas Island", CC: "Cocos (Keeling) Islands", CO: "Colombia", KM: "Comoros", CG: "Congo", CD: "Congo, Democratic Republic of the Congo", CK: "Cook Islands", CR: "Costa Rica", CI: "Cote D'Ivoire", HR: "Croatia", CU: "Cuba", CW: "Curacao", CY: "Cyprus", CZ: "Czech Republic", DK: "Denmark", DJ: "Djibouti", DM: "Dominica", DO: "Dominican Republic", EC: "Ecuador", EG: "Egypt", SV: "El Salvador", GQ: "Equatorial Guinea", ER: "Eritrea", EE: "Estonia", ET: "Ethiopia", FK: "Falkland Islands (Malvinas)", FO: "Faroe Islands", FJ: "Fiji", FI: "Finland", FR: "France", GF: "French Guiana", PF: "French Polynesia", TF: "French Southern Territories", GA: "Gabon", GM: "Gambia", GE: "Georgia", DE: "Germany", GH: "Ghana", GI: "Gibraltar", GR: "Greece", GL: "Greenland", GD: "Grenada", GP: "Guadeloupe", GU: "Guam", GT: "Guatemala", GG: "Guernsey", GN: "Guinea", GW: "Guinea-Bissau", GY: "Guyana", HT: "Haiti", HM: "Heard Island and Mcdonald Islands", VA: "Holy See (Vatican City State)", HN: "Honduras", HK: "Hong Kong", HU: "Hungary", IS: "Iceland", IN: "India", ID: "Indonesia", IR: "Iran, Islamic Republic of", IQ: "Iraq", IE: "Ireland", IM: "Isle of Man", IL: "Israel", IT: "Italy", JM: "Jamaica", JP: "Japan", JE: "Jersey", JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya", KI: "Kiribati", KP: "Korea, Democratic People's Republic of", KR: "Korea, Republic of", XK: "Kosovo", KW: "Kuwait", KG: "Kyrgyzstan", LA: "Lao People's Democratic Republic", LV: "Latvia", LB: "Lebanon", LS: "Lesotho", LR: "Liberia", LY: "Libyan Arab Jamahiriya", LI: "Liechtenstein", LT: "Lithuania", LU: "Luxembourg", MO: "Macao", MK: "Macedonia, the Former Yugoslav Republic of", MG: "Madagascar", MW: "Malawi", MY: "Malaysia", MV: "Maldives", ML: "Mali", MT: "Malta", MH: "Marshall Islands", MQ: "Martinique", MR: "Mauritania", MU: "Mauritius", YT: "Mayotte", MX: "Mexico", FM: "Micronesia, Federated States of", MD: "Moldova, Republic of", MC: "Monaco", MN: "Mongolia", ME: "Montenegro", MS: "Montserrat", MA: "Morocco", MZ: "Mozambique", MM: "Myanmar", NA: "Namibia", NR: "Nauru", NP: "Nepal", NL: "Netherlands", AN: "Netherlands Antilles", NC: "New Caledonia", NZ: "New Zealand", NI: "Nicaragua", NE: "Niger", NG: "Nigeria", NU: "Niue", NF: "Norfolk Island", MP: "Northern Mariana Islands", NO: "Norway", OM: "Oman", PK: "Pakistan", PW: "Palau", PS: "Palestinian Territory, Occupied", PA: "Panama", PG: "Papua New Guinea", PY: "Paraguay", PE: "Peru", PH: "Philippines", PN: "Pitcairn", PL: "Poland", PT: "Portugal", PR: "Puerto Rico", QA: "Qatar", RE: "Reunion", RO: "Romania", RU: "Russian Federation", RW: "Rwanda", BL: "Saint Barthelemy", SH: "Saint Helena", KN: "Saint Kitts and Nevis", LC: "Saint Lucia", MF: "Saint Martin", PM: "Saint Pierre and Miquelon", VC: "Saint Vincent and the Grenadines", WS: "Samoa", SM: "San Marino", ST: "Sao Tome and Principe", SA: "Saudi Arabia", SN: "Senegal", RS: "Serbia", CS: "Serbia and Montenegro", SC: "Seychelles", SL: "Sierra Leone", SG: "Singapore", SX: "Sint Maarten", SK: "Slovakia", SI: "Slovenia", SB: "Solomon Islands", SO: "Somalia", ZA: "South Africa", GS: "South Georgia and the South Sandwich Islands", SS: "South Sudan", ES: "Spain", LK: "Sri Lanka", SD: "Sudan", SR: "Suriname", SJ: "Svalbard and Jan Mayen", SZ: "Swaziland", SE: "Sweden", CH: "Switzerland", SY: "Syrian Arab Republic", TW: "Taiwan, Province of China", TJ: "Tajikistan", TZ: "Tanzania, United Republic of", TH: "Thailand", TL: "Timor-Leste", TG: "Togo", TK: "Tokelau", TO: "Tonga", TT: "Trinidad and Tobago", TN: "Tunisia", TR: "Turkey", TM: "Turkmenistan", TC: "Turks and Caicos Islands", TV: "Tuvalu", UG: "Uganda", UA: "Ukraine", AE: "United Arab Emirates", GB: "United Kingdom", US: "United States", UM: "United States Minor Outlying Islands", UY: "Uruguay", UZ: "Uzbekistan", VU: "Vanuatu", VE: "Venezuela", VN: "Viet Nam", VG: "Virgin Islands, British", VI: "Virgin Islands, U.s.", WF: "Wallis and Futuna", EH: "Western Sahara", YE: "Yemen", ZM: "Zambia", ZW: "Zimbabwe"
};

export const ICONS: any = {
    back: 'textures/ui/icons/action/back',
    del: 'textures/ui/icons/action/del',
    edit: 'textures/ui/icons/action/edit',
    add: 'textures/ui/icons/action/add',
    act: 'textures/ui/icons/action/act',
    den: 'textures/ui/icons/action/den',
    import: 'textures/ui/icons/action/import',
    export: 'textures/ui/icons/action/export',
    settings: 'textures/ui/icons/action/settings',
    customize: 'textures/ui/icons/action/customize',
    crown: 'textures/ui/icons/action/crown',
    decrown: 'textures/ui/icons/action/decrown',
    dice: 'textures/ui/icons/action/dice',
    pl3: 'textures/ui/icons/plr3',
    pl2: 'textures/ui/icons/plr2',
    pl1: 'textures/ui/icons/plr1',
    plsel: 'textures/ui/icons/plrsel',
    store: 'textures/ui/icons/store/logo',
    console: 'textures/ui/icons/console',
    default_plugin: 'textures/ui/icons/plugin'
};
export const upgradeItems = {
    material: [
        "minecraft:air",
        "minecraft:wooden",
        "minecraft:stone",
        "minecraft:golden",
        "minecraft:iron",
        "minecraft:diamond",
        "minecraft:netherite"
    ]
};
export const upgradeArmor = {
    material: [
        "minecraft:leather",
        "minecraft:golden",
        "minecraft:chainmail",
        "minecraft:iron",
        "minecraft:diamond",
        "minecraft:netherite"
    ]
};
export const allBlocks = `{"blocks": ["acacia_button", "acacia_door", "acacia_fence", "acacia_fence_gate", "acacia_hanging_sign", "acacia_log", "acacia_pressure_plate", "acacia_stairs", "acacia_standing_sign", "acacia_trapdoor", "acacia_wall_sign", "activator_rail", "air", "allow", "amethyst_block", "amethyst_cluster", "ancient_debris", "andesite_stairs", "anvil", "azalea", "azalea_leaves", "azalea_leaves_flowered", "bamboo", "bamboo_block", "bamboo_button", "bamboo_door", "bamboo_double_slab", "bamboo_fence", "bamboo_fence_gate", "bamboo_hanging_sign", "bamboo_mosaic", "bamboo_mosaic_double_slab", "bamboo_mosaic_slab", "bamboo_mosaic_stairs", "bamboo_planks", "bamboo_pressure_plate", "bamboo_sapling", "bamboo_slab", "bamboo_stairs", "bamboo_standing_sign", "bamboo_trapdoor", "bamboo_wall_sign", "barrel", "barrier", "basalt", "beacon", "bed", "bedrock", "bee_nest", "beehive", "beetroot", "bell", "big_dripleaf", "birch_button", "birch_door", "birch_fence", "birch_fence_gate", "birch_hanging_sign", "birch_log", "birch_pressure_plate", "birch_stairs", "birch_standing_sign", "birch_trapdoor", "birch_wall_sign", "black_candle", "black_candle_cake", "black_carpet", "black_concrete", "black_glazed_terracotta", "black_shulker_box", "black_wool", "blackstone", "blackstone_double_slab", "blackstone_slab", "blackstone_stairs", "blackstone_wall", "blast_furnace", "blue_candle", "blue_candle_cake", "blue_carpet", "blue_concrete", "blue_glazed_terracotta", "blue_ice", "blue_shulker_box", "blue_wool", "bone_block", "bookshelf", "border_block", "brain_coral", "brewing_stand", "brick_block", "brick_stairs", "brown_candle", "brown_candle_cake", "brown_carpet", "brown_concrete", "brown_glazed_terracotta", "brown_mushroom", "brown_mushroom_block", "brown_shulker_box", "brown_wool", "bubble_column", "bubble_coral", "budding_amethyst", "cactus", "cake", "calcite", "calibrated_sculk_sensor", "camera", "campfire", "candle", "candle_cake", "carpet", "carrots", "cartography_table", "carved_pumpkin", "cauldron", "cave_vines", "cave_vines_body_with_berries", "cave_vines_head_with_berries", "chain", "chain_command_block", "cherry_button", "cherry_door", "cherry_double_slab", "cherry_fence", "cherry_fence_gate", "cherry_hanging_sign", "cherry_leaves", "cherry_log", "cherry_planks", "cherry_pressure_plate", "cherry_sapling", "cherry_slab", "cherry_stairs", "cherry_standing_sign", "cherry_trapdoor", "cherry_wall_sign", "cherry_wood", "chest", "chiseled_bookshelf", "chiseled_deepslate", "chiseled_nether_bricks", "chiseled_polished_blackstone", "chorus_flower", "chorus_plant", "clay", "coal_block", "coal_ore", "cobbled_deepslate", "cobbled_deepslate_double_slab", "cobbled_deepslate_slab", "cobbled_deepslate_stairs", "cobbled_deepslate_wall", "cobblestone", "cobblestone_wall", "cocoa", "command_block", "composter", "concrete", "concretePowder", "conduit", "copper_block", "copper_ore", "coral", "coral_block", "coral_fan", "coral_fan_dead", "coral_fan_hang", "coral_fan_hang2", "coral_fan_hang3", "cracked_deepslate_bricks", "cracked_deepslate_tiles", "cracked_nether_bricks", "cracked_polished_blackstone_bricks", "crafting_table", "crimson_button", "crimson_door", "crimson_double_slab", "crimson_fence", "crimson_fence_gate", "crimson_fungus", "crimson_hanging_sign", "crimson_hyphae", "crimson_nylium", "crimson_planks", "crimson_pressure_plate", "crimson_roots", "crimson_slab", "crimson_stairs", "crimson_standing_sign", "crimson_stem", "crimson_trapdoor", "crimson_wall_sign", "crying_obsidian", "cut_copper", "cut_copper_slab", "cut_copper_stairs", "cyan_candle", "cyan_candle_cake", "cyan_carpet", "cyan_concrete", "cyan_glazed_terracotta", "cyan_shulker_box", "cyan_wool", "dark_oak_button", "dark_oak_door", "dark_oak_fence", "dark_oak_fence_gate", "dark_oak_hanging_sign", "dark_oak_log", "dark_oak_pressure_plate", "dark_oak_stairs", "dark_oak_trapdoor", "dark_prismarine_stairs", "darkoak_standing_sign", "darkoak_wall_sign", "daylight_detector", "daylight_detector_inverted", "dead_brain_coral", "dead_bubble_coral", "dead_fire_coral", "dead_horn_coral", "dead_tube_coral", "deadbush", "decorated_pot", "deepslate", "deepslate_brick_double_slab", "deepslate_brick_slab", "deepslate_brick_stairs", "deepslate_brick_wall", "deepslate_bricks", "deepslate_coal_ore", "deepslate_copper_ore", "deepslate_diamond_ore", "deepslate_emerald_ore", "deepslate_gold_ore", "deepslate_iron_ore", "deepslate_lapis_ore", "deepslate_redstone_ore", "deepslate_tile_double_slab", "deepslate_tile_slab", "deepslate_tile_stairs", "deepslate_tile_wall", "deepslate_tiles", "deny", "detector_rail", "diamond_block", "diamond_ore", "diorite_stairs", "dirt", "dirt_with_roots", "dispenser", "double_cut_copper_slab", "double_plant", "double_stone_slab", "double_stone_slab2", "double_stone_slab3", "double_stone_slab4", "double_wooden_slab", "dragon_egg", "dried_kelp_block", "dripstone_block", "dropper", "emerald_block", "emerald_ore", "enchanting_table", "end_brick_stairs", "end_bricks", "end_gateway", "end_portal", "end_portal_frame", "end_rod", "end_stone", "ender_chest", "exposed_copper", "exposed_cut_copper", "exposed_cut_copper_slab", "exposed_cut_copper_stairs", "exposed_double_cut_copper_slab", "farmland", "fence", "fence_gate", "fire", "fire_coral", "fletching_table", "flower_pot", "flowering_azalea", "flowing_lava", "flowing_water", "frame", "frog_spawn", "frosted_ice", "furnace", "gilded_blackstone", "glass", "glass_pane", "glow_frame", "glow_lichen", "glowingobsidian", "glowstone", "gold_block", "gold_ore", "golden_rail", "granite_stairs", "grass", "grass_path", "gravel", "gray_candle", "gray_candle_cake", "gray_carpet", "gray_concrete", "gray_glazed_terracotta", "gray_shulker_box", "gray_wool", "green_candle", "green_candle_cake", "green_carpet", "green_concrete", "green_glazed_terracotta", "green_shulker_box", "green_wool", "grindstone", "hanging_roots", "hardened_clay", "hay_block", "heavy_weighted_pressure_plate", "honey_block", "honeycomb_block", "hopper", "horn_coral", "ice", "infested_deepslate", "info_update", "info_update2", "invisibleBedrock", "iron_bars", "iron_block", "iron_door", "iron_ore", "iron_trapdoor", "jigsaw", "jukebox", "jungle_button", "jungle_door", "jungle_fence", "jungle_fence_gate", "jungle_hanging_sign", "jungle_log", "jungle_pressure_plate", "jungle_stairs", "jungle_standing_sign", "jungle_trapdoor", "jungle_wall_sign", "kelp", "ladder", "lantern", "lapis_block", "lapis_ore", "large_amethyst_bud", "lava", "lava_cauldron", "leaves", "leaves2", "lectern", "lever", "light_block", "light_blue_candle", "light_blue_candle_cake", "light_blue_carpet", "light_blue_concrete", "light_blue_glazed_terracotta", "light_blue_shulker_box", "light_blue_wool", "light_gray_candle", "light_gray_candle_cake", "light_gray_carpet", "light_gray_concrete", "light_gray_shulker_box", "light_gray_wool", "light_weighted_pressure_plate", "lightning_rod", "lime_candle", "lime_candle_cake", "lime_carpet", "lime_concrete", "lime_glazed_terracotta", "lime_shulker_box", "lime_wool", "lit_blast_furnace", "lit_deepslate_redstone_ore", "lit_furnace", "lit_pumpkin", "lit_redstone_lamp", "lit_redstone_ore", "lit_smoker", "lodestone", "log", "log2", "loom", "magenta_candle", "magenta_candle_cake", "magenta_carpet", "magenta_concrete", "magenta_glazed_terracotta", "magenta_shulker_box", "magenta_wool", "magma", "mangrove_button", "mangrove_door", "mangrove_double_slab", "mangrove_fence", "mangrove_fence_gate", "mangrove_hanging_sign", "mangrove_leaves", "mangrove_log", "mangrove_planks", "mangrove_pressure_plate", "mangrove_propagule", "mangrove_roots", "mangrove_slab", "mangrove_stairs", "mangrove_standing_sign", "mangrove_trapdoor", "mangrove_wall_sign", "mangrove_wood", "medium_amethyst_bud", "melon_block", "melon_stem", "mob_spawner", "monster_egg", "moss_block", "moss_carpet", "mossy_cobblestone", "mossy_cobblestone_stairs", "mossy_stone_brick_stairs", "movingBlock", "mud", "mud_brick_double_slab", "mud_brick_slab", "mud_brick_stairs", "mud_brick_wall", "mud_bricks", "muddy_mangrove_roots", "mycelium", "nether_brick", "nether_brick_fence", "nether_brick_stairs", "nether_gold_ore", "nether_sprouts", "nether_wart", "nether_wart_block", "netherite_block", "netherrack", "netherreactor", "normal_stone_stairs", "noteblock", "oak_fence", "oak_hanging_sign", "oak_log", "oak_stairs", "observer", "obsidian", "ochre_froglight", "orange_candle", "orange_candle_cake", "orange_carpet", "orange_concrete", "orange_glazed_terracotta", "orange_shulker_box", "orange_wool", "oxidized_copper", "oxidized_cut_copper", "oxidized_cut_copper_slab", "oxidized_cut_copper_stairs", "oxidized_double_cut_copper_slab", "packed_ice", "packed_mud", "pearlescent_froglight", "pink_candle", "pink_candle_cake", "pink_carpet", "pink_concrete", "pink_glazed_terracotta", "pink_petals", "pink_shulker_box", "pink_wool", "piston", "pistonArmCollision", "pitcher_crop", "pitcher_plant", "planks", "podzol", "pointed_dripstone", "polished_andesite_stairs", "polished_basalt", "polished_blackstone", "polished_blackstone_brick_double_slab", "polished_blackstone_brick_slab", "polished_blackstone_brick_stairs", "polished_blackstone_brick_wall", "polished_blackstone_bricks", "polished_blackstone_button", "polished_blackstone_double_slab", "polished_blackstone_pressure_plate", "polished_blackstone_slab", "polished_blackstone_stairs", "polished_blackstone_wall", "polished_deepslate", "polished_deepslate_double_slab", "polished_deepslate_slab", "polished_deepslate_stairs", "polished_deepslate_wall", "polished_diorite_stairs", "polished_granite_stairs", "portal", "potatoes", "powder_snow", "powered_comparator", "powered_repeater", "prismarine", "prismarine_bricks_stairs", "prismarine_stairs", "pumpkin", "pumpkin_stem", "purple_candle", "purple_candle_cake", "purple_carpet", "purple_concrete", "purple_glazed_terracotta", "purple_shulker_box", "purple_wool", "purpur_block", "purpur_stairs", "quartz_block", "quartz_bricks", "quartz_ore", "quartz_stairs", "rail", "raw_copper_block", "raw_gold_block", "raw_iron_block", "red_candle", "red_candle_cake", "red_carpet", "red_concrete", "red_flower", "red_glazed_terracotta", "red_mushroom", "red_mushroom_block", "red_nether_brick", "red_nether_brick_stairs", "red_sandstone", "red_sandstone_stairs", "red_shulker_box", "red_wool", "redstone_block", "redstone_lamp", "redstone_ore", "redstone_torch", "redstone_wire", "reeds", "reinforced_deepslate", "repeating_command_block", "reserved6", "respawn_anchor", "sand", "sandstone", "sandstone_stairs", "sapling", "scaffolding", "sculk", "sculk_catalyst", "sculk_sensor", "sculk_shrieker", "sculk_vein", "seaLantern", "sea_pickle", "seagrass", "shroomlight", "shulker_box", "silver_glazed_terracotta", "skull", "slime", "small_amethyst_bud", "small_dripleaf_block", "smithing_table", "smoker", "smooth_basalt", "smooth_quartz_stairs", "smooth_red_sandstone_stairs", "smooth_sandstone_stairs", "smooth_stone", "sniffer_egg", "snow", "snow_layer", "soul_campfire", "soul_fire", "soul_lantern", "soul_sand", "soul_soil", "soul_torch", "sponge", "spore_blossom", "spruce_button", "spruce_door", "spruce_fence", "spruce_fence_gate", "spruce_hanging_sign", "spruce_log", "spruce_pressure_plate", "spruce_stairs", "spruce_standing_sign", "spruce_trapdoor", "spruce_wall_sign", "stained_glass", "stained_glass_pane", "stained_hardened_clay", "standing_banner", "standing_sign", "stickyPistonArmCollision", "sticky_piston", "stone", "stone_brick_stairs", "stone_button", "stone_pressure_plate", "stone_slab", "stone_slab2", "stone_slab3", "stone_slab4", "stone_stairs", "stonebrick", "stonecutter", "stonecutter_block", "stripped_acacia_log", "stripped_bamboo_block", "stripped_birch_log", "stripped_cherry_log", "stripped_cherry_wood", "stripped_crimson_hyphae", "stripped_crimson_stem", "stripped_dark_oak_log", "stripped_jungle_log", "stripped_mangrove_log", "stripped_mangrove_wood", "stripped_oak_log", "stripped_spruce_log", "stripped_warped_hyphae", "stripped_warped_stem", "structure_block", "structure_void", "suspicious_gravel", "suspicious_sand", "sweet_berry_bush", "tallgrass", "target", "tinted_glass", "tnt", "torch", "torchflower", "torchflower_crop", "trapdoor", "trapped_chest", "tripWire", "tripwire_hook", "tube_coral", "tuff", "turtle_egg", "twisting_vines", "undyed_shulker_box", "unlit_redstone_torch", "unpowered_comparator", "unpowered_repeater", "verdant_froglight", "vine", "wall_banner", "wall_sign", "warped_button", "warped_door", "warped_double_slab", "warped_fence", "warped_fence_gate", "warped_fungus", "warped_hanging_sign", "warped_hyphae", "warped_nylium", "warped_planks", "warped_pressure_plate", "warped_roots", "warped_slab", "warped_stairs", "warped_standing_sign", "warped_stem", "warped_trapdoor", "warped_wall_sign", "warped_wart_block", "water", "waterlily", "waxed_copper", "waxed_cut_copper", "waxed_cut_copper_slab", "waxed_cut_copper_stairs", "waxed_double_cut_copper_slab", "waxed_exposed_copper", "waxed_exposed_cut_copper", "waxed_exposed_cut_copper_slab", "waxed_exposed_cut_copper_stairs", "waxed_exposed_double_cut_copper_slab", "waxed_oxidized_copper", "waxed_oxidized_cut_copper", "waxed_oxidized_cut_copper_slab", "waxed_oxidized_cut_copper_stairs", "waxed_oxidized_double_cut_copper_slab", "waxed_weathered_copper", "waxed_weathered_cut_copper", "waxed_weathered_cut_copper_slab", "waxed_weathered_cut_copper_stairs", "waxed_weathered_double_cut_copper_slab", "weathered_copper", "weathered_cut_copper", "weathered_cut_copper_slab", "weathered_cut_copper_stairs", "weathered_double_cut_copper_slab", "web", "weeping_vines", "wheat", "white_candle", "white_candle_cake", "white_carpet", "white_concrete", "white_glazed_terracotta", "white_shulker_box", "white_wool", "wither_rose", "wood", "wooden_button", "wooden_door", "wooden_pressure_plate", "wooden_slab", "wool", "yellow_candle", "yellow_candle_cake", "yellow_carpet", "yellow_concrete", "yellow_flower", "yellow_glazed_terracotta", "yellow_shulker_box", "yellow_wool"]}`;
export const upgradesBlocked = []; // Example: "axe", "shovel"