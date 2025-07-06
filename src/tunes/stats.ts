import {edScore, getScore} from "../modules/axisTools"

const DB_NAME = 'data.stats'
const STATS_IDS = [ ]

export async function addStats(statId,sum=1) {
    await edScore(statId,DB_NAME,sum,'add')
}

export function getStats(statId) {
    return getScore(statId,DB_NAME)
}