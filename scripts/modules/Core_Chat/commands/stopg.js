import { stopGame } from "../../../games/main";
let CCstopgConfig = {
    name: "stopg",
    description: "Test command",
    args: ["game_id"],
    func: function (game_id) { stopGame(game_id); },
    version: 1,
    secure: true
};
export { CCstopgConfig };
