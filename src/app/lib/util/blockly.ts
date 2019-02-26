import { Workspace, Blockly, Block } from '@kano/kwc-blockly/blockly.js';
import { IDisposable } from '@kano/common/index.js';

export function onDidCreateBlockType(workspace : Workspace, type : string, cb : (e : any) => void) : IDisposable {
    const callback = (e : any) => {
        if (e.type !== Blockly.Events.CREATE || e.blockType !== type) {
            return;
        }
        cb(e);
    };
    workspace.addChangeListener(callback);
    return {
        dispose: () => {
            workspace.removeChangeListener(callback);
        },
    };
}

/**
 * Walk a Block tree upwards. Returns null if reached the top. Returns whatever non-false value the visitor returned
 * @param block A blockly block
 * @param cb A function that will be called on every block up the tree. Return false to continue walking
 */
export function walkUpstream<T>(block : Block, cb : (block : Block) => T|false) : T|null {
    const parent = block.getParent();
    if (!parent) {
        return null;
    }
    const result = cb(parent);
    if (result !== false) {
        return result;
    }
    return walkUpstream(parent, cb);
}
