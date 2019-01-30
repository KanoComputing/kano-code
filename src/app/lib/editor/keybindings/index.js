import { Plugin } from '../plugin.js';
import { Binding } from './binding.js';

export class Keybindings extends Plugin {
    onInstall(editor) {
        this.editor = editor;
    }
    register(keys, cb, target) {
        const binding = new Binding(keys, cb, target || this.editor.rootEl);
        this.editor.root.appendChild(binding.root);
        return binding;
    }
}

export default Keybindings;
