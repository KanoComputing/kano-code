import { Part } from './part.js';
import { Editor } from '../editor/editor.js';

/**
 * Controls the content to display in the part list under the output
 */
export abstract class PartInlineDisplay<T extends HTMLElement = HTMLElement> {
    public abstract domNode : T;
    constructor(part : Part) {}
    /**
     * Called when the inline display is added to the list of parts
     * @param editor The editor instance to which this inline display will be added
     */
    abstract onInject(editor : Editor) : void;
    /**
     * Called when the inline display is removed from the list of parts
     */
    abstract onDispose() : void;
}

export class DefaultInlineDisplay extends PartInlineDisplay {
    public domNode: HTMLElement = document.createElement('div');
    onInject() {}
    onDispose() {}
}