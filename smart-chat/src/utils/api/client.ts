import { system, world } from "@minecraft/server";
import { randomInt } from "utils/toolsMinimal";
import { APIDataDecoder } from "./utils";

export enum responseTypes {
    NULL = 0,
    LIST = 1,
    ARRAY = 2,
    STRING = 3
}

export interface APIPayload extends BasicPayload{
    callback?: string;
};

interface BasicPayload {
    code?: number
    name?: string,
    responseType?: responseTypes,
    data?: any
}

function* receiveStream(callbackCode: string, APIRoute: string, payload: APIPayload, returnData: Function){
    let stream: string[] = [];
    
    const _event = system.afterEvents.scriptEventReceive.subscribe(e => {
        let packageID = e.id.split(`callback:id${callbackCode}_`)[1]
        if(packageID){

            switch(packageID){
                //Финальный пакет
                case 'F':
                    stream.push(e.message.replace(/^"(.*)"$/, '$1'))
                    let data = stream.join('');
                    let payload: APIPayload = JSON.parse(data)
                    let decoded = APIDataDecoder(payload.responseType!!, payload.data)
                    system.afterEvents.scriptEventReceive.unsubscribe(_event)
                    returnData(decoded);
                    break;
                //Остальные пакеты
                default:
                    stream.push(e.message.replace(/^"(.*)"$/, '$1'))
                    break;
            }
        }
    })
    system.run(()=>{
        world.getDimension('overworld').runCommand(`scriptevent ${APIRoute} ${JSON.stringify(payload).replace(/\"/g, "'")}`)
    })
    yield;
    
}

export async function callAPI(route: string, payload: APIPayload): Promise<any>{
    try{
        return new Promise((resolve)=>{
            let callbackCode = randomInt(10000,99999).toString();
            payload['callback'] = callbackCode
            function returnData(obj: object){resolve(obj);}
            system.runJob(receiveStream(callbackCode, route, payload, returnData))
        })
    }catch(e){console.error(e, e.stack)}
}