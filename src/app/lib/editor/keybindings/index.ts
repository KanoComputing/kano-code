import { Plugin } from '../plugin.js';
import { Binding } from './binding.js';
import Editor from '../editor.js';

export class Keybindings extends Plugin {
    private editor? : Editor;
    onInstall(editor : Editor) {
        this.editor = editor;
    }
    register(keys : string, cb : () => any, target : HTMLElement) {
        if (!this.editor) {
            throw new Error('Could not register keybinding: Editor was not installed');
        }
        const binding = new Binding(keys, cb, target || this.editor.rootEl);
        this.editor.root!.appendChild(binding.root);
        return binding;
    }
}

export default Keybindings;
