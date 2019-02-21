import * as sinon from 'sinon/pkg/sinon-esm.js';
import { Flash, addFlashField } from './flash.js';
import { Block } from '@kano/kwc-blockly/blockly.js';

suite('Flash', () => {
    test('trigger()', () => {
        const flash = new Flash();

        const initialColor = flash.domNode.style.fill;

        flash.trigger();

        assert.equal(flash.domNode.style.fill, initialColor);
        
        setTimeout(() => {
            assert.notEqual(flash.domNode.style.fill, initialColor);
        }, 51);
    });
});

test('addFlashField()', () => {
    const input = {
        insertFieldAt: sinon.stub(),
    };
    class FakeBlock {
        inputList : any[] = [];
    }
    const block = new FakeBlock();

    // Does nothing when block has no input
    addFlashField(block as Block);

    block.inputList.push(input);
    
    addFlashField(block as Block);

    assert(input.insertFieldAt.calledWith(0));

});
