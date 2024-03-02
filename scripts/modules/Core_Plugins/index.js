import { ActionFormData, MessageFormData, } from "@minecraft/server-ui"; // Непосредственно создание форм
import { getScore, runCMD } from "../axisTools";
import { plugins_log } from "../Logger/logger_env";
//Plugins
import { config_map_info } from "./plugins/map_info/index.js";
//Packed_Ui
import { packui_map_info } from "./plugins/map_info/ui/index.js";
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

    async register(config, packed_ui = false) {
        if (getScore(this.name, 'data.plugins') != 0) {
            let _config = config
            let _version = _config.version.toString().replaceAll(',', '.')
            let _authors = _config.authors.toString().replaceAll(',', ', ')
            let _name = _config.name
            let _description = _config.description
            let _file = _config.file

            //Pushing values into list
            LPN.push(`${_name}\nv${_version} by ${_authors}`)
            LoadedPlugins.push(_file)
            LoadedConfig.push(_config)

            //LOGS
            plugins_log.put(thing + `[Plugins] "${_name}" plugin loaded\n` + `Name: ${_name}\nAuthors: ${_authors}\nVersion: v${_version}\nDescription: ${_description}` + thing)

            if (packed_ui != false) {
                let ui = packed_ui[0]
                let func = packed_ui[1]
                //Ui Creation
                for (let el = 0; el != LPN.length; el++) {
                    Plugins.button(LPN[el])
                    add(el, function (source) {
                        //Plugins setting
                        //If ui_features in plugin settings, import ui file
                        if (LoadedConfig[el].dependencies.indexOf("ui_features") != -1) {
                            try {
                                ui.show(source).then(uicall => { /*Send ui callback to main function in plugin*/ func(uicall) })
                            } catch (e) { /*Trace errors*/ console.warn(e) }
                        }
                    })
                }
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
            let map_info = new Core_Plugins('map_info').register(config_map_info, packui_map_info)
        break;
        case 'getNames':
            //Getting names of loaded plugins
            runCMD(`say ${LPN}`);
        break;
    }
}

export function showWindow(source){ if (LPN.length == 0){ /*Show error message when plugins not initializated*/ error("No plugins found!\nTry to Init", source)}else{ /*Show menu with all plugins*/ Plugins.show(source).then(obj => { pseudoSwitch(obj.selection, source) }) } }
function error(message, source){ /*Error message form*/ let ErrorMessage = new MessageFormData() .title("Oops...").body(message).button1("gui.ok").button2("gui.close");ErrorMessage.show(source).then() }