import '@kano/styles/typography.js'
import '@kano/styles/color.js'
import { IFileDropOverlayProvider } from './file-upload.js';
import { html, render } from 'lit-html/lit-html.js';
import { svg } from '@kano/icons-rendering/index.js';
import { templateContent } from '../directives/template-content.js';

const cloud = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.32 30.13"><defs></defs><title>Asset 36</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_3" data-name="Layer 3"><path d="M35.29,30.13H28.74a2.42,2.42,0,0,1-1.87-.76,2.6,2.6,0,0,1-.76-1.87V24.65a1.1,1.1,0,0,1,.34-.81,1.14,1.14,0,0,1,.84-.34H30a.88.88,0,0,0,.68-1.43l-7-8.34a1.11,1.11,0,0,0-.9-.42,1.09,1.09,0,0,0-.89.42l-7,8.34a.79.79,0,0,0-.13.93.81.81,0,0,0,.79.5h2.63a1.14,1.14,0,0,1,.84.34,1.1,1.1,0,0,1,.34.81V27.5a2.55,2.55,0,0,1-.79,1.87,2.43,2.43,0,0,1-1.84.76H9.18a9.45,9.45,0,0,1-4.37-1.05,9.08,9.08,0,0,1-3.35-2.95A8.59,8.59,0,0,1,0,21.81a7.86,7.86,0,0,1,1.1-4.58,8.68,8.68,0,0,1,3.35-3.37,1.89,1.89,0,0,0,1-1.95A7,7,0,0,1,7.31,6.33,6.69,6.69,0,0,1,10.57,4.2a7.18,7.18,0,0,1,6.4.92,1.84,1.84,0,0,0,1.32.29,1.46,1.46,0,0,0,1.1-.71A10.33,10.33,0,0,1,23.74.93a10.62,10.62,0,0,1,6-.81,9.58,9.58,0,0,1,5.79,3.05,10.94,10.94,0,0,1,2,2.84,9.9,9.9,0,0,1,.95,5.82,1.54,1.54,0,0,0,.92,1.77,8.65,8.65,0,0,1,4.79,9.34,8,8,0,0,1-3,5.14A9.19,9.19,0,0,1,35.29,30.13Z"/></g></g></svg>`;

export const defaultDropOverlayProvider : IFileDropOverlayProvider = {
    domNode: null,
    template: null,
    getDomNode() {
        if (!this.domNode) {
            this.template = html`
                <style>
                    .drop-zone {
                        font-family: var(--font-body);
                        color: white;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        width: 50%;
                        height: 50%;
                        border: 8px solid var(--color-grey);
                        border-radius: 6px;
                        border-style: dashed;
                    }
                    .drop-zone svg {
                        fill: var(--color-grey);
                        width: 128px;
                        height: 128px;
                    }
                </style>
                <div class="drop-zone">
                    ${templateContent(cloud)}
                    <h1>Drop your files here</h1>
                </div>
            `;
            this.domNode = document.createElement('div');
            this.domNode.style.display = 'none';
            this.domNode.style.flexDirection = 'column';
            this.domNode.style.alignItems = 'center';
            this.domNode.style.justifyContent = 'center';
            this.domNode.style.opacity = '0';
            this.domNode.style.transition = 'opacity 200ms ease-out';
            this.domNode.style.background = 'rgba(41, 47, 53, 0.7)';
            render(this.template, this.domNode);
        }
        return this.domNode;
    },
    animateDragEnter() {
        const domNode = this.getDomNode();
        domNode.style.display = 'flex';
        // Force a browser layout so it takes in account the opacity change
        domNode.getBoundingClientRect();
        domNode.style.opacity = '1';
    },
    animateDragLeave() {
        const domNode = this.getDomNode();
        domNode.style.display = 'none';
        domNode.style.opacity = '0';
    },
    animateDrop() {
        const domNode = this.getDomNode();
        domNode.style.display = 'none';
        domNode.style.opacity = '0';
    },
};
