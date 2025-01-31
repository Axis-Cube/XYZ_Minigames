/*
Created by Lndrs_ (Lndrs2224), Axisander
Description: Hp showing lib
©️ AbstractScripts 2022
https://github.com/AbstractScripts/
*/
import { runCMD, playsound, setTickTimeout, hasTag } from '#modules/axisTools';
import { GAMEDATA } from '#root/modules/core/games/gamedata';
import { getGame } from '#root/modules/core/games/main';
import { addMoney } from '#tunes/bank';
import { SCOLOR, SYM } from '#root/const';

const hp_full = '\ue120';
const hp_half = '\ue121';
const hp_empty = '\ue122';

const ICONS = {
    "player1": "\ue151",
    "player0": "\ue152",
    "hider1": "\ue193",
    "hider0": "\ue193"
};

function nameTag(source) { let name = source.nameTag; let result = ICONS['player'+name.length % 2]; if (hasTag(source,'hns.hider')) { result = ICONS['hider'+name.length % 2]; } return `${result} ${source.nameTag}`; }
export function axisHealthBar( hurtEntity, damagingEntity, damagingProjectile ) { if (true) { let hp = Math.ceil(hurtEntity.getComponent('health').currentValue); let killer = damagingEntity.name; let prey = nameTag(hurtEntity); let hp_msg = 'unknown'; if (hp <= 0) { let msgToAdd = ''; if (GAMEDATA[getGame()].death_data.kill_reward) { addMoney(killer,GAMEDATA[getGame()].death_data.kill_reward,true); msgToAdd = `${SCOLOR} (+${GAMEDATA[getGame()].death_data.kill_reward}${SYM})`; } hp = 0; let deadName = hurtEntity.name; for (let i = 10; i >= 0; i--) { setTickTimeout(() => {runCMD(`titleraw @a[name="${killer}"] actionbar {"rawtext":[{"text":"${prey} | ${hp_empty.repeat(i)}"}]}`)}, 2*(10-i)); } setTickTimeout(() => {runCMD(`titleraw @a[name="${killer}"] actionbar {"rawtext":[{"text":"${prey}"}]}`)}, 22); setTickTimeout(() => {runCMD(`titleraw @a[name="${killer}"] actionbar {"rawtext":[{"text":"\ue114 §c${deadName}"}]}`)}, 25); for (let i = deadName.length; i >= 0; i--) { if (i != 0) { setTickTimeout(() => {runCMD(`titleraw @a[name="${killer}"] actionbar {"rawtext":[{"text":"\ue114 §c${deadName.substr(0,i)}"}]} `)}, 30+2*(deadName.length-i)); } else { setTickTimeout(() => {runCMD(`titleraw @a[name="${killer}"] actionbar {"rawtext":[{"text":"\ue114${msgToAdd}"}]} `)}, 30+2*(deadName.length-i)); } } return }; if (hp % 2 != 0) { /*half*/ hp--; let hp_full_count = hp / 2; let hp_empty_count = 10 - 1 - hp_full_count; hp_msg = `${hp_full.repeat(hp_full_count)}${hp_half}${hp_empty.repeat(hp_empty_count)}`; } else { /*int*/ let hp_full_count = hp / 2; let hp_empty_count = 10 - hp_full_count; hp_msg = `${hp_full.repeat(hp_full_count)}${hp_empty.repeat(hp_empty_count)}`; }; if (damagingProjectile) { playsound('random.orb', killer, 1, 0.6)}; runCMD(`title @a[name="${killer}"] actionbar ${prey} | ${hp_msg}`); } }