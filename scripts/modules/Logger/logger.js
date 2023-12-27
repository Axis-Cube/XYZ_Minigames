import { runCMD, sleep } from "../axisTools"
import { ActionFormData, MessageFormData } from "@minecraft/server-ui"

import * as log_env from './logger_env'

function reverseArr(input) {
    var ret = new Array;
    for(var i = input.length-1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}

export class Logger{
    constructor(name){
        this.log = []
        this.name = name
        this.status = 0
    }

    put(content){
        this.log.push(content)
    }

    load(t, next=''){
        try{
            const next_page = next
            runCMD(`titleraw ${t.name} actionbar {"rawtext":[{"text":"[LOGS] \ue134 Loading >>> ${this.name}"}]}`)
            sleep(40)


            let form = new ActionFormData()
            form.title(`[LOG Viewer v1.0] Channel: `+this.name)
            

            if(next == ''){
                form.button('Back')
            }else{
                form.button(`Go To "${next_page}"`)
            }

            let content = reverseArr(this.log)
            if(content != ''){
                form.body(content.join('\n'))
            }else{
                form.body('Empty Log...')
            }
            form.button('Exit')
            form.show(t).then(sel =>{
                if(next = ''){}else{
                    if(sel.canceled){return}
                    switch(sel.selection){
                        case 1:
                        break;

                        case 0:
                            if(next_page != ''){
                                load_log(next_page,t)
                            }else{return}
                        break;

                        default:
                        break;
                    }
                }
            })
        }catch{
            runCMD(`titleraw ${t.name} actionbar {"rawtext":[{"text":"[LOGS] \ue116 Failed to load ${this.name}"}]}`)
        }
            
    
    }

}

export function load_log(name = 'default_log', source){
    try{
        log_env[name].load(source, Object.keys(log_env)[Object.keys(log_env).indexOf(name)+1])
    }catch(e){
        runCMD(`titleraw ${source.name} actionbar {"rawtext":[{"text":"[LOGS] \ue116 Failed to load ${name}"}]}`)
    }
}