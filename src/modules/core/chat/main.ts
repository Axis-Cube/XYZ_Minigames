import { world } from "@minecraft/server";
import { CHAT_CODES, CHAT_CODES_AV } from "#root/const";
import { playsound, rawtext } from "#modules/axisTools";
import { getEmojiItembyValue, getPurchasedItems, STORE_ITEMS } from "#tunes/store";
import { SOUNDMSG, getPlayerSoundMessage } from "#tunes/profile";
import { CCcall, COMMAND_PREFIXES } from "./CHandler";

//#region Constants
const regex = new RegExp(":" + Object.keys(CHAT_CODES).join(":|:") + ":", "g");
//#endregion

//#region Functions
export function sendChatMessage(messageData) {
    const player = messageData.sender
    let finalMessage = messageData.message
    let prefix = ''

    //Custom Commands call
    if(COMMAND_PREFIXES.includes(messageData.message[0])){
        messageData.cancel = true
        let tempArgs = messageData.message.slice(1).split(" ")
        let args: any = []
        for(let i=0; i<=tempArgs.length; i++){
            args.push(tempArgs[i])
        }

        CCcall(args, player)
    }else{
        if(player.hasTag('spec')) prefix = '§8[%axiscube.games.role.spectator§8]§r'
        finalMessage = finalMessage.replace(/\%/g,'%%')

        //Поиск эмодзи в сообщении
        let find_emojis = [...finalMessage.matchAll(regex)]
        let messaged = false
        //Выполнение для каждого эмодзи
        for(let i in find_emojis){
            //Получение названия эмодзи
            let temp: any  = find_emojis[i][0]
            temp = temp.replaceAll(":", "")
            //Проверка куплен ли эмодзи, при этом получение id эмодзи через getEmojiItembyValue(table, value)
            if (!CHAT_CODES_AV[temp] || [...getPurchasedItems(`${player.name}`)].includes(Number(getEmojiItembyValue(STORE_ITEMS, temp)))){
                try{
                    //Попытка заменить сообщение
                    finalMessage = finalMessage.replaceAll(`:${[temp]}:`, CHAT_CODES[temp])
                }catch{}
            } else if(Number(getEmojiItembyValue(STORE_ITEMS, temp) == -1)){
                //Действия если эмодзи не найден
                //finalMessage = finalMessage.replaceAll(`:${[temp]}:`, CHAT_CODES[[temp]])
                if (!messaged) {
                    rawtext('axiscube.chat.emoji.buy',player.name,'translate','c')
                    messaged = true
                }
            } else {
                //Повтор на всякий, для всех исключений
                if (!messaged) {
                    rawtext('axiscube.chat.emoji.buy',player.name,'translate','c')
                    messaged = true
                }
            }
        }

        world.sendMessage(`${prefix}${player.nameTag}§r: ${finalMessage}`)
        const sound = getPlayerSoundMessage(player.name)
        playsound(sound,player,SOUNDMSG[sound[1][0]],SOUNDMSG[sound[1][1]])
        playsound(sound,`@a[name=!"${player.name}"]`,SOUNDMSG[sound[2][0]],SOUNDMSG[sound[2][1]])
    }
}
//#endregion