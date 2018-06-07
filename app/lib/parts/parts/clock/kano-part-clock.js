import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { UIMixin } from '../../../../elements/part/kano-ui-behavior.js';
import { BaseMixin } from '../../base.js';

class KanoPartClock extends BaseMixin(UIMixin(PolymerElement)) {
    static get is() { return 'kano-part-clock'; }
}

customElements.define(KanoPartClock.is, KanoPartClock);

