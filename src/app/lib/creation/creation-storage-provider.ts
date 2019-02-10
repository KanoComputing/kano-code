import { Plugin } from '../editor/plugin.js';
import { ICreationBundle } from '../editor/editor.js';

export abstract class CreationStorageProvider extends Plugin {
    abstract write(creationBundle : ICreationBundle) : Promise<void>|void
}

export default CreationStorageProvider;
