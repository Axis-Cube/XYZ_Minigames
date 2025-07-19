import { responseTypes } from "./client";

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