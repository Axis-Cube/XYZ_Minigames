import { edScore, getTargetByScore } from "#modules/axisTools";
import { magicIt } from "#modules/playerNameTag";

const DATABASE = 'data.userapi'

export function toCheeseId(id,typeId='') {
    if (typeof id == "string") id = magicIt(`${typeId}${id}`)
    return id
}

/**
 * @param {String} id
 * @param {Object} defaultData
 * @param {String} db
 * @returns {Object}
*/

export function dbGetRecord(id,defaultData={},db=DATABASE) {
    let rawData = getTargetByScore(toCheeseId(id),db,defaultData)
    if (typeof rawData == 'object') return rawData
    rawData = rawData.replace(/\'/g,'"')
    return JSON.parse(rawData)
}

/**
 * @param {String} id
 * @param {Object} newData
 * @param {String} db
*/
export async function dbSetRecord(id,newData={},db=DATABASE) {
    let rawData = getTargetByScore(toCheeseId(id),db,'{}')
    await edScore(rawData,db,'','reset')
    await edScore(JSON.stringify(newData).replace(/\"/g,"'"),db,toCheeseId(id))
}

/**
 * @param {String} id
 * @param {Object} newData
 * @param {String} db
*/
export async function dbRemoveRecord(id,db=DATABASE) {
    let rawData = getTargetByScore(toCheeseId(id),db,'{}')
    await edScore(rawData,db,'','reset')
}

/**
 * @param {String} id
 * @param {Object} defaultData
 * @param {String} db
 * @returns {Object}
*/

export function dbGetPlayerRecord(name,typeId,defaultData={},db=DATABASE) {
    let rawData = getTargetByScore(toCheeseId(name,typeId),db,defaultData)
    if (typeof rawData == 'object') return rawData
    rawData = rawData.replace(/\'/g,'"')
    return JSON.parse(rawData)
}

/**
 * @param {String} id
 * @param {Object} newData
 * @param {String} db
*/
export async function dbSetPlayerRecord(name,typeId,newData={},db=DATABASE) {
    let rawData = getTargetByScore(toCheeseId(name,typeId),db,'{}')
    await edScore(rawData,db,'','reset')
    await edScore(JSON.stringify(newData).replace(/\"/g,"'"),db,toCheeseId(name,typeId))
}