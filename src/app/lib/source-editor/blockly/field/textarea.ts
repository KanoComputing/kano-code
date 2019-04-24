import { FieldTextInput, WidgetDiv, Workspace, goog } from '@kano/kwc-blockly/blockly.js';

export class TextareaField extends FieldTextInput {
    workspace_? : Workspace;
    constructor(text : string) {
        super(text, (nextValue : string) => {
            try {
                JSON.parse(nextValue);
            } catch (e) {
                return null;
            }
        });
    }
    showEditor_() {
        this.workspace_ = this.sourceBlock_.workspace;
        WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_());
        const div = WidgetDiv.DIV;
        // Create the input.
        const htmlInput =
            goog.dom.createDom(goog.dom.TagName.TEXTAREA, 'blocklyHtmlInput');
        htmlInput.style.width = '300px';
        htmlInput.style.height = '200px';
        htmlInput.setAttribute('spellcheck', this.spellcheck_);
        const fontSize =
            `${FieldTextInput.FONTSIZE * this.workspace_.scale}pt`;
        div.style.fontSize = fontSize;
        htmlInput.style.fontSize = fontSize;

        FieldTextInput.htmlInput_ = htmlInput;
        div.appendChild(htmlInput);

        htmlInput.value = htmlInput.defaultValue = this.text_;
        htmlInput.oldValue_ = null;
        this.validate_();
        this.resizeEditor_();
        htmlInput.focus();
        htmlInput.select();
        this.bindEvents_(htmlInput);
    }
    onHtmlInputKeyDown_(e : KeyboardEvent) {
        const htmlInput = FieldTextInput.htmlInput_;
        const escKey = 27;
        const tabKey = 9;
        if (e.keyCode == escKey) {
            htmlInput.value = htmlInput.defaultValue;
            WidgetDiv.hide();
        } else if (e.keyCode == tabKey) {
            const cIndex = htmlInput.selectionStart;
            if (cIndex === null) {
                return;
            }
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