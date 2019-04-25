import { Editor } from '../editor.js';
import { FileLoaders } from './loader.js';

const Loader = {
    load(editor : Editor, content : string) {
        const parsed = JSON.parse(content);
        editor.load(parsed);
    }
}

FileLoaders.register('kcode', Loader);
