import Part from '../part.js';

const STYLE_CONF = {
    'background-color': {
        key: 'background-color',
        type: 'color',
        label: 'Background',
    },
    color: {
        key: 'color',
        type: 'color',
        label: 'Color',
    },
    width: {
        key: 'width',
        type: 'range',
        label: 'Width',
        boundTo: 'width',
        symbol: 'px',
    },
    height: {
        key: 'height',
        type: 'range',
        label: 'Height',
        boundTo: 'height',
        symbol: 'px',
    },
    background: {
        key: 'background',
        type: 'color',
        label: 'Background',
    },
    'font-size': {
        key: 'font-size',
        type: 'range',
        label: 'Text size',
        symbol: 'em',
        min: 1,
        max: 20,
        step: 1,
    },
    'font-weight': {
        key: 'font-weight',
        type: 'font-weight',
        label: 'Text weight',
    },
    'font-family': {
        key: 'font-family',
        type: 'list',
        label: 'Text font',
        options: [{
            value: 'Bariol',
            label: 'Bariol',
        },
        {
            value: 'Serif',
            label: 'Serif',
        },
        {
            value: 'Monospace',
            label: 'Monospace',
        }],
    },
};

class UI extends Part {
    static get id() { return 'ui'; }
    constructor(opts, manager, size) {
        super(opts, manager);
        this.customizable = Object.assign({}, opts.customizable) || { style: [], properties: [] };
        this.customizable.properties = this.customizable.properties || [];
        if (opts.customizable && opts.customizable.style) {
            this.customizable.style = opts.customizable.style.map((key) => {
                const style = STYLE_CONF[key];
                if (style.boundTo === 'width') {
                    style.max = size.width;
                } else if (style.boundTo === 'height') {
                    style.max = size.height;
                }
                return style;
            });
        }
        this.partType = UI.id;
        this.rotation = opts.rotation || 0;
        this.rotationDisabled = typeof opts.rotationDisabled === 'undefined' ? false : opts.rotationDisabled;
        this.scaleDisabled = typeof opts.scaleDisabled === 'undefined' ? false : opts.scaleDisabled;
        this.scale = opts.scale || 100;
        this.visible = typeof opts.visible === 'undefined' ? true : opts.visible;
        // Each UI part has its specific component to render on the screen
        this.tagName = opts.component || `kano-ui-${this.type}`;
        this.configPanel = opts.configPanel || 'kano-ui-editor';
        this.excludeDefaultBlocks = typeof opts.excludeDefaultBlocks === 'undefined' ? false : opts.excludeDefaultBlocks;
        this.showDefaultConfiguration = typeof opts.showDefaultConfiguration === 'undefined' ? true : opts.showDefaultConfiguration;

        if (this.excludeDefaultBlocks) {
            return;
        }
        this.blocks.push({
            block: ui => ({
                id: 'ui_move_by',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_MOVE_BY}`,
                args0: [{
                    type: 'input_value',
                    name: 'pixels',
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function (block) {
                let x = Blockly.JavaScript.valueToCode(block, 'pixels') || 0,
                    code = `devices.get('${ui.id}').moveAlong(${x});\n`;
                return code;
            },
        });
        if (!this.rotationDisabled) {
            this.blocks.push({
                block: ui => ({
                    id: 'ui_rotate',
                    message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_ROTATE}`,
                    args0: [{
                        type: 'field_dropdown',
                        name: 'DIR',
                        options: [
                            ['\u21BB', 'cw'],
                            ['\u21BA', 'ccw'],
                            ['to', 'absolute'],
                        ],
                    }, {
                        type: 'input_value',
                        name: 'DEG',
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null,
                }),
                javascript: ui => function (block) {
                    let dir = block.getFieldValue('DIR'),
                        deg = Blockly.JavaScript.valueToCode(block, 'DEG') || 0,
                        method = 'rotate',
                        code;
                    if (dir === 'ccw') {
                        deg *= -1;
                    }
                    if (dir === 'absolute') {
                        method = 'absolute_rotate';
                    }
                    code = `devices.get('${ui.id}').${method}(${deg});\n`;
                    return code;
                },
            });
        }
        this.legacyBlocks.push({
            block: ui => ({
                id: 'ui_rotate_clockwise',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_ROTATE_CLOCKWISE}`,
                args0: [{
                    type: 'input_value',
                    name: 'DEG',
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function (block) {
                let deg = Blockly.JavaScript.valueToCode(block, 'DEG') || 0,
                    code;
                code = `devices.get('${ui.id}').rotate(${deg});\n`;
                return code;
            },
        });
        this.legacyBlocks.push({
            block: ui => ({
                id: 'ui_rotate_counter_clockwise',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_ROTATE_COUNTER_CLOCKWISE}`,
                args0: [{
                    type: 'input_value',
                    name: 'DEG',
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function (block) {
                let deg = Blockly.JavaScript.valueToCode(block, 'DEG') || 0,
                    code;
                code = `devices.get('${ui.id}').rotate(-1 * ${deg});\n`;
                return code;
            },
        });
        this.legacyBlocks.push({
            block: ui => ({
                id: 'ui_absolute_rotate',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_ABSOLUTE_ROTATE}`,
                args0: [{
                    type: 'input_value',
                    name: 'DEG',
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function (block) {
                let deg = Blockly.JavaScript.valueToCode(block, 'DEG') || 0,
                    code = '';
                if (deg) {
                    code = `devices.get('${ui.id}').absolute_rotate(${deg});\n`;
                }
                return code;
            },
        });
        if (!this.scaleDisabled) {
            this.blocks.push({
                block: ui => ({
                    id: 'ui_scale',
                    message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_SCALE}`,
                    args0: [{
                        type: 'input_value',
                        name: 'FACTOR',
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null,
                }),
                javascript: ui => function (block) {
                    let factor = Blockly.JavaScript.valueToCode(block, 'FACTOR') || 100,
                        code;
                    code = `devices.get('${ui.id}').scale(${factor});\n`;
                    return code;
                },
            });
        }
        this.legacyBlocks.push({
            block: ui => ({
                id: 'ui_scale_rel',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_RELATIVE_SCALE}`,
                args0: [{
                    type: 'input_value',
                    name: 'FACTOR',
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function (block) {
                let factor = Blockly.JavaScript.valueToCode(block, 'FACTOR') || 0,
                    code;
                code = `devices.get('${ui.id}').resize(${factor});\n`;
                return code;
            },
        });
        this.blocks.push({
            block: ui => ({
                id: 'ui_set_x_y',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_SET_X_Y}`,
                args0: [{
                    type: 'input_value',
                    name: 'X',
                },
                {
                    type: 'input_value',
                    name: 'Y',
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function (block) {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    y = Blockly.JavaScript.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${ui.id}').setXY(${x}-1,${y}-1);\n`;
                return code;
            },
        });
        this.legacyBlocks.push({
            block: ui => ({
                id: 'ui_set_x',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_SET_X}`,
                args0: [{
                    type: 'input_value',
                    name: 'X',
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function (block) {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    code = `devices.get('${ui.id}').setX(${x});\n`;
                return code;
            },
        });
        this.legacyBlocks.push({
            block: ui => ({
                id: 'ui_set_y',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_SET_Y}`,
                args0: [{
                    type: 'input_value',
                    name: 'Y',
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function (block) {
                let y = Blockly.JavaScript.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${ui.id}').setY(${y});\n`;
                return code;
            },
        });
        this.blocks.push({
            block: ui => ({
                id: 'ui_show_hide',
                message0: `${ui.name}: %1`,
                args0: [{
                    type: 'field_dropdown',
                    name: 'VISIBILITY',
                    options: [
                        [
                            Blockly.Msg.BLOCK_UI_VISIBILITY_SHOW,
                            'show',
                        ],
                        [
                            Blockly.Msg.BLOCK_UI_VISIBILITY_HIDE,
                            'hide',
                        ],
                    ],
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function (block) {
                let visibility = block.getFieldValue('VISIBILITY'),
                    code;
                visibility = visibility === 'show' ? 'true' : 'false';
                code = `devices.get('${ui.id}').show(${visibility});\n`;
                return code;
            },
        });
        this.legacyBlocks.push({
            block: ui => ({
                id: 'ui_toggle_visibility',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_TOGGLE_VISIBILITY}`,
                previousStatement: null,
                nextStatement: null,
            }),
            javascript: ui => function () {
                const code = `devices.get('${ui.id}').toggleVisibility();\n`;
                return code;
            },
        });
        this.blocks.push({
            block: ui => ({
                id: 'ui_x',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_X}`,
                output: 'Number',
            }),
            javascript: ui => function () {
                return [`devices.get('${ui.id}').getX()+1`];
            },
        });
        this.blocks.push({
            block: ui => ({
                id: 'ui_y',
                message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_Y}`,
                output: 'Number',
            }),
            javascript: ui => function () {
                return [`devices.get('${ui.id}').getY()+1`];
            },
        });
        if (!this.scaleDisabled) {
            this.blocks.push({
                block: ui => ({
                    id: 'ui_size',
                    message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_SIZE}`,
                    output: 'Number',
                }),
                javascript: ui => function () {
                    return [`devices.get('${ui.id}').getSize()`];
                },
            });
        }
        if (!this.rotationDisabled) {
            this.blocks.push({
                block: ui => ({
                    id: 'ui_rotation',
                    message0: `${ui.name}: ${Blockly.Msg.BLOCK_UI_ROTATION}`,
                    output: 'Number',
                }),
                javascript: ui => function () {
                    return [`devices.get('${ui.id}').getRotation()`];
                },
            });
        }
    }
    toJSON() {
        const plain = super.toJSON.call(this);
        plain.excludeDefaultBlocks = this.excludeDefaultBlocks;
        plain.showDefaultConfiguration = this.showDefaultConfiguration;
        plain.rotation = this.rotation;
        plain.scale = this.scale;
        plain.visible = this.visible;
        return plain;
    }
}

export default UI;
