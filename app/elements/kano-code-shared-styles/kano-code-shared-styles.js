import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="kano-code-shared-styles">
    <template>
        <style>
            :host {
                --kano-part-editor-padding: 32px 32px 12px;
                --kano-part-editor-content-height: 75vh;
                --kano-part-editor-input-margin: 32px;
                --kano-part-editor-label: {
                    display: block;
                    color: rgba(255, 255, 255, 0.5);
                    text-transform: uppercase;
                    font-size: 12px;
                    line-height: 12px;
                    font-family: var(--font-body);
                    font-weight: bold;
                    margin-bottom: 10px;
                };
            }
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
