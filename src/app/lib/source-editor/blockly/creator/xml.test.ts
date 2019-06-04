import { Xml } from '@kano/kwc-blockly/blockly.js';
import { assert } from '@kano/web-tester/helpers.js';
import { getSelectorForNode } from './xml.js';

suite('creator.xml', () => {
    test('getSelectorForNode', () => {
        const xmlString = `
            <xml>
                <block id="test">
                    <value name="POSITION">
                        <shadow>
                            <value name="X">
                                <shadow>
                                    <field name="NUM"></field>
                                </shadow>
                            </value>
                        </shadow>
                    </value>
                </block>
            </xml>
        `;

        const dom = Xml.textToDom(xmlString);

        const limit = dom.querySelector('block[id="test"]') as HTMLElement;
        const node = dom.querySelector('field[name="NUM"]') as HTMLElement;

        const result = getSelectorForNode(node, limit);

        assert.equal(result, 'input#POSITION>shadow>input#X>shadow>input#NUM');
    });
});
