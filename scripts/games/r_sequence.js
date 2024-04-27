import { world } from "@minecraft/server";
import { playsound, setTickTimeout, setblock } from "../modules/axisTools";

let buttons = { //Buttons coordinates (like 3.25.-9 x.y.z)
    1: '3.25.-9', 2: '2.25.-9', 3: '1.25.-9',
    4: '3.24.-9', 5: '2.24.-9', 6: '1.24.-9',
    7: '3.23.-9', 8: '2.23.-9', 9: '1.23.-9',

}

let blocks = { //Blocks coordinates (like 3.25.-9 x.y.z)
    1: '3.25.-8', 2: '2.25.-8', 3: '1.25.-8',
    4: '3.24.-8', 5: '2.24.-8', 6: '1.24.-8',
    7: '3.23.-8', 8: '2.23.-8', 9: '1.23.-8',
}

let sequence = [] //Dynamic

function getRandomNum(min, max) {return Math.random() * (max - min) + min;}
function addToSequence(){sequence.push(Math.floor(getRandomNum(1,10)))}
//function showHint(list){
//    for(let i=0;i!=list.length;i++){
//        setTickTimeout(() => {
//        let cords = blocks[sequence[i]].split('.')
//        setblock(cords[0],cords[1],cords[2],'green_concrete')},70)  
//    }
//    //removeHint(list)
//}
//function removeHint(list){
//    for(let z=0;z!=list.length;z++){
//        setTickTimeout(() => {
//        let cords = blocks[sequence[z]].split('.')
//        setblock(cords[0],cords[1],cords[2],'stone')},70)  
//    }
//}



export function start(p){
    sequence.push(Math.floor(getRandomNum(1,10)))
    console.warn(sequence)
    let player = p 
    let seq_lenght = sequence.length
    let i = 0


let bpevent = world.afterEvents.buttonPush.subscribe(bp => {
        let s_p = bp.source
        let bl = bp.block.location
        let coords = (`${bl.x}.${bl.y}.${bl.z}`)

        if(sequence.length == i+1){
            if(coords == buttons[sequence[i]]){
                i++
                playsound('random.pop',s_p,1,1.5)
                addToSequence()
                console.warn(sequence + ' New game')
                i = 0
                //showHint(sequence)
                
            }else{stop(bpevent)}
        }else{
            if(coords == buttons[sequence[i]]){
                playsound('random.pop2', s_p, 1,1.5)
                i++
            }else{stop(bpevent)}
        }
    })

}
function stop(event){
    world.afterEvents.buttonPush.unsubscribe(event)
    sequence = []
}