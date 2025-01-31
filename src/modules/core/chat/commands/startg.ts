import { startGame } from "#root/modules/core/games/main"
import { runCMD } from "#modules/axisTools"
import { CInterface } from "../CHandler";

let CCstartgConfig: CInterface = {
    name: "startg",
    description: "Test command",
    args: ["game_id", "arn", "$player"],
    func: function(game_id, arn, player){startGame(game_id, player, arn)},
    version: 1,
    secure: true
}

export { CCstartgConfig }