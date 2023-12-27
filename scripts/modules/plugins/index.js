import { runCMD } from "../axisTools";
import {PLUGINS} from "./allowed";
import {configure} from "./ui/PluginManager";
import { plugins_log } from "../Logger/logger_env";

let thing = '\n----------------------------\n';
export let LPN = []
export let LoadedPlugins = []
export let LoadedConfig = []
export function Process(action, param='Empty'){

    switch (action){
        //Initialize function
        case 'Init':
            //Scan all plugins and import them
            for(let element = 0; element != PLUGINS.length; element++) {
                import(`./plugins/${PLUGINS[element]}/index.js`).then( obj => {
                    //Getting config of plugin and misc informtion
                    let _config = obj.config
                    let _version = _config.version
                    let _authors = _config.authors
                    let _name = _config.name
                    let _description = _config.description
                    let _file = _config.file
                    //Pushing values into list
                    LPN.push(`Name: ${_name} | Authors: ${_authors} | Version: ${_version} | Description: ${_description}`)
                    LoadedPlugins.push(_file)
                    LoadedConfig.push(_config)

                    //LOGS
                    plugins_log.put(thing+`[Plugins] "${PLUGINS[element]}" plugin loaded\n`+`Name: ${_name} | Authors: ${_authors} | Version: ${_version} | Description: ${_description}`+thing)
                    //END-OF-LOGS
                    
                    //Console info
                    console.warn(`[Plugins] "${PLUGINS[element]}" plugin loaded`)
                })
            }
            configure()
            console.warn(`[Plugins] All loaded...`)
            break;

        case 'getNames':
            //Getting names of loaded plugins
            runCMD(`say ${LPN}`);
        break;
    }
}
