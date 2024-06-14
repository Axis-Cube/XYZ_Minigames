import { world } from "@minecraft/server";
import { CHAT_CODES, CHAT_CODES_AV } from "../../const";
import { playsound, rawtext } from "../axisTools";
import { getEmojiItembyValue, getPurchasedItems, STORE_ITEMS } from "../../tunes/store";
import { SOUNDMSG, getPlayerSoundMessage } from "../../tunes/profile";
import { CCcall, COMMAND_PREFIXES } from "./CHandler";

const regex = new RegExp(":" + Object.keys(CHAT_CODES).join(":|:") + ":", "g");
export function sendChatMessage(messageData) {
    const player = messageData.sender
    let finalMessage = messageData.message
    let prefix = ''

    //Custom Commands call
    if(COMMAND_PREFIXES.includes(messageData.message[0])){
        messageData.cancel = true
        let tempArgs = messageData.message.slice(1).split(" ")
        let args = []
        for(let i=0; i<=tempArgs.length; i++){
            args.push(tempArgs[i])
        }

        CCcall(args, player)
    }else{

        
        //End of Custom Commands

        if (player.hasTag('spec')) prefix = '§8[%axiscube.games.role.spectator§8]§r '
        finalMessage = finalMessage.replace(/\%/g,'%%')

        //Поиск эмодзи в сообщении
        let find_emojis = [...finalMessage.matchAll(regex)]
        let messaged = false
        //Выполнение для каждого эмодзи
        for(let i in find_emojis){
            //Получение названия эмодзи
            let temp = find_emojis[i][0]
            temp = temp.replaceAll(":", "")
            //Проверка куплен ли эмодзи, при этом получение id эмодзи через getEmojiItembyValue(table, value)
            if (!CHAT_CODES_AV[temp] || [...getPurchasedItems(`${player.name}`)].includes(Number(getEmojiItembyValue(STORE_ITEMS, temp)))){
                try{
                    //Попытка заменить сообщение
                    finalMessage = finalMessage.replaceAll(`:${[temp]}:`, CHAT_CODES[[temp]])
                }catch{}
            } else if(Number(getEmojiItembyValue(temp) == -1)){
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
        //'random.pop2' : ['Pop2!',[1,1.5],[1,1]],
        const sound = getPlayerSoundMessage(player.name)
        playsound(sound,player,SOUNDMSG[sound[1][0]],SOUNDMSG[sound[1][1]])
        playsound(sound,`@a[name=!"${player.name}"]`,SOUNDMSG[sound[2][0]],SOUNDMSG[sound[2][1]])
    }
}