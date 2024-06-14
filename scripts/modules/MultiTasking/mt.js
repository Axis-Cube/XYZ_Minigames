import { system } from "@minecraft/server";
import { multitask_log } from "../Logger/logger_env";
export class MultiTasking {
    constructor(name) {
        this.query = [];
        this.name = name;
    }
    async register(pid) {
        this.query.push(pid);
        console.warn(this.query);
    }
    async kill(pid = null) {
        if (pid != null) {
            system.clearRun(pid);
            let index = this.query.indexOf(pid);
            this.query.splice(index, 1);
            multitask_log.put(`[MT] Stopped pid <${pid}>`);
        }
        else {
            for (let i in this.query) {
                system.clearRun(this.query[i]);
                multitask_log.put(`[MT] Stopped pid <${this.query[i]}>`);
            }
            this.query = [];
        }
    }
}
