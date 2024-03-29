/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { assert } from '@kano/web-tester/helpers.js';
import { degreesToRadians } from './conversions.js';

const degrees = 45;

suite('conversions', () => {
    test('degreesToRadians convert 45deg', () => {
        let result = degreesToRadians(degrees);
        assert.equal(parseFloat(result.toFixed(6)), 0.785398);
    });
});
