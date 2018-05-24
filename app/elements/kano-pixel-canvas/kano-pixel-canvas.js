/**
@group Kano Elements
@hero hero.svg
@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
        <style>
            :host {
                display: block;
                position: relative;
            }
            .pixel {
                width: 20px;
                height: 20px;
                /* Use a border the same color as the background, allows the spacing to trigger the mouseover event */
                border: 2px solid var(--kano-pixel-editor-background, #444);
                background-color: black;
                box-sizing: content-box;
                @apply --kano-pixel-canvas-pixel;
            }
            .canvas {
                @apply --layout-horizontal;
                @apply --layout-wrap;
                box-sizing: border-box;
            }
            .canvas-wrapper {
                @apply --layout-horizontal;
                @apply --layout-center-justified;
                background-color: var(--kano-pixel-editor-background, #444);
            }
            .pen {
                position: absolute;
                top: 0;
                left: 0;
                width: 18px;
                height: 18px;
                opacity: 0.45;
                border: 2px solid white;
                pointer-events: none;
                @apply --shadow-elevation-2dp;
                border-radius: 1px;
                display: none;
            }
            .picker {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin-top: 16px;
            }
        </style>
        <div class="content" on-contextmenu="_preventContextMenu">
            <div class="canvas-wrapper">
                <div class="canvas" style\$="[[_computeCanvasStyle(width, pixelSize, spacing)]]">
                    <template is="dom-repeat" items="[[bitmap]]" as="pixel" id="repeat">
                        <div class="pixel" id\$="pixel-[[index]]" style\$="[[_computePixelStyle(pixel, pixelSize, spacing)]]" on-mouseover="_pixelOver" on-mouseout="_pixelOut"></div>
                    </template>
                </div>
            </div>
        </div>
        <div class="pen" id="pen" style\$="[[_computePenStyle(pixelSize, penColor, penType, _isMouseOver)]]"></div>
        <iron-a11y-keys target="[[target]]" keys="cmd+z ctrl+z" on-keys-pressed="undo"></iron-a11y-keys>
`,

  is: 'kano-pixel-canvas',
  behaviors: [IronResizableBehavior],

  properties: {
      /**
       * An array of all the pixels of the canvas
       */
      bitmap: {
          type: Array,
          value: () => [],
          notify: true
      },
      /**
       * Width of the canvas
       */
      width: {
          type: Number,
          value: 1
      },
      /**
       * Height of the canvas
       */
      height: {
          type: Number,
          value: 1
      },
      /**
       * Size of the pixels, defines the size of the rendered pixel square 
       */
      pixelSize: {
          type: Number,
          value: 20
      },
      /**
       * Space between each pixels
       */
      spacing: {
          type: Number,
          value: 3
      },
      /**
       * Color of the pen. This color will be used to draw on the canvas
       */
      penColor: {
          type: String,
          value: '#000000'
      },
      /**
       * Type of the pen, either fill or draw
       */
      penType: {
          type: String,
          value: 'draw',
          observer: '_penTypeChanged'
      },

  },

  listeners: {
      'mousedown': '_mouseDown',
      'mouseover': '_onMouseOver',
      'mousemove': '_onMouseMove',
      'mouseout': '_onMouseOut',
      'mouseenter': '_computePosition',
      'iron-resize': '_computePosition'
  },

  attached () {
      this._mouseUp = this._mouseUp.bind(this);
      document.addEventListener('touchstart', this._mouseDown);
      document.addEventListener('mouseup', this._mouseUp);
      document.addEventListener('touchend', this._mouseUp);
      this._history = [];
      this.MAX_HISTORY_LENGTH = 5;
      this.target = document.body;
  },

  detached () {
      document.removeEventListener('touchstart', this._mouseDown);
      document.removeEventListener('mouseup', this._mouseUp);
      document.removeEventListener('touchend', this._mouseUp);
  },

  _startHistoryRecord () {
      this._currentHistoryChanges = [];
  },

  _endHistoryRecord () {
      if (this._currentHistoryChanges) {
          this._addHistoryRecord(this._currentHistoryChanges);
      }
  },

  _recordHistoryChange (index, oldValue, newValue) {
      if (oldValue !== newValue) {
          this._currentHistoryChanges.push({
              index,
              oldValue,
              newValue
          });
      }
  },

  _addHistoryRecord (changes) {
      changes = this._cleanHistoryChanges(changes);
      if (changes.length) {
          this._history.push({ changes });
          this.fire('paint-action');
          if (this._history.length > this.MAX_HISTORY_LENGTH) {
              this._history.shift();
          }
      }
  },

  _cleanHistoryChanges (changes) {
      return changes.filter(change => change.oldValue !== change.newValue);
  },

  _paintPixel (index, color) {
      color = color || this.penColor
      this.splice('bitmap', index, 1, color);
  },

  _paintGroup (indices, color) {
      color = color || this.penColor
      indices.forEach(index => this._paintPixel(index, color));
  },

  _blurAll () {
      let pixels = dom(this.root).querySelectorAll('[data-color]'),
          prevColor, pixel;
      for (let i = 0; i < pixels.length; i++) {
          pixel = pixels[i];
          prevColor = pixel.getAttribute('data-color');
          if (prevColor) {
              pixel.style.backgroundColor = prevColor;
              pixel.removeAttribute('data-color');
          }
      }
  },

  _hoverPixel (el, color) {
      el.setAttribute('data-color', el.style.backgroundColor);
  },

  _hoverGroup (indices, color) {
      indices.forEach(index => {
          let el = this.$$(`#pixel-${index}`);
          el.setAttribute('data-color', el.style.backgroundColor);
          el.style.backgroundColor = this.penColor;
      });
  },

  _computeCanvasStyle (width, pixelSize, spacing) {
      let w = (width * (pixelSize + (spacing * 2)));
      return `max-width: ${w}px; width: ${w}px;`;
  },

  _computePixelStyle (pixel, pixelSize, spacing) {
      return `background-color: ${pixel || '#000000'}; width: ${pixelSize}px; height: ${pixelSize}px; border-width: ${spacing}px`;
  },

  _penTypeChanged () {
      if (this.currentIndex) {
          this._blurAll();
          this._paintOrHover(this.currentIndex);
      }
  },

  _pixelOver (e) {
      let target = e.path ? e.path[0] : e.target,
          model = e.model || this.$$('#repeat').modelForElement(target),
          index = model.get('index');
      this.currentIndex = index;
      this._paintOrHover(index, target);
  },

  _paintOrHover (index, target) {
      let color = this.rightClick || this.penType === 'erase' ? '#000000' : this.penColor;
      target = target || this.$$(`#pixel-${index}`);
      // The mouse is down, effectively paint on the bitmap, otherwise just apply a hover
      if (this.isMouseDown) {
          if (this.penType === 'draw' || this.penType === 'erase') {
              if (this.bitmap[index] !== color) {
                  this._recordHistoryChange(index, this.bitmap[index], color);
                  this._paintPixel(index, color);
              }
              
          } else if (this.penType === 'fill') {
              let group = this.getFillGroup(index);
              this._addHistoryRecord(group.map(idx => {
                  return {
                      index: idx,
                      oldValue: this.bitmap[idx],
                      newValue: color
                  };
              }));
              this._paintGroup(group, color);
          }
          this._blurAll();
      } else {
          if (this.penType === 'draw' || this.penType === 'erase') {
              this._hoverPixel(target, color);
          } else if (this.penType === 'fill') {
              this._hoverGroup(this.getFillGroup(index));
          }
      }
  },

  getFillGroup (index) {
      let color = this.bitmap[index],
          closeIdenticalPixels = this.getCloseIdenticalColors(index, color);
      closeIdenticalPixels.push(index);
      return closeIdenticalPixels;
  },

  getCloseIdenticalColors (index, color, checked) {
      let coord = this.indexToCoord(index),
          closeGroup = [],
          closeX, closeY, closeColor, closeIndex;
      checked = checked || [index];

      // Check the upper, lower, left, and right pixels
      [[-1, 0], [0, -1], [1, 0], [0, 1]].forEach(address => {
          closeX = coord.x + address[0];
          closeY = coord.y + address[1];
          // The close pixel is in the frame
          if (closeX < this.width && closeY < this.height && closeX >= 0 && closeY >= 0) {
              closeIndex = this.coordToIndex(closeX, closeY);
              // Stop here if the pixel was already checked
              if (checked.indexOf(closeIndex) === -1) {
                  checked.push(closeIndex);
                  closeColor = this.bitmap[closeIndex];
                  // The close pixel is the same color and is not already in the group 
                  if (closeColor === color && index !== closeIndex) {
                      closeGroup.push(closeIndex);
                      closeGroup = closeGroup.concat(this.getCloseIdenticalColors(closeIndex, color, checked));
                  }
               }
          }
      });
      return closeGroup;
  },

  indexToCoord (index) {
      return {
          x: index % this.width,
          y: Math.floor(index / this.width)
      };
  },

  coordToIndex (x, y) {
      return y * this.width + x;
  },

  /**
   * Goes a step back in the history
   */
  undo (e) {
      if (this._history.length) {
          let record = this._history.pop();
          record.changes.forEach(change => {
              this._paintPixel(change.index, change.oldValue);
          });
      }
      if (e && e.detail && e.detail.keyboardEvent) {
          e.detail.keyboardEvent.stopPropagation();
          return false;
      }
  },

  _pixelOut (e) {
      this.currentIndex = null;
      this._blurAll();
  },

  _mouseDown (e) {
      //Prevent drag-and-drop
      e.preventDefault();
      let target = e.path ? e.path[0] : e.target;
      this.isMouseDown = true;
      this.rightClick = (e.button === 2);
      this._startHistoryRecord();
      if (target.classList.contains('pixel')) {
          this._pixelOver(e);
      }
  },

  _preventContextMenu (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
  },

  _mouseUp () {
      this.isMouseDown = false;
      this._endHistoryRecord();
  },

  _onMouseOver () {
      this._isMouseOver = true;
  },

  _onMouseMove (e) {
      if (this._isMouseOver && this.position) {
          this.transform(`translate(${e.x - this.position.left - 14}px, ${e.y - this.position.top - 14}px)`, this.$.pen);
      }
  },

  _onMouseOut () {
      this._isMouseOver = false;
  },

  _computePenStyle (size, color, penType, isMouseOver) {
      color = penType === "erase" ? '#000000' : color;
      return `background: ${color}; display: ${isMouseOver ? 'block' : 'none'}; width: ${size}px; height: ${size}px;}`;
  },

  _computePosition () {
      this.position = this.getBoundingClientRect();
  }
});
