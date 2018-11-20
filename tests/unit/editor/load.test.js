import * as code from '../../../app/lib/index.js';
import * as parts from '../../../app/lib/parts/index.js';
import { setupStyle } from '../ui-tools.js';

class TestPartType extends parts.Part {
    static get id() { return 'test'; }
}

const TestPart = {
    partType: 'test',
    type: 'test',
    label: 'TestPart',
    colour: '#E73544',
    symbols: [{
        type: 'variable',
        name: 'variable',
        returnType: Number,
    }],
};

mocha.timeout(3000000);

suite('Editor', () => {
    suite('#load', () => {
        let editor;
        let plugin;
        setup(() => {
            setupStyle();
            editor = new code.Editor();
            const outputPlugin = new parts.PartsOutputPlugin([TestPartType], [TestPart]);
            plugin = new parts.PartsPlugin(outputPlugin);
            editor.addPlugin(plugin);
        });
        test('loads app with parts', (done) => {
            const partId = 'load_with_parts';
            const method = 'test_variable';
            const blockType = `${partId}#${method}`;
            const blockId = 'test_block';
            editor.load({
                parts: [{ type: 'test', id: partId }],
                source: `<xml><block id="${blockId}" type="${blockType}"></block></xml>`,
            });
            editor.inject();
            const ws = editor.sourceEditor.getBlocklyWorkspace();
            const block = ws.getBlockById(blockId);
            assert.equal(block.type, blockType);
            // assert.equal(block.inputList.length, 1);
        });
        teardown(() => {
            editor.dispose();
        });
    });
});
