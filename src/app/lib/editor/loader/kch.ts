import { Editor } from '../editor.js';
import { FileLoaders } from './loader.js';

const Loader = {
    load(editor : Editor, content : string) {
        throw new Error('Not implemented');
    }
}

FileLoaders.register('kch', Loader);
