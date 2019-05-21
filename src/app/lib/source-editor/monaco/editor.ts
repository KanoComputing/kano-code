import '../../../../vendor/monaco-editor/esm/vs/language/typescript/monaco.contribution.js';
import '../../../../vendor/monaco-editor/esm/vs/basic-languages/monaco.contribution.js';
import { SimpleEditorModelResolverService } from '../../../../vendor/monaco-editor/esm/vs/editor/standalone/browser/simpleServices.js';
/**
 * Monkeypatch to make 'Find All References' work across multiple files
 * https://github.com/Microsoft/monaco-editor/issues/779#issuecomment-374258435
 */
SimpleEditorModelResolverService.prototype.findModel = function(editor: any, resource: { toString: () => void; }) {
  return (window as any).monaco.editor.getModels().find((model: { uri: { toString: () => void; }; }) => model.uri.toString() === resource.toString());
};

declare global {
    interface Window {
        MonacoEnvironment : {
            getWorker?(moduleId : string, label : string) : string;
            getWorkerUrl?(moduleId : string, label : string) : string;
        }
    }
}

window.MonacoEnvironment = {
    // TODO: Create a Kano Code environment to resolve those
    getWorkerUrl(moduleId, label) {
        if (label === 'javascript') {
            return '/dist/vendor/monaco-workers/ts.worker.js';
        }
        return '/dist/vendor/monaco-workers/editor.worker.js';
    }
}

export * from '../../../../vendor/monaco-editor/esm/vs/editor/edcore.main.js';