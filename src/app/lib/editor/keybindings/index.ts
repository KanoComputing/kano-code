/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Plugin } from '../plugin.js';
import { Binding } from './binding.js';
import Editor from '../editor.js';

export class Keybindings extends Plugin {
    private editor? : Editor;
    onInstall(editor : Editor) {
        this.editor = editor;
    }
    /**
    * @example
    *```js
    *
    *keybindings.register('ctrl+g', () => console.log('Keybinding triggered'));
    *keybindings.register('esc', () => console.log('Keybinding triggered'), input);
    *```
    */
    register(keys : string, cb : () => any, target? : HTMLElement) {
        if (!this.editor) {
            throw new Error('Could not register keybinding: Editor was not installed');
        }
        const binding = new Binding(keys, cb, target || this.editor.domNode);
        this.editor.root!.appendChild(binding.root);
        return binding;
    }
}

export default Keybindings;
