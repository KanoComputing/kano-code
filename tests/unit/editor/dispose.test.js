import * as code from '../../../app/lib/index.js';
import { setup, test, suite } from '../tools.js';

suite('Editor', () => {
    suite('#dispose', () => {
        let editor;
        setup(() => {
            editor = new code.Editor();
        });
        test('should call onDispose on the outputview', (done) => {
            class MyOutput extends code.OutputViewProvider {
                get root() {
                    return document.createElement('div');
                }
                onDispose() {
                    done();
                }
            }

            editor.output.registerOutputViewProvider(new MyOutput());

            editor.dispose();
        });
        test('should call onDispose on the workpsaceView', (done) => {
            class MyWorkspace extends code.WorkspaceViewProvider {
                get root() {
                    return document.createElement('div');
                }
                onDispose() {
                    done();
                }
            }

            editor.registerWorkspaceViewProvider(new MyWorkspace());

            editor.dispose();
        });
        test('should call onDispose on the plugins', (done) => {
            class MyPlugin extends code.Plugin {
                onDispose() {
                    done();
                }
            }

            editor.addPlugin(new MyPlugin());

            editor.dispose();
        });
    });
});
