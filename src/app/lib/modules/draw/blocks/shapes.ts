import { Block, Blockly } from '@kano/kwc-blockly/blockly.js';

const COLOUR = '#82C23D';

export const shapes = [{
    block: (part : any) => {
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
        };
    },
    javascript: () => {
        return function (block : Block) {
            let radius = Blockly.JavaScript.valueToCode(block, 'RADIUS', Blockly.JavaScript.ORDER_NONE) || 'null';
            return `ctx.circle(${radius});\n`;
        };
    }
},{
    block: (part : any) => {
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
        };
    },
    javascript: () => {
        return function (block : Block) {
            let radiusx = Blockly.JavaScript.valueToCode(block, 'RADIUSX', Blockly.JavaScript.ORDER_COMMA) || 'null',
                radiusy = Blockly.JavaScript.valueToCode(block, 'RADIUSY', Blockly.JavaScript.ORDER_COMMA) || 'null';
            return `ctx.ellipse(${radiusx}, ${radiusy});`;
        };
    }
},{
    block: (part : any) => {
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
        };
    },
    javascript: (part : any) => {
        return function (block: Block) {
            let size = Blockly.JavaScript.valueToCode(block, 'SIZE', Blockly.JavaScript.ORDER_NONE) || 'null';
            return `ctx.square(${size});`;
        };
    }
},{
    block: (part : any) => {
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
        };
    },
    javascript: (part : any) => {
        return function (block: Block) {
            let width = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_COMMA) || 'null',
                height = Blockly.JavaScript.valueToCode(block, 'HEIGHT', Blockly.JavaScript.ORDER_COMMA) || 'null';
            return `ctx.rectangle(${width}, ${height});`;
        };
    }
},{
    block: (part : any) => {
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
        };
    },
    javascript: (part : any) => {
        return function (block: Block) {
            let radius = Blockly.JavaScript.valueToCode(block, 'RADIUS', Blockly.JavaScript.ORDER_COMMA) || 'null',
                start = Blockly.JavaScript.valueToCode(block, 'START', Blockly.JavaScript.ORDER_COMMA) || 'null',
                end = Blockly.JavaScript.valueToCode(block, 'END', Blockly.JavaScript.ORDER_COMMA) || 'null',
                close = block.getFieldValue('CLOSE') || false;
            return `ctx.arc(${radius}, ${start}, ${end}, ${close});`;
        };
    }
},{
    block: (part : any) => {
        let id = 'shapes_polygon';
        Blockly.Blocks[`${part.id}_${id}`] = {
            init: function () {
                this.points = 1;
                this.workspace.addChangeListener((e : any) => {
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
            mutationToDom (block: Block) {
                let container = document.createElement('mutation');
                container.setAttribute('points', this.points);
                return container;
            },
            domToMutation(xmlElement : HTMLElement) {
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
    javascript: (part : any) => {
        return function (block : Block) {
            let points = [],
                close = Blockly.JavaScript.valueToCode(block, 'CLOSE', Blockly.JavaScript.ORDER_COMMA) || true;
            for (let i = 1; i <= (block as any).points; i++) {
                points.push(Blockly.JavaScript.valueToCode(block, `X${i}`, Blockly.JavaScript.ORDER_COMMA) || 0);
                points.push(Blockly.JavaScript.valueToCode(block, `Y${i}`, Blockly.JavaScript.ORDER_COMMA) || 0);
            }
            return `ctx.polygon(${points.join(', ')}, ${close});`;
        };
    }
},{
    block: (part : any) => {
        return {
            id: 'pixel',
            lookup: 'pixel()',
            message0: `${part.name}: ${Blockly.Msg.BLOCK_CANVAS_PIXEL}`,
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (part : any) => {
        return function (block: Block) {
            return `ctx.pixel();`;
        };
    }
}];

export default shapes;