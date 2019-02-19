export interface ISelector {
    tag? : string;
    id? : string;
    class? : string;
    child? : ISelector;
}

export interface IRootSelector extends ISelector {
    position? : { x : number, y : number };
}

export interface IQueryResult {
    [K : string] : any;
    getHTMLElement() : HTMLElement|SVGElement;
    getPosition?() : { x : number, y : number };
    getId() : any;
}

export interface ITagHandler {
    (selector : ISelector, parent : IQueryResult|null) : IQueryResult|null;
}

export class QueryEngine {
    private handlers : Map<string, ITagHandler> = new Map();
    static parseValue(selector : ISelector, root : IRootSelector, value : string, modifier : string) {
        if (modifier === '') {
            selector.tag = value;
        } else if (modifier === '#') {
            selector.id = value;
        } else if (modifier === '.') {
            selector.class = value;
        } else if (modifier === '>') {
            selector.child = {};
            selector = selector.child;
            selector.tag = value;
        } else if (modifier === ':') {
            const parts = value.split(',');
            if (parts.length !== 2) {
                return selector;
            }
            const x = parseFloat(parts[0]);
            const y = parseFloat(parts[1]);
            root.position = { x, y };
        }
        return selector;
    }
    registerTagHandler(tag : string, handler : ITagHandler) {
        this.handlers.set(tag, handler);
        return {
            dispose: () => {
                this.handlers.delete(tag);
            },
        };
    }
    parse(input : string) {
        const reg = /#|>|\.|:/g;
        const root : IRootSelector = {};
        let selector = root;
        let res;
        let value;
        let prevIndex = 0;
        let prevModifier = '';
        while ((res = reg.exec(input)) !== null) {
            value = input.substring(prevIndex, res.index);
            selector = QueryEngine.parseValue(selector, root, value, prevModifier);
            prevModifier = res[0];
            prevIndex = reg.lastIndex;
        }
        // Handle the rest of the string
        value = input.substring(prevIndex, input.length);
        QueryEngine.parseValue(selector, root, value, prevModifier);
        return root;
    }
    resolve(selector : ISelector, parent : IQueryResult|null = null) : IQueryResult|null {
        if (!selector.tag) {
            throw new Error('Could not resolve selector: tag is empty');
        }
        const handler = this.handlers.get(selector.tag);
        if (!handler) {
            throw new Error(`Could not resolve selector: '${selector.tag}' is an unknown tag`);
        }
        const result = handler(selector, parent);
        if (!selector.child) {
            return result;
        }
        return this.resolve(selector.child, result);
    }
    query(input : string) {
        const selector = this.parse(input);
        return this.resolve(selector);
    }
    /**
     * Prints a warning mesasge explaining why a query would fail. Used by tagHandlers to provide debugging information about selectors
     * @param message The reason for a query's failure
     */
    warn(message : string) {
        console.warn(`[SELECTOR] ${message}`);
    }
}
