import { system, world } from "@minecraft/server"
import { DIM } from "const"
import { getPlayerSoundMessage, SOUNDMSG } from "tunes/profile";
import { getEmojiItembyValue, getPurchasedItems, STORE_ITEMS } from "tunes/store";
import { APICallback } from "./stream";

export function APIDataEncoder(type:responseTypes, data: any){
    switch (type){
        case responseTypes.ARRAY:
            return JSON.stringify(data).replace(/\"/g, "'")
        case responseTypes.LIST:
            return data.join("|")
        case responseTypes.STRING:
            return data;
        case responseTypes.NULL:
            return "null"
    }
}

export function APIDataDecoder(type:responseTypes, data: any){
    switch (type){
        case responseTypes.ARRAY:
            return JSON.parse(data.replace(/\'/g, '"'))
        case responseTypes.LIST:
            return data.split("|")
        case responseTypes.STRING:
            return data;
        case responseTypes.NULL:
            return "null"
    }
}


export enum responseTypes {
    NULL = 0,
    LIST = 1,
    ARRAY = 2,
    STRING = 3
}

export interface APIPayload extends BasicPayload{
    callback: string;
};

interface BasicPayload {
    code?: number
    name?: string,
    responseType: responseTypes,
    data?: any
}

namespace APIRoutes {
    //STORE: getEmojiItembyValue, getPurchasedItems, STORE_ITEMS
    let storeServerPrefix = "api:store_"
    export const STORE = {
        "ITEMS_TABLE": `${storeServerPrefix}itemsTable`,
        "PURCHASED_ITEMS": `${storeServerPrefix}purchasedItems`,
        "EMOJI_BY_VALUE": `${storeServerPrefix}emojiByValue`
    }

    //PROFILE: SOUNDMSG, getPlayerSoundMessage
    let profileServerPrefix = "api:profile_"
    export const PROFILE = {
        "SOUNDMSG": `${profileServerPrefix}soundMsg`,
        "PLAYERSOUNDMSG": `${profileServerPrefix}playerSoundMsg`
    }
}

system.afterEvents.scriptEventReceive.subscribe(e=>{
    let payload: BasicPayload = {code: 0, responseType: responseTypes.NULL};
    let callbackID = '0';

    try{
        let id = e.id;
        if(id.includes("api:")){
            let data: APIPayload = JSON.parse(e.message.replace(/\'/g, '"'))
            callbackID = data.callback
            switch (id){
                case APIRoutes.STORE.ITEMS_TABLE:
                    payload.responseType = responseTypes.ARRAY
                    payload.data = APIDataEncoder(responseTypes.ARRAY, STORE_ITEMS)
                    payload.code = 200
                break;

                case APIRoutes.STORE.PURCHASED_ITEMS:
                    payload.responseType = responseTypes.LIST
                    payload.data = APIDataEncoder(responseTypes.LIST, getPurchasedItems(data.name))
                    payload.code = 200
                break;

                case APIRoutes.STORE.EMOJI_BY_VALUE:
                    payload.responseType = responseTypes.ARRAY
                    payload.data = APIDataEncoder(responseTypes.ARRAY, getEmojiItembyValue(data.data?.table!!, data.data?.emoji!!))
                    payload.code = 200
                break;

                case APIRoutes.PROFILE.PLAYERSOUNDMSG:
                    payload.responseType = responseTypes.STRING
                    payload.data = APIDataEncoder(responseTypes.STRING, getPlayerSoundMessage(data.name))
                    payload.code = 200
                break;

                case APIRoutes.PROFILE.SOUNDMSG:
                    payload.responseType = responseTypes.ARRAY
                    payload.data = APIDataEncoder(responseTypes.ARRAY, SOUNDMSG),
                    payload.code = 200
            }

            if(payload.code == 0) throw 0;
            else{
                APICallback(callbackID, JSON.stringify(payload))
            }
        }
    }catch(e){
        console.error(e, e.stack)
        //DIM.runCommand(`scriptevent ${callbackID} 0`)
    }
})