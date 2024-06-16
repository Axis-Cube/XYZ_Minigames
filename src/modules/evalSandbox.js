//@ts-nocheck 
//import { placePlatform, placePodushkaBezopasnosti } from "../games/blockp";
import { formMapSettings } from "tunes/mapSettings";
import { formGameChooser } from "../games/chooser";
import { formTestRun } from "../tunes/testrun";
import { formProfile } from "../tunes/profile";
import { getGameArena, startTimer } from "../games/main";
import { pvpSetkit } from "../games/pvp";
import { hnsDeath, unplaceBlock } from "../games/hns";
import { addMoney } from "../tunes/bank";
import { fieldPlace, mnfRemoveBarrier } from "../games/mnf";
import { bwEquipmentCheck } from "../games/bw";

import * as ax from "./axisTools";
import { BlockPermutation, Player, world } from "@minecraft/server";
import { bwClear, formBWshop, generateRes, getResInterval } from "../games/bw";
//import { GAMEDATA } from "../games/gamedata";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { DIM } from "../const";
import {runCMD, runCMDs} from "./axisTools";


export let EvalForm = new ModalFormData().title('Eval v0.1').textField('Command','Enter text...')
export function axisEval(code = "", player) {
    let name;
    if (player != undefined) { name = player.name; }
    try {
        console.warn(code)
        eval(code) 
    } catch(error) { console.warn(error.name,error,'\n',error.stack) }
}
