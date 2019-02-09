import { ApplicationModule } from './app.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { addFlashField, setupFlash } from '../../plugins/flash.js';
import { IAPIDefinition } from '../../meta-api/module.js';

export const AppAPI : IAPIDefinition = {
    type: 'module',
    name: ApplicationModule.id,
    color: '#5fc9f3',
    verbose: 'App',
    symbols: [{
        type: 'function',
        name: 'onStart',
        verbose: 'when app starts',
        parameters: [{
            type: 'parameter',
            name: 'callback',
            verbose: '',
            returnType: Function,
        }],
        blockly: {
            postProcess(block : Block) {
                addFlashField(block);
                block.setPreviousStatement(false);
                block.setNextStatement(false);
            },
        },
    }, {
        type: 'function',
        name: 'restart',
        verbose: 'restart app',
    }],
    onInstall(editor, mod : ApplicationModule) {
        setupFlash(editor, ApplicationModule.id, mod._onDidStart, 'onStart');
    },
};
