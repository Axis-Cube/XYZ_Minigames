import {
    ActionFormData,
    MessageFormData,
    ModalFormData
} from "@minecraft/server-ui"; // Непосредственно создание форм

export let FORM = new ModalFormData()
    .title('Hello')
    .toggle('Test', true)

export function main(response){
    let [toggle] = response.formValues;
    console.warn(toggle)
}