import { ActionFormData, MessageFormData } from "@minecraft/server-ui"
import { openJSON } from "../modules/easyform"
import { beginGame, getGame, getGameType, startGame, stopGame } from "./main"
import { world } from "@minecraft/server"
import { GAMEDATA } from "./gamedata"
import { teamCheck } from "./category_team"
import { edScore, rawtext, runCMDs, tellraw } from "../modules/axisTools"
import { checkPerm } from "../modules/perm"
import { STORE_ITEMS, addItem } from "../tunes/store"
import { ICONS, SCOLOR, SYM } from "../const"
import { addMoney } from "../tunes/bank"

const GM_FORM = {
    1: [
        {
            "name": "%axiscube.blockp.name", // name for list and title
            "body": "%axiscube.blockp.d", // description in body
            "icon": "textures/ui/icons/games/blockp", // image for button
            "ui_type": "default", // someforms; default; silder; advanced
            "for_start": 2, // start function
        },
        {
            "name": "%axiscube.mnf.name",
            "body": "%axiscube.mnf.d",
            "icon": "textures/ui/icons/games/diff/easy",
            "ui_type": "stack",
            "for_start": 4,
            "forms": [
                {
                    "type": "other",
                    "value": ["diff","data"],
                    "body": "%axiscube.form.games.diff",
                    "keys": [ "%options.difficulty.easy", "%options.difficulty.normal", "%options.difficulty.hard", {"rawtext":[{"translate":"axiscube.challenge","with":{"rawtext":[{"translate":"options.difficulty.hardcore"}]}},{"text":"\n"},{"translate":"axiscube.challenge.unical_trophy"}]} ],
                    "images": [ "textures/ui/icons/games/diff/easy", "textures/ui/icons/games/diff/normal", "textures/ui/icons/games/diff/hard", "textures/ui/icons/games/diff/hardcore" ]
                }
            ]
        },
        {
            "name": "%axiscube.gls.name",
            "body": "%axiscube.gls.d",
            "icon": "textures/blocks/glass",
            "ui_type": "stack",
            "for_start": 6,
            "forms": [
                {
                    "type": "other",
                    "value": ["diff","data"],
                    "body": "%axiscube.form.games.diff",
                    "keys": ["%options.difficulty.easy", "%options.difficulty.normal", "%options.difficulty.hard", {"rawtext":[{"translate":"axiscube.challenge","with":{"rawtext":[{"translate":"options.difficulty.hardcore"}]}},{"text":"\n"},{"translate":"axiscube.challenge.unical_trophy"}]}],
                    "images": [ "textures/ui/icons/games/diff/easy", "textures/ui/icons/games/diff/normal", "textures/ui/icons/games/diff/hard", "textures/ui/icons/games/diff/hardcore" ]
                }
            ]
        },
        {
            "name": "%axiscube.drp.name",
            "body": "%axiscube.drp.d",
            "ui_type": "default",
            "for_start": 7
        },
        {
            "name": "%axiscube.tnt.name",
            "body": "%axiscube.tnt.d",
            "ui_type": "default",
            "for_start": 8,
            "cmd": [
                `scoreboard players set diff data 0`
            ]
        },
        {
            "name": "%axiscube.prk.name",
            "body": "%axiscube.prk.d",
            "icon": "textures/items/stick",
            "ui_type": "stack",
            "for_start": 11,
            "forms": [
                {
                    "type": "other",
                    "value": ["arn","data"],
                    "body": "%axiscube.form.games.diff",
                    "keys": ["1", "2", "3", "4", "5"],
                    "images": [ "textures/ui/icons/games/diff/easy", "textures/ui/icons/games/diff/normal", "textures/ui/icons/games/diff/hard", "textures/ui/icons/games/diff/hard", "textures/ui/icons/games/diff/hard"]
                }
            ]
        },
    ],
    2: [
        {
            "name": "%axiscube.hns.name",
            "body": "%axiscube.hns.d",
            "icon": "textures/ui/icons/games/hns",
            "ui_type": "default",
            "for_start": 1
        },
        {
            "name": "%axiscube.pvp.name",
            "body": "%axiscube.pvp.d",
            "icon": "textures/ui/icons/games/pvp",
            "ui_type": "stack",
            "for_start": 3,
            "forms": [
                {
                    "type": "gametype",
                    "keys": [ "%axiscube.form.games.gametype.ffa", "%axiscube.form.games.gametype.teamgame" ],
                    "images": [ "textures/ui/icons/plr3","textures/ui/icons/teams/pvp" ]
                },
                {
                    "type": "other",
                    "value": ["arn","data"],
                    "body": "%axiscube.form.games.arena",
                    "keys": [ "%axiscube.form.games.wildwest", "%axiscube.form.games.icy" ],
                    "images": [ "textures/blocks/red_sandstone_normal", "textures/blocks/blue_ice" ]
                }
            ]
        },
        {
            "name": "%axiscube.bw.name",
            "body": "%axiscube.bw.d",
            "icon": "textures/ui/icons/games/bw",
            "ui_type": "default",
            "for_start": 5
        },
        {
            "name": "%axiscube.flagw_bridges.name",
            "body": "%axiscube.flagw_bridges.d",
            "ui_type": "stack",
            "for_start": 9,
            "forms": [
                {
                    "type": "other",
                    "value": ["arn","data"],
                    "body": "%axiscube.form.games.diff",
                    "keys": ["Bamboo", "Spaceships"],
                    "images": [ "textures/items/barrier", "textures/items/barrier"]
                }
            ]
        },
        {
            "name": "%axiscube.flagw_frontl.name",
            "body": "%axiscube.flagw_frontl.d",
            "ui_type": "default",
            "for_start": 10
        },
        {
            "name": "%axiscube.hg.name",
            "body": "%axiscube.hg.d",
            "ui_type": "default",
            "for_start": 12 
        }
    ]
}

export const GM_CHALLANGES = {
    0: {
        game: 4,
        name: 'options.difficulty.hardcore',
        body: 'axiscube.challenge.d.hardcore',
        icon: "textures/ui/icons/games/diff/hardcore",
        promo: 'axiscube.challenge.unical_trophy',
        acceptAction: async (player) => {
            await edScore('diff','data',3)
            startGame(4,player)
        },
        reward: [
            { type: 'uniset', value: 31},
            { type: 'money', value: 650}
        ]

    },
    1:{
        game: 6,
        name: 'test_glass_chlng',
        body: 'test_glass_chlng_body',
        icon: "textures/ui/icons/games/diff/hardcore",
        acceptAction: async (player) => {
            await edScore('diff','data',3)
            startGame(6,player)
        },
        reward: [
            { type: 'uniset', value: 35},
            { type: 'money', value: 650}
        ]

    }
}

export function getGameChallenges(id) {
    let ch: string[] = []
    for (let i in GM_CHALLANGES) {
        if (GM_CHALLANGES[i].game == id) ch.push(i)
    }
    return ch
}

export function formGameChallenges(player,id) {
    const chl = GM_CHALLANGES[id]

    const form = new ActionFormData()
    .title({rawtext:[{translate:'axiscube.challenge',with:{rawtext:[{translate:chl.name}]}}]})
    
    let btext: any = {rawtext:[
        {translate:chl.body},
        {text:'\n\n'},
        {translate:'axiscube.challenge.for',with:{rawtext:[{translate:`axiscube.${GAMEDATA[chl.game].namespace}.name`}]}},
        {text:'\n\n'},
        {translate:'axiscube.challenge.trophy.list'},
    ]}
    for (let i of chl.reward) {
        switch (i.type) {
            case 'uniset':
                btext.rawtext = [...btext.rawtext,{text:'\n * '},{translate:'axiscube.challenge.trophy.uni_setpack',with:{rawtext:[{translate:`axiscube.store.product.${STORE_ITEMS[i.value].namespace}`}]}}]
            break;
            case 'money':
                btext.rawtext = [...btext.rawtext,{text:'\n * '},{translate:'axiscube.challenge.trophy.axigems',with:[`${SCOLOR}${i.value}${SYM}§r`]}]
            break;
        }
    }
    form.body(btext)
    form.button('%axiscube.challenge.accept',ICONS.act)
    form.show(player).then(gg => {
        if (gg.selection == 0) {
            chl.acceptAction(player)
        }
    })
}

export function  completeChallenge(player,id) {
    const chl = GM_CHALLANGES[id]
    tellraw({rawtext:[{translate:'axiscube.challenge.completed',with:{rawtext:[{text:player.nameTag},{translate:chl.name}]}}]})
    for (let i of chl.reward) {
        switch (i.type) {
            case 'uniset':
                addItem(player.name,i.value)
                tellraw({rawtext:[{translate:'axiscube.challenge.reward.store',with:{rawtext:[{translate:`axiscube.store.product.${STORE_ITEMS[i.value].namespace}`}]}}]})
            break;
            case 'money':
                addMoney(player.name,i.value)
            break;
        }
    }
}

export async function formGameChooser(player,type=1,disableCheck=false) {
    const GAMES = GM_FORM[type]
    if (type == 2 && [...world.getPlayers()].length < 2 && !disableCheck) {
        const formWarn = new MessageFormData()
        .title('%gui.error')
        .body('§c%axiscube.form.p2.no_players_warn')
        .button1('%gui.back')
        .button2('%gui.continue')
        await formWarn.show(player).then(gg => { if (gg.selection == 0) { openJSON('gamesel',player) } else if (gg.selection == 1) { formGameChooser(player,type,true) } })
    }
    if (!disableCheck && type == 2 && [...world.getPlayers()].length < 2) return

    const formFeed = new ActionFormData()
    .title('%axiscube.form.games')
    .body(`%axiscube.form.games.p${type}`)
    .button('%gui.back','textures/ui/icons/back')

    for (let i in GAMES) {
        formFeed.button(GAMES[i].name,GAMES[i].icon)
    }

    formFeed.show(player).then(gg => {
        if (gg.selection == 0) {
            openJSON('gamesel',player)
            return
        } else if (gg.selection == undefined) {
            return
        }
        const sel = Number(gg.selection)-1
        const thisGame = GAMES[sel]
        const challs = getGameChallenges(thisGame.for_start)

        const formOfThisGame = new ActionFormData()
            .title(`${thisGame.name}`)
            .body(`${thisGame.body}`)
            .button('%menu.play','textures/ui/icons/gamepad')

            if (challs.length > 0) {
                for (let i of challs) {
                    formOfThisGame.button({"rawtext":[{"translate":"axiscube.challenge","with":{"rawtext":[{"translate":GM_CHALLANGES[i].name}]}},{"text":"\n"},{"translate":GM_CHALLANGES[i].promo}]},GM_CHALLANGES[i].icon)
                }
            }

            formOfThisGame.button('%gui.back','textures/ui/icons/back')
            
            formOfThisGame.show(player).then(async gg => {
                if (gg.selection == 0){
                    await edScore('mg','data');
                    await edScore('stg','data');
                    await edScore('arn','data');
                    await edScore('type','data');
                    if (thisGame.ui_type == 'default') {
                        await runCMDs(thisGame.cmd)
                        startGame(thisGame.for_start,player,0);
                    } else if (thisGame.ui_type == 'stack') {
                        let isCanceled = false
                        for (let i in thisGame.forms) {
                            if (isCanceled) break
                            let thisForm = thisGame.forms[i]
                            if (thisForm.type == 'gametype') {
                                const formGtype = new ActionFormData()
                                .title(`${thisGame.name}`)
                                .body(`%axiscube.form.games.gametype`)
                                for (let j in thisForm.keys) {
                                    formGtype.button(thisForm.keys[j],thisForm.images[j])
                                }
                                await formGtype.show(player).then(async gl => {
                                    if (gl.selection != undefined) {
                                        await edScore('type','data',gl.selection)
                                    } else {
                                        isCanceled = true
                                    }
                                })
                            } else if (thisForm.type == 'other') {
                                const formGtype = new ActionFormData()
                                .title(`${thisGame.name}`)
                                .body(thisForm.body)
                                for (let j in thisForm.keys) {
                                    formGtype.button(thisForm.keys[j],thisForm.images[j])
                                }
                                await formGtype.show(player).then(async gl => {
                                    if (gl.selection != undefined) {
                                        await edScore(thisForm.value[0],thisForm.value[1],gl.selection)
                                    } else {
                                        isCanceled = true
                                    }
                                })
                            }
                            //{
                            //     "type": "gametype",
                            //     "keys": [ "%axiscube.form.games.gametype.ffa", "%axiscube.form.games.gametype.teamgame" ],
                            //     "images": [ "textures/ui/icons/plr3","textures/ui/icons/teams/pvp" ]
                            // }
                        }
                        if (!isCanceled && thisGame.cmd) await runCMDs(thisGame.cmd);
                        if (!isCanceled) await startGame(thisGame.for_start,player);
                    }
                } else if (gg.selection == 1+challs.length) {
                    openJSON('gamesel',player)
                } else if (gg.selection && gg.selection < 1+challs.length) {
                    formGameChallenges(player,challs[gg.selection-1])
                }
            })
    })
}

export async function formBeginGameConfirm(player,id=getGame()) {
    let canStart = true
    let warnMessage = GAMEDATA[id].confirm_begin[getGameType()].warn_message
    switch(GAMEDATA[id].confirm_begin[getGameType()].check) {
        case false:
        break;
        case 'teamcheck':
            if (!teamCheck()) {
                canStart = false
                warnMessage = 'axiscube.games.startgame.confirm.error %axiscube.games.startgame.confirm.error.team'
            }
        break;
    }
    const form = new MessageFormData()
        .title('%axiscube.games.startgame.confirm')
        .body(`%axiscube.games.startgame.confirm.d\n\n§c%${warnMessage}`)
        if (canStart) {
            form.button1('%gui.cancel')
            form.button2('%gui.confirm')
        } else {
            form.button1('%gui.cancel')
            form.button2('%gui.ok')
        }
        
    
    form.show(player).then(async gg => {
        if (gg.selection === 0 || gg.selection === undefined || !canStart) { return }
        if (!checkPerm(player.name,'start')) { rawtext('axiscube.perm.denied.start',player.name,'translate','c'); return }
        if (GAMEDATA[id].min_players > [...world.getPlayers()].length) {
            tellraw(`{"rawtext":[{"translate":"axiscube.games.startgame.no_players","with":{"rawtext":[{"translate":"axiscube.${GAMEDATA[id].namespace}.name"},{"text":"${GAMEDATA[id].min_players}"}]}}]}`)
            stopGame()
            return
        }
        beginGame(id)
    })
}
export async function formCancelGameConfirm(player,id=getGame()) {
    const form = new MessageFormData()
        .title('%axiscube.games.startgame.confirm')
        .body(`%axiscube.games.cancelgame.confirm.d`)
        .button1('%gui.cancel')
        .button2('%gui.confirm')
    
    form.show(player).then(gg => {
        if (gg.selection === 0 || gg.selection === undefined) return
        if (!checkPerm(player.name,'stop')) { rawtext('axiscube.perm.denied.stop',player.name,'translate','c'); return }
        tellraw(`{"rawtext":[{"translate":"axiscube.games.cancelgame","with":["${player.nameTag}"]}]}`)
        stopGame(id)
    })
}