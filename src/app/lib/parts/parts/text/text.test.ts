import { TextPart } from './text.js';
import { generate } from '../../../../../test/generate.js';

suite('TextPart', () => {
    test('#constructor()', () => {
        const text = new TextPart();

        assert.equal((text as any)._el.textContent, 'Text');
        assert.equal((text as any)._el.style.color, 'rgb(0, 0, 0)');
    });
    test('#render()', () => {
        const testValue = generate.string();
        const testColor = `rgb(${generate.rgb().join(', ')})`;
        const text = new TextPart();

        text.core.value = testValue;
        text.core.color = testColor;
        text.core.invalidated = true;

        text.render();

        assert.equal((text as any)._el.textContent, testValue);
        assert.equal((text as any)._el.style.color, testColor);
    });
    test('#value', () => {
        return new Promise((resolve) => {
            const text = new TextPart();
    
            let testValue = generate.string();
    
            text.core.value = testValue;
    
            assert.equal(text.value, testValue);
    
            testValue = generate.string();
    
            text.core.onDidInvalidate(() => {
                assert.equal(text.core.value, testValue);
                resolve();
            });
    
            text.value = testValue;
        });
    });
    test('#color', () => {
        return new Promise((resolve) => {
            const text = new TextPart();
    
            let testColor = generate.rgbString();
    
            text.core.color = testColor;
    
            assert.equal(text.color, testColor);
    
            testColor = generate.string();
    
            text.core.onDidInvalidate(() => {
                assert.equal(text.core.color, testColor);
                resolve();
            });
    
            text.color = testColor;
        });
    });
});
