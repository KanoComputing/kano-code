/**
@group Kano Elements
@hero hero.svg
@demo demo/kano-part-editor.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '../kano-icons/kc-ui.js';
import '../kano-ui-editor/kano-ui-editor.js';
import '../kano-data-editor/kano-data-editor.js';
import '../kano-light-shape-configuration/kano-light-shape-configuration.js';
import '../kano-light-animation-part-editor/kano-light-animation-part-editor.js';
import '../kano-light-frame-part-editor/kano-light-frame-part-editor.js';
import '../kano-motion-sensor-part-editor/kano-motion-sensor-part-editor.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import { MediaQueryBehavior } from '../behaviors/kano-media-query-behavior.js';
import '../kano-code-shared-styles/kano-code-shared-styles.js';
import { Store } from '../../scripts/legacy/store.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
const colorThemes = {
    'ui': '#00d9c7',
    'data': '#9b61bd',
    'hardware': '#ef5285'
}
const behaviors = [
    MediaQueryBehavior,
    I18nBehavior
];
class KanoPartEditor extends Store.StateReceiver(
    mixinBehaviors(behaviors, PolymerElement)
) {
  static get template() {
    return html`
        <style include="kano-code-shared-styles">
            :host {
                @apply --layout-vertical;
                border: 1px solid #202428;
                border-radius: 6px;
                background: #292f35;
            }
            :host #config-panel-container {
                @apply --layout-vertical;
                flex: 1 0 auto;
                position: relative;
                overflow: hidden;
                box-sizing: border-box;
            }
            #config-panel-container > * {
                @apply --layout-vertical;
                flex: 1 1 auto;
            }
        </style>
        <div id="config-panel-container"></div>
`;
  }

  static get is() { return 'kano-part-editor'; }
  static get properties() {
      return {
          selected: {
              type: Object,
              linkState: 'selectedPart',
              // computed: '_computeSelected(parts, selectedIndex)',
              observer: '_selectedSet',
          },
          theme: {
              type: String,
              computed: '_computeTheme(selected)'
          },
          name: {
              type: String,
              value: ''
          },
          parts: {
              type: Array,
              linkState: 'addedParts',
          },
          selectedIndex: {
              type: Number,
              linkState: 'selectedPartIndex',
          }
      };
  }
  static get observers() {
      return [
          '_configPanelChanged(selected.configPanel)',
          '_updateName(selected)'
      ];
  }
  _computeSelected(parts, index) {
      if (!parts) {
          return null;
      }
      return parts[index];
  }
  _configPanelChanged(panel, oldValue) {
      let tagName = panel || 'div',
          container = dom(this.$['config-panel-container']);

      this._updateName(this.selected);

      const tpl = document.createElement('template');

      tpl.innerHTML = `<${tagName} class="kano-part-editor" id="${tagName.replace('kano-', '')}" element="[[selected]]" on-element-changed="_onSelectedChanged" theme="[[theme]]" name="{{name}}"></${tagName}>`

      const template = html`${tpl}`;
      this.instance = this._stampTemplate(template);

      this.scrollTarget = this.instance.firstChild;

      // Listen to scroll events on the part-editor to append the top/bottom divider
      this.scrollTarget.addEventListener('scroll', this._onScroll.bind(this));

      this._cleanContainer();

      container.appendChild(this.instance);

      // Compute the scroll state next to remove the dividers from the eventual previous editor
      requestAnimationFrame(this._onScroll.bind(this));
  }
  _computeTheme (selected) {
      if (!selected) {
          return;
      }
      const theme = colorThemes[selected.partType];
      return theme;
  }
  _updateName (selected) {
      if (!selected) {
          return;
      }
      this.set('name', selected.name);
  }
  _onScroll () {
      let target = this.scrollTarget;

      this.toggleClass('can-scroll', target.offsetHeight < target.scrollHeight);
      this.toggleClass('is-scrolled', target.scrollTop > 0);
      this.toggleClass('scrolled-to-bottom', target.scrollTop + target.offsetHeight >= target.scrollHeight);
  }
  enterQuitsInput () {
      if (event.keyCode == 13) {
          this.blur();
          return false;
      }
  }
  _cleanContainer () {
      let container = dom(this.$['config-panel-container']);
      while (container.firstChild) {
          container.removeChild(container.firstChild);
      }
  }
  _selectedSet (newValue, oldValue) {
      if (oldValue) {
          this.fire('config-panel-changed');
      }
  }
  stop () {
      this._cleanContainer();
  }
  _onSelectedChanged(e) {
      const { path, value } = e.detail;
      this.dispatch({ type: 'UPDATE_PART', property: path.replace('element.', ''), value });
  }
}
customElements.define(KanoPartEditor.is, KanoPartEditor);
