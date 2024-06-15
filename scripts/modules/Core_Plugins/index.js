import { ActionFormData, MessageFormData, } from "@minecraft/server-ui"; // Непосредственно создание форм
import { plugins_log } from "../Logger/logger_env.js";
import { getScore, runCMD } from "../axisTools.js";
import { ICONS } from "../../const.js";
//Plugins
import { config_admin_panel } from "./plugins/admin_panel/config";
import { config_map_prefix } from "./plugins/map_prefix/config";
import { config_map_info } from "./plugins/map_info/config";
//Packed_Ui
import { packui_admin_panel } from "./plugins/admin_panel/ui/index.js";
import { packui_map_prefix } from "./plugins/map_prefix/ui/index.js";
import { packui_map_info } from "./plugins/map_info/ui/index.js";
/*==============================================================*/
let thing = '\n----------------------------\n';
function pseudoSwitch(value, source) { if (callbacks[value]) {
    callbacks[value].forEach(function (fn) { fn(source); });
} }
function add(_case, fn) { callbacks[_case] = callbacks[_case] || []; callbacks[_case].push(fn); }
let Plugins = new ActionFormData().title('axiscube.settings.plugins').body('');
export let LPN = [];
export let LoadedPlugins = [];
export let LoadedConfig = [];
export let LoadedUi = [];
var callbacks = {};
export class Core_Plugins {
    constructor(name) {
        this.name = name;
    }
    async register(id, config, packed_ui = false) {
        if (getScore(this.name, 'data.plugins') != 0) {
            await import(`../Core_Plugins/plugins/${config.file}/index`); //Import file if plugin enabled
            let _config = config;
            let _version = _config.version.toString().replaceAll(',', '.');
            let _authors = _config.authors.toString().replaceAll(',', ', ');
            let _name = _config.name;
            let _file = _config.file;
            let _description = _config.description;
            let _dependencies = _config.dependencies;
            //Pushing values into list
            LPN.push(`${_name}\nv${_version} by ${_authors}`);
            //LoadedPlugins.push(_file)
            LoadedConfig.push(_config);
            //LOGS
            plugins_log.put(thing + `§l[Plugins] "${_name}" plugin loaded\n§r` + `File: ${_file}\nDependencies: §2${_dependencies.join(', ')}§r\nAuthors: ${_authors}\nVersion: v${_version}\nDescription: ${_description}` + thing);
            if (packed_ui != false) {
                let ui = packed_ui[0];
                let func = packed_ui[1];
                //Ui Creation
                Plugins.button(LPN[id], (LoadedConfig[id].icon) ? LoadedConfig[id].icon : ICONS.default_plugin);
                add(id, function (source) {
                    //Plugins setting
                    //If ui_features in plugin settings, import ui file
                    if (LoadedConfig[id].dependencies.indexOf("ui_features") != -1) {
                        try {
                            ui.show(source).then(async (uicall) => { await func(uicall, source); });
                        }
                        catch (e) { /*Trace errors*/
                            console.warn(e);
                        }
                    }
                });
            }
        }
    }
}
export function Process(action, param = 'Empty') {
    switch (action) {
        //Initialize function
        case 'Init':
            let admin_panel = new Core_Plugins('admin_panel').register(0, config_admin_panel, packui_admin_panel);
            let map_info = new Core_Plugins('map_info').register(1, config_map_info, packui_map_info);
            let map_prefix = new Core_Plugins('map_prefix').register(2, config_map_prefix, packui_map_prefix);
            break;
        case 'getNames':
            //Getting names of loaded plugins
            runCMD(`say ${LPN}`);
            break;
    }
}
export function showWindow(source) { if (LPN.length == 0) { /*Show error message when plugins not initializated*/
    error("No plugins found!\nTry to Init", source);
}
else { /*Show menu with all plugins*/
    Plugins.show(source).then(obj => { pseudoSwitch(obj.selection, source); });
} }
function error(message, source) { /*Error message form*/ let ErrorMessage = new MessageFormData().title("Oops...").body(message).button1("gui.ok").button2("gui.close"); ErrorMessage.show(source).then(); }
//Отложено на дальнюю полку
//Пройтись по LoadedConfigs 
//export function events(name, event){
//    try {
//        let _config = pl.config
//
//        plugins_log.put(`§6[PLUGINS] [${name}] - Trying to execute event -> ${event}§r\n`)
//
//        if (_config.dependencies.indexOf("event_listen") != -1) {
//            try {
//                import(`../plugins/${name}/events.js`).then(evf => {
//
//                    //Getting ui form
//                    let EV_LIST = evf.EVENTS
//                    try{
//                        eval(`EV_LIST.${event}()`)
//                        plugins_log.put(`§a[PLUGINS] [${name}] - Successfuly executed event ${event}§r\n`)
//                    }catch(e){console.warn(`Event (${event}) not found!`)}
//                })
//            } catch (e) {console.error(e)}
//        }
//    } catch (e) {plugins_log.put(`[PL ERR] `+e+'\n'+e.stack)}
//        
//}
