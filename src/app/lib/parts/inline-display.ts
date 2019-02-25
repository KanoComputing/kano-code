import { Part } from './part.js';

/**
 * Controls the content to display in the part list under the output
 */
export abstract class PartInlineDisplay<T extends HTMLElement = HTMLElement> {
    public abstract domNode : T;
    constructor(part : Part) {}
    abstract onInject() : void;
}

export class DefaultInlineDisplay extends PartInlineDisplay {
    public domNode: HTMLElement = document.createElement('div');
    onInject() {}
}