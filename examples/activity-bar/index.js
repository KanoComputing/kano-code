import * as code from '../../index.js';
import * as i18n from '../../i18n.js';

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor();

        editor.inject(document.body);

        editor.onDidInject(() => {
            let widgets = [];
    
            function createWidget(block) {
                return {
                    domNode: null,
                    getDomNode() {
                        if (!this.domNode) {
                            this.domNode = document.createElement('div');
                            this.domNode.textContent = block.type;
                            this.domNode.style.marginTop = '-24px';
                            this.domNode.style.background = '#212121';
                            this.domNode.style.color = 'white';
                            this.domNode.style.border = '1px solid #2196F3';
                            this.domNode.style.padding = '2px 4px';
                            this.domNode.style.fontFamily = 'Arial';
                            this.domNode.style.fontSize = '14px';
                        }
                        return this.domNode;
                    },
                    getPosition() {
                        // Different position based on the type of block
                        if (block.outputConnection) {
                            return `block#${block.id}:100,50`
                        }
                        return `block#${block.id}`;
                    },
                }
            }
            const button = document.createElement('button');
            button.textContent = 'Hello :)'
            button.style.margin = '32px';
            
            editor.activityBar.registerTooltipEntry({
                title: 'Display hello',
                icon: '/examples/activity-bar/icon.png',
                root: button,
            });
            // Add the button in the activity bar
            const entry = editor.activityBar.registerEntry({
                title: 'Display types',
                icon: '/examples/activity-bar/icon.png',
            });


    
            // On mouse click, tap, keyboard selection, etc...
            entry.onDidActivate(() => {
                if (widgets.length) {
                    // If there are widgets, clear them
                    widgets.forEach(w => editor.removeContentWidget(w));
                    widgets.length = 0;
                } else {
                    // If no widget. create them
                    const workspace = editor.sourceEditor.getWorkspace();
                    const blocks = workspace.getAllBlocks();
                    widgets = blocks.map(block => createWidget(block));
                    widgets.forEach(w => editor.addContentWidget(w));
                }
            });
        });
    });
