import { ISelector, QueryEngine } from './selector.js';

export function aliasTagHandlerFactory(queryEngine : QueryEngine, map : Map<string, string>) {
    return (selector : ISelector) => {
        if (!selector.id) {
            throw new Error('Could not find alias: No id provided');
        }
        const s = map.get(selector.id);
        if (!s) {
            throw new Error(`Could not find alias: '${selector.id}' was not registered before`);
        }
        return queryEngine.query(s);
    };
}
