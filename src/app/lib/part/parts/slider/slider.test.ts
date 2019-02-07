import { SliderPart } from './slider.js';

suite('SliderPart', () => {
    test('#value', () => {
        return new Promise((resolve) => {
            const testValue = 12;
            const slider = new SliderPart();

            slider.core.onDidInvalidate(() => {
                assert.equal(slider.core.value, testValue);

                slider.core.value = 14;

                assert.equal(slider.value, 14);
                resolve();
            });

            slider.value = testValue;
        });
    });
    test('#onChange()', () => {
        return new Promise((resolve) => {
            const slider = new SliderPart();

            slider.onChange(() => {
                resolve();
            });

            (slider as any)._el.dispatchEvent(new CustomEvent('input'));
        });
    });
    test('#render()', () => {
        const value = 13;
        const slider = new SliderPart();
        
        slider.core.value = value;

        slider.render();

        assert.equal((slider as any)._el.value, value.toString());
    });
});
