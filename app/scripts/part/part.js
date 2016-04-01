import slug from 'speakingurl';

export default class Part {

    set name (value) {
        let oldName = this.name,
            names = Part.nameRegistry[this.type],
            newName;
        if (!value) {
            this.uniqueName = value;
            return;
        }
        names[oldName] = false;
        // Generate a unique name
        newName = this.getUniqueName(value);
        // Add it to the registery
        names[newName] = true;
        this.uniqueName = newName;
        this.id = slug(this.uniqueName);
    }

    get name () {
        return this.uniqueName;
    }

    constructor (opts) {
        this.type = opts.type;
        Part.nameRegistry[this.type] = Part.nameRegistry[this.type] || {};
        this.id = opts.id;
        this.name = opts.name;
        this.label = opts.label;
        this.name = this.name || this.label;
        this.description = opts.description;
        this.image = opts.image;
        this.colour = opts.colour;
        this.blocks = opts.blocks || [];
        this.events = opts.events || [];
        this.listeners = opts.listeners || [];
        this.codes = {};
        this.userStyle = Object.assign({}, opts.userStyle);
        this.userProperties = Object.assign({}, opts.userProperties);
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_move_by',
                    message0: `move ${ui.name} by %1 %2`,
                    args0: [{
                        type: 'input_value',
                        name: 'X'
                    },{
                        type: 'input_value',
                        name: 'Y'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.JavaScript.valueToCode(block, 'X')) || 0,
                        y = parseInt(Blockly.JavaScript.valueToCode(block, 'Y')) || 0,
                        code = `devices.get('${ui.id}').move(${x}, ${y});\n`;
                    return code;
                };
            },
            natural: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.Natural.valueToCode(block, 'X')) || 0,
                        y = parseInt(Blockly.Natural.valueToCode(block, 'Y')) || 0,
                        code = `move ${ui.name} by ${x}, ${y}\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_rotate',
                    message0: `turn ${ui.name} %1 by %2`,
                    args0: [{
                        type: "field_dropdown",
                        name: "DIRECTION",
                        options: [
                            [
                                "Clockwise",
                                "clockwise"
                            ],
                            [
                                "Counter Clockwise",
                                "counterclockwise"
                            ]
                        ]
                    },{
                        type: 'input_value',
                        name: 'DEG'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let deg = parseInt(Blockly.JavaScript.valueToCode(block, 'DEG')) || 0,
                        direction = block.getFieldValue('DIRECTION'),
                        code;
                    direction = direction === 'clockwise' ? '' : '-';
                    code = `devices.get('${ui.id}').rotate(${direction}${deg});\n`;
                    return code;
                };
            },
            natural: (ui) => {
                return function (block) {
                    let deg = parseInt(Blockly.Natural.valueToCode(block, 'DEG')) || 0,
                        direction = block.getFieldValue('DIRECTION'),
                        code;
                    direction = direction === 'clockwise' ? 'clockwise' : 'counter clockwise';
                    code = `turn ${ui.name} ${direction} by ${deg} deg\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_scale',
                    message0: `scale ${ui.name} %1 by %2`,
                    args0: [{
                        type: "field_dropdown",
                        name: "DIRECTION",
                        options: [
                            [
                                "Up",
                                "up"
                            ],
                            [
                                "Down",
                                "down"
                            ]
                        ]
                    },{
                        type: 'input_value',
                        name: 'FACTOR'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let factor = parseInt(Blockly.JavaScript.valueToCode(block, 'FACTOR')) || 0,
                        direction = block.getFieldValue('DIRECTION'),
                        code;
                    direction = direction === 'up' ? '' : '-';
                    code = `devices.get('${ui.id}').scale(${direction}${factor});\n`;
                    return code;
                };
            },
            natural: (ui) => {
                return function (block) {
                    let factor = parseInt(Blockly.Natural.valueToCode(block, 'FACTOR')) || 0,
                        direction = block.getFieldValue('DIRECTION'),
                        code;
                    code = `scale ${ui.name} ${direction} by ${factor}\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_set_x',
                    message0: `set ${ui.name} x to %1`,
                    args0: [{
                        type: 'input_value',
                        name: 'X'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.JavaScript.valueToCode(block, 'X')) || 0,
                        code = `devices.get('${ui.id}').setX(${x});\n`;
                    return code;
                };
            },
            natural: (ui) => {
                return function (block) {
                    let x = parseInt(Blockly.Natural.valueToCode(block, 'X')) || 0,
                        code = `set ${ui.name} x to ${x}\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_set_y',
                    message0: `set ${ui.name} y to %1`,
                    args0: [{
                        type: 'input_value',
                        name: 'Y'
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let y = parseInt(Blockly.JavaScript.valueToCode(block, 'Y')) || 0,
                        code = `devices.get('${ui.id}').setY(${y});\n`;
                    return code;
                };
            },
            natural: (ui) => {
                return function (block) {
                    let y = parseInt(Blockly.Natural.valueToCode(block, 'Y')) || 0,
                        code = `set ${ui.name} y to ${y}\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_show_hide',
                    message0: `${ui.name} %1`,
                    args0: [{
                        type: "field_dropdown",
                        name: "VISIBILITY",
                        options: [
                            [
                                "Show",
                                "show"
                            ],
                            [
                                "Hide",
                                "hide"
                            ]
                        ]
                    }],
                    inputsInline: true,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function (block) {
                    let visibility = block.getFieldValue('VISIBILITY'),
                        code;
                    visibility = visibility === 'show' ? 'true' : 'false';
                    code = `devices.get('${ui.id}').show(${visibility});\n`;
                    return code;
                };
            },
            natural: (ui) => {
                return function (block) {
                    let visibility = block.getFieldValue('VISIBILITY'),
                        code;
                    code = `${visibility} ${ui.name}\n`;
                    return code;
                };
            }
        });
        this.blocks.push({
            block: (ui) => {
                return {
                    id: 'ui_toggle_visibility',
                    message0: `toggle ${ui.name}'s' visibility`,
                    previousStatement: null,
                    nextStatement: null
                };
            },
            javascript: (ui) => {
                return function () {
                    let code = `devices.get('${ui.id}').toggleVisibility();\n`;
                    return code;
                };
            },
            natural: (ui) => {
                return function () {
                    let code = `toggle ${ui.name}'s vicibility\n`;
                    return code;
                };
            }
        });
    }
    getUniqueName (value, inc=0) {
        let newName = inc ? `${value} ${inc}` : value;
        if (Part.nameRegistry[this.type][newName]) {
            return this.getUniqueName(value, inc + 1);
        }
        return newName;
    }
    addBlock (block) {
        this.blocks.push(block);
    }
    addEvent (event) {
        this.events.push(event);
    }
    stop () {
        this.removeListeners();
    }
    start () {

    }
    addEventListener () {
        this.listeners.push(arguments);
    }
    removeListeners () {
        this.listeners = [];
    }
    toJSON () {
        let plain = {};
        plain.id = this.id;
        plain.name = this.name;
        plain.type = this.type;
        plain.userStyle = this.userStyle;
        plain.userProperties = this.userProperties;
        plain.position = this.position;
        return plain;
    }
}

Part.nameRegistry = {};
Part.clear = () => {
    Part.nameRegistry = {};
};
