import { UIBehavior } from '../kano-ui-behavior.js';
import { Base } from '../../../scripts/kano/make-apps/parts-api/base.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
/* globals Polymer, Kano */

Polymer({
    is: 'kano-part-clock',
    behaviors: [Base, UIBehavior]
});
