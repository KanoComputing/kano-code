/**

`kano-animated-svg` controls changes of path descriptors of a path SVG element.
It allows you to define a set of SVG paths and switch between them.

Example:
    <kano-animated-svg paths="[[paths]]"
                       selected="start"></kano-animated-svg>

 The following custom properties and mixins are also available for styling:

 Custom property | Description | Default
 ----------------|-------------|----------
 `--kano-animated-path` | Mixin applied to the path SVG element | `{}`

@group Kano Elements
@hero hero.svg
@demo ./demo.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <style>
        :host {
            display: block;
            position: relative;
        }
        :host svg {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }
        :host #path {
            @apply(--kano-animated-path);
        }
        </style>
        <svg xmlns="http://www.w3.org/2000/svg" id="svg">
            <path id="path" class="animatable"></path>
        </svg>
`,

  is: 'kano-animated-svg',

  properties: {
      /**
       * Set of path descriptors
       */
      paths: {
          type: Object,
          value: () => {
              return {};
          }
      },
      /**
       * Key of the selected path descriptor
       */
      selected: {
          type: String
      },
      /**
       * Width of the svg path (in pixels)
       */
      width: Number,
      /**
       * Height of the svg path (in pixels)
       */
      height: Number
  },

  observers: [
      'updatePath(selected, paths.*)',
      'updateViewBox(width, height)'
  ],

  updateViewBox () {
      this.$.svg.setAttribute('width', this.width);
      this.$.svg.setAttribute('height', this.height);
      this.$.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
  },

  updatePath () {
      this.$.path.setAttribute('d', this.paths[this.selected] || '');
  }
});
