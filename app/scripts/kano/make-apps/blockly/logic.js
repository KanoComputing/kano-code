(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    /**
     * Registers the logic blocks, and creates its category
     */
    const COLOR = '#f75846';

    let register = (Blockly) => {

        let flags = Kano.MakeApps.config.getFlags();

        for (let i = 0; i < flags.experiments.length; i++) {
            if (flags.experiments[i] === 'functions') {

                Blockly.Blocks.controls_if = {
                    init: function () {

                        this.appendValueInput('IF0')
                            .setCheck('Boolean')
                            .appendField(new Blockly.FieldIfStack({ elseIfs: 0, else: false }, (newValue) => {
                                this.elseifCount_ = newValue.elseIfs;
                                this.elseCount_   = newValue.else;
                                this.updateShape_();
                            }))
                            .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);

                        this.appendStatementInput('DO')
                            .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

                        this.setPreviousStatement(true);
                        this.setNextStatement(true);

                        this.setColour("%{BKY_LOGIC_HUE}");
                    },
                    /**
                     * Modify this block to have the correct number of inputs.
                     * @this Blockly.Block
                     * @private
                     */
                    updateShape_: function () {
                        let i;
                        // Delete everything.
                        if (this.getInput('ELSE')) {
                            this.removeInput('ELSE');
                        }
                        i = 1;
                        while (this.getInput('IF' + i)) {
                            this.removeInput('IF' + i);
                            this.removeInput('DO' + i);
                            i++;
                        }
                        // Rebuild block.
                        for (let i = 1; i <= this.elseifCount_; i++) {
                            this.appendValueInput('IF' + i)
                                .setCheck('Boolean')
                                .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
                            this.appendStatementInput('DO' + i)
                                .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
                        }
                        if (this.elseCount_) {
                            this.appendStatementInput('ELSE')
                                .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
                        }
                    },
                    /**
                     * Create XML to represent the number of else-if and else inputs.
                     * @return {Element} XML storage element.
                     * @this Blockly.Block
                     */
                    mutationToDom: function () {
                        let container;
                        if (!this.elseifCount_ && !this.elseCount_) {
                            return null;
                        }
                        container = document.createElement('mutation');
                        if (this.elseifCount_) {
                            container.setAttribute('elseif', this.elseifCount_);
                        }
                        if (this.elseCount_) {
                            container.setAttribute('else', 1);
                        }
                        return container;
                    },
                    /**
                     * Parse XML to restore the else-if and else inputs.
                     * @param {!Element} xmlElement XML storage element.
                     * @this Blockly.Block
                     */
                    domToMutation: function (xmlElement) {
                        this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
                        this.elseCount_   = parseInt(xmlElement.getAttribute('else'), 10) || 0;
                        this.updateShape_();
                    }
                };
                break;
            }
        }

        Blockly.Blocks.logic_compare = {
            init: function () {
                let options = [
                    { label: "= equal", textLabel: "=", value: "EQ" },
                    { label: "\u2260 not equal", textLabel: "\u2260", value: "NEQ" },
                    { label: "< less than", textLabel: "<", value: "LT" },
                    { label: "\u2264 less than or equal", textLabel: "\u2264", value: "LTE" },
                    { label: "> greater than", textLabel: ">", value: "GT" },
                    { label: "\u2265 greater than or equal", textLabel: "\u2265", value: "GTE" }
                ]
                this.appendValueInput('A');

                this.appendDummyInput()
                    .appendField(new Blockly.FieldCustomDropdown(options), 'OP');

                this.appendValueInput('B');

                this.setInputsInline(true);
                this.setOutput('Boolean');
                this.setColour('%{BKY_LOGIC_HUE}');
                this.setHelpUrl('%{BKY_LOGIC_COMPARE_HELPURL}');
            }
        }

        Blockly.Pseudo.controls_if = (block) => {
            // If/elseif/else condition.
            let n        = 0,
                argument = Blockly.Pseudo.valueToCode(block, 'IF' + n, Blockly.JavaScript.ORDER_NONE) || 'false',
                branch   = Blockly.Pseudo.statementToCode(block, 'DO' + n),
                code     = 'if (' + argument + ') {\n' + branch + '}';
            for (n = 1; n <= block.elseifCount_; n++) {
                argument  = Blockly.Pseudo.valueToCode(block, 'IF' + n, Blockly.JavaScript.ORDER_NONE) || 'false';
                branch    = Blockly.Pseudo.statementToCode(block, 'DO' + n);
                code     += ' else if (' + argument + ') {\n' + branch + '}';
            }
            if (block.elseCount_) {
                branch  = Blockly.Pseudo.statementToCode(block, 'ELSE');
                code   += ' else {\n' + branch + '}';
            }
            return code + '\n';
        };

        Blockly.Pseudo.logic_compare = (block) => {
            // Comparison operator.
            const OPERATORS = {
                'EQ' : '==',
                'NEQ': '!=',
                'LT' : '<',
                'LTE': '<=',
                'GT' : '>',
                'GTE': '>='
            };
            let operator  = OPERATORS[block.getFieldValue('OP')],
                order     = (operator == '==' || operator == '!=') ? Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL,
                argument0 = Blockly.Pseudo.valueToCode(block, 'A', order) || '0',
                argument1 = Blockly.Pseudo.valueToCode(block, 'B', order) || '0',
                code      = argument0 + ' ' + operator + ' ' + argument1;
            return [code, order];
        };

        Blockly.Blocks.if_collides = {
            init: function () {
                Blockly.Blocks.collision_event.applyCollisionFields('', this);

                this.setOutput('Boolean');

                this.setColour(COLOR);
            },
            getFirstPartOptions: function () {
                let options = Blockly.Blocks.collision_event.getParts()
                    .map(this.formatPartOption);

                if (!options.length) {
                    options.push(['No available part', null]);
                }

                return options;
            },
            getSecondPartOptions: function () {
                let options = Blockly.Blocks.collision_event.getParts()
                    .filter(part => {
                        return part.id !== this.getFieldValue('PART1');
                    })
                    .map(this.formatPartOption);

                // The @ here is to make sure no part id will collide with this name
                options.push(['Top Edge', "'@top-edge'"]);
                options.push(['Right Edge', "'@right-edge'"]);
                options.push(['Bottom Edge', "'@bottom-edge'"]);
                options.push(['Left Edge', "'@left-edge'"]);

                return options;
            },
            formatPartOption (part) {
                return [part.name, `parts.get('${part.id}')`];
            }
        };

        Blockly.JavaScript.if_collides = (block) => {
            let part1Id = block.getFieldValue('PART1'),
                part2Id = block.getFieldValue('PART2'),
                code    = `parts.collisionBetween(${part1Id}, ${part2Id})`;
            return [code];
        };

        Blockly.Pseudo.if_collides = Blockly.JavaScript.if_collides;

        category.blocks.forEach((category) => {
            Kano.Util.Blockly.updateBlockColour(Blockly.Blocks[category.id], COLOR);
        });
    };

    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name  : Blockly.Msg.CATEGORY_LOGIC,
        id    : 'logic',
        colour: COLOR,
        blocks: [
            'controls_if',
            'logic_compare',
            'logic_operation',
            'logic_negate',
            'logic_boolean',
            'if_collides'
        ]
    });

    Kano.MakeApps.Blockly.setLookupString('controls_if', 'if (validation) {...}');
    Kano.MakeApps.Blockly.setLookupString('logic_compare', 'compare(a, b, check)');
    Kano.MakeApps.Blockly.setLookupString('logic_negate', 'not(a)');
    Kano.MakeApps.Blockly.setLookupString('logic_boolean', 'boolean');
    Kano.MakeApps.Blockly.setLookupString('logic_boolean', 'true');
    Kano.MakeApps.Blockly.setLookupString('logic_boolean', 'false');

    Kano.MakeApps.Blockly.addModule('logic', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
