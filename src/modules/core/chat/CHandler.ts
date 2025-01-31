import { isAdmin, runCMD } from "#modules/axisTools"
import { CCmtkillConfig } from "./commands/mtkill"
import { CCprodConfig } from "./commands/prod"
import { CCstartgConfig } from "./commands/startg"
import { CCstopgConfig } from "./commands/stopg"

//#region Variables
export let COMMAND_PREFIXES = ["`","\\"]
let LOADED = {}

export interface CInterface{
    name: string,
    description: string,
    args: string[] | never[],
    func: any,
    version: number,
    secure: boolean
}
//#endregion

//#region Class
export class CHandler{
    config: CInterface;

    constructor(file){
        this.config = file
    }

    async register(){
        if(this.config.func){
            LOADED[`${this.config.name}`] = {
                config: this.config,
                args: this.config.args,
                func: this.config.func,
            }
        }else{
            console.warn('Function Not found')
        }
    }
}
//#endregion

//#region Commands Registration
let startg = new CHandler(CCstartgConfig).register()
let stopg = new CHandler(CCstopgConfig).register()
let mtkill = new CHandler(CCmtkillConfig).register()
let prod = new CHandler(CCprodConfig).register()
//#endregion

//#region Functions
export async function CCcall(args, player=null){
    let command_name = args[0]
    args.shift()
    try{
        if(LOADED[command_name] == undefined){}
        else{
                if(LOADED[command_name].config.secure){
                    if(player != null && await isAdmin(player)){
                        CCexecute(command_name, args, player)
                    }else{
                        throw new Error('Only admin can use this command')
                    }
                }
                else{
                    CCexecute(command_name, args, player)
                }
            
        }
    }catch(e){console.warn(e)}
}

async function CCexecute(command_name, args, player){
    let needed_args = LOADED[command_name].args
    let auto_args = {
        "$player": player
    }
    try{
        for(let el in needed_args){
            if(auto_args[needed_args[el]]){
                args.pop()
                args.push(auto_args[needed_args[el]])
                console.warn(`[Core_Chat][CHandler] Replaced Argument ${needed_args[el]} -> ${auto_args[needed_args[el]]}`)
                console.warn(args)
            }{
                if(args[el]==undefined){
                    throw new Error(`[Core_Chat][CHandler] Нехватает аргумента ${needed_args[el]}`)
                }
                if(args[el]==""){
                    throw new Error(`[Core_Chat][CHandler] Аргумент ${needed_args[el]} не может быть пустой`)
                }
            }
        }
        LOADED[command_name].func(...args)
        
    }catch(e){
        console.warn(e)
    }
}
//#endregion
