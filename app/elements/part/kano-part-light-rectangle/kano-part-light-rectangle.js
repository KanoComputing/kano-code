import '../kano-light-shape-behavior.js';
import '../../../scripts/kano/make-apps/parts-api/light-rectangle.js';
import { Polymer } from '../../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="kano-part-light-rectangle">
    <style is="custom-style" include="part-style"></style>
    <template>
        <style>
        :host {
            display: block;
        }
        .container {
            position: relative;
            border: 1px solid blue;
        }
        .pixel {
            width: 21px;
            height: 21px;
            margin: 3px;
        }
        .canvas {
            @apply(--layout-horizontal);
            @apply(--layout-wrap);
            padding: 2px;
        }
        .container[running] {
            display: none;
        }
        </style>
        <div class="container" style\$="[[_computeContainerStyle(model.userProperties.*)]]" running\$="[[isRunning]]">
            <div id="pixel-array" class="canvas"></div>
        </div>
    </template>
    
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/* globals Polymer, Kano */

Polymer({
    is: 'kano-part-light-rectangle',
    behaviors: [Kano.MakeApps.PartsAPI['light-rectangle'], Kano.Behaviors.LightShapeBehavior],
    _computeContainerStyle () {
        let width = parseInt(this.model.userProperties.width) * this.PIXEL_SIZE + 4,
            height = parseInt(this.model.userProperties.height) * this.PIXEL_SIZE + 4,
            length = parseInt(this.model.userProperties.width) * parseInt(this.model.userProperties.height),
            container = this.$['pixel-array'],
            div;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        for (let i = 0; i < length; i++) {
            div = document.createElement('div');
            div.className = 'pixel';
            div.style.backgroundColor = this.model.userProperties.color;
            container.appendChild(div);
        }
        return `width: ${width}px; height: ${height}px;`;
    },
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
