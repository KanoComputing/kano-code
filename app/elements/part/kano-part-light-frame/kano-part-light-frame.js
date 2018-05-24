import '../kano-light-shape-behavior.js';
import '../../../scripts/kano/make-apps/parts-api/light-frame.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="kano-part-light-frame">
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
        .pixel {
            width: 21px;
            height: 21px;
            margin: 3px;
        }
        .container[running] {
            display: none;
        }
        </style>
        <div class="container" running\$="[[isRunning]]">
            <kano-bitmap-renderer width="[[model.userProperties.width]]" height="[[model.userProperties.height]]" pixel-size="25" spacing="1" bitmap="[[model.userProperties.bitmap]]" loop=""></kano-bitmap-renderer>
        </div>
    </template>
    
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/* globals Polymer, Kano */

Polymer({
    is: 'kano-part-light-frame',
    behaviors: [
        Kano.MakeApps.PartsAPI['light-frame'],
        Kano.Behaviors.LightShapeBehavior,
    ],
    detached () {
        // Firing a regular event won't do much as this is detached and the workspace will not receive it.
        document.dispatchEvent(new CustomEvent('iron-signal', {
            bubbles: false,
            detail: {
                name: 'remove-shape',
                data: this.model.id
            }
        }));
    }
});
