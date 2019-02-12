import '@kano/kwc-blockly/blockly.js';
import '../../../elements/kc-asset-picker/kc-asset-picker-dialog.js';


Blockly.FieldAssetPicker = function FieldAssetPicker(heading, type, rootDir, value, root, opt_validator) {
    this._heading = heading;
    this._type = type;
    this._rootDir = rootDir;
    this._expandedValue = value;
    this.root = root;
    Blockly.FieldAssetPicker.superClass_.constructor.call(this, this._expandedValue.item.name, opt_validator);
};
goog.inherits(Blockly.FieldAssetPicker, Blockly.Field);

Blockly.FieldAssetPicker.prototype.showEditor_ = function () {
    this.customEl = document.createElement('kc-asset-picker-dialog');
    this.customEl.assetsRoot = this.root;
    this.customEl.updateStyles({
        '--kc-asset-picker-highlight-color': this.sourceBlock_.getColour(),
    });
    this.customEl.style.maxHeight = '600px';
    this.customEl.style.height = '80vh';
    this.customEl.withBackdrop = true;
    this.customEl.heading = this._heading;
    this.customEl.type = this._type;
    this.customEl.rootDir = this._rootDir;
    this.customEl.fitInto = this.sourceBlock_.workspace.getParentSvg();
    this.customEl.select(this._expandedValue.item.name, this._expandedValue.path);

    this.customEl.addEventListener('value-changed', (e) => {
        this._expandedValue = e.detail.value;
        this.setValue(this._expandedValue.item.name);
        this.customEl.preloadSample(this._expandedValue.item.filename);
        this.customEl.close();
        document.body.removeChild(this.customEl);
    });

    document.body.appendChild(this.customEl);
    this.customEl.open();
};

Blockly.FieldAssetPicker.prototype.setValue = function (value) {
    if (value === null) {
        // No change if null.
        return;
    }
    if (this.sourceBlock_ && Blockly.Events.isEnabled() && this.value_ != value) {
        Blockly.Events.fire(new Blockly.Events.Change(this.sourceBlock_, 'field', this.name, this.value_, value));
    }
    this.value_ = value;
    const parts = this._expandedValue.path.split('/');
    parts.shift();
    parts.shift();
    parts.push(this._expandedValue.item.name);
    this.setText(parts.join(' ▸ '));
};

Blockly.FieldAssetPicker.prototype.getExtendedValue = function (value) {
    return this._expandedValue;
};

Blockly.FieldAssetPicker.prototype.save = function (container) {
    container.setAttribute('sample', JSON.stringify(this._expandedValue));
};

Blockly.FieldAssetPicker.prototype.load = function (container) {
    this._expandedValue = JSON.parse(container.getAttribute('sample'));
    this.setValue(this._expandedValue.item.name);
};

export const FieldAssetPicker = Blockly.FieldAssetPicker;
