import { Editor } from '../editor/editor.js';
import { FileLoaders } from '../editor/loader/loader.js';

const Loader = {
    load(editor : Editor, content : string) {
        throw new Error('Not implemented');
    }
}

FileLoaders.register('kch', Loader);
