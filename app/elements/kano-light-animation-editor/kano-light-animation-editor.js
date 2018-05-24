/**
  @group Kano Elements
  @hero hero.svg
  @demo demo/kano-light-animation-editor.html
  */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '../../../../../@polymer/polymer/polymer-legacy.js';

import '../../../../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../../../../@polymer/iron-icon/iron-icon.js';
import '../../../../../@polymer/iron-image/iron-image.js';
import '../../../../../@polymer/iron-pages/iron-pages.js';
import '../kano-icons/kc-ui.js';
import '../kano-pixel-editor/kano-pixel-editor.js';
import '../kano-bitmap-list/kano-bitmap-list.js';
import '../kano-pixel-canvas/kano-pixel-canvas.js';
import '../inputs/kano-input-range/kano-input-range.js';
import { AppEditorBehavior } from '../behaviors/kano-app-editor-behavior.js';
import { LightBitmapBehavior } from '../behaviors/kano-light-bitmap-behavior.js';
import '../kano-tooltip/kano-tooltip.js';
import { Polymer } from '../../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
          <style>
              :host {
                  @apply --layout-vertical;
                  @apply --layout-justified;
              }
              #pixel-editor {
                  @apply --layout-flex-auto;
              }
              .bitmap-container {
                  @apply --layout-flex-auto;
                  @apply --layout-vertical;
                  position: relative;
                  width: 100%;
              }
              #canvas-area {
                  @apply --layout-flex-auto;
                  @apply --layout-vertical;
                  @apply --layout-center-justified;
              }
              #lightboard-body {
                  position: absolute;
                  top: calc(50% - 158px);
                  left: calc(50% - 212px);
              }
              .settings {
                  @apply --layout-vertical;
                  @apply --layout-flex-auto;
              }
              .settings-controls {
                  @apply --layout-flex-auto;
                  @apply --layout-vertical;
              }
              .settings-controls>* {
                  margin-bottom: 18px;
              }
              .settings-controls .size-settings {
                  @apply --layout-horizontal;
              }
              .settings-controls .size-settings kano-input-range:first-child {
                  margin-right: 16px;
              }
              kano-pixel-canvas,
              kano-bitmap-renderer {
                  @apply --layout-self-center;
              }
              kano-pixel-canvas {
                  cursor: none;
                  --kano-pixel-editor-background: var(--color-dark);
              }
              .bottom-panel {
                  max-width: 100%;
                  z-index: 2;
                  background-color: #252b31;
              }
              .bottom-panel-header {
                  border-top: 1px solid var(--kano-app-part-editor-border);
                  border-bottom: 1px solid var(--kano-app-part-editor-border);
              }
              kano-bitmap-list {
                  --kano-bitmaplist-action-container: {
                      border-top: 1px solid var(--kano-app-part-editor-border);
                      border-bottom: 1px solid var(--kano-app-part-editor-border);
                  };
              }
              kano-bitmap-list button {
                  @apply --kano-button;
                  color: #8f9195;
              }
              kano-bitmap-list button,
              kano-bitmap-list label {
                  @apply --layout-horizontal;
                  @apply --layout-center;
                  text-transform: uppercase;
                  font-family: var(--font-body);
                  font-size: 12px;
                  line-height: 16px;
                  font-weight: bold;
                  background-color: transparent;
                  margin: 7px 40px 7px 0;
                  padding: 0;
                  transition: color 300ms;
              }
              kano-bitmap-list button:last-of-type {
                  margin: 7px 24px 7px 0;
              }
              kano-bitmap-list label {
                  color: white;
              }
              kano-bitmap-list iron-icon {
                  --iron-icon-height: 18px;
                  --iron-icon-width: 18px;
                  margin-right: 8px;
                  fill: #8f9195;
                  transition: fill 300ms;
              }
              kano-bitmap-list button:hover {
                  color: #fff;
              }
              kano-bitmap-list button:hover iron-icon {
                  fill: #00d9c7;
              }
              kano-bitmap-list button.delete-frame-button:hover iron-icon {
                  fill: var(--color-flame);
              }
              #bitmap-label {
                  margin: 7px 40px;
              }
              #frames {
                  @apply --layout-flex;
                  overflow: hidden;
              }
              kano-tooltip {
                  z-index: 10;
              }
              kano-tooltip span.tooltip-text {
                color: var(--color-chateau);
                text-transform: initial;
                font-size: 14px;
                font-family: var(--font-body);
                text-decoration: none;
                padding: 6px 12px;
              }
              [hidden] {
                  display: none !important;
              }
          </style>
          <kano-pixel-editor id="pixel-editor" bitmap="{{selectedFrame}}" width="[[width]]" height="[[height]]" pen-color="{{penColor}}" pen-type="{{penType}}">
              <div slot="bitmap" class="bitmap-container">
                  <iron-image id="lightboard-body" src="/assets/mode/lightboard/body-with-buttons.svg" sizing="contain" width="424" height="336" hidden\$="[[!withDeviceOutline]]"></iron-image>
                  <iron-pages selected="[[previewState]]" attr-for-selected="name" id="canvas-area">
                      <kano-pixel-canvas id="canvas" name="stopped" bitmap="{{selectedFrame}}" width="[[width]]" height="[[height]]" pixel-size="22" spacing="1" pen-color="[[penColor]]" pen-type="[[penType]]" on-paint-action="_onPaintAction"></kano-pixel-canvas>
                      <kano-bitmap-renderer id="renderer" class="preview-renderer" name="running" bitmap="[[frame]]" loop="[[running]]" pixel-size="22" spacing="1" width="[[width]]" height="[[height]]" fps="30"></kano-bitmap-renderer>
                  </iron-pages>
              </div>
              <div slot="settings" class="settings">
                  <div class="settings-controls">
                      <kano-input-text value="{{label}}" theme="[[theme]]"></kano-input-text>
                      <div class="size-settings">
                          <kano-input-range id="width-slider" class="slider" value="{{width}}" label="Width" min="1" max="16" theme="[[theme]]" on-slider-changed="_trackWidth">
                                            </kano-input-range>
                          <kano-input-range id="height-slider" class="slider" value="{{height}}" label="Height" min="1" max="8" theme="[[theme]]" on-slider-changed="_trackHeight">
                                            </kano-input-range>
                      </div>
                      <kano-input-range id="speed-slider" class="slider" value="{{speed}}" label="Speed" min="1" max="30" symbol="fps" theme="[[theme]]" on-slider-changed="_trackSpeed">
                                        </kano-input-range>
                  </div>
              </div>
          </kano-pixel-editor>
          <!-- TODO: localisation -->
          <div class="bottom-panel">
              <kano-bitmap-list id="frames" bitmaps="{{bitmaps}}" selected="{{selectedFrame}}" selected-index="{{selectedIndex}}" running="[[running]]" width="[[width]]" height="[[height]]" on-frame-limit-reached="_onFrameLimitReached">
                  <label id="bitmap-label" slot="label">Animate</label>
                  <button id="add-frame-button" type="button" slot="add-button" disabled\$="[[running]]">
                      <iron-icon icon="kc-ui:add"></iron-icon>
                      <span>Add cell</span>
                  </button>
                  <button type="button" slot="duplicate-button" disabled\$="[[running)]]">
                      <iron-icon icon="kc-ui:duplicate"></iron-icon>
                      <span>Duplicate</span>
                  </button>
                  <button class="delete-frame-button" type="button" slot="delete-button" disabled\$="[[running]]">
                      <iron-icon icon="kc-ui:close"></iron-icon>
                      <span>Delete</span>
                  </button>
                  <button class="delete-frame-button" type="button" slot="delete-all-button" disabled\$="[[running]]">
                      <iron-icon icon="kc-ui:close"></iron-icon>
                      <span>Delete all</span>
                  </button>
              </kano-bitmap-list>
              <kano-tooltip id="tooltip" position="top">
                  <span class="tooltip-text">Frame limit reached!</span>
              </kano-tooltip>
          </div>
`,

  is: 'kano-light-animation-editor',

  behaviors: [
      AppEditorBehavior,
      LightBitmapBehavior
  ],

  properties: {
      bitmaps: {
          type: Array,
          notify: true
      },
      width: {
          type: Number,
          notify: true
      },
      height: {
          type: Number,
          notify: true
      },
      selectedIndex: {
          type: Number,
          value: 0
      },
      previewState: {
          type: String,
          observer: '_previewStateChanged'
      },
      theme: {
          type: String,
          value: "#00d9c7"
      },
      running: {
          type: Boolean,
          value: false,
          notify: true
      },
      label: {
          type: String,
          notify: true,
          observer: '_trackLabel'
      },
      speed: {
          type: Number,
          notify: true
      },
      withDeviceOutline: {
          type: Boolean,
          value: false
      },
      selectedFrame: Array,
      penColor: String,
      penType: String,
      toolsUsed: {
          type: Object,
          value: () => {
              return {};
          }
      }
  },

  observers: [
      '_onBitmapsSet(bitmaps)',
      '_onBitmapsChanged(bitmaps.*)',
      '_onFrameChanged(frame.*)',
      '_onSelectedFrameChanged(selectedFrame.*)',
      '_sizeChanged(width, height)'
  ],

  created () {
      this._onKeydown = this._onKeydown.bind(this);
      this._onKeyup = this._onKeyup.bind(this);
  },

  attached () {
      let panelElements;

      document.addEventListener('keydown', this._onKeydown);
      document.addEventListener('keyup', this._onKeyup);

      this.previewState = 'stopped';
  },

  detached () {
      document.removeEventListener('keydown', this._onKeydown);
      document.removeEventListener('keyup', this._onKeyup);

      this._stopPreview();
  },

  _onKeydown (e) {
      //disable key commands if event origin is an input, or when running and key is not 'space'
      if (/INPUT/.test(e.composedPath()[0].tagName) || (this.running && e.key !== ' ')) {
          return;
      }

      this.set('_isShiftPressed', e.shiftKey);
      switch (e.key) {
          case 'd':
              this._duplicateFrame();
              break;
          case 'n':
              this._addFrame();
              break;
          case 'ArrowRight':
              this._nextFrame();
              break;
          case 'ArrowLeft':
              this._previousFrame();
              break;
          case ' ':
              e.preventDefault();
              this._togglePreviewState();
              break;
      }
  },

  _onKeyup (e) {
      this.set('_isShiftPressed', e.shiftKey);
  },

  _addFrame () {
      this.$.frames.addFrame();
      this.notifyChange('light-animation-add-frame');
  },

  _duplicateFrame () {
      this.$.frames.duplicateFrame();
      this.notifyChange('light-animation-duplicate-frame');
  },

  _nextFrame () {
      this.selectedIndex = Math.min(this.bitmaps.length - 1, this.selectedIndex + 1);
      this.selectedFrame = this.bitmaps[this.selectedIndex].slice(0);
  },

  _previousFrame () {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      this.selectedFrame = this.bitmaps[this.selectedIndex].slice(0);
  },

  _onBitmapsSet (e) {
      this.selectedFrame = this.bitmaps[this.selectedIndex] &&
              this.bitmaps[this.selectedIndex].slice(0);

      //merge bitmaps and compute colors for custom palette
      if (!this.colorsComputed) {
          let allColors = this.bitmaps.reduce((acc, bitmap, index, bitmaps) => {
              if (bitmaps.indexOf(bitmap) === index) {
                  return acc.concat(bitmap);
              }
          }, []);
          this.$['pixel-editor']._computePalette(allColors);
          this.colorsComputed = true;
      }
  },

  _onBitmapsChanged (e) {
      if (this.lock) {
          return;
      }
      //Lock observer while resetting the observed property
      this.lock = true;

      if (e.path.search(/splices/) !== -1) {
          this._setBitmaps();
      }
      this.async(() => this.lock = false);
  },

  _setBitmaps () {
      this.set('storedBitmaps', this.storeBitmaps());
      this.set('bitmaps', this.storedBitmaps.map(bitmap => this._adjustForDisplay(bitmap, this.width, this.height)));
  },

  storeBitmaps () {
      return this.bitmaps.map(bitmap => this._adjustForStorage(bitmap, this.width));
  },

  _sizeChanged () {
      if (!this.bitmaps || this.bitmaps.length === 0) {
          this._generateEmptyFrame();
          return;
      }
      this.storedBitmaps = this.storedBitmaps || this.storeBitmaps();
      this.set('bitmaps', this.storedBitmaps.map(bitmap => this._adjustForDisplay(bitmap, this.width, this.height)));
  },

  _generateEmptyFrame () {
      let emptyFrame = [];
      for (let i = 0; i < this.height * this.width; i++) {
          emptyFrame.push('#000000');
      }
      this.set('bitmaps', [emptyFrame]);
  },

  _resetPreview () {
      clearTimeout(this.timeoutId);
      this.previewState = 'stopped';
      this.selectedIndex = 0;
      this.selectedFrame = this.bitmaps[0].slice(0);
      this.running = false;
  },

  _togglePreviewState () {
      this.set('previewState', this.previewState === 'running' ? 'stopped' : 'running');
      if (this.previewState === 'running') {
          this.oldSelectedIndex = this.selectedIndex;
          this._updatePreview();
          this.$.frames.moveDelay = 0;
          this.running = true;
      } else {
          clearTimeout(this.timeoutId);
          this.selectedIndex = this.oldSelectedIndex;
          this.selectedFrame = this.bitmaps[this.oldSelectedIndex].slice(0);
          this.async(() => this.$.frames.moveDelay = 350);
          this.running = false;
      }
  },

  _stopPreview () {
      this.set('previewState', 'stopped');
      clearTimeout(this.timeoutId);
  },

  _updatePreview () {
      if (this.bitmaps) {
          this.frame = this.bitmaps[this.selectedIndex];
          this.selectedIndex++;
          if (this.selectedIndex > this.bitmaps.length - 1) {
              this.selectedIndex = 0;
          }
          this.selectedFrame = this.bitmaps[this.selectedIndex].slice(0);
      }
      this.timeoutId = setTimeout(this._updatePreview.bind(this), 1000 / this.speed);
  },

  _onFrameChanged () {
      this.fire('render-frame', this.frame);
  },

  _onSelectedFrameChanged () {
      if (this.selectedFrame) {
          this.fire('render-frame', this.selectedFrame);
      }
  },

  _previewStateChanged () {
      this.notifyChange('light-animation-preview-changed', { value: this.previewState });
  },

  _onFrameLimitReached () {
    if (!this.$.tooltip.opened) {
      this.$.tooltip.set('target', this.$['bitmap-label'].getBoundingClientRect());
      this.$.tooltip.open();
      this.async(() => this.$.tooltip.close(), 1600);
    }
  },

  _onPaintAction () {
      this.notifyChange('light-animation-paint', { tool: this.penType });
      if (!this.toolsUsed[this.penType]) {
          this.fire('tracking-event', {
                name: `${this.penType}_tool_used`
          });
          this.toolsUsed[this.penType] = true;
      }
  },

  getElementsRegistry () {
      const panelElements = this.$['pixel-editor'].getElementsRegistry();
      return {
          'width-slider': this.$['width-slider'],
          'height-slider': this.$['height-slider'],
          'speed-slider': this.$['speed-slider'],
          'add-frame-button': this.$['add-frame-button'],
          'canvas': this.$.canvas,
          'frames': this.$.frames,
          'palette': panelElements['palette'],
          'draw-button': panelElements['draw-button'],
          'fill-button': panelElements['fill-button'],
          'colors': panelElements['colors'],
          'add-color-button': panelElements['add-color-button'],
          'color-wheel': panelElements['color-wheel']
      }
  },

  _trackHeight () {
      this.fire('tracking-event', {
            name: 'animation_height_changed'
      });
  },

  _trackLabel (current, previous) {
      this.debounce('track-label', () => {
          if (previous && current !== previous) {
              this.fire('tracking-event', {
                    name: 'animation_name_changed'
              });
          }
      }, 1500);
  },

  _trackSpeed () {
      this.fire('tracking-event', {
            name: 'animation_speed_changed'
      });
  },

  _trackWidth () {
      this.fire('tracking-event', {
            name: 'animation_width_changed'
      });
  }
});
