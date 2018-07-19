import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class KanoTooltip extends PolymerElement {
    static get is() { return 'kano-tooltip'; }
    static get template() {
        return html`
        <style>
            :host {
                display: inline-block;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 1;
                visibility: hidden;
                text-align: center;
                --kano-tooltip-border-width: 0px;
                --kano-tooltip-border-color: transparent;
                --kano-tooltip-caret-width: 13px;
            }
            :host([position="top"]) {
                transform-origin: 50% 100%;
            }
            :host([position="right"]) {
                transform-origin: 0% 50%;
            }
            :host([position="bottom"]) {
                transform-origin: 50% 0%;
            }
            :host([position="left"]) {
                transform-origin: 100% 50%;
            }
            :host .tooltip {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                background-color: var(--kano-tooltip-background-color, white);
                border-radius: 4px;
                border: solid;
                border-color: var(--kano-tooltip-border-color);
                border-width: var(--kano-tooltip-border-width);
                font-size: 16px;
                line-height: 16px;
                @apply --kano-tooltip;
            }
            :host([position="top"]) .tooltip {
                box-shadow: 0 4px 4px 0px rgba(0, 0, 0, 0.1);
            }
            :host([position="bottom"]) .tooltip {
                box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.1);
            }
            :host([position="left"]) .tooltip,
            :host([position="right"]) .tooltip {
                box-shadow: 0 4px 4px 0px rgba(0, 0, 0, 0.1);
            }
            :host .tooltip .caret-shadow {
                position: absolute;
                width: var(--kano-tooltip-caret-width);
                height: var(--kano-tooltip-caret-width);
                background: #fff;
                padding: 0px;
                transform: rotate(45deg);
                @apply --kano-tooltip-caret;
            }
            :host([position="top"]) .tooltip .caret-shadow {
                top: 99%;
                left: 50%;
                border-bottom-right-radius: 2px;
                box-shadow: 2px 2px 2px -1px rgba(0, 0, 0, 0.1);
                margin-left: calc(var(--kano-tooltip-caret-width) / -2);
                margin-top: calc(var(--kano-tooltip-caret-width) / -2);
            }
            :host([position="right"]) .tooltip .caret-shadow {
                top: 50%;
                right: 99%;
                border-bottom-left-radius: 2px;
                box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
                margin-top: calc(var(--kano-tooltip-caret-width) / -2);
                margin-right: calc(var(--kano-tooltip-caret-width) / -2);
            }
            :host([position="bottom"]) .tooltip .caret-shadow {
                bottom: 99%;
                left: 50%;
                border-top-left-radius: 2px;
                box-shadow: -4px -4px 4px -4px rgba(0, 0, 0, 0.1);
                margin-left: calc(var(--kano-tooltip-caret-width) / -2);
                margin-bottom: calc(var(--kano-tooltip-caret-width) / -2);
            }
            :host([position="left"]) .tooltip .caret-shadow {
                top: 50%;
                left: 99%;
                border-top-right-radius: 2px;
                box-shadow: 2px 0 2px -1px rgba(0, 0, 0, 0.1);
                margin-top: calc(var(--kano-tooltip-caret-width) / -2);
                margin-left: calc(var(--kano-tooltip-caret-width) / -2);
            }
        </style>
        <div class\$="tooltip [[position]]" id="tooltip">
            <div class="caret-shadow" hidden\$="{{caretHidden(position)}}"></div>
            <slot></slot>
        </div>
`;
    }
    static get properties() {
        return {
            position: {
                type: String,
                value: 'top',
                reflectToAttribute: true,
            },
            target: {
                type: Object,
            },
            trackTarget: {
                type: Boolean,
                value: false,
            },
            zIndex: {
                type: Number,
                value: null,
            },
            offset: {
                type: Number,
                value: 20,
            },
            autoClose: {
                type: Boolean,
                value: false,
            },
            opened: {
                type: Boolean,
                value: false,
                notify: true,
            },
        };
    }
    static get observers() {
        return [
            'updatePosition(target.*, position, zIndex)',
            'setupTargetTracking(target)',
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        const observer = new MutationObserver(() => {
            if (!this.opened) {
                return;
            }
            this.updatePosition();
        });
        observer.observe(this, { childList: true, subtree: true, characterData: true });
        this._onClickEvent = this._onClickEvent.bind(this);
        this._onWindowResize = this._onWindowResize.bind(this);
        document.addEventListener('click', this._onClickEvent);
        document.addEventListener('touchend', this._onClickEvent);
        window.addEventListener('resize', this._onWindowResize);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('resize', this._onWindowResize);
        document.removeEventListener('click', this._onClickEvent);
        document.removeEventListener('touchend', this._onClickEvent);

        if (this.targetTracker) {
            clearInterval(this.targetTracker);
        }
    }
    _onClickEvent(e) {
        if (this.openedEvent === e) {
            return;
        }
        let target = e.path ? e.path[0] : e.target;
        if (this.autoClose && this.opened) {
            // Go up the dom to check if the event originated from inside the tooltip or not
            while (target !== this && target !== document.body) {
                target = target.parentNode || target.host;
            }
            if (target !== this) {
                this.close();
            }
        }
    }
    updatePosition() {
        this.positionWillChange = true;
        const { target } = this;
        let tRect;

        if (!target) {
            return;
        }

        /* Compute stacking context relative to viewport */
        this._computeContext();

        /* See whether the target was a rect or an element */
        if ('left' in target && 'top' in target &&
          'width' in target && 'height' in target) {
            tRect = target;
        } else {
            tRect = target.getBoundingClientRect();
        }

        const { style } = this;
        const rect = this.getBoundingClientRect();

        const widthCenter = tRect.left + (tRect.width / 2) - (rect.width / 2) - this.contextOffset.left;
        const heightCenter = tRect.top + (tRect.height / 2) - (rect.height / 2) - this.contextOffset.top;

        if (['top', 'bottom'].indexOf(this.position) !== -1) {
            style.left = `${widthCenter}px`;
        } else if (['right', 'left'].indexOf(this.position) !== -1) {
            style.top = `${heightCenter}px`;
        } else { /* float */
            style.top = `${tRect.top + tRect.height * 0.95 - rect.height}px`;
            style.left = `${widthCenter}px`;
        }

        if (this.position === 'top') {
            style.top = `${tRect.top - rect.height - this.contextOffset.top - this.offset}px`;
        } else if (this.position === 'bottom') {
            style.top = `${tRect.bottom - this.contextOffset.top + this.offset}px`;
        } else if (this.position === 'right') {
            style.left = `${tRect.right - this.contextOffset.left + this.offset}px`;
        } else if (this.position === 'left') {
            style.left = `${tRect.left - this.contextOffset.left - rect.width - this.offset}px`;
        }

        if (this.zIndex !== null) {
            style['z-index'] = this.zIndex;
        }

        this.positionWillChange = false;
        this.open();
    }
    open(e) {
        this.openedEvent = e;
        // Let an eventual click event triggering the open go the the click handler
        setTimeout(() => {
            const { style } = this;
            // Still recomputing the position, let it finish, it will open automatically at the end
            if (this.positionWillChange) {
                return;
            }
            style.visibility = 'visible';
            if (this.alreadyAnimated) {
                return;
            }
            this.animate([{
                opacity: 0,
                transform: 'scale(0.5)',
            }, {
                opacity: 1,
                transform: 'scale(1)',
            }], {
                easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)',
                duration: 150,
                fill: 'forwards',
            });
            this.opened = true;
            this.alreadyAnimated = true;
        });
    }
    close() {
        this.opened = false;

        this.animate([{
            opacity: 1,
            transform: 'scale(1)',
        }, {
            opacity: 0,
            transform: 'scale(0.5)',
        }], {
            easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)',
            duration: 150,
        }).onfinish = this.onCloseAnimationEnd.bind(this);
    }
    onCloseAnimationEnd() {
        this.alreadyAnimated = false;
        this.style.visibility = 'hidden';
    }
    setupTargetTracking() {
        const { target } = this;

        if (!this.trackTarget) {
            return;
        }

        if (this.targetTracker) {
            clearInterval(this.targetTracker);
        }

        if (this.trackTarget && target && 'getBoundingClientRect' in target) {
            this.targetTracker = setInterval(this.updatePosition.bind(this), 1000);
        }
    }
    _computeContext() {
        this.style.left = 0;
        this.style.top = 0;
        const contextBounds = this.getBoundingClientRect();
        this.set('contextOffset', {
            top: contextBounds.top,
            left: contextBounds.left,
        });
    }
    _onWindowResize() {
        if (!this.opened) {
            return;
        }
        let resizeTimer;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => this.updatePosition(), 100);
    }
    caretHidden(position) {
        return position === 'float';
    }
}

customElements.define(KanoTooltip.is, KanoTooltip);
