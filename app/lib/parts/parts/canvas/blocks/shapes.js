

const COLOUR = '#82C23D';

const shapes = [{
    block: (part) => {
        return {
            id: 'circle',
            lookup: 'circle(radius)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_CIRCLE}`,
            args0: [{
                type: "input_value",
                name: "RADIUS",
                check: 'Number'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'RADIUS': `<shadow type="math_number"><field name="NUM">5</field></shadow>`
            }
        };
    },
    javascript: (part) => {
        return function (block) {
            let radius = Blockly.JavaScript.valueToCode(block, 'RADIUS') || 'null';
            return `ctx.circle(${radius});\n`;
        };
    }
},{
    block: (part) => {
        return {
            id: 'ellipse',
            lookup: 'ellipse(rx, ry)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_ELIPSE}`,
            args0: [{
                type: "input_value",
                name: "RADIUSX",
                check: 'Number'
            },{
                type: "input_value",
                name: "RADIUSY",
                check: 'Number',
                align: 'RIGHT'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'RADIUSX': `<shadow type="math_number"><field name="NUM">5</field></shadow>`,
                'RADIUSY': `<shadow type="math_number"><field name="NUM">5</field></shadow>`
            }
        };
    },
    javascript: (part) => {
        return function (block) {
            let radiusx = Blockly.JavaScript.valueToCode(block, 'RADIUSX') || 'null',
                radiusy = Blockly.JavaScript.valueToCode(block, 'RADIUSY') || 'null';
            return `ctx.ellipse(${radiusx}, ${radiusy});`;
        };
    }
},{
    block: (part) => {
        return {
            id: 'square',
            lookup: 'square(size)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_SQUARE}`,
            args0: [{
                type: "input_value",
                name: "SIZE",
                check: 'Number'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'SIZE': `<shadow type="math_number"><field name="NUM">5</field></shadow>`
            }
        };
    },
    javascript: (part) => {
        return function (block) {
            let size = Blockly.JavaScript.valueToCode(block, 'SIZE') || 'null';
            return `ctx.square(${size});`;
        };
    }
},{
    block: (part) => {
        return {
            id: 'rectangle',
            lookup: 'rectangle(width, height)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_RECTANGLE}`,
            args0: [{
                type: "input_value",
                name: "WIDTH",
                check: 'Number'
            },{
                type: "input_value",
                name: "HEIGHT",
                check: 'Number',
                align: 'RIGHT'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'WIDTH': `<shadow type="math_number"><field name="NUM">5</field></shadow>`,
                'HEIGHT': `<shadow type="math_number"><field name="NUM">5</field></shadow>`
            }
        };
    },
    javascript: (part) => {
        return function (block) {
            let width = Blockly.JavaScript.valueToCode(block, 'WIDTH') || 'null',
                height = Blockly.JavaScript.valueToCode(block, 'HEIGHT') || 'null';
            return `ctx.rectangle(${width}, ${height});`;
        };
    }
},{
    block: (part) => {
        return {
            id: 'arc',
            lookup: 'arc(radius, start, end, close)',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_ARC}`,
            args0: [{
                type: "input_value",
                name: "RADIUS",
                check: 'Number'
            },{
                type: "input_value",
                name: "START",
                check: 'Number'
            },{
                type: "input_value",
                name: "END",
                check: 'Number'
            },{
                type: "input_value",
                name: "CLOSE",
                check: 'Boolean'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'RADIUS': `<shadow type="math_number"><field name="NUM">5</field></shadow>`,
                'START': `<shadow type="math_number"><field name="NUM">0</field></shadow>`,
                'END': `<shadow type="math_number"><field name="NUM">1</field></shadow>`,
                'CLOSE': `<shadow type="logic_boolean"></shadow>`
            }
        };
    },
    javascript: (part) => {
        return function (block) {
            let radius = Blockly.JavaScript.valueToCode(block, 'RADIUS') || 'null',
                start = Blockly.JavaScript.valueToCode(block, 'START') || 'null',
                end = Blockly.JavaScript.valueToCode(block, 'END') || 'null',
                close = block.getFieldValue('CLOSE') || false;
            return `ctx.arc(${radius}, ${start}, ${end}, ${close});`;
        };
    }
},{
    block: (part) => {
        let id = 'shapes_polygon';
        Blockly.Blocks[`${part.id}#${id}`] = {
            init: function () {
                this.points = 1;
                this.workspace.addChangeListener((e) => {
                    if (e.type === Blockly.Events.MOVE &&
                        (e.newParentId === this.id || e.oldParentId === this.id)
                        && e.newInputName !== 'CLOSE') {
                        this._updateShape();
                    }
                });

                this.setColour(COLOUR);

                this.appendDummyInput()
                    .appendField(`${part.name}: ${Blockly.Msg.BLOCK_CANVAS_POLYGON}`);

                this.setNextStatement(true);
                this.setPreviousStatement(true);

                this._initShape();
            },
            /**
            * Populate the block with inputs mapping to the points
            */
            _initShape () {
                let inputName,
                    closeInput = this.getInput('CLOSE');

                if (closeInput) {
                    this.removeInput('CLOSE');
                }
                for (let i = 1; i <= this.points; i++) {
                    inputName = `X${i}`;
                    if (!this.getInput(inputName)) {
                        this.appendValueInput(inputName)
                            .setCheck('Number')
                            .setAlign(Blockly.ALIGN_RIGHT)
                            .appendField(`x${i}`);
                    }
                    inputName = `Y${i}`;
                    if (!this.getInput(inputName)) {
                        this.appendValueInput(inputName)
                            .setCheck('Number')
                            .setAlign(Blockly.ALIGN_RIGHT)
                            .appendField(`y${i}`);
                    }
                }
                this.appendValueInput('CLOSE')
                    .setCheck('Boolean')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField('close path');
            },
            /**
            * Check the inputs for the last and before last points and add/delete inputs accordingly
            */
            _updateShape () {
                let xInput = this.getInput(`X${this.points}`),
                    yInput;
                this.removeInput('CLOSE');
                if (!xInput) {
                    this.appendValueInput(`X${this.points}`)
                        .setCheck('Number')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(`x${this.points}`);
                    this.appendValueInput(`Y${this.points}`)
                        .setCheck('Number')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(`y${this.points}`);
                }
                xInput = this.getInput(`X${this.points}`);
                yInput = this.getInput(`Y${this.points}`);
                if (xInput.connection.targetConnection || yInput.connection.targetConnection) {
                    this.points++;
                    this._updateShape();
                } else {
                    xInput = this.getInput(`X${this.points - 1}`);
                    yInput = this.getInput(`Y${this.points - 1}`);
                    if (this.points > 1 && !xInput.connection.targetConnection && !yInput.connection.targetConnection) {
                        this.removeInput(`X${this.points}`);
                        this.removeInput(`Y${this.points}`);
                        this.points--;
                        this._updateShape();
                    }
                }
                if (!this.getInput('CLOSE')) {
                    this.appendValueInput('CLOSE')
                        .setCheck('Boolean')
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(Blockly.Msg.BLOCK_CANVAS_CLOSE_PATH);
                }
            },
            mutationToDom (block) {
                let container = document.createElement('mutation');
                container.setAttribute('points', this.points);
                return container;
            },
            domToMutation (xmlElement) {
                this.points = xmlElement.getAttribute('points');
                this._initShape();
            }
        };
        return {
            id,
            lookup: 'polygon(x1, y1, x2, y2, ...)',
            doNotRegister: true,
            colour: COLOUR
        };
    },
    javascript: (part) => {
        return function (block) {
            let points = [],
                close = Blockly.JavaScript.valueToCode(block, 'CLOSE') || true;
            for (let i = 1; i <= block.points; i++) {
                points.push(Blockly.JavaScript.valueToCode(block, `X${i}`) || 0);
                points.push(Blockly.JavaScript.valueToCode(block, `Y${i}`) || 0);
            }
            return `ctx.polygon(${points.join(', ')}, ${close});`;
        };
    }
},{
    block: (part) => {
        return {
            id: 'pixel',
            lookup: 'pixel()',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_PIXEL}`,
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (part) => {
        return function (block) {
            return `ctx.pixel();`;
        };
    }
}];

export default shapes;