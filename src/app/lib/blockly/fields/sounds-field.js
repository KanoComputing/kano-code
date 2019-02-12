import '../../../elements/kc-blockly-sounds.js';

export const FieldSoundsFactory = (Blockly) => {
    // /* eslint no-underscore-dangle: "off" */
    class FieldSounds extends Blockly.Field {
        constructor(value, object, updateShape) {
            super(value);
            object.forEach((obj) => {
                if (obj.label === value) {
                    if (obj.label) {
                        this.value_ = obj.value;
                    }
                }
            });
            this.object = object;
            this.updateShape = updateShape;
        }
        position() {
            const viewportBBox = Blockly.utils.getViewportBBox();
            const anchorBBox = this.getScaledBBox_();
            const elementSize = goog.style.getSize(this.customEl);
            Blockly.WidgetDiv.positionWithAnchor(
                viewportBBox,
                anchorBBox,
                elementSize,
                this.sourceBlock_.RTL,
            );
        }
        showEditor_() {
            Blockly.WidgetDiv.show(
                this,
                this.sourceBlock_.RTL,
                FieldSounds.widgetDispose_,
            );
            const div = Blockly.WidgetDiv.DIV;

            this.customEl = document.createElement('kc-blockly-sounds');
            this.customEl.items = this.object;
            this.customEl.value = this.getValue();
            div.appendChild(this.customEl);
            this.customEl.addEventListener('value-changed', () => {
                this.object.forEach((obj) => {
                    if (obj.label && obj.value === this.customEl.value) {
                        this.value_ = this.customEl.value;
                        this.setValue(obj.label);
                    } else if (obj.value === this.customEl.value) {
                        this.setValue(obj.value);
                    }
                });
                if (this.updateShape) {
                    this.updateShape(this.customEl.value);
                }
            });
            this.position();
            if ('animate' in HTMLElement.prototype) {
                div.animate({
                    opacity: [0, 1],
                }, {
                    duration: 100,
                    easing: 'ease-out',
                });
            }
        }
        static indexValue(element) {
            return element === this.value;
        }
    }
    return FieldSounds;
};

export default FieldSoundsFactory;
