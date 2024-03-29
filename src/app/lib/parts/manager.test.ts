/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import * as sinon from 'sinon/pkg/sinon-esm.js';
import { PartsManager } from './manager.js';
import { Output } from '../output/output.js';
import { Resources } from '../output/resources.js';
import { Part } from './part.js';
import { part } from './decorators.js';

suite('PartsManager', () => {
    test('#registerPart()', () => {
        const output = new Output();
        const manager = new PartsManager(output);

        @part('test')
        class TestPart extends Part {}

        manager.registerPart(TestPart);

        const registered = manager.getRegisteredParts();

        assert.equal(registered.get('test'), TestPart);
    });
    test('#addPart()', () => {
        const output = new Output();
        output.registerResources(new Resources());
        const manager = new PartsManager(output);

        sinon.stub(output, 'visuals').value({});
        sinon.stub(output, 'audio').value({});
        sinon.stub(output, 'dom').value({});

        const onInstall = sinon.mock();

        @part('test')
        class TestPart extends Part {
            onInstall() {
                onInstall();
            }
        }

        manager.registerPart(TestPart);

        manager.addPart(TestPart);

        assert(onInstall.called);
    });
});
