import { Editor } from '../editor/editor.js';
import { IBriefingData, Briefing } from './briefing.js';
import { ContributionManager } from '../contribution.js';

const registeredBriefings = new ContributionManager<typeof Briefing>();

export function registerBriefing(id : string, briefing : typeof Briefing) {
    registeredBriefings.register(id, briefing);
}

export function createBriefing(editor : Editor, data : IBriefingData) {
    const BriefingConstructor = registeredBriefings.get(editor.sourceType);
    if (!BriefingConstructor) {
        throw new Error(`Could not create briefing: Briefing for source type '${editor.sourceType}' was not imported.`);
    }
    return new BriefingConstructor(editor, data);
}
