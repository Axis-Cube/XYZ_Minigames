import {system} from "@minecraft/server";

system.beforeEvents.startup.subscribe((initEvent) => {
    initEvent.blockComponentRegistry.registerCustomComponent("axiscube:interact", {
        onPlayerInteract: async ({player, block}) => {
            if(!player?.isValid || !block) return;

            switch(block.typeId){
                case "axiscube:hg_upgrade":
                    import("./games/hg").then(({upgradeItem}) => {
                        upgradeItem(player)
                    })
                break;
                default:
                break;
            }
        }
    })
    
    initEvent.itemComponentRegistry.registerCustomComponent("axiscube:item_use", {
        onUse: async ({source, itemStack}) => {
            if(!source.isValid || !itemStack) return;

            import("./modules/axisTools").then(({runCMDs})=>{
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
                    default:
                        break;
                }
            })
        }
    })
})