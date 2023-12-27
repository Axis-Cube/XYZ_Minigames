// 100%
//import { placePlatform, placePodushkaBezopasnosti } from "../games/blockp";
import { formGameChooser } from "../games/chooser";
import { formProfile } from "../tunes/profile";
import { getGameArena, startTimer } from "../games/main";
import { pvpSetkit } from "../games/pvp";
import { hnsDeath, unplaceBlock } from "../games/hns";
import { addMoney } from "../tunes/bank";
import { fieldPlace, mnfRemoveBarrier } from "../games/mnf";
import { formMapSettings } from "../tunes/mapSettings";
import { bwEquipmentCheck } from "../games/bw";

import * as ax from "./axisTools";
import { BlockPermutation, world } from "@minecraft/server";
import { bwClear, formBWshop, generateRes, getResInterval } from "../games/bw";
import { GAMEDATA } from "../games/gamedata";
import { ActionFormData } from "@minecraft/server-ui";
import { DIM } from "../const";
import {runCMD, runCMDs} from "./axisTools";


export function axisEval(code,player) {
    let name
    if (player) { name = player.name; }
    
    try { eval(code) } catch(error) { console.warn(error.name,error,'\n',error.stack) }
}
