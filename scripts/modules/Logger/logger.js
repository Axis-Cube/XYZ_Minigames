import { getScore, runCMD, sleep } from "../axisTools";
import { ActionFormData } from "@minecraft/server-ui";
import * as log_env from './logger_env';
function reverseArr(input) {
    var ret = new Array;
    for (var i = input.length - 1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}
export class Logger {
    constructor(name) {
        this.log = [];
        this.name = name;
        this.status = 0;
    }
    put(content) {
        let currentdate = new Date();
        let correction = getScore('time_correction', 'settings');
        this.log.push(`[${currentdate.getHours() + correction + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()}] ` + content);
        console.log(`[${currentdate.getHours() + correction + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()}] ` + content);
    }
    load(t, next = '') {
        try {
            let next_page = next;
            let content = reverseArr(this.log);
            const first_page = Object.keys(log_env)[0];
            runCMD(`titleraw ${t.name} actionbar {"rawtext":[{"text":"[LOGS] \ue191 Loading >>> ${this.name}"}]}`);
            sleep(40);
            let form = new ActionFormData();
            form.title(`[LOG Viewer v1.3] Channel: ` + this.name);
            if (next == '') {
                form.button(`Go To "${first_page}"`);
                next_page = first_page;
            }
            else {
                form.button(`Go To "${next_page}"`);
            }
            if (content.length != 0) {
                form.body(content.join('\n'));
            }
            else {
                form.body('Empty Log...');
            }
            form.button('Exit');
            form.show(t).then(sel => {
                if (next = '') { }
                else {
                    if (sel.canceled) {
                        return;
                    }
                    switch (sel.selection) {
                        case 1:
                            break;
                        case 0:
                            if (next_page != '') {
                                load_log(next_page, t);
                            }
                            else {
                                return;
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
        }
        catch {
            runCMD(`titleraw ${t.name} actionbar {"rawtext":[{"text":"[LOGS] \ue116 Failed to load ${this.name}"}]}`);
        }
    }
}
export function load_log(name = 'games_log', source) {
    try {
        log_env[name].load(source, Object.keys(log_env)[Object.keys(log_env).indexOf(name) + 1]);
    }
    catch {
        runCMD(`titleraw ${source.name} actionbar {"rawtext":[{"text":"[LOGS] \ue116 Failed to load ${name}"}]}`);
    }
}
