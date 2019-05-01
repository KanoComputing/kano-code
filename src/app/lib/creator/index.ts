import { ContributionManager } from '../contribution.js';
import { Creator } from './creator.js';
import Editor from '../editor/editor.js';

const registeredCreators = new ContributionManager<typeof Creator>();

export function registerCreator(id : string, creator : typeof Creator) {
    registeredCreators.register(id, creator);
}

export function create(editor : Editor) {
    const CreatorConstructor = registeredCreators.get(editor.sourceType);
    if (!CreatorConstructor) {
        throw new Error(`Could not create creator: Creator for source type '${editor.sourceType}' was not imported.`);
    }
    return new CreatorConstructor(editor);
}
