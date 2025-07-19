export namespace APIRoutes {
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