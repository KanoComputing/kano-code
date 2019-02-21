import { subscribeTimeout, IDisposable, EventEmitter } from '@kano/common/index.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { flash } from './icons.js';
import { BlocklySourceEditor } from '../../editor/source-editor/blockly.js';
import Editor from '../../editor/editor.js';
import { FlashField } from './field.js';

export class Flash {
    public domNode: HTMLDivElement = document.createElement('div');
    private timeoutSub : IDisposable|null = null;
    constructor() {
        this.domNode.style.display = 'flex';
        this.domNode.style.fill = '#8F9195';
        this.domNode.style.flexDirection = 'row';
        this.domNode.style.justifyContent = 'flex-end';
        this.domNode.appendChild(flash.content.cloneNode(true));
        const icon = this.domNode.querySelector('svg');
        icon!.style.width = '14px';
        icon!.style.height = '14px';
    }
    trigger() {
        if (this.timeoutSub) {
            this.timeoutSub.dispose();
            this.timeoutSub = null;
        }
        // Make sure the flash begins with the off state. This will force a flicker on fast triggers
        this.domNode.style.fill = '#8F9195';
        setTimeout(() => {
            this.domNode.style.fill = 'yellow';
            this.timeoutSub = subscribeTimeout(() => {
                this.domNode.style.fill = '#8F9195';
            }, 500);
        }, 50);
    }
}

/**
 * Prepends a flash field to the provided block's first input.
 * Does nothing if the provided block doesn't have any inputs
 * @param block Target block to add the flash field onto
 */
export function addFlashField(block : Block) {
    if (!block.inputList.length) {
        return;
    }
    block.inputList[0].insertFieldAt(0, new FlashField(''), 'FLASH');
}

/**
 * Subscribe to the provided event, find all blocks listening to the event and trigger their flash field
 * @param editor The target editor
 * @param id Unique id of the target module
 * @param emitter The event emitter triggering the event to flash
 * @param method The name of the method reacting to the event
 */
export function setupFlash(editor : Editor, id : string, emitter : EventEmitter, method : string) {
    if (editor.sourceType !== 'blockly') {
        return;
    }
    const sourceEditor = editor.sourceEditor as BlocklySourceEditor;
    emitter.event(() => {
        const workspace = sourceEditor.getWorkspace();
        const blocks = workspace.getAllBlocks();
        blocks.filter((block) => block.type === `${id}_${method}`)
            .forEach((block) => {
                const field = block.getField('FLASH') as FlashField;
                field.trigger();
            });
    });
}
