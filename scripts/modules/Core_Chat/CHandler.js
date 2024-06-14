import { isAdmin } from "../axisTools";
import { CCmtkillConfig } from "./commands/mtkill";
import { CCstartgConfig } from "./commands/startg";
import { CCstopgConfig } from "./commands/stopg";
export let COMMAND_PREFIXES = ["`", "\\"];
let LOADED = {};
export class CHandler {
    constructor(file) {
        this.config = file;
    }
    async register() {
        if (this.config.func) {
            LOADED[`${this.config.name}`] = {
                config: this.config,
                args: this.config.args,
                func: this.config.func,
            };
        }
        else {
            console.warn('Function Not found');
        }
    }
}
let startg = new CHandler(CCstartgConfig).register();
let stopg = new CHandler(CCstopgConfig).register();
let mtkill = new CHandler(CCmtkillConfig).register();
export async function CCcall(args, player = null) {
    let command_name = args[0];
    args.shift();
    try {
        if (LOADED[command_name] == undefined) { }
        else {
            if (LOADED[command_name].config.secure) {
                if (player != null && await isAdmin(player)) {
                    CCexecute(command_name, args, player);
                }
                else {
                    throw new Error('Only admin can use this command');
                }
            }
            else {
                CCexecute(command_name, args, player);
            }
        }
    }
    catch (e) {
        console.warn(e);
    }
}
async function CCexecute(command_name, args, player) {
    let needed_args = LOADED[command_name].args;
    let auto_args = {
        "$player": player
    };
    try {
        for (let el in needed_args) {
            if (auto_args[needed_args[el]]) {
                args.pop();
                args.push(auto_args[needed_args[el]]);
                console.warn(`----> ${needed_args[el]} ${auto_args[needed_args[el]]}`);
                console.warn(args);
            }
            {
                if (args[el] == undefined) {
                    throw new Error(`Нехватает аргумента ${needed_args[el]}`);
                }
                if (args[el] == "") {
                    throw new Error(`Аргумент ${needed_args[el]} не может быть пустой`);
                }
            }
        }
        LOADED[command_name].func(...args);
    }
    catch (e) {
        console.warn(e);
    }
}
