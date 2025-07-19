import { ActionFormData } from "@minecraft/server-ui";
import { runCMD } from "../modules/axisTools";
export function AboutManu(target) {
    let t = target;
    let name = t.name;
    let form = new ActionFormData()
        .body("About Menu")
        .button("Test");
    form.show(t).then(af => {
        if (af.canceled) { }
        else {
            switch (af.selection) {
                case 0:
                    runCMD('say 1');
                    break;
                default:
                    runCMD('say default');
                    break;
            }
        }
    });
}
