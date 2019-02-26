import { Workspace, Blockly } from '@kano/kwc-blockly/blockly.js';
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
