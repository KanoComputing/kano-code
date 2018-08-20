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

class VM {
    constructor(context) {
        this.context = context || {};
    }

    runInContext(script) {
        const contextKeywords = Object.keys(this.context);
        const exclude = FORBIDDEN.filter(keyword => contextKeywords.indexOf(keyword) === -1);
        let pieces = [];
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
}

export default VM;
