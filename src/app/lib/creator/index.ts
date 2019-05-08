import { ContributionManager } from '../contribution.js';
import { Creator } from './creator.js';
import Editor from '../editor/editor.js';

export interface ICreatorHelper {
    [K : string] : (...args : any[]) => any;
}

const registeredCreators = new ContributionManager<typeof Creator>();
const registeredHelpers = new ContributionManager<ICreatorHelper[]>();

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

export function registerCreatorHelper(id : string, helper : ICreatorHelper) {
    const helpers = registeredHelpers.get(id) || [];
    helpers.push(helper);
    registeredHelpers.register(id, helpers);
}

export function getHelpers(id : string) {
    return registeredHelpers.get(id);
}
