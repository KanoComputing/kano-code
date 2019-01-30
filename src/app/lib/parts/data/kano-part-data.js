import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { UIMixin } from '../mixin.js';
import { DataMixin } from './data.js';

class KanoPartData extends UIMixin(DataMixin(PolymerElement)) {
    static get is() { return 'kano-part-data'; }
    ready() {
        this.appModules = Kano.AppModules;
    }
}

customElements.define(KanoPartData.is, KanoPartData);
