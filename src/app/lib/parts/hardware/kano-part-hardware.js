
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { UIMixin } from '../mixin.js';

class KanoPartHardware extends UIMixin(PolymerElement) {
    static get is() { return 'kano-part-hardware'; }
}

customElements.define(KanoPartHardware.is, KanoPartHardware);
