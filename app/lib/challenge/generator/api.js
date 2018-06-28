function TextareaFieldProvider(Blockly) {
    return class extends Blockly.FieldTextInput {
        constructor(text) {
            super(text, (nextValue) => {
                try {
                    JSON.parse(nextValue);
                } catch (e) {
                    return null;
                }
            });
        }
        showEditor_() {
            this.workspace_ = this.sourceBlock_.workspace;
            Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_());
            const div = Blockly.WidgetDiv.DIV;
            // Create the input.
            const htmlInput =
                goog.dom.createDom(goog.dom.TagName.TEXTAREA, 'blocklyHtmlInput');
            htmlInput.style.width = '300px';
            htmlInput.style.height = '200px';
            htmlInput.setAttribute('spellcheck', this.spellcheck_);
            const fontSize =
                `${Blockly.FieldTextInput.FONTSIZE * this.workspace_.scale}pt`;
            div.style.fontSize = fontSize;
            htmlInput.style.fontSize = fontSize;

            Blockly.FieldTextInput.htmlInput_ = htmlInput;
            div.appendChild(htmlInput);

            htmlInput.value = htmlInput.defaultValue = this.text_;
            htmlInput.oldValue_ = null;
            this.validate_();
            this.resizeEditor_();
            htmlInput.focus();
            htmlInput.select();
            this.bindEvents_(htmlInput);
        }
        onHtmlInputKeyDown_(e) {
            const htmlInput = Blockly.FieldTextInput.htmlInput_;
            const escKey = 27;
            const tabKey = 9;
            if (e.keyCode == escKey) {
                htmlInput.value = htmlInput.defaultValue;
                Blockly.WidgetDiv.hide();
            } else if (e.keyCode == tabKey) {
                const cIndex = htmlInput.selectionStart;
                htmlInput.value = [htmlInput.value.slice(0, cIndex), // Slice at cursor index
                    '    ', // Add Tab
                    htmlInput.value.slice(cIndex)].join('');// Join with the end
                e.stopPropagation();
                e.preventDefault(); // Don't quit the area
                htmlInput.selectionStart = cIndex + 4;
                htmlInput.selectionEnd = cIndex + 4;
            }
        }
    };
}

export const GeneratorAPIProvider = editor => ({
    type: 'module',
    name: 'generator',
    verbose: 'Challenge',
    color: '#676767',
    symbols: [{
        type: 'function',
        name: 'banner',
        parameters: [{
            name: 'text',
            default: "'Banner content'",
            returnType: String,
            blockly: {
                field: true,
            },
        }],
        blockly: {
            javascript(Blockly, block) {
                const bannerText = block.getFieldValue('TEXT');
                return `// @banner: ${bannerText}\n`;
            },
        },
    }, {
        type: 'function',
        name: 'start',
        blockly: {
            javascript(Blockly) {
                return '// @challenge-start\n';
            },
        },
    }, {
        type: 'function',
        name: 'step',
        parameters: [{
            name: 'json',
            returnType: String,
            blockly: {
                customField(Blockly) {
                    const TextareaField = TextareaFieldProvider(Blockly);
                    return new TextareaField(`{
    
}`);
                },
            },
        }],
        blockly: {
            javascript(Blockly) {
                return '// @step\n';
            },
        },
    }],
});

export default GeneratorAPIProvider;

