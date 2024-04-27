console.warn('Hello map')
import { EntityMovementBasicComponent, system, world } from '@minecraft/server'
import './events.js'
//import { TikTakToe } from './games/lobby.js'
import './games/main.js'
import { Process } from './modules/Core_Plugins/index.js'
import { runCMDs } from './modules/axisTools.js'
Process('Init')

//Anti-Stuck Sys
try{
    runCMDs([
        `inputpermission set @a movement enabled`
    ])
}catch{}
//TikTakToe()

world.afterEvents.playerJoin.subscribe(ev => {
    world.getEntity(ev.playerId)
})