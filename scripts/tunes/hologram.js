import { system, world } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
function getObjective(entity) {
    const tag = entity.getTags().find(tag => tag.startsWith("objective:"));
    return tag ? tag.slice(10) : null;
}
function getCustomName(entity) {
    const tag = entity.getTags().find(tag => tag.startsWith("title:"));
    return tag ? tag.slice(6) : null;
}
function getScore(entity, allPlayerNames, leaderboardObjective) {
    const tag = entity.getTags().find(tag => tag.startsWith("scores:")) || "scores:[]";
    const existingScores = JSON.parse(tag.slice(7)).filter(([name]) => !allPlayerNames.includes(name));
    const newScore = world.getAllPlayers().map(oyuncu => {
        try {
            return [oyuncu.name, leaderboardObjective.getScore(oyuncu.scoreboardIdentity)];
        }
        catch (error) {
            return null;
        }
    }).filter(v => v);
    const score = existingScores.concat(newScore).sort((a, b) => b[1] - a[1]).slice(0, 10);
    entity.removeTag(tag);
    entity.addTag(`scores:${JSON.stringify(score)}`);
    return score;
}
function updateNameTag(entity, customName, scores) {
    if (scores.length === 0)
        return;
    const nameTag = `${customName || '§cUnnamed'}§r${scores.map(([name, score], i) => `\n§3${i + 1}. §b${name}§r: §d${score}`).join('')}`;
    entity.nameTag = nameTag;
}
export function holoEditor(entity, player) {
    const editor = new ModalFormData()
        .title("Holo Editor v0.1")
        .dropdown("Edit", ["Name_tag", "Name", "Objective", "Kill", "Clear tags"])
        .textField("Editor", "Enter text")
        .show(player).then(ed => {
        if (!ed.formValues) {
            return;
        }
        let [dropdown, text] = ed.formValues;
        switch (dropdown) {
            case 0:
                entity.nameTag = text;
                break;
            case 1:
                entity.addTag(`title:${text}`);
                break;
            case 2:
                entity.addTag(`objective:${text}`);
                break;
            case 3:
                entity.kill();
                break;
            default:
                let tags = entity.getTags();
                for (let el in tags) {
                    entity.removeTag(tags[el]);
                }
                break;
        }
    });
}
system.runInterval(() => {
    const entities = world.getDimension("overworld").getEntities({ type: 'axiscube:hologram' });
    for (const entity of entities) {
        const leader = getObjective(entity);
        if (!leader)
            continue;
        const customName = getCustomName(entity);
        const Objective = world.scoreboard.getObjective(leader);
        const playerNames = world.getAllPlayers().map(oyuncu => oyuncu.name);
        const scores = getScore(entity, playerNames, Objective);
        updateNameTag(entity, customName, scores);
    }
}, 20);
