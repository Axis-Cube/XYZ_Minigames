import { ActionFormData } from "@minecraft/server-ui"
import { edScore, hasTag, runCMD, tellraw } from "#modules/axisTools"
import { world } from "@minecraft/server"

//#region Constants
export const TEAMS = [
    'red','green','blue','yellow','purple',
    'orange','pink','cyan','lime','black'
]

export const TEAMS4 = [
    'red','green','blue','yellow'
]

export const TEAMS2 = [
    'red', 'blue'
]

export const TEAM_COLORS = {
    'red':'§c','blue':'§9','green':'§2','yellow':'§e','purple':'§u',
    'orange':'§6','pink':'§d','cyan':'§3','lime':'§a','black':'§8'
}

export const TEAM_NOTEAMSELECTOR = '@a[tag=!team.red,tag=!team.green,tag=!team.blue,tag=!team.yellow,tag=!team.purple,tag=!team.orange,tag=!team.pink,tag=!team.cyan,tag=!team.lime,tag=!team.black]'
//#endregion

//#region Functions
export function teamArray() {
    let teams: string[] = []
    for (let playerT of [...world.getPlayers()]) {
        for (let i in TEAMS) {
            if (playerT.hasTag(`team.${TEAMS[i]}`) && !teams.includes(TEAMS[i]) && !playerT.hasTag(`spec`)) {
                teams.push(TEAMS[i])
                continue 
            }
        }
    }
    return teams
}

//{type: 'colorscore', score: 3, objective: 'pvp.display'},
export function scoreboardTeamcolor(score=3,objective='pvp.display',teamList=TEAMS) {
    let players = [...world.getPlayers()]
    for (let i in teamList) {
        for (let playerT of players) {
            if (playerT.hasTag(`team.${teamList[i]}`)) {
                edScore(`${TEAM_COLORS[teamList[i]]}${playerT.name}`,objective,score)
                //del players[players.indexOf(playerT)] // Tupoy python moment
            }
        }
    }
}

export function teamCheck() {
    return teamArray().length > 1
}

export function getPlayerTeam(player) {
    let playerTags = [...player.getTags()]
    for (let i in playerTags) {
        if (playerTags[i].startsWith('team.')) return playerTags[i].split('.')[1]
        
    }
}

export function formTeamsel(player,teamsList=TEAMS,addSpectator=true,colorNameTag=true,iconType='heads') {
    const form = new ActionFormData()
    .title('%axiscube.teamgame.choice_team')
    .body(`%axiscube.teamgame.choice_team.d`)
    let knowTeam = false
    if (addSpectator) {
        let isSel = ''
        if (player.hasTag('spec')) {knowTeam = true; isSel = '\ue124 '}
        form.button(`${isSel}%axiscube.teamgame.choice_team.spec`,`textures/ui/icons/teams/${iconType}/spec`)
    }
    for (let i in teamsList) {
        let isSel = ''
        if (!knowTeam && hasTag(player,`team.${teamsList[i]}`)) {isSel = '§l'; knowTeam = true}
        form.button(`${isSel}%axiscube.teamgame.team.${teamsList[i]}`,`textures/ui/icons/teams/${iconType}/${teamsList[i]}`)
    }
    form.show(player).then(async gg => { if (!gg.canceled) {
        if(!gg.selection){return;}

        let playerTags = [...player.getTags()]
        for (let i in playerTags) {
            if (playerTags[i].startsWith('team.')) {await runCMD(`tag @s remove ${playerTags[i]}`,player)}
            
        }
        if (addSpectator) {
            await runCMD('tag @s remove spec',player)
            if (gg.selection === 0) {
                if (colorNameTag) player.nameTag = player.name
                await runCMD('tag @s add spec',player)
                tellraw({rawtext:[{translate:'axiscube.teamgame.team.join.spec',with:{rawtext:[{text:player.name}]}}]})
            } else if (gg.selection > 0) {
                if (colorNameTag) player.nameTag = `${TEAM_COLORS[teamsList[Number(gg.selection)-1]]}${player.name}§r`
                tellraw({rawtext:[{translate:'axiscube.teamgame.team.join',with:{rawtext:[{text:player.nameTag},{translate:`axiscube.teamgame.team.${teamsList[Number(gg.selection)-1]}`}]}}]})
                await runCMD(`tag @s add team.${teamsList[Number(gg.selection)-1]}`,player)
            }
        } else {
            if (colorNameTag) player.nameTag = `${TEAM_COLORS[teamsList[Number(gg.selection)]]}${player.name}§r`
            await runCMD(`tag @s add team.${teamsList[Number(gg.selection)]}`,player)
            tellraw({rawtext:[{translate:'axiscube.teamgame.team.join',with:{rawtext:[{text:player.nameTag},{translate:`axiscube.teamgame.team.${teamsList[Number(gg.selection)]}`}]}}]})
        }
    }})
}
//#endregion