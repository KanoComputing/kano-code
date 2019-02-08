import { TextInputPart } from './text-input.js';
import { generate } from '../../../../../test/generate.js';

suite('TextInputPart', () => {
    test('#constructor()', () => {
        const input = new TextInputPart();

        assert.equal((input as any)._el.value, '');
        assert.equal((input as any)._el.placeholder, '');
    });
    test('#render()', () => {
        const testValue = generate.string();
        const testPlaceholder = generate.string();
        const input = new TextInputPart();

        input.core.value = testValue;
        input.core.placeholder = testPlaceholder;
        input.core.invalidated = true;

        input.render();

        assert.equal((input as any)._el.value, testValue);
        assert.equal((input as any)._el.placeholder, testPlaceholder);
    });
    test('#value', () => {
        return new Promise((resolve) => {
            const input = new TextInputPart();
    
            let testValue = generate.string();
    
            input.core.value = testValue;
    
            assert.equal(input.value, testValue);
    
            testValue = generate.string();
    
            input.core.onDidInvalidate(() => {
                assert.equal(input.core.value, testValue);
                resolve();
            });
    
            input.value = testValue;
        });
    });
    test('#placeholder', () => {
        return new Promise((resolve) => {
            const input = new TextInputPart();
    
            let testPlaceholder = generate.rgbString();
    
            input.core.placeholder = testPlaceholder;
    
            assert.equal(input.placeholder, testPlaceholder);
    
            testPlaceholder = generate.string();
    
            input.core.onDidInvalidate(() => {
                assert.equal(input.core.placeholder, testPlaceholder);
                resolve();
            });
    
            input.placeholder = testPlaceholder;
        });
    });
    test('#onChange()', () => {
        return new Promise((resolve) => {
            const input = new TextInputPart();

            input.onChange(() => {
                resolve();
            });

            (input as any)._el.dispatchEvent(new CustomEvent('input'));
        });
    });
});
