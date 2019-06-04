import DialogProvider from '../editor/dialogs/dialog-provider.js';
import { html, render } from 'lit-html/lit-html.js';
import { IRemix } from './remix.js';

export class RemixDialogProvider extends DialogProvider {
    private data : IRemix;
    constructor(data : IRemix) {
        super();
        this.data = data;
    }
    createDom(): HTMLElement {
        const domNode = document.createElement('div');
        domNode.style.background = 'white';
        render(this.render(), domNode);
        return domNode;
    }
    render() {
        return html`
            <button dialog-dismiss>&times;</button>
            ${this.data.samples
                ? this.data.samples.map(sample => html`
                    <div>
                        <img src=${sample.img} />
                        <span>${sample.description}</span>
                    </div>
                `)
                : html``}
        `;
    }
    dispose() { }
}
