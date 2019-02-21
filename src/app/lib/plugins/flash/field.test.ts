import { FlashField } from './field.js';
import { Block, utils } from '@kano/kwc-blockly/blockly.js';

class BlockStub {
    public root : SVGGElement;
    constructor() {
        this.root = utils.createSvgElement('g') as SVGGElement;
    }
    getSvgRoot() {
        return this.root;
    }
}

suite('FlashField', () => {
    test('init()', () => {
        const block = new BlockStub() as unknown as Block;
        const field = new FlashField('');

        field.setSourceBlock(block);

        field.init();
        
        // Create the field properly
        assert.equal((block as any).root.firstChild, field.fieldGroup_);
        
        field.init();
        
        // Make sure it does not add a second field
        assert.equal((block as any).root.children.length, 1);
    });
    test('trigger()', (done) => {
        const block = new BlockStub() as unknown as Block;
        const field = new FlashField('');

        field.setSourceBlock(block);

        // Does not fail if not initialised
        field.trigger();
        
        setTimeout(() => {
            field.init();
            field.trigger();
            // Always dips immediately
            assert.equal((field as any).path.style.opacity, '0.3');
            setTimeout(() => {
                // flash after dip
                assert.equal((field as any).path.style.opacity, '1');
                setTimeout(() => {
                    // stop after a while
                    assert.equal((field as any).path.style.opacity, '0.3');
                    done();
                }, 500);
            }, 200);
        }, 51);
    });
});
