import { runCMD, runCMDs } from "#modules/axisTools"
import { CInterface } from "../CHandler";

let CCprodConfig: CInterface = {
    name: "prod",
    description: "Prepare map to production",
    args: [],
    func: prodPrepare,
    version: 1,
    secure: true
}

function prodPrepare(){
    runCMDs([
        //Erase UserData
        "scoreboard objectives remove data.userapi",
        "scoreboard objectives add data.userapi dummy data.userapi"
        //
    ])
}

export { CCprodConfig }