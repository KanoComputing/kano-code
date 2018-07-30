import { AppModule } from '../../../app/lib/app-modules/app-module.js';
import { Output } from '../../../app/lib/output/output.js';
import { setup, test, assert, suite, teardown } from '../tools.js';

suite('AppModule', () => {
    suite('#addMethod', () => {
        let output;
        setup(() => {
            output = new Output();
        });
        test('should append to methods using string', () => {
            let methodCalled = false;
            const TestModule = class extends AppModule {
                constructor() {
                    super();
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
            const m = new AppModule(output);
            m.addMethod('testMethod', () => {
                methodCalled = true;
            });

            m.methods.testMethod();

            assert(methodCalled, 'Added methods does not point to callback');
        });
        test('should append module', () => {
            const m = new AppModule(output);
            m.addModule('subModule');

            assert.exists(m.methods.subModule, 'Submodule was not added to methods object');
        });
        test('should append method to module', () => {
            let methodCalled = false;
            const m = new AppModule(output);
            const subModule = m.addModule('subModule');

            subModule.addMethod('testMethod', () => {
                methodCalled = true;
            });

            m.methods.subModule.testMethod();

            assert.exists(methodCalled, 'Submodule does not have method');
        });
        test('should append nested modules', () => {
            const m = new AppModule(output);
            const subModule = m.addModule('subModule');
            subModule.addModule('subSubModule');

            assert.exists(m.methods.subModule.subSubModule);
        });
        teardown(() => {
            output.dispose();
        });
    });
});
