import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-icon/iron-icon.js';
import '@kano/kwc-icons/kwc-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { PaperDialogBehavior } from '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';
import '../kc-dialog-topbar/kc-dialog-topbar.js';
import './kc-asset-picker.js';
import { KcAssetPickerBehavior } from './kc-asset-picker-behavior.js';
import { KwcFileManagerBehavior } from '@kano/kwc-file-picker/kwc-file-manager-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style include="kc-asset-picker-style">
            :host {
                color: white;                
                background: var(--color-black);
                font-family: var(--font-body);
                font-weight: bold;
                display: flex;
flex-direction: column;
                width: 552px;
                min-width: 340px;
                border-radius: 6px;
                border: 1px solid #202428;
            }
            #container {
                display: flex;
flex-direction: column;
                flex: 1 1 auto;
            }
            kc-dialog-topbar {
                flex: none;
                --kc-dialog-topbar-icon-color: var(--kc-asset-picker-highlight-color, var(--color-grassland));
            }
        </style>
        <kc-dialog-topbar label="[[heading]]" icon="folder">
            <button slot="action" dialog-dismiss="">Cancel</button>
        </kc-dialog-topbar>
        <div id="container">
            <div class="header">
                <button class="icon-button" on-tap="goHigher">
                    <iron-icon icon="kano-icons:button-back"></iron-icon>
                </button>
                <kwc-file-breadcrumbs parts="[[breadcrumbs]]">
                    <template>
                        <iron-icon hidden\$="[[!index]]" icon="kano-icons:link-arrow"></iron-icon>
                        <button path-index\$="[[index]]" class="bread-item">[[item]]</button>
                    </template>
                </kwc-file-breadcrumbs>
            </div>
            <div class="files">
                <template is="dom-repeat" items="[[fileList]]" as="item">
                    <button class="dir directory" path-name\$="[[item.name]]" hidden\$="[[!hasChildren(item)]]">
                        <span class="name">[[item.name]]</span>
                        <div class="number">
                            <span>[[item.children.length]]</span>    
                        </div>
                        <iron-icon icon="kano-icons:link-arrow"></iron-icon>
                    </button>
                    <iron-pages selected="[[type]]" attr-for-selected="name" hidden\$="[[hasChildren(item)]]" fallback-selection="file">
                        <div class="dir file" name="samples" on-tap="_selectAsset" selected\$="[[isSelected(index, selectedIndex, selectedPath, item)]]">
                            <button class="play" on-tap="_previewSample">
                                <kano-animated-svg width="19" height="21" paths="[[playButtonIcons]]" selected="[[_getPlayingStatus(playing, index, paused)]]"></kano-animated-svg>
                            </button>
                            <span class="label">[[item.name]]</span>
                            <button class="add">
                                <iron-icon icon="kano-icons:plus"></iron-icon>
                            </button>
                        </div>
                        <button class="dir file" name="file" on-tap="_selectAsset" selected\$="[[isSelected(index, selectedIndex, selectedPath, item)]]">[[item.name]]</button>
                    </iron-pages>
                </template>
            </div>
        </div>
`,

    is: 'kc-asset-picker-dialog',

    behaviors: [
        KwcFileManagerBehavior,
        KcAssetPickerBehavior,
        PaperDialogBehavior,
    ],

    properties: {
        heading: String,
        dismissLabel: {
            type: String,
            value: 'Cancel',
        },
    },
});
