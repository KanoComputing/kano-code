import { Polymer } from '../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../@polymer/polymer/lib/utils/html-tag.js';
const ICON_SRCS = {

};

Polymer({
  _template: html`
        <style>
        :host {
            display: block;
        }
        :host .explorer {
            @apply --layout-horizontal;
            @apply --layout-center-justified;
            @apply --layout-wrap;
            max-width: calc(144px * 5);
        }
        :host .item {
            @apply(--layout-vertical);
            @apply(--layout-center);
            margin: 12px;
        }
        :host .item:hover {
            cursor: pointer;
        }
        :host .icon {
            @apply --layout-vertical;
            @apply --layout-center;
            @apply --layout-center-justified;
            width: 120px;
            height: 120px;
            background: #fff;
            border-radius: 4px;
        }
        :host .icon iron-image {
            width: 100px;
            height: 100px;
        }
        :host header {
            @apply --layout-horizontal;
            @apply --layout-center;
        }
        :host header div {
            @apply --layout-flex;
        }
        :host .left {
            @apply --layout-start;
        }
        :host .right {
            @apply --layout-end;
        }
        :host .center {
            text-align: center;
        }
        :host .back {
            @apply --kano-icon-button;
            font-size: 2em;
            font-weight: 600;
            font-family: monospace;
        }
        </style>
        <header>
            <div class="left">
                <button type="button" class="back" on-tap="goBack" hidden\$="[[!folder.parent]]">&lt;</button>
            </div>
            <div class="center">
                <h4>[[folder.name]]</h4>
            </div>
            <div class="right"></div>
        </header>
        <div class="explorer">
            <template is="dom-repeat" items="{{folder.children}}" as="file" filter="isFile">
                <div id\$="{{_filenameToId(file.name)}}" class\$="item file [[selectedClass(file, selectedFile)]]" on-tap="selectFile">
                    <div class="icon">
                        <iron-image src="[[computeIcon(file)]]" preload="" fade="" sizing="contain"></iron-image>
                    </div>
                    <span class="name">{{file.name}}</span>
                </div>
            </template>
            <template is="dom-repeat" items="{{folder.children}}" as="folder" filter="isFolder">
                <div class="item folder" on-tap="openFolder">
                    <div class="icon">
                        <iron-image src="[[computeIcon(folder)]]" preload="" fade="" sizing="contain"></iron-image>
                    </div>
                    <span class="name">{{folder.name}}</span>
                </div>
            </template>
        </div>
`,

  is: 'kano-fs',

  properties: {
      files: {
          type: Array,
          value: () => {
              return [];
          },
          observer: 'filesChanged'
      },
      folder: {
          type: Object
      }
  },

  filesChanged () {
      let folder;
      if (!this.files) {
          return;
      }
      folder = { 'children': this.files };
      folder.children.forEach((item) => {
          item.parent = folder;
      });
      this.folder = folder;
  },

  isFile (item) {
      return !this.isFolder(item);
  },

  isFolder (item) {
      return item.children;
  },

  selectedClass (item) {
      return item === this.selectedFile ? 'selected' : '';
  },

  computeIcon (item) {
      if (this.isFolder(item)) {
          return item.icon || '/assets/icons/folder.png';
      }
      if (item.type === 'image') {
          return item.data.src;
      }
      return ICON_SRCS[item.type];
  },

  openFolder (e) {
      let folder = e.model.get('folder');
      folder.parent = this.folder;
      folder.children.forEach((item) => {
          item.parent = folder;
      });
      this.folder = folder;
      this.fire('browse', this.folder);
  },

  goBack () {
      this.folder = this.folder.parent;
      this.fire('browse', this.folder);
  },

  selectFile (e) {
      let file = e.model.get('file');
      this.selectedFile = file;
      this.fire('select-file', file);
  },

  computePath (item) {
      let path = '',
          name = item.name || '';
      if (item.parent) {
          path = `${this.computePath(item.parent)}/${path}`;
      }

      return `${path}${name}`;
  },

  _filenameToId (str) {
      return str.replace(/\s+/g, '-').toLowerCase();
  }
});
