import { KCEditorBanner } from '../../../elements/kano-editor-banner/kano-editor-banner.js';
import { EventEmitter, subscribeDOM, IEvent } from '@kano/common/index.js';
import { twemoji } from '@kano/twemoji/index.es.js';
import { BlocklyEditorBannerWidget } from '../../widget/blockly-banner.js';
import { eye, reset } from '@kano/icons/ui.js';

export interface IBannerData {
    text : string;
    nextButton : boolean;
}

export interface IBannerButton {
    dispose() : void;
    onDidClick : IEvent<void>;
}

export class BannerWidget extends BlocklyEditorBannerWidget {
    private bannerEl? : KCEditorBanner;
    private buttons : IBannerButton[] = [];
    getDomNode() {
        const domNode = super.getDomNode();
        if (!this.bannerEl) {
            this.bannerEl = new KCEditorBanner();
            this.bannerEl.style.margin = '7px';
            this.bannerEl.style.alignSelf = 'flex-end';
            this.bannerEl.style.pointerEvents = 'all';
            domNode.appendChild(this.bannerEl);
        }
        return domNode;
    }
    getBannerEl() {
        if (!this.bannerEl) {
            this.getDomNode();
        }
        return this.bannerEl!;
    }
    setTitle(title : string) {
        const bannerEl = this.getBannerEl();
        bannerEl.title = title;
    }
    setText(text : string) {
        const bannerEl = this.getBannerEl();
        bannerEl.text = twemoji.parse(text);
    }
    setProgress(progress : number) {
        const bannerEl = this.getBannerEl();
        bannerEl.progress = progress;
    }
    setIconNode(node : HTMLElement|null) {
        const bannerEl = this.getBannerEl();
        const prevNode = bannerEl.querySelector('[slot="avatar"]');
        if (prevNode) {
            prevNode.remove();
        }
        if (!node) {
            return;
        }
        node.slot = 'avatar';
        bannerEl.appendChild(node);
    }

    setHint(text : string) {
        const bannerEl = this.getBannerEl();
        bannerEl.hintText = twemoji.parse(text);
    }
    
    addHintButton(text : string) {
        const bannerEl = this.getBannerEl();
        const el = document.createElement('button');
        el.textContent = text;
        el.slot = 'hint-button';
        el.classList.add('hint');
        bannerEl.appendChild(el);
        const emitter = new EventEmitter();
        const sub = subscribeDOM(el, 'click', () => emitter.fire());
        const button = {
            dispose: () => {
                el.remove();
                emitter.dispose();
                sub.dispose();
            },
            onDidClick: emitter.event,
        };

        return button;
    }
    addMenuButton(text : string) {
        const bannerEl = this.getBannerEl();
        const el = document.createElement('button');
        el.textContent = text;
        el.slot = 'info';
        el.classList.add('btn', 'secondary', 'inverted');
        
        const instance = eye.content.cloneNode(true);
        el.insertBefore(instance, el.firstChild);
        
        bannerEl.appendChild(el);

        const emitter = new EventEmitter();

        const sub = subscribeDOM(el, 'click', () => emitter.fire());

        const button = {
            dispose: () => {
                el.remove();
                emitter.dispose();
                sub.dispose();
            },
            onDidClick: emitter.event,
        };

        return button;
    }
    addButton(text : string, primary = false, isReset = false) {
        const bannerEl = this.getBannerEl();
        const el = document.createElement('button');
        el.slot = 'actions';
        el.textContent = text;
        el.classList.add('btn');
        if (!primary) {
            el.classList.add('secondary');
        }
        if (isReset) {
            el.classList.add('reset', 'inverted');
            const instance = reset.content.cloneNode(true);
            el.insertBefore(instance, el.firstChild);
        }

        bannerEl.appendChild(el);

        const emitter = new EventEmitter();

        const sub = subscribeDOM(el, 'click', () => emitter.fire());

        const button = {
            dispose: () => {
                if (el.parentNode === bannerEl) {
                    bannerEl.removeChild(el);
                }
                emitter.dispose();
                sub.dispose();
            },
            onDidClick: emitter.event,
        };

        return button;
    }
    hide() {
        const domNode = this.getDomNode();
        domNode.style.display = 'none';
    }
    showHint() {
        const bannerEl = this.getBannerEl();
        bannerEl.hintDisplayed = true;
    }
    show() {
        const bannerEl = this.getBannerEl();
        const domNode = this.getDomNode();
        domNode.style.display = 'flex';
        bannerEl.classList.remove('animate');
        // This makes sure the class is added next frame and the CSS engine takes it in account
        requestAnimationFrame(() => {
            bannerEl.classList.add('animate');
        });
    }
    dispose() {
        this.buttons.forEach(b => b.dispose());
        this.buttons.length = 0;
    }
}
