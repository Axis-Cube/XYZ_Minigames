import { system } from "@minecraft/server";
import { DIM } from "const";

function cutStream(data: string): string[]{
    let dataBlocks = data.match(/.{1,50}/g);
    return dataBlocks!!
}

export function APICallback(callbackCode: string, data: string){
    let stream = cutStream(data);
    //Передаем данные
    for(let i=0; i < stream.length; i++){
        DIM.runCommand(`scriptevent callback:id${callbackCode}_${(i==stream.length-1?"F":i)} "${stream[i]}"`)
    }
    
}