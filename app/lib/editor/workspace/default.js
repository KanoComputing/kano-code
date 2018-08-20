import { WorkspaceViewProvider } from './index.js';

export class DefaultWorkspaceViewProvider extends WorkspaceViewProvider {
    constructor(...args) {
        super(...args);
        this.root = document.createElement('div');
    }
    get outputViewRoot() {
        return this.root;
    }
    get partsRoot() {
        return this.root;
    }
}

export default DefaultWorkspaceViewProvider;
