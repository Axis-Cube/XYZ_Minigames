import { world } from "@minecraft/server";
import { upgradeItem } from "#games/hg"
import { prkCheckpointTp } from "#games/prk";
import { runCMDs } from "#modules/axisTools";

world.beforeEvents.worldInitialize.subscribe((initEvent) => {
    initEvent.blockComponentRegistry.registerCustomComponent("axiscube:interact", {
        onPlayerInteract: async ({player, block}) => {
            if(!player?.isValid() || !block) return;

            switch(block.typeId){
                case "axiscube:hg_upgrade":
                    upgradeItem(player)
                break;
                default:
                break;
            }
        }
    })
    
    initEvent.itemComponentRegistry.registerCustomComponent("axiscube:item_use", {
        onUse: async ({source, itemStack}) => {
            if(!source.isValid() || !itemStack) return;

            switch(itemStack.typeId){
                case "axiscube:book_of_speed":
                    runCMDs([
                        "playsound block.beehive.enter @s",
                        "effect @s speed 7 3 true",
                        "clear @s axiscube:book_of_speed 0 1"
                    ], source)
                break;
                case "mcxyz:fireball":
                    runCMDs([
                            "execute as @s[tag=!nab] run summon fireball ^^1^1",
                            "clear @s mcxyz:fireball 0 1",
                            "playsound mob.ghast.fireball @s ~~~"
                    ], source)
                break;
                case "mcxyz:levitation_item":
                    runCMDs([
                        "playsound block.beehive.enter @a",
                        "effect @s levitation 1 10 true",
                        "particle minecraft:example_flipbook",
                        "effect @s slow_falling 3 0 true",
                        "clear @s[m=!c] mcxyz:levitation_item 0 1"
                    ], source)
                break;
                case "axiscube:back_to_checkpoint":
                    prkCheckpointTp(source)
                break;
                default:
                break;
            }
        }
    })
})
