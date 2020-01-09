/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

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

        slider.core.invalidated = true;
        slider.render();

        assert.equal((slider as any)._el.value, value.toString());
    });
});
