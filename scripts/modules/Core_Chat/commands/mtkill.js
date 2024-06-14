import { MT_GAMES } from "../../MultiTasking/instances";
let CCmtkillConfig = {
    name: "mtkill",
    description: "Test command",
    args: [],
    func: function () { MT_GAMES.kill(); },
    version: 1,
    secure: true
};
export { CCmtkillConfig };
