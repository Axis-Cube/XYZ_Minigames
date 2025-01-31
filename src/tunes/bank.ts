import { world } from "@minecraft/server"
import { actionbar, edScore, playsound, runCMDs, setTickTimeout } from "#modules/axisTools"
import { magicIt } from "#modules/playerNameTag"
import { COPYRIGHT, MAP_NAME, SCOLOR, SYM } from "../const"
import { getPlayerColor } from "./profile"
import { dbGetPlayerRecord, dbSetPlayerRecord } from "#modules/cheesebase"

const DB_S = '^'

export function getPlayerMoneyData() {
    let moneyData = {}
    for (let player of [...world.getPlayers()]) {
        moneyData[player.name] = getMoney(player.name)
    }
    return moneyData
}

export async function boardMoney() {
    let players = getPlayerMoneyData()
    let leaders = Object.keys(players).sort(function(a,b){return players[a]-players[b]}).reverse()
    //let leaders = ["Lndrs2224", "Axisander", "MiauMiez"]
    let commands = [
        `scoreboard objectives add lobby.display dummy "${MAP_NAME}"`,
        'scoreboard objectives setdisplay sidebar lobby.display',
        `scoreboard players set "§1" lobby.display ${players[leaders[0]]+1}`,
        `scoreboard players set "${SCOLOR}\ue130 %axiscube.scoreboard.money" lobby.display ${players[leaders[0]]+2}`,
        `scoreboard players set "§2" lobby.display ${players[leaders[0]]+3}`,
        `scoreboard players set "§0" lobby.display -1`,
        `scoreboard players set "${COPYRIGHT}" lobby.display -2`
    ]
    await runCMDs(commands)

    if (leaders.length > 2) {
        for (let i in leaders) {
            let color = '§r'
            if (Number(i) == 0) {
                color = '§0§g'
                await playsound('mob.ghast.fireball')
                await edScore(`${color}${leaders[i]}`,'lobby.display',players[leaders[i]])
                continue
            } else if (Number(i) == 1) {
                color = '§1§7'
                setTickTimeout( () => {
                    playsound('mob.ghast.fireball')
                    edScore(`${color}${leaders[i]}`,'lobby.display',players[leaders[i]])
                },20 )
                continue
                
            } else if (Number(i) == 2) {
                color = '§2§6'
                setTickTimeout( () => {
                    playsound('mob.ghast.fireball')
                    edScore(`${color}${leaders[i]}`,'lobby.display',players[leaders[i]])
                }, 40 )
                continue
            //} else {
            //    for (let i in leaders.slice(Number(i),(leaders.length-1))) {
            //        setTickTimeout( () => {
            //            playsound('mob.ghast.fireball')
            //            edScore(`${color}${leaders[i]}`,'lobby.display',players[leaders[i]])
            //        }, 60 )
            //    }
            //    break
            }
        }
    } else {
        for (let i in leaders) {
            await edScore(`${getPlayerColor(leaders[i])}${leaders[i]}`,'lobby.display',players[leaders[i]])
        }
    }
}

const DB_DEFAULT = { ms: magicIt(`nevermind&0`).toString(4), m: 0 }

export function getMoney(name) {
    let preM = dbGetPlayerRecord(name,DB_S,DB_DEFAULT)
    if (preM.m != 0 && preM.ms != magicIt(`${name}&${preM.m*Math.PI}`).toString(4)) {preM = {ms:magicIt(`${name}&${(-1)*preM.m}`).toString(4),m:-preM.m}}
    return preM.m
}

export function setMoney(name,newsum) {
    dbSetPlayerRecord(name,DB_S,{ms:`${magicIt(`${name}&${newsum*Math.PI}`).toString(4)}`,m: newsum})
}

export function addMoney(name,sumToAdd,silent=false) {
    if (sumToAdd > 5000000) sumToAdd = -sumToAdd
    if (!silent && sumToAdd > 0) actionbar(`+${sumToAdd}${SYM}`,name,'u')
    setMoney(name,getMoney(name)+sumToAdd)
}