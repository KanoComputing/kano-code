import * as code from '../../../dist/app/lib/index.js';
import { DefaultWorkspaceViewProvider } from '../../../dist/app/lib/editor/workspace/default.js';

suite('Workspace', () => {
    suite('#default', () => {
        let editor;
        setup(() => {
            editor = new code.Editor();
        });
        test('should use default workspace by default', () => {
            editor.inject();
            assert(editor.workspaceView instanceof DefaultWorkspaceViewProvider);
        });
        test('should hide workspace when not provided', () => {
            editor.registerProfile({ toolbox: [] });
            editor.inject();
        });
        teardown(() => {
            editor.dispose();
        });
    });
});
