import * as code from '../../index.js';
import * as i18n from '../../i18n.js';

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor();

        editor.inject(document.body);

        const contentWidget = {
            domNode: null,
            getDomNode() {
                if (!this.domNode) {
                    this.domNode = document.createElement('button');
                    this.domNode.textContent = 'Content Widget';
                    this.domNode.style.background = '#212121';
                    this.domNode.style.color = 'white';
                    this.domNode.style.border = '1px solid #2196F3';
                    this.domNode.style.padding = '2px 4px';
                    this.domNode.style.fontFamily = 'Arial';
                    this.domNode.style.fontSize = '14px';
                    // Remove itself when clicked
                    this.domNode.addEventListener('click', () => {
                        editor.removeContentWidget(this);
                    });
                }
                return this.domNode;
            },
            getPosition() {
                return 'block.app_onStart:100,0';
            },
        };

        editor.onDidInject(() => {
            editor.sourceEditor.onDidSourceChange(() => {
                editor.layoutContentWidget(contentWidget);
            });
            editor.addContentWidget(contentWidget);
        });
    });
