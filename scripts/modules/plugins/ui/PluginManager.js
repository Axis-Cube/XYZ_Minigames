import {
    ActionFormData,
    MessageFormData,
    ModalFormData
} from "@minecraft/server-ui"; // Непосредственно создание форм
import { plugins_log } from "../../Logger/logger_env.js";
import { getScore } from "../../axisTools.js";


let Plugins = new ActionFormData()
    .title('axiscube.settings.plugins')
    .body('')

// you can have initial casses
var callbacks = {};

// and you can create new entry with this function
function add(_case, fn) {
    callbacks[_case] = callbacks[_case] || [];
    callbacks[_case].push(fn);
}

// this function work like switch(value)
// to make the name shorter you can name it `cond` (like in scheme)
function pseudoSwitch(value, source) {
    if (callbacks[value]) {
        callbacks[value].forEach(function(fn) {
            fn(source);
        });
    }
}

//Plugins "Friendly" Names
let _plugins = []

//Plugins id
let _files

//Plugins configs
let _config = []


export function configure() {
    try {

        import('../index.js').then(obj => {
            //Getting information about plugins
            _plugins = obj.LPN
            _files = obj.LoadedPlugins
            _config = obj.LoadedConfig

            //Register all plugins
            for (let el = 0; el != _plugins.length; el++) {
                //Adding buttons
                Plugins.button(_plugins[el])
                //Adding case to switch
                add(el, function (source) {
                    //Plugins settings

                    //If ui_features in plugin settings, import ui file
                    if (_config[el].dependencies.indexOf("ui_features") != -1) {
                        try {
                            import(`../plugins/${_files[el]}/ui/index.js`).then(uif => {
                                //Getting ui form
                                let ui = uif.FORM
                                //Getting main function
                                let func = uif.main
                                ui.show(source).then(uicall => {
                                    //Send ui callback to main function in plugin
                                    func(uicall)
                                })
                            })
                        } catch (e) {
                            //Trace errors
                            console.warn(e)
                        }
                    }
                })

            }
        })
    }catch (e){console.warn(e, e.stack)} // Trace errors
}

export function events(name, event){
    try {
        import(`../plugins/${name}/index.js`).then(pl => {
            let _config = pl.config

            plugins_log.put(`§6[PLUGINS] [${name}] - Trying to execute event -> ${event}§r\n`)

            if (_config.dependencies.indexOf("event_listen") != -1) {
                try {
                    import(`../plugins/${name}/events.js`).then(evf => {
    
                        //Getting ui form
                        let EV_LIST = evf.EVENTS
                        try{
                            eval(`EV_LIST.${event}()`)
                            plugins_log.put(`§a[PLUGINS] [${name}] - Successfuly executed event ${event}§r\n`)
                        }catch(e){console.warn(`Event (${event}) not found!`)}
                    })
                } catch (e) {console.error(e)}
            }
        })
    } catch (e) {console.error(e)}
        
}

function error(message, source){
    //Error message form
    let ErrorMessage = new MessageFormData()
        .title("Oops...")
        .body(message)
        .button1("gui.ok")
        .button2("gui.close")
    ErrorMessage.show(source).then()
}
export function showWindow(source){
    if (_plugins.length == 0) {
        //Show error message when plugins not initializated
        error("No plugins found!\nTry to Init", source)
    }else{
        //Show menu with all plugins
        Plugins.show(source).then(obj => {
            pseudoSwitch(obj.selection, source)
        })
    }
}
