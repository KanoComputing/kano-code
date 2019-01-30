const FORBIDDEN = [
    'window',
    'top',
    'Window',
    'Document',
    'document',
    'console',
    'alert',
    'releaseEvents',
    'localStorage',
    'KW_SDK',
    'Kano',
    'open',
    'location',
    'parent',
    'postMessage',
    'print',
    'profile',
    'prompt',
    'scroll',
    'scrollBy',
    'scrollTo',
    'scrollX',
    'scrollY',
    'session',
    'sessionStorage',
];

declare global {
    interface Window { userCode: Function; }
}

export interface IVMContext {
    [K : string] : string;
}

class VM {
    private context : IVMContext;
    constructor(context : IVMContext = {}) {
        this.context = context;
    }

    runInContext(script : string) {
        const contextKeywords = Object.keys(this.context);
        const exclude = FORBIDDEN.filter(keyword => contextKeywords.indexOf(keyword) === -1);
        let pieces : string[] = [];
        let thisValue;

        // Look for the `this` keyword in the context
        const thisIndex = contextKeywords.indexOf('this');

        if (thisIndex !== -1) {
            // Remove `this` from the context keys
            exclude.splice(thisIndex, 1);
            // Store the value of `this` as defined in the context
            thisValue = this.context.this;
        }

        // Set the forbidden keywords to undefined
        pieces = pieces.concat(exclude.map(keyword => `${keyword} = undefined`));

        // Create the wrapped code
        const wrapper = `window.userCode = function (${contextKeywords.join(', ')}){\nvar ${pieces.join(', ')};\n${script}}`;

        // This will create the `userCode` function in the window Object
        eval(wrapper);

        // Call the function.`this` will be set to undefined inside the VM if not set in the context
        window.userCode.apply(thisValue, contextKeywords.map(keyword => this.context[keyword]));
    }
    dispose() {
        delete window.userCode;
    }
}

export default VM;
