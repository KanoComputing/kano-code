import '../../../../../elements/kano-motion-zone-input/kano-motion-zone-input.js';
Blockly.FieldMotionZone = function (value, part, opt_validator) {
    this._part = part;
    Blockly.FieldDropdown.superClass_.constructor.call(this, value || 1, opt_validator);
};
goog.inherits(Blockly.FieldMotionZone, Blockly.FieldDropdown);

Blockly.FieldMotionZone.prototype.showEditor_ = function () {
    Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, Blockly.FieldMotionZone.widgetDispose_);

    // Position the palette to line up with the field.
    var anchorBBox = this.getScaledBBox_(),
        viewportBBox = Blockly.utils.getViewportBBox(),
        div = Blockly.WidgetDiv.DIV,
        paletteSize;
    
    customEl = document.createElement('kano-motion-zone-input');
    customEl.style.background = 'white';
    customEl.style.borderRadius = '6px';
    customEl.value = parseInt(this.getValue());

    customEl.addEventListener('value-changed', (e) => {
        this.setValue(e.detail.value);
        Blockly.WidgetDiv.hide();
    });

    this._gaugePoll = setInterval(() => {
        customEl.gauge = this._part.lastProximityValue;
    }, 50);

    div.appendChild(customEl);
    paletteSize = goog.style.getSize(customEl);
    Blockly.WidgetDiv.positionWithAnchor(viewportBBox, anchorBBox, paletteSize, this.sourceBlock_.RTL);
};

Blockly.FieldMotionZone.widgetDispose_ = function () {
    clearInterval(this._gaugePoll);
};

Blockly.FieldMotionZone.prototype.setValue = function (value) {
    if (value === null) {
        // No change if null.
        return;
    }
    if (this.sourceBlock_ && Blockly.Events.isEnabled() && this.value_ != value) {
        Blockly.Events.fire(new Blockly.Events.Change(this.sourceBlock_, 'field', this.name, this.value_, value));
    }
    this.value_ = value.toString();
    this.setText(this.value_);
};

export const FieldMotionZone = Blockly.FieldMotionZone;
