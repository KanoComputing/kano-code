import { BlocklySourceEditor } from '../../dist/app/lib/source-editor/blockly.js';
import { registerSourceEditor } from '../../dist/app/lib/source-editor/source-editor.js';

registerSourceEditor('blockly', BlocklySourceEditor);
