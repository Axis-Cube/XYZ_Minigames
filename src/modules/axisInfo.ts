import { system } from "@minecraft/server";
import { MT_INFO } from "./MultiTasking/instances"
import { runCMD } from "./axisTools"
export class Information{ constructor(){} async replace(obj: string | number, force:boolean = false){ if(force)(MT_INFO.kill()); let id: number; runCMD(`titleraw @a title {"rawtext":[{"text":"ud0\'${obj}\'"}]}`); } async erase(){ MT_INFO.kill(); runCMD(`title @a title ud0""`); } }
export let axisInfo = new Information();