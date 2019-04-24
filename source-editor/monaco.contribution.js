import { MonacoSourceEditor } from '../dist/app/lib/source-editor/monaco.js';
import { registerSourceEditor } from '../dist/app/lib/source-editor/source-editor.js';

registerSourceEditor('monaco', MonacoSourceEditor);
