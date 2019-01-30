import Plugin from './editor/plugin.js';

class UserPlugin extends Plugin {
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {
        if (this.editor.sourceType === 'blockly') {
            const sourceView = this.editor.getElement('source-view');
            sourceView.noUser = false;
            sourceView.noBack = false;
        }
    }
}


export default UserPlugin;
