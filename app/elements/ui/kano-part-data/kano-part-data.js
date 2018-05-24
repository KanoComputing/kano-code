import '@polymer/polymer/polymer-legacy.js';
import { UIBehavior } from '../../part/kano-ui-behavior.js';
import { data } from '../../../scripts/kano/make-apps/parts-api/data.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
/* globals Polymer, Kano */

Polymer({
    is: 'kano-part-data',
    behaviors: [UIBehavior, data],
    ready () {
        this.appModules = Kano.AppModules;
    },
    start () {
        data.start.apply(this, arguments);
    },
    stop () {
        data.stop.apply(this, arguments);
    }
});
