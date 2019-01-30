import { AppModule } from '../../../dist/app/lib/app-modules/app-module.js';
import { Output } from '../../../dist/app/lib/output/output.js';

suite('Runner', () => {
    mocha.globals(['userCode']);
    suite('#instrumentation', () => {
        let output;
        let methodCalled;
        setup(() => {
            methodCalled = false;

            const TestModule = class extends AppModule {
                static get id() {
                    return 'test';
                }
                constructor() {
                    super();
                    this.addMethod('testMethod', '_testMethod');
                    const mod = this.addModule('testModule');
                    mod.addMethod('testMethodInModule', () => {});
                }
                _testMethod() {
                    methodCalled = true;
                }
            };

            output = new Output();
            output.runner.addModule(TestModule);
        });
        test('Should fail when module does not exists', () => {
            assert.throws(() => output.runner.instrumentize('unknown.testMethod'));
        });
        test('Should fail when method does not exists', () => {
            assert.throws(() => output.runner.instrumentize('test.unknown'));
        });
        test('Should notify when instrumented method is called', (done) => {
            const arg = Math.random();
            const instrument = output.runner.instrumentize('test.testMethod');
            instrument.on('method-called', (e) => {
                assert(e.method === 'test.testMethod');
                assert(e.args[0] === arg);
                done();
            });

            output.setCode(`test.testMethod(${arg});`);

            output.setRunningState(true);
        });
        test('Should notify when instrumented method in module is called', (done) => {
            const arg = Math.random();
            const instrument = output.runner.instrumentize('test.testModule.testMethodInModule');
            instrument.on('method-called', (e) => {
                assert(e.method === 'test.testModule.testMethodInModule');
                assert(e.args[0] === arg);
                done();
            });

            output.setCode(`test.testModule.testMethodInModule(${arg});`);

            output.setRunningState(true);
        });
        test('Should notify before the body of the function is called', (done) => {
            const instrument = output.runner.instrumentize('test.testMethod');
            instrument.on('method-called', (e) => {
                if (e.method === 'test.testMethod') {
                    assert(!methodCalled);
                }
                done();
            });

            output.setCode('test.testMethod();');

            output.setRunningState(true);
        });
        test('Should NOT notify once instrument has been disposed of', (done) => {
            const instrument = output.runner.instrumentize('test.testMethod');
            instrument.on('method-called', (e) => {
                throw new Error('Instrument still in place after being disposed of');
            });

            instrument.dispose();

            output.setCode('test.testMethod();');

            output.setRunningState(true);

            setTimeout(() => {
                done();
            }, 10);
        });
        teardown(() => {
            output.dispose();
        });
    });
});
