export interface ISelector {
    tag? : string;
    id? : string;
    class? : string;
    child? : ISelector;
}

export interface IQueryResult {
    [K : string] : any;
    getHTMLElement() : HTMLElement|SVGElement;
    getId() : any;
}

export interface ITagHandler {
    (selector : ISelector, parent? : IQueryResult) : IQueryResult;
}

export class QueryEngine {
    private handlers : Map<string, ITagHandler> = new Map();
    static parseValue(selector : ISelector, value : string, modifier : string) {
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
        }
        return selector;
    }
    registerTagHandler(tag : string, handler : ITagHandler) {
        this.handlers.set(tag, handler);
    }
    parse(input : string) {
        const reg = /#|>|\./g;
        const root : ISelector = {};
        let selector = root;
        let res;
        let value;
        let prevIndex = 0;
        let prevModifier = '';
        while ((res = reg.exec(input)) !== null) {
            value = input.substring(prevIndex, res.index);
            selector = QueryEngine.parseValue(selector, value, prevModifier);
            prevModifier = res[0];
            prevIndex = reg.lastIndex;
        }
        // Handle the rest of the string
        value = input.substring(prevIndex, input.length);
        QueryEngine.parseValue(selector, value, prevModifier);
        return root;
    }
    resolve(selector : ISelector, parent? : IQueryResult) : IQueryResult {
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
}
