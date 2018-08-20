import '../kano-light-shape-behavior.js';
import '../../../scripts/kano/make-apps/parts-api/light-animation-display.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="kano-part-light-animation-display">
    <style is="custom-style" include="part-style"></style>
    <template>
        <style>
        :host {
            display: block;
        }
        .container {
            position: relative;
            border: 1px solid blue;
            padding: 2px;
        }
        .container[running] {
            display: none;
        }
        </style>
        <div class="container" running\$="[[isRunning]]">
            <kano-bitmap-renderer width="[[model.userProperties.width]]" height="[[model.userProperties.height]]" bitmap="[[bitmap]]" pixel-size="22" spacing="1" fps="30" loop=""></kano-bitmap-renderer>
        </div>
    </template>
    
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/* globals Polymer, Kano */

Polymer({
    is: 'kano-part-light-animation-display',
    behaviors: [Kano.MakeApps.PartsAPI['light-animation-display'], Kano.Behaviors.LightShapeBehavior],
    ready() {
        this.frameIndex = 0;
    },
    attached() {
        this._updateAnimation();
    },
    detached() {
        // Firing a regular event won't do much as this is detached and the workspace will not receive it.
        document.dispatchEvent(new CustomEvent('iron-signal', {
            bubbles: false,
            detail: {
                name: 'remove-shape',
                data: this.model.id,
            },
        }));
    },
});
