import { ICONS } from "./const";
import { getScore } from "./modules/axisTools";

export const FORMS = {
    mainmenu: {
        title: "%axiscube.form.mainmenu",
        body: "%axiscube.form.mainmenu.d",
        buttons: [
            {
                button_name: "%axiscube.form.games",
                icon: "textures/ui/icons/gamepad", 
                on_click: [ { "type": "form", "value": "gamesel" } ]
            },
            {
                button_name: "%axiscube.profile",
                icon: "textures/ui/icons/avatars/1", 
                on_click: [ { "type": "eval", "value": "formProfile(player)" } ]
            },
            {
                button_name: "%axiscube.testrun",
                icon: ICONS.console, 
                visible: getScore('testrun', 'settings')==1,
                on_click: [ { "type": "eval", "value": "formTestRun(player)" } ]
            },
            {
                button_name: "%axiscube.settings.map",
                icon: ICONS.settings, 
                on_click: [ { "type": "eval", "value": "formMapSettings(player)" } ]
            }
        ]
    },
    gamesel: {
        title: "%axiscube.form.games",
        body: "%axiscube.form.games.d",
        buttons: [
            {
                button_name: "%axiscube.form.games.p1",
                icon: "textures/ui/icons/plr1", 
                on_click: [ { "type": "eval", "value": "formGameChooser(player,1)" } ]
            },
            {
                button_name: "%axiscube.form.games.p2",
                icon: "textures/ui/icons/plr2", 
                on_click: [ { "type": "eval", "value": "formGameChooser(player,2,true)" } ]
            },
            {
                button_name: "%gui.back",
                icon: ICONS.back, 
                on_click: [ { "type": "form", "value": "mainmenu" } ]
            }
        ]
    }
};