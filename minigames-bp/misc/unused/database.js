import { world } from '@minecraft/server'
import {runCMD} from './axisTools'
import {db_log} from './Logger/logger_env'
import { DIM } from '../const'

export function getTargetByScore(score=0,objectiveId='data',ifNothing=undefined) {
    const oB = world.scoreboard.getObjective(objectiveId)
    for (let trg of [...oB.getParticipants()]) {
        if (oB.getScore(trg) === score) {
            return trg.displayName
        }
    }
    return ifNothing
}

export class DataBase{

    constructor(container){
        this.container = container
    }

    async set(data, id='*') {
        try{
            let dt = new Date()                                                         //Generate id by timestamp(seconds) / ceil
            data = JSON.stringify(data).replaceAll('"', '\\"')                          //Encode JSON
            if(id !== '*'){ //If id in args
                if(getTargetByScore(Number(id),this.container,undefined) != undefined){ //If table(id) Exist //////////////////////
                    await this.destroy(Number(id))                                      //Destroy old table
                    runCMD(`scoreboard players set "${data}" ${this.container} ${id}`)  //Create new table with custom id
                    return id                                //Return data /// END *********************
                }else{                                                                  //Else ////////////////////////////////////
                    runCMD(`scoreboard players set "${data}" ${this.container} ${id}`)  //Create new table with custom id
                    return id                                //Return data /// END *********************
                }
            }else{
                id = Math.ceil(dt.getTime()/1000)                                       //Get seconds in timestamp
                runCMD(`scoreboard players set "${data}" ${this.container} ${id}`)      //Create new table with Timestamp id
                return id                                       //Return data /// END *********************
            }
        }catch(e){
            db_log.put('DB: Set Err ' + e)
        }
    }

    async add(id, key, value) {                                                   //Get args from message
        if (!isNaN(Number(value))){                                                   //If number in JSON ////////////////////////
            value = Number(value)                                                   //Convert String into Number
        }
        try{
        if(getTargetByScore(Number(id),this.container,undefined) != undefined){    //If table(id) Exist ////////////////////// 
            let raw = getTargetByScore(Number(id),this.container,undefined)        //Getting Scoreboard Participant
            raw = raw.replaceAll('\\','')                                               //Decode JSON
            let pre = JSON.parse(raw)                                                   //JSON
            pre[key] = value                                                      //Adding new element
            pre = JSON.stringify(pre).replaceAll('"', '\\"')                            //Encode JSON

            if(await this.destroy(id)){                                            //If destroy successful ///////////////////
                runCMD(`scoreboard players set "${pre}" ${this.container} ${id}`)  //Create new table with custom id
                return true
            }else{
                throw new Error('Deleting Err')
            }
        }
        }catch(e){
            db_log.put('DB: Add Err ' + e)
            return false
        }
    }

    load(id) {
        return getTargetByScore(Number(id),this.container,undefined).replaceAll('\\','') //Getting Scoreboard Participant and Decode
    }

    read(id, part){
        //Getting Scoreboard Participant, Decode, Return part of JSON
        try{
            return JSON.parse(getTargetByScore(Number(id),this.container,undefined).replaceAll('\\',''))[part] 
        }catch(e){
            db_log.put('DB: Read Err ' + e)
            return false
        }

    }

    remove(id, part){
        //Decode JSON
        let json = JSON.parse(getTargetByScore(Number(id),this.container,undefined).replaceAll('\\',''))
        try{
            //Deleting element
            delete json[part]
            //Create new table with custom id
            this.set(json, id)
            return true
        }catch(e){
            db_log.put('DB: Remove Err ' + e)
            return false
        }
    }

    async destroy(id){
        try{
            if(getTargetByScore(Number(id),this.container,undefined)!= undefined){      //If table(id) Exist
                //Resetting old Participant
                DIM.runCommandAsync(`scoreboard players reset "${getTargetByScore(Number(id),this.container,undefined)}" ${this.container}`)
                return true
            }else{
                throw new Error('Didnt exist')
            }
        }catch(e){
            db_log.put('DB: Destroy Err' + e)
            return false
        }
    }
}