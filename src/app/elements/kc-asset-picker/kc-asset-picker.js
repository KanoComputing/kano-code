import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-pages/iron-pages.js';
import { KwcFileManagerBehavior } from '@kano/kwc-file-picker/kwc-file-manager-behavior.js';
import '@kano/kwc-file-picker/kwc-file-breadcrumbs.js';
import '@kano/kwc-icons/kwc-icons.js';
import '@kano/kwc-style/color.js';
import '@kano/kwc-style/typography.js';
import '@polymer/iron-icon/iron-icon.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '../kano-animated-svg/kano-animated-svg.js';
import './kc-asset-picker-style.js';
import { KcAssetPickerBehavior } from './kc-asset-picker-behavior.js';

Polymer({
    _template: html`
        <style include="kc-asset-picker-style">
            :host {
                display: block;
                color: white;                
                background: var(--color-black);
                font-family: var(--font-body);
                font-weight: bold;
            }
        </style>
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
`,

    is: 'kc-asset-picker',

    behaviors: [
        KwcFileManagerBehavior,
        KcAssetPickerBehavior,
    ],
});
