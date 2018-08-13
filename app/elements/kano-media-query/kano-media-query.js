import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-media-query/iron-media-query.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
        <iron-media-query query="(max-width: 700px)" query-matches="{{smallScreen}}"></iron-media-query>
        <iron-media-query query="(min-width: 700px) and (max-width: 980px)" query-matches="{{mediumScreen}}"></iron-media-query>
        <iron-media-query query="(min-width: 980px) and (max-width: 1280px)" query-matches="{{largeScreen}}"></iron-media-query>
`,

  is: 'kano-media-query',

  properties: {
      smallScreen: {
          type: Boolean,
          notify: true
      },
      mediumScreen: {
          type: Boolean,
          notify: true
      },
      largeScreen: {
          type: Boolean,
          notify: true
      }     
  }
});
