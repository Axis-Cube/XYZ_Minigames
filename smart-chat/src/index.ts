import { system, world } from "@minecraft/server";
import { CHAT_CODES, CHAT_CODES_AV } from "./const";
import { playsound, rawtext } from "./utils/toolsMinimal";
import { callAPI } from "utils/api/client";
import { APIRoutes } from "utils/api/routes";

async function getEmojiItembyValue(table: object, emoji: string): Promise<Number>{
    return Number((await callAPI(APIRoutes.STORE.EMOJI_BY_VALUE, {data: {table: table, emoji: emoji}})))
}

async function getPurchasedItems(name: string): Promise<string[]>{
    return await callAPI(APIRoutes.STORE.PURCHASED_ITEMS, {name: name})
}

async function getPlayerSoundMessage(name: string): Promise<string>{
    return await callAPI(APIRoutes.PROFILE.PLAYERSOUNDMSG, {name:name})
}


const regex = new RegExp(":" + Object.keys(CHAT_CODES).join(":|:") + ":", "g");

world.beforeEvents.chatSend.subscribe(async chat => {
    let msg = chat.message;
    let sender = chat.sender
    chat.cancel = true

    //CONSTANTS
    const STORE_ITEMS = await callAPI(APIRoutes.STORE.ITEMS_TABLE, {})
    const SOUNDMSG = await callAPI(APIRoutes.PROFILE.SOUNDMSG, {})
    let prefix = '';
    
    if (sender.hasTag('spec')) prefix = '§8[%axiscube.games.role.spectator§8]§r '
    msg = msg.replace(/\%/g,'%%')

    //Поиск эмодзи в сообщении
    let find_emojis = [...msg.matchAll(regex)]
    let messaged = false
    //Выполнение для каждого эмодзи
    for(let i in find_emojis){
        //Получение названия эмодзи
        let temp: any  = find_emojis[i][0]
        temp = temp.replaceAll(":", "")
        //Проверка куплен ли эмодзи, при этом получение id эмодзи через getEmojiItembyValue(table, value)
        if (!CHAT_CODES_AV[temp] || [...(await getPurchasedItems(`${sender.name}`))].includes(String(await getEmojiItembyValue(STORE_ITEMS, temp)))){
            try{
                //Попытка заменить сообщение
                msg = msg.replaceAll(`:${[temp]}:`, CHAT_CODES[temp])
            }catch{}
        } else if(await getEmojiItembyValue(STORE_ITEMS, temp) == -1){
            //Действия если эмодзи не найден
            //msg = msg.replaceAll(`:${[temp]}:`, CHAT_CODES[[temp]])
            if (!messaged) {
                rawtext('axiscube.chat.emoji.buy',sender.name,'translate','c')
                messaged = true
            }
        } else {
            //Повтор на всякий, для всех исключений
            if (!messaged) {
                rawtext('axiscube.chat.emoji.buy',sender.name,'translate','c')
                messaged = true
            }
        }
    }

    world.sendMessage(`${prefix}${sender.nameTag}§r: ${msg}`)
    //'random.pop2' : ['Pop2!',[1,1.5],[1,1]],
    const sound = await getPlayerSoundMessage(sender.name)
    playsound(sound,sender,SOUNDMSG[sound[1][0]],SOUNDMSG[sound[1][1]])
    playsound(sound,`@a[name=!'${sender.name}']`,SOUNDMSG[sound[2][0]],SOUNDMSG[sound[2][1]])
    
})