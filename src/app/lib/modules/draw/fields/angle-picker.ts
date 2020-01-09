/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Block } from '@kano/kwc-blockly/blockly.js';
import { FieldAngle } from '../../../source-editor/blockly/field/field-angle.js';

export const registerAnglePicker = (Blockly: Blockly) => {

    Blockly.Blocks.angle = {
        init: function init() {
            this.appendDummyInput()
                .appendField(new FieldAngle(null), 'VALUE');
            this.setOutput('Number');
        },
    };

    Blockly.JavaScript.angle = (block: Block) => {
        const value = block.getFieldValue('VALUE');
        return [value, Blockly.JavaScript.ORDER_ATOMIC];
    };
}
