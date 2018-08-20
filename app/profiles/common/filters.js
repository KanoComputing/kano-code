const filters = [{
    block: () => {
        return {
            id: 'filter_clear',
            message0: 'frame: clear filters',
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (part) => {
        return (block) => {
            return `devices.get('${part.id}').clearFilters();\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            return `devices.get('${part.id}').clearFilters();\n`;
        };
    }
},{
    block: () => {
        return {
            id: 'filter_invert',
            message0: 'frame: invert',
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (part) => {
        return (block) => {
            return `devices.get('${part.id}').addFilter('invert');\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            return `devices.get('${part.id}').addFilter('invert');\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_grayscale',
                message0: 'frame: grayscale',
                previousStatement: null,
                nextStatement: null
            };
    },
    javascript: (part) => {
        return (block) => {
            return `devices.get('${part.id}').addFilter('grayscale');\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            return `devices.get('${part.id}').addFilter('grayscale');\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_blur',
                message0: 'frame: blur',
                message1: 'size %1',
                args1: [{
                    type: 'input_value',
                    name: 'SIZE',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'SIZE': '<shadow type="math_number"><field name="NUM">50</field></shadow>'
                }
            };
    },
    javascript: (part) => {
        return (block) => {
            let size = Blockly.JavaScript.valueToCode(block, 'SIZE') || 50;
            return `devices.get('${part.id}').addFilter('gaussianBlur', ${size});\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_colorize',
                message0: 'frame: colorize',
                message1: 'color %1 value %2',
                args1: [{
                    type: 'input_value',
                    name: 'COLOR',
                    check: 'Colour',
                    align: 'RIGHT'
                },{
                    type: 'input_value',
                    name: 'VALUE',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'COLOR': '<shadow type="colour_picker"><field name="COLOUR">#ff0000</field></shadow>',
                    'VALUE': '<shadow type="math_number"><field name="NUM">50</field></shadow>'
                }
            };
    },
    javascript: (part) => {
        return (block) => {
            let color = Blockly.JavaScript.valueToCode(block, 'COLOR') || "'#ff0000'",
                value = Blockly.JavaScript.valueToCode(block, 'VALUE') || 50;
            return `devices.get('${part.id}').addFilter('colorize', devices.get('${part.id}').hexToRgb(${color}), Math.max(0, Math.min(1, ${value} / 100)));\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_threshold',
                message0: 'frame: black and white',
                message1: 'threshold %1',
                args1: [{
                    type: 'input_value',
                    name: 'THRESHOLD',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'THRESHOLD': '<shadow type="math_number"><field name="NUM">50</field></shadow>'
                }
            };
    },
    javascript: (part) => {
        return (block) => {
            let threshold = Blockly.JavaScript.valueToCode(block, 'THRESHOLD') || 50;
            return `devices.get('${part.id}').addFilter('threshold', Math.max(0, Math.min(255, ${threshold} * 2.55)));\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_pixelate',
                message0: 'frame: pixelate',
                message1: 'size %1',
                args1: [{
                    type: 'input_value',
                    name: 'SIZE',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'SIZE': '<shadow type="math_number"><field name="NUM">20</field></shadow>'
                }
            };
    },
    javascript: (part) => {
        return (block) => {
            let size = Blockly.JavaScript.valueToCode(block, 'SIZE') || 20;
            return `devices.get('${part.id}').addFilter('pixelate', Math.max(1, Math.min(100, ${size})));\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_contrast',
                message0: 'frame: contrast %1',
                args0: [{
                    type: 'input_value',
                    name: 'CONTRAST',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'CONTRAST': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
    },
    javascript: (part) => {
        return (block) => {
            let contrast = Blockly.JavaScript.valueToCode(block, 'CONTRAST') || 0;
            return `devices.get('${part.id}').addFilter('contrast', Math.max(-300, Math.min(300, (${contrast} * 3))));\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_kaleidoscope',
                message0: 'frame: kaleidoscope',
                message1: 'rotation offset %1 # slices %2 zoom %3',
                args1: [{
                    type: 'input_value',
                    name: 'ROTATION_OFFSET',
                    check: 'Number',
                    align: 'RIGHT'
                },{
                    type: 'input_value',
                    name: 'SLICES',
                    check: 'Number',
                    align: 'RIGHT'
                },{
                    type: 'input_value',
                    name: 'ZOOM',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'ROTATION_OFFSET': '<shadow type="math_number"><field name="NUM">50</field></shadow>',
                    'SLICES': '<shadow type="math_number"><field name="NUM">12</field></shadow>',
                    'ZOOM': '<shadow type="math_number"><field name="NUM">1</field></shadow>'
                }
            };
    },
    javascript: (part) => {
        return (block) => {
            let offset = Blockly.JavaScript.valueToCode(block, 'ROTATION_OFFSET') || 50,
                slices = Blockly.JavaScript.valueToCode(block, 'SLICES') || 12,
                zoom = Blockly.JavaScript.valueToCode(block, 'ZOOM') || 1;
            return `devices.get('${part.id}').enableKaleidoscope(${offset}, Math.min(${slices}, 1000), Math.min(${zoom}, 50));\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            let offset = Blockly.JavaScript.valueToCode(block, 'OFFSET_ROTATION') || 50,
                slices = Math.min(Blockly.JavaScript.valueToCode(block, 'SLICES') || 12, 1000),
                zoom = Math.min(Blockly.JavaScript.valueToCode(block, 'ZOOM') || 1, 50)
            return `devices.get('${part.id}').enableKaleidoscope(${offset}, ${slices}, ${zoom});\n`;
        };
    }
}];

export { filters };
