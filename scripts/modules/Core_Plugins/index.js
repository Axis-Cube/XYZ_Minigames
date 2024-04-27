import { ActionFormData, MessageFormData, } from "@minecraft/server-ui"; // Непосредственно создание форм
import { getScore, runCMD } from "../axisTools";
import { plugins_log } from "../Logger/logger_env";
//Plugins
import { config_map_info } from "./plugins/map_info/index.js";
//Packed_Ui
import { packui_map_info } from "./plugins/map_info/ui/index.js";
import { config_admin_panel } from "./plugins/admin_panel/index.js";
import { packui_admin_panel } from "./plugins/admin_panel/ui/index.js";
import { ICONS } from "../../const.js";
/*==============================================================*/
let thing = '\n----------------------------\n';
let Plugins = new ActionFormData().title('axiscube.settings.plugins').body('');
export let LPN = []
export let LoadedPlugins = []
export let LoadedConfig = []
export let LoadedUi = []
var callbacks = {};
function add(_case, fn) { callbacks[_case] = callbacks[_case] || []; callbacks[_case].push(fn); }
function pseudoSwitch(value, source) { if (callbacks[value]) { callbacks[value].forEach(function(fn) { fn(source); }); } }

export class Core_Plugins {
    constructor(name) {
        this.name = name
    }

    async register(id, config, packed_ui = false) {
        if (getScore(this.name, 'data.plugins') != 0) {
            let _config = config
            let _version = _config.version.toString().replaceAll(',', '.')
            let _authors = _config.authors.toString().replaceAll(',', ', ')
            let _name = _config.name
            let _description = _config.description

            //Pushing values into list
            LPN.push(`${_name}\nv${_version} by ${_authors}`)
            //LoadedPlugins.push(_file)
            LoadedConfig.push(_config)

            //LOGS
            plugins_log.put(thing + `[Plugins] "${_name}" plugin loaded\n` + `Name: ${_name}\nAuthors: ${_authors}\nVersion: v${_version}\nDescription: ${_description}` + thing)

            if (packed_ui != false) {
                let ui = packed_ui[0]
                let func = packed_ui[1]
                //Ui Creation
                    Plugins.button(LPN[id], (LoadedConfig[id].icon)?LoadedConfig[id].icon:ICONS.default_plugin)
                    add(id, function (source) {
                        //Plugins setting
                        //If ui_features in plugin settings, import ui file
                        if (LoadedConfig[id].dependencies.indexOf("ui_features") != -1) {
                            try {
                                ui.show(source).then(async uicall => { /*Send ui callback to main function in plugin*/ await func(uicall, source) })
                            } catch (e) { /*Trace errors*/ console.warn(e) }
                        }
                    })
            }
        }
    }
}

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

//import {PLUGINS} from "./allowed";
export function Process(action, param='Empty'){
    switch (action){
        //Initialize function
        case 'Init':
            let admin_panel = new Core_Plugins('admin_panel').register(0, config_admin_panel, packui_admin_panel)
            let map_info = new Core_Plugins('map_info').register(1, config_map_info, packui_map_info)
        break;
        case 'getNames':
            //Getting names of loaded plugins
            runCMD(`say ${LPN}`);
        break;
    }
}

export function showWindow(source){ if (LPN.length == 0){ /*Show error message when plugins not initializated*/ error("No plugins found!\nTry to Init", source)}else{ /*Show menu with all plugins*/ Plugins.show(source).then(obj => { pseudoSwitch(obj.selection, source) }) } }
function error(message, source){ /*Error message form*/ let ErrorMessage = new MessageFormData() .title("Oops...").body(message).button1("gui.ok").button2("gui.close");ErrorMessage.show(source).then() }