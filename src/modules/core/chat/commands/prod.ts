import { runCMD, runCMDs } from "#modules/axisTools"
import { CInterface } from "../CHandler";

let CCprodConfig: CInterface = {
    name: "prod",
    description: "Prepare map to production",
    args: [],
    func: function(game_id, arn, player){
        runCMDs([
            "scoreboard objectives remove data.userapi",
            "scoreboard objectives add data.userapi dummy data.userapi"
        ])
    },
    version: 1,
    secure: true
}

export { CCprodConfig }