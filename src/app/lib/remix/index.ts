import { ContributionManager } from '../contribution.js';
import { Remix, IRemix } from './remix.js';
import { Editor } from '../editor/editor.js';

const registeredRemix = new ContributionManager<typeof Remix>();

export function registerRemix(id : string, remix : typeof Remix) {
    registeredRemix.register(id, remix);
}

export function createRemix(editor : Editor, remixData : IRemix) {
    const RemixConstructor = registeredRemix.get(editor.sourceType);
    if (!RemixConstructor) {
        throw new Error(`Could not create remix: Remix for source type '${editor.sourceType}' was not imported`);
    }
    return new RemixConstructor(editor, remixData);
}

export * from './remix.js';
