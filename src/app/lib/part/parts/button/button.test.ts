import { click } from '@polymer/iron-test-helpers/mock-interactions.js';
import { ButtonPart } from './button.js';
import { PartContextStub } from '../../../../../test/part-context-stub.js';

suite('ButtonPart', () => {
    test('#onInstall()', () => {
        const stub = new PartContextStub();
        const button = new ButtonPart();

        button.onInstall(stub);

        // Check it adds the styles
        const styles = [...stub.dom.root.querySelectorAll('style')];

        assert.equal(styles.length, 1);
    });
    test('#getLabel()', () => {
        const testLabel = 'TEST';
        const button = new ButtonPart();

        button.core.label = testLabel;

        assert.equal(button.getLabel(), testLabel);
    });
    test('#setLabel()', () => {
        return new Promise((resolve) => {
            const testLabel = 'TEST';
            const button = new ButtonPart();
    
            // Make sure it triggers
            button.core.onDidInvalidate(() => {
                assert.equal(button.core.label, testLabel);
                resolve();
            });
    
            button.setLabel(testLabel);

        });
    });
    test('#setTextColor()', () => {
        return new Promise((resolve) => {
            const testColor = '#ff00ff';
            const button = new ButtonPart();
    
            // Make sure it triggers
            button.core.onDidInvalidate(() => {
                assert.equal(button.core.textColor, testColor);
                resolve();
            });
    
            button.setTextColor(testColor);
        });
    });
    test('#setBackgroundColor()', () => {
        return new Promise((resolve) => {
            const testColor = '#ff00ff';
            const button = new ButtonPart();
    
            // Make sure it triggers
            button.core.onDidInvalidate(() => {
                assert.equal(button.core.backgroundColor, testColor);
                resolve();
            });
    
            button.setBackgroundColor(testColor);
        });
    });
    test('#onClick()', () => {
        return new Promise((resolve) => {
            const button = new ButtonPart();
            
            // Make sure it triggers
            button.onClick(() => {
                resolve();
            });
            
            click((button as any)._el);
        });
    });
    test('#render()', () => {
        const label = '#text';
        const background = 'rgb(255, 0, 255)';
        const text = 'rgb(0, 255, 255)';
        const button = new ButtonPart();
        
        button.core.backgroundColor = background;
        button.core.textColor = text;
        button.core.label = label;

        button.render();

        assert.equal((button as any)._el.textContent, label);
        assert.equal((button as any)._el.style.color, text);
        assert.equal((button as any)._el.style.backgroundColor, background);
    });
});
