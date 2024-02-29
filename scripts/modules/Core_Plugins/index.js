import { getScore, runCMD } from "../axisTools";
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
            try{
                //Scan all plugins and import them
                for(let element = 0; element != PLUGINS.length; element++) {
                    console.warn(PLUGINS[element])
                    if(getScore(PLUGINS[element],'data.plugins') == 0){continue}
                    console.warn(`./plugins/${PLUGINS[element]}/index.js`)
                    import(`./plugins/${PLUGINS[element]}/index.js`).then( obj => {
                        console.warn(`${PLUGINS[element]} ------- ${JSON.stringify(obj)}`)
                        //Getting config of plugin and misc informtion
                        let _config = obj.config
                        let _version = _config.version.toString().replaceAll(',','.')
                        let _authors = _config.authors.toString().replaceAll(',',', ')
                        let _name = _config.name
                        let _description = _config.description
                        let _file = _config.file
                        //Pushing values into list
                        LPN.push(`${_name}\nv${_version} by ${_authors}`)
                        LoadedPlugins.push(_file)
                        LoadedConfig.push(_config)

                        //LOGS
                        plugins_log.put(thing+`[Plugins] "${PLUGINS[element]}" plugin loaded\n`+`Name: ${_name}\nAuthors: ${_authors}\nVersion: v${_version}\nDescription: ${_description}`+thing)
                        //END-OF-LOGS
                        
                        //Console info
                        console.warn(`[Plugins] "${PLUGINS[element]}" plugin loaded`)
                    })
                }
                configure()
                console.warn(`[Plugins] All loaded...`)
                break;
            }catch(e){
                plugins_log.put(`[PL ERR] `+e.stack+'\n'+e)
            }

        case 'getNames':
            //Getting names of loaded plugins
            runCMD(`say ${LPN}`);
        break;
    }
}
