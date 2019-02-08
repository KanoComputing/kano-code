import { flash } from './icons.js';
import { subscribeTimeout, IDisposable } from '@kano/common/index.js';

export class Flash {
    public domNode: HTMLDivElement = document.createElement('div');
    private timeoutSub : IDisposable|null = null;
    constructor() {
        this.domNode.style.display = 'flex';
        this.domNode.style.fill = '#8F9195';
        this.domNode.style.flexDirection = 'row';
        this.domNode.style.justifyContent = 'flex-end';
        this.domNode.appendChild(flash.content.cloneNode(true));
        const icon = this.domNode.querySelector('svg');
        icon!.style.width = '14px';
        icon!.style.height = '14px';
    }
    trigger() {
        if (this.timeoutSub) {
            this.timeoutSub.dispose();
            this.timeoutSub = null;
        }
        this.domNode.style.fill = 'yellow';
        this.timeoutSub = subscribeTimeout(() => {
            this.domNode.style.fill = '#8F9195';
        }, 500);
    }
}
