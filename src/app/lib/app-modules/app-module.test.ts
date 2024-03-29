/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { AppModule } from './app-module.js';
import { Output } from '../output/output.js';

class TestModule extends AppModule {}

suite('AppModule', () => {
    suite('#addMethod()', () => {
        let output : Output;
        setup(() => {
            output = new Output();
        });
        test('should append to methods using string', () => {
            let methodCalled = false;
            class TestModule extends AppModule {
                constructor(output : Output) {
                    super(output);
                    this.addMethod('testMethod', '_testMethod');
                }
                _testMethod() {
                    methodCalled = true;
                }
            };

            const m = new TestModule(output);

            m.methods.testMethod();

            assert(methodCalled, 'Added methods does not point to instance method');
        });
        test('should append to methods using callback', () => {
            let methodCalled = false;
            const m = new TestModule(output);
            m.addMethod('testMethod', () => {
                methodCalled = true;
            });

            m.methods.testMethod();

            assert(methodCalled, 'Added methods does not point to callback');
        });
        test('should append module', () => {
            const m = new TestModule(output);
            m.addModule('subModule');

            assert.exists(m.methods.subModule, 'Submodule was not added to methods object');
        });
        test('should append method to module', () => {
            let methodCalled = false;
            const m = new TestModule(output);
            const subModule = m.addModule('subModule');

            subModule.addMethod('testMethod', () => {
                methodCalled = true;
            });

            m.methods.subModule.testMethod();

            assert.exists(methodCalled, 'Submodule does not have method');
        });
        test('should append nested modules', () => {
            const m = new TestModule(output);
            const subModule = m.addModule('subModule');
            subModule.addModule('subSubModule');

            assert.exists(m.methods.subModule.subSubModule);
        });
        teardown(() => {
            output.dispose();
        });
    });
});
