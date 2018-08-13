import { PolymerElement } from '@polymer/polymer/polymer-element.js';
let defined = false;

class StoreObserver {
    constructor(store, editor) {
        if (!defined) {
            class Observer extends store.StateReceiver(PolymerElement) {
                static get is() { return 'kc-editor-observer'; }
                static get properties() {
                    return {
                        addedParts: {
                            linkState: 'addedParts',
                        },
                    };
                }
                static get observers() {
                    return [
                        '_addedPartsSplices(addedParts.splices)',
                    ];
                }
                _addedPartsSplices(changes) {
                    if (!changes) {
                        return;
                    }
                    changes.indexSplices.forEach((splice) => {
                        splice.removed.forEach((part) => {
                            this.editor.trigger('part-removed', part);
                        });
                        for (let i = 0; i < splice.addedCount; i += 1) {
                            const index = splice.index + i;
                            const part = splice.object[index];
                            this.editor.trigger('part-added', part);
                        }
                    });
                }
            }
            customElements.define(Observer.is, Observer);
            defined = true;
        }
        this.observerEl = document.createElement('kc-editor-observer');
        this.observerEl.editor = editor;
    }
    get rootEl() {
        return this.observerEl;
    }
}

export default StoreObserver;
