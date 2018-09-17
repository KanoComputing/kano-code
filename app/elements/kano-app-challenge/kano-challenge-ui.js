/**

`kano-challenge-ui`

Example:
    <kano-challenge-ui step="[[currentStep]]"></kano-challenge-ui>

 The following custom properties and mixins are also available for styling:

 Custom property | Description | Default
 ----------------|-------------|----------

@group Kano Elements
@hero hero.svg
@demo ./demo/kano-challenge-ui.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/marked-element/marked-element.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../kano-tooltip/kano-tooltip.js';
import '../kano-arrow/kano-arrow.js';
import '../kano-blockly-block/kano-blockly-block.js';
import '../kano-highlight/kano-highlight.js';
import '../kano-value-preview/kano-value-preview.js';
import { AppElementRegistryBehavior } from '../behaviors/kano-app-element-registry-behavior.js';
import '../behaviors/kano-blockly-validator-behavior.js';
import { I18nBehavior } from '../behaviors/kano-i18n-behavior.js';
import { SoundPlayerBehavior } from '@kano/web-components/kano-sound-player-behavior/kano-sound-player-behavior.js';
import '@kano/kwc-style/typography.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
    _template: html`
        <style>
            @keyframes pop-in {
                0% {
                    transform: scale(0, 0);
                }
                80% {
                    transform: scale(1.3, 1.3);
                }
                100% {
                    transform: scale(1.0, 1.0);
                }
            }
            @keyframes ring {
                0% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                20% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 2 */
                20.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                21% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                40% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 3 */
                40.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                41% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                60% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 4 */
                60.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                61% {
                    transform: scale(0, 0);
                    opacity: 0.8;
                }
                80% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
                /* 5 */
                80.5% {
                    transform: scale(0, 0);
                    opacity: 0;
                }
                81% {
                    transform: scale(0, 0);
                    opacity: 1.0;
                }
                100% {
                    transform: scale(2.5, 2.5);
                    opacity: 0;
                }
            }
            @keyframes jump {
                0% {
                    transform: scale(1.0, 1.0);
                }
                80% {
                    transform: scale(1.0, 1.0);
                }
                82% {
                    transform: scale(1.3, 1.3);
                }
                83.5% {
                    transform: scale(0.9, 0.9);
                }
                85% {
                    transform: scale(1, 1);
                }
                100% {
                    transform: scale(1.0, 1.0);
                }
            }
            @keyframes ripple {
                0% {
                    transform: scale(0, 0);
                    opacity: 1;
                }
                80% {
                    transform: scale(0, 0);
                    opacity: 1;
                }
                89% {
                    opacity: 0.05;
                }
                100% {
                    transform: scale(1.0, 1.0);
                    opacity: 0;
                }
            }
            :host {
                @apply --layout-vertical;
                flex: 1;
                --tooltip-color: white;
            }
            :host .instruction-overlay {
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-center-justified;
                padding: 5px;
            }
            :host button {
                @apply --kano-button;
                background-color: var(--color-grassland);
                color: #fff;
                text-shadow: none;
                font-size: 14px;
                font-weight: bold;
                line-height: 18px;
                border-radius: 3px;
                padding: 7px 24px;
                margin-left: 12px;
            }
            :host #modal {
                border-radius: 4px;
            }
            :host .modal-content {
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
                font-family: var(--font-body, Arial);
                font-size: 16px;
                color: black;
            }
            :host .modal-content button {
                @apply --kano-button;
                margin: 15px 0 0;
                color: #435055;
            }
            :host .tooltip-content {
                @apply --layout-vertical;
                @apply --layout-center;
            }
            :host .tooltip-content button {
                margin: 12px 0 0 0;
            }
            kano-tooltip {
                z-index: 201;
                --kano-tooltip-background-color: var(--tooltip-color);
                --kano-tooltip-border-color: white;
                --kano-tooltip-border-width: 1px;
                color: black;
                font-family: var(--font-body);
                --kano-tooltip: {
                    padding: 16px 26px 16px;
                };
            }
            kano-arrow {
                z-index: 201;
            }
            [slot="markdown-html"] p {
                line-height: 18px;
            }
            [slot="markdown-html"] img {
                max-height: 50px;
            }
            [slot="markdown-html"] img:not(:first-child) {
                margin-top: 12px;
            }
            .markdown-html kano-blockly-block {
                line-height: 0px;
                vertical-align: middle;
                display: inline-block;
            }
            .beacon-wrapper {
                position: relative;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            .beacon {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                @apply --layout-vertical;
                @apply --layout-center;
                @apply --layout-center-justified;
            }
            .beacon.animate {
                animation: 150ms ease-in pop-in;
                animation-delay: 0ms;
                animation-iteration-count: 1;
            }
            .beacon .core {
                width: 12px;
                height: 12px;
                background: #fec02d;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
            }
            .beacon .core.animate {
                animation: 5s ease-in-out jump;
                animation-delay: 400ms;
                animation-iteration-count: infinite;
            }
            .beacon-wrapper .ripple {
                position: absolute;
                top: -135px;
                left: -135px;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                border: 1px solid rgba(254, 192, 45, 1.0);
                box-sizing: border-box;
                transform: scale(0, 0);
            }
            .beacon-wrapper .ripple.animate {
                animation: 5s ease-out ripple;
                animation-delay: 400ms;
                animation-iteration-count: infinite;
            }
            .beacon-wrapper .ring {
                position: absolute;
                top: -10px;
                left: -10px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #fec02d;
                box-sizing: border-box;
                transform: scale(0, 0);
            }
            .beacon-wrapper .ring.animate {
                animation: 5s ease-out infinite ring;
                animation-delay: 400ms;
            }
            .markdown-html p {
                margin: 0px;
            }
            .tooltip-content .emoji, .modal-content .emoji {
                max-width: 18px;
                max-height: 18px;
                transform: translateY(4px);
            }
            [hidden] {
                visibility: hidden !important;
                opacity: 0 !important;
            }
        </style>
        <slot name="editor" id="content"></slot>
        <kano-highlight id="highlight" x="[[highlight.x]]" y="[[highlight.y]]" width="[[highlight.width]]" height="[[highlight.height]]" hidden\$="[[idle]]"></kano-highlight>
        <kano-arrow source="[[arrow.source]]" target="[[arrow.target]]" angle="[[arrow.angle]]" id="arrow" hidden\$="[[idle]]">
            <iron-image slot="arrow-image" src="/assets/icons/white_arrow.svg" width="[[arrow.size]]" height="[[arrow.size]]" sizing="contain"></iron-image>
        </kano-arrow>
        <kano-arrow target="[[_beacon.target]]" bounce="0" angle="[[_beacon.angle]]" offset="[[_beacon.offset]]" left-align="[[_beacon.leftAlign]]" hidden\$="[[idle]]">
            <div class="beacon-wrapper" slot="arrow-image">
                <div class="ripple" id="ripple" on-animationiteration="_ringAnimationIterated" on-animationstart="_ringAnimationIterated"></div>
                <div class="ring" id="ring"></div>
                <div class="beacon" id="beacon">
                    <div class="core" id="core"></div>
                </div>
            </div>
        </kano-arrow>
        <template is="dom-repeat" items="[[_tooltips]]" as="tooltip" on-dom-change="_tooltipDomChanged">
            <kano-tooltip id\$="tooltip-[[index]]" target="[[tooltip.target]]" position="[[tooltip.position]]" z-index="[[tooltip.zIndex]]" tracking="[[tooltip.tracking]]" bounce\$="[[tooltip.bounce]]" on-tap="_stopPropagation" hidden\$="[[idle]]">
                <div class="tooltip-content">
                    <div class="tooltip-text">
                        <marked-element markdown="[[tooltip.text]]">
                            <div class="markdown-html" slot="markdown-html"></div>
                        </marked-element>
                    </div>
                    <button type="button" on-tap="_nextStep" hidden\$="[[!tooltip.next_button]]">[[localize('NEXT', 'Next')]]</button>
                </div>
            </kano-tooltip>
        </template>
        <paper-dialog id="modal" modal="">
            <div class="modal-content">
                <div class="text">
                    <marked-element markdown="[[selectedStep.modal.text]]">
                        <div class="markdown-html" slot="markdown-html"></div>
                    </marked-element>
                </div>
                <button type="button" on-tap="_nextStep">[[localize('NEXT', 'Next')]]</button>
            </div>
        </paper-dialog>
`,

    is: 'kano-challenge-ui',

    behaviors: [
        AppElementRegistryBehavior,
        SoundPlayerBehavior,
        I18nBehavior,
        IronResizableBehavior,
    ],

    properties: {
        tooltips: {
            type: Array,
        },
        step: {
            type: Object,
        },
        arrow: {
            type: Object,
        },
        beacon: Object,
        state: {
            type: Object,
            value: () => ({
                hints: {
                    enabled: true,
                },
            }),
            notify: true,
        },
        idle: {
            type: Boolean,
            observer: '_onIdleChanged',
        },
    },

    observers: [
        '_setupWithDelay(step, state.*)',
        '_updateBeacon(beacon.*)',
        '_updateTooltips(tooltips.*)',
    ],

    listeners: {
        change: '_editorChanged',
    },

    _stopPropagation(e) {
        e.preventDefault();
        e.stopPropagation();
    },

    _editorChanged(e) {
        // Store current step object
        let step = this.selectedStep,
            detail = e.detail;

        if (!step || this.done) {
            return;
        }
        if (this.tooltips && detail.type === 'blockly' && detail.event.type === 'move') {
            this.updateTooltips();
        }
    },

    computeSelectedStep() {
        return this.steps[this.step];
    },

    /**
   * Find the blockly element and listens to the change event
   */
    ready() {
        this.modal = this.$.modal;
        this.highlight = {};
        this.loadSound('/assets/audio/sounds/ding.mp3');
        this._onRefit = this._onRefit.bind(this);
        this.eventsCausingRefit = {
            'toolbox-scroll': ['flyout_block'],
            'workspace-scroll': ['block'],
            'block-move': ['block'],
            'iron-resize': 'all',
        };
    },

    attached() {
        this.updateTooltips = this.updateTooltips.bind(this);
        this.addEventListener('mousewheel', this.updateTooltips, true);
        window.addEventListener('resize', this.updateTooltips);
        Object.keys(this.eventsCausingRefit).forEach((eventName) => {
            this.addEventListener(eventName, this._onRefit);
        });
        this.animationSupported = 'animate' in HTMLElement.prototype;
    },

    detached() {
        this.removeEventListener('mousewheel', this.updateTooltips);
        window.removeEventListener('resize', this.updateTooltips);
        Object.keys(this.eventsCausingRefit).forEach((eventName) => {
            this.removeEventListener(eventName, this._onRefit);
        });
    },

    getToolbox() {
        return this.workspace.toolbox;
    },

    _nextStep() {
        this.fire('next-step');
    },

    _onResize() {
        const step = this.step;
        if (!step) {
            return;
        }

        if (this.beacon) {
            this._fitBeacon(this.beacon);
        }

        if (step.arrow) {
            this._fitArrow(step);
        }

        this._fitTooltips(this.tooltips);
    },

    _onRefit(e) {
        const targetConcerned = this.eventsCausingRefit[e.type];
        this._refitUiElements(targetConcerned);
    },

    _refitUiElements(targetConcerned) {
        const step = this.step;

        if (!step) {
            return;
        }

        if (this.beacon && this._targetIsConcerned(this.beacon.target, targetConcerned)) {
            this._fitBeacon(this.beacon);
        }

        if (step.arrow && this._targetIsConcerned(step.arrow.target, targetConcerned)) {
            this._fitArrow(step);
        }
        this._fitTooltips(this.tooltips);
    },

    /**
   * Checks if the target of the beacon matches the type of targets concerned by the refit event received
   */
    _targetIsConcerned(target, targetTypes) {
        if (targetTypes === 'all') {
            return true;
        }
        return typeof target === 'object' && Object.keys(target).some(key => targetTypes.indexOf(key) !== -1);
    },

    _updateTooltips() {
        this.computeTooltips();
    },

    computeTooltips() {
        const { tooltips } = this;
        this.set('_tooltips', []);
        this.debounce('computeTooltips', () => {
            this._fitTooltips(tooltips, true);
        }, 200);
    },

    _fitTooltips(tooltips, scroll) {
        if (!tooltips) {
            return;
        }
        const formattedTooltips = tooltips.map((tooltip) => {
            const copy = Object.assign({}, tooltip);
            copy.target = this._getTargetElement(tooltip.location);

            if (!copy.target) {
                return;
            }

            if ('getBoundingClientRect' in copy.target) {
                copy.target = copy.target.getBoundingClientRect();
            }

            if (scroll) {
                this._scrollWorkspaceOnTargetIfNeeded(copy.target, tooltip.location);
            }

            copy.text = tooltip.text;
            copy.tracking = !!tooltip.tracking;

            return copy;
        });
        // Forces a recompute on the dom-repeat to make sure all tooltips are updated
        this.set('_tooltips', []);
        this.async(() => {
            this.set('_tooltips', formattedTooltips);
        });
    },

    _tooltipDomChanged(e) {
        let tooltips = dom(this.root).querySelectorAll('kano-tooltip[bounce]'),
            offset,
            transform,
            tooltip;
        for (let i = 0; i < tooltips.length; i++) {
            tooltip = tooltips[i];
            offset = 70;
            if (tooltip.position === 'top' || tooltip.position === 'bottom') {
                transform = 'translateY';
            } else {
                transform = 'translateX';
            }
            if (tooltip.position === 'top' || tooltip.position === 'left') {
                offset *= -1;
            }
            tooltips[i].animate([{
                transform: `${transform}(${offset}px)`,
            }, {
                transform: `${transform}(0px)`,
            }, {
                transform: `${transform}(${offset}px)`,
            }], {
                duration: 40 * 25,
                easing: 'ease-in-out',
                iterations: Infinity,
            });
        }
    },

    computeArrow(step) {
        if (!step || !step.arrow || (!this.state.hints.enabled && !step.injected)) {
            this.$.arrow.hide();
            this.arrow = {};
            return;
        }
        this.async(() => {
            this._fitArrow(step, true);
        }, 300);
    },

    _fitArrow(step, scroll) {
        let source,
            target;

        if (step.arrow.source) {
            source = this._getTargetElement(step.arrow.source);
            if ('getBoundingClientRect' in source) {
                source = source.getBoundingClientRect();
            }
        }
        target = this._getTargetElement(step.arrow.target);

        if ('getBoundingClientRect' in target) {
            target = target.getBoundingClientRect();
        }
        if (scroll) {
            this._scrollWorkspaceOnTargetIfNeeded(target, step.arrow.target);
        }
        this.set('arrow', {
            source,
            target,
            size: (step.arrow.size || 70) * 0.6,
            angle: step.arrow.angle || 0,
        });
    },

    _updateBeacon() {
        this.computeBeacon();
    },

    computeBeacon() {
        const { beacon } = this;
        if (this.animationSupported) {
            this.$.beacon.animate({
                opacity: [1, 0],
            }, {
                duration: 200,
                fill: 'forwards',
            });
        } else {
            this.$.beacon.style.opacity = 1;
        }

        clearTimeout(this._ringSoundTimeout);
        this._ringAnimationCount = 0;

        this.toggleClass('animate', false, this.$.beacon);
        this.toggleClass('animate', false, this.$.ring);
        this.toggleClass('animate', false, this.$.ripple);
        this.toggleClass('animate', false, this.$.core);

        if (!beacon) {
            return;
        }

        this.async(() => {
            this._fitBeacon(beacon, true);
        }, 300);
    },

    _scrollWorkspaceOnTargetIfNeeded(target, location) {
        if (location && location.block) {
            let workspace = this.workspace,
                workspaceRect = workspace.svgBackground_.getBoundingClientRect(),
                viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                block;
            if (target &&
                  (target.top + target.height > workspaceRect.top + workspaceRect.height) ||
                  (target.left + target.width > workspaceRect.left + workspaceRect.width) ||
                  (target.top < 0) ||
                  (target.left < 0)) {
                block = this.getTargetBlock(location.block);
                workspace.scrollBlockIntoView(block, true);
            }
        }
    },

    _fitBeacon(beacon, scroll) {
        let target = this._getTargetElement(beacon.target),
            angle = beacon.angle || 0,
            offset = beacon.offset || 10,
            leftAlign = beacon.leftAlign || false,
            viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        if (target && ('getBoundingClientRect' in target)) {
            target = target.getBoundingClientRect();
        }

        if (scroll) {
            this._scrollWorkspaceOnTargetIfNeeded(target, beacon.target);
        }

        // Check if the target is out of the viewport (vertically)
        if (target && target.top + target.height > viewportHeight) {
            if (beacon.target.flyout_block) {
                const toolbox = this._getElement('blockly-toolbox');
                // Force a scroll of the toolbox to move the target in the viewport. Add 50 to make sure it's not just at the border of the screen
                toolbox.scrollTop = toolbox.scrollTop + (target.top + target.height - viewportHeight) + 300;
            }
        }
        this.set('_beacon', {
            target,
            angle,
            offset,
            leftAlign,
        });
        if (this.animationSupported) {
            this.$.beacon.animate({
                opacity: [0, 1],
            }, {
                duration: 200,
                delay: 10,
                fill: 'forwards',
            });
        } else {
            this.$.beacon.style.opacity = 1;
        }
        this.toggleClass('animate', true, this.$.beacon);
        this.toggleClass('animate', true, this.$.ring);
        this.toggleClass('animate', true, this.$.ripple);
        this.toggleClass('animate', true, this.$.core);
    },

    _ringAnimationIterated(e) {
        if (this._ringAnimationCount > 4 || this.idle) {
            return;
        }
        this._ringSoundTimeout = setTimeout(() => {
            this.playSound('/assets/audio/sounds/ding.mp3');
            this._ringAnimationCount++;
        }, 4600 * 0.80);
    },

    _onIdleChanged(idle) {
        if (idle) {
            clearTimeout(this._ringSoundTimeout);
            this._ringAnimationCount = 0;
        }
    },

    _computeElements() {
        if (!this.modeReady) {
            return;
        }

        const step = this.step;

        this.debounce('stepChanged', () => {
            if (!step) {
                this.tooltips = [];
                this.arrow = {};
                this.modal.close();
                this.$.highlight.hide();
                return;
            }

            if (step.load_app) {
                this.fire('load', step.load_app);
            }

            if (step.save_app) {
                this.fire('save', {
                    id: step.save_app,
                    stepIds: this.stepIds,
                    blockIds: this.blockIds,
                });
            }

            if (step.save_to_storage) {
                this.fire('save-to-storage');
            }
            this.modal.close();

            if (step.modal) {
                step.modal.text = step.modal.text;
                this.modal.open();
            }

            this.computeTooltips(step);
            this.computeArrow(step);
            this.computeHighlight(step);
            this.computePhantomBlock(step);
            this.computeSounds(step);
        }, 10);
    },

    computeSounds(step) {
        if (this.step.play_on_end) {
            this.loadSound(`/assets/audio/sounds/${this.step.play_on_end}.wav`);
        }
    },

    computePhantomBlock(step) {
        let phantom_block = step.phantom_block,
            connection,
            target,
            host;

        if (!phantom_block ||
          !phantom_block.location ||
          !Blockly.selected) {
            Blockly.removePhantomBlock();
            return;
        }
        host = this.getTargetBlock(phantom_block.location.block);

        if (!phantom_block.target) {
            connection = host.nextConnection;
        } else {
            for (let i = 0; i < host.inputList.length; i++) {
                if (host.inputList[i].name === phantom_block.target) {
                    connection = host.inputList[i].connection;
                    break;
                }
            }
        }
        target = Blockly.selected;

        if (!connection) {
            return;
        }
        this.async(() => {
            Blockly.setPhantomBlock(connection, target);
        });
    },

    computeHighlight(step) {
        if (step.highlight) {
            const highlightString = JSON.stringify(step.highlight);
            if (highlightString !== this.previousHighlight) {
                this.$.highlight.hide();
                this.debounce('highlight', () => {
                    this.focusOn(step.highlight);
                    this.$.highlight.show();
                }, 200);
                this.previousHighlight = JSON.stringify(step.highlight);
            }
        } else {
            this.$.highlight.hide();
        }
    },

    focusOn(selector) {
        let target = this._getTargetElement(selector);
        target = target.getBoundingClientRect();
        this.set('highlight.x', target.left);
        this.set('highlight.y', target.top);
        this.set('highlight.width', target.width);
        this.set('highlight.height', target.height);
        this.$.highlight.show();
    },

    _getTargetElement(selector) {
        let element = this.editor,
            partId,
            block,
            el;

        if (typeof selector === 'object') {
            if (selector.block) {
                block = this.getTargetBlock(selector.block);

                if (selector.block.inputName) {
                    const el = this.getTargetBlockInput(selector.block);
                    if (!el) {
                        this._notifyError('Could not find input', selector.block);
                    }
                    return el;
                }

                if (!block || !block.svgPath_) {
                    this._notifyError('Could not find block', selector.block);
                }
                return block && block.svgPath_;
            } else if (selector.category) {
                let toolbox = this._getElement('blockly-toolbox'),
                    el = toolbox.getCategoryElement(selector.category);

                if (!el) {
                    this._notifyError('Could not find category', selector.category);
                }
                return el;
            } else if (selector.flyout_block) {
                const flyout = this._getElement('blockly-flyout');
                const block = flyout.getBlockByType(selector.flyout_block);

                if (!block) {
                    this._notifyError('Could not find block in flyout', selector.flyout_block);
                }
                return block.getSvgRoot();
            } else if (selector.root) {
                element = document.querySelector(selector.root);
                selector = selector.path;
            }
        }
        el = this._getElement(selector);

        if (!el) {
            this._notifyError('Could not find element', selector);
        }

        return el;
    },

    _notifyError(message, detail) {
        this.fire('challenge-ui-error', { message, detail });
    },

    updateTooltips() {
        this.debounce('updateTooltips', () => {
            if (this.tooltips) {
                for (let i = 0; i < this.tooltips.length; i++) {
                    if (this.$$(`#tooltip-${i}`).tracking) {
                        this.$$(`#tooltip-${i}`).updatePosition();
                    }
                }
            }
            this.computeArrow(this.step);
            this.$$('kano-arrow').updatePosition();
        }, 100);
    },

    getTargetBlock(selector) {
        let block = this.workspace.getBlockById(selector.id);
        if (selector.shadow) {
            block = this.getTargetBlockShadow(block, selector.shadow);
        }
        return block;
    },

    getTargetBlockShadow(block, selector) {
        if (typeof selector === 'string') {
            return block.getInput(selector).connection.targetBlock();
        } else if ('shadow' in selector) {
            let shadowSelector = selector;
            if (typeof shadowSelector !== 'string' && shadowSelector.name) {
                shadowSelector = shadowSelector.name;
            }
            return this.getTargetBlockShadow(block, shadowSelector);
        }
        return null;
    },
    
    getTargetBlockInput(selector) {
        let block = this.getTargetBlock(selector),
            connection,
            blockRect,
            blockPos,
            inputRelPos,
            pos;

        if (selector.inputName) {
            // The input targeted might be a field. If a field exists with this name, return the rect matching
            let field = block.getField(selector.inputName),
                input;

            if (field) {
                return field.fieldGroup_.getBoundingClientRect();
            }

            input = block.getInput(selector.inputName);
            if (!input) {
                return block.getSvgRoot();
            }

            connection = input.connection;
            if (!connection) {
                return block.getSvgRoot();
            }
        } else {
            connection = block.nextConnection;
        }
        blockRect = block.svgPath_.getBoundingClientRect();
        blockPos = block.getRelativeToSurfaceXY();
        inputRelPos = {
            x: connection.x_ - blockPos.x,
            y: connection.y_ - blockPos.y,
        };
        pos = {};

        pos.left = blockRect.left + inputRelPos.x;
        pos.top = blockRect.top + inputRelPos.y;

        pos.right = blockRect.right + blockRect.width - inputRelPos.x;
        pos.bottom = blockRect.bottom + blockRect.height - inputRelPos.y;

        pos.width = 1;
        pos.height = 1;

        return pos;
    },

    finishStep() {
        if (this.step.play_on_end) {
            this.playSound(`/assets/audio/sounds/${this.step.play_on_end}.wav`);
        }
    },

    _getLongestDelay() {
        let step = this.step,
            delayingElements = [],
            currentDelay,
            longestDelay;

        if (!step) {
            return 0;
        }

        if (step.tooltips) {
            step.tooltips.forEach(tooltip => delayingElements.push(this._getTargetElement(tooltip.location)));
        }

        if (this.beacon) {
            delayingElements.push(this._getTargetElement(this.beacon.target));
        }

        if (step.arrow) {
            delayingElements.push(this._getTargetElement(step.arrow.source));
        }

        delayingElements.forEach((el) => {
            if (el instanceof HTMLElement) {
                currentDelay = parseInt(el.getAttribute('data-animate'));
            }
            if (currentDelay > (longestDelay || 0)) {
                longestDelay = currentDelay;
            }
        });
        return (longestDelay || 0);
    },

    _setupWithDelay() {
        /* Toggle idle state to show elements with a little delay when the step loads in.
      This also allows to read the current data-animate values of target elements */
        this._computeElements();
        this.idle = true;
        this.async(this._turnOnVisibility, 250);
    },

    _turnOnVisibility() {
        const delay = this._getLongestDelay();

        if (delay) {
            this.async(() => this._refitUiElements('all'), delay);
            this.async(() => this.idle = false, delay + 50);
        } else {
            this.idle = false;
        }
    },
});
