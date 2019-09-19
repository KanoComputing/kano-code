import {
    Blockly,
    goog,
    FieldNumber,
    utils,
    WidgetDiv,
    FieldTextInput,
    Block,
} from '@kano/kwc-blockly/blockly.js';
import '@kano/kwc-number-inputs/kwc-dial.js';

/* eslint no-underscore-dangle: "off" */
export class FieldAngle extends FieldNumber {
    customEl: any;
    sourceBlock_: any;
    workspace_: any;
    position() {
        const viewportBBox = utils.getViewportBBox();
        const anchorBBox = this.getScaledBBox_();
        const elementSize = goog.style.getSize(this.customEl);
        const y = WidgetDiv.calculateY_(
            viewportBBox,
            anchorBBox,
            elementSize,
        );
        if (y < anchorBBox.top) {
            this.customEl.style.transform = 'translateY(-100%)';
            this.customEl.style.top = 0;
            this.customEl.style.position = 'absolute';
        }
    }

    showEditor_() {
        this.workspace_ = this.sourceBlock_.workspace;
        let quietInput = false;
        if (goog.userAgent.IPHONE || goog.userAgent.IPAD || goog.userAgent.ANDROID) {
            quietInput = true;
        }
        this.showInlineEditor_(quietInput);
        const div = WidgetDiv.DIV;
        let lastCall = 0;

        function throttleAngle(delay : number, fn : Function) {
            const now = (new Date()).getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            fn();
        }
        const updateAngle = () => {
            this.setValue(this.customEl.value);
            FieldTextInput.htmlInput_.value = this.customEl.value;
        };

        this.customEl = document.createElement('kwc-dial');
        this.customEl.value = this.getValue();
        this.customEl.suffix = '°';
        div.appendChild(this.customEl);
        this.customEl.addEventListener('value-changed', () => {
            throttleAngle(250, updateAngle);
        });
        this.customEl.addEventListener('mouseup', () => {
            throttleAngle(0, updateAngle);
        });
        this.customEl.addEventListener('touchend', () => {
            throttleAngle(0, updateAngle);
        });
        this.position();
        if ('animate' in HTMLElement.prototype) {
            div.animate({
                opacity: [0, 1],
            }, {
                duration: 100,
                easing: 'ease-out',
            });
        } else {
            div.style.opacity = '1';
        }
    }

    onHtmlInputChange_() {
        super.onHtmlInputChange_();
        this.customEl.value = this.getValue();
    }

    onMouseUp_(e : MouseEvent) {
        if (utils.isRightButton(e)) {
            // Right-click.

        } else if (this.sourceBlock_.workspace.isDragging() || this.sourceBlock_.isInFlyout) {
            // Drag operation is concluding.  Don't open the editor.

        } else if (this.sourceBlock_.isEditable()) {
            // Non-abstract sub-classes must define a showEditor_ method.
            this.showEditor_();
            // The field is handling the touch, but we also want the blockSvg onMouseUp
            // handler to fire, so we will leave the touch identifier as it is.
            // The next onMouseUp is responsible for nulling it out.
        }
    }
}

export default FieldAngle;
