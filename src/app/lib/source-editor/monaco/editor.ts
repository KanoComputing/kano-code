import 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/monaco.contribution.js';

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
            return '/monaco-workers/ts.worker.js';
        }
        return '/monaco-workers/editor.worker.js';
    }
}

export * from 'monaco-editor/esm/vs/editor/edcore.main.js';