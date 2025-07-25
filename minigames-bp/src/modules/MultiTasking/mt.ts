import { system } from "@minecraft/server"
import { multitask_log } from "../Logger/logger_env";

export class MultiTasking{
    named_query: any;
    query: number[];
    name: string;

    constructor(name){
        this.query = []
        this.named_query = {}
        this.name = name
    }

    async registerNamed(name ,pid){
        this.named_query[name] = pid
    }

    async register(pid){
        this.query.push(pid)
    }

    async kill(pid: number | null = null){
        if(pid != null){
            system.clearRun(pid);
            let index = this.query.indexOf(pid)
            this.query.splice(index,1)
            multitask_log.put(`[MT] Stopped pid <${pid}>`)
        }else{
            for(let i in this.query){
                system.clearRun(this.query[i])
                multitask_log.put(`[MT] Stopped pid <${this.query[i]}>`)
            }
            this.query=[]
        }
    }

    async killNamed(name: string | null = null){
        if(name != null){
            let pid = this.named_query[name]
            system.clearRun(pid);
            let index = this.query.indexOf(pid)
            this.query.splice(index,1)
            multitask_log.put(`[MT] Stopped pid <${pid}>`)
        }else{}
    }
}