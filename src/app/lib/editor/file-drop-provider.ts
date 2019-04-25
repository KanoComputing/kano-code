import { IFileDropOverlayProvider } from './file-upload.js';
import { html, render } from 'lit-html/lit-html.js';

export const defaultDropOverlayProvider : IFileDropOverlayProvider = {
    domNode: null,
    template: null,
    getDomNode() {
        if (!this.domNode) {
            this.template = html`<h1>Drop here</h1>`
            this.domNode = document.createElement('div');
            this.domNode.style.display = 'none';
            this.domNode.style.flexDirection = 'column';
            this.domNode.style.alignItems = 'center';
            this.domNode.style.justifyContent = 'center';
            this.domNode.style.background = 'rgba(255, 255, 255, 0.4)';
            render(this.template, this.domNode);
        }
        return this.domNode;
    },
    animateDragEnter() {
        this.domNode.style.display = 'flex';
    },
    animateDragLeave() {
        this.domNode.style.display = 'none';
    },
    animateDrop() {
        this.domNode.style.display = 'none';
    },
};
