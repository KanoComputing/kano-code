import { LitElement, css, html, property, query, customElement } from 'lit-element/lit-element.js';

export type TooltipPosition = 'top'|'right'|'bottom'|'left'|'float'|'rightTop';

@customElement('kano-tooltip')
export class KanoTooltip extends LitElement {
    static get styles() {
        return [css`
            :host {
                display: inline-block;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 2;
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
            :host([position="rightTop"]) .tooltip .caret-shadow {
                top: 75%;
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
            @keyframes pop {
                0% {
                    opacity: 0;
                    transform: scale(0.5);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            .pop-in, .pop-out {
                animation-name: pop;
                animation-duration: 150ms;
                animation-iteration-count: 1;
                animation-timing-function: cubic-bezier(0.2, 0, 0.13, 1.5);
                animation-delay: 0;
            }
            .pop-in {
                animation-direction: normal;
                animation-fill-mode: forwards;
            }
            .pop-out {
                animation-direction: reverse;
            }
        `];
    }
    render() {
        return html`
            <div class="tooltip ${this.position}" id="tooltip">
                <div class="caret-shadow" ?hidden$=${this.caretHidden(this.position)}></div>
                <slot></slot>
            </div>
        `;
    }
    @query('#tooltip')
    private tooltip? : HTMLElement;

    @property({ type: String })
    public position : TooltipPosition = 'top';

    private _target? : HTMLElement;
    public trackTarget = false;
    public offset = 20;
    public autoClose = false;
    public opened = false;
    private targetTracker? : number;
    private openedEvent? : MouseEvent|TouchEvent;
    private positionWillChange = false;
    private alreadyAnimated = false;

    set target(value : HTMLElement|undefined) {
        this._target = value;
        this.setupTargetTracking();
        this.updatePosition();
    }

    get target() {
        return this._target;
    }

    set zIndex(value : number) {
        this.style.zIndex = value.toString();
    }

    updated(changedProps : Map<string, unknown>) {
        super.updated(changedProps);
        if (changedProps.has('position')) {
            this.setAttribute('position', this.position);
            this.updatePosition();
        }
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
            window.clearInterval(this.targetTracker);
        }
    }
    _onClickEvent(e : MouseEvent|TouchEvent) {
        if (this.openedEvent === e) {
            return;
        }
        let target = e.composedPath()[0] as Node;
        if (this.autoClose && this.opened) {
            // Go up the dom to check if the event originated from inside the tooltip or not
            while (target !== this && target !== document.body && target.parentNode) {
                target = target.parentNode || (target as any).host;
            }
            if (target !== this) {
                this.close();
            }
        }
    }
    _onWindowResize() {
        if (!this.opened) {
            return;
        }
        let resizeTimer;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => this.updatePosition(), 100);
    }
    caretHidden(position : TooltipPosition) {
        return position === 'float';
    }
    updatePosition() {
        this.positionWillChange = true;
        const { target } = this;
        let tRect;

        if (!target) {
            return;
        }

        /* Compute stacking context relative to viewport */
        const contextOffset = this._computeContext();

        /* See whether the target was a rect or an element */
        if ('left' in target && 'top' in target &&
          'width' in target && 'height' in target) {
            tRect = target;
        } else {
            tRect = target.getBoundingClientRect();
        }

        const { style } = this;
        const rect = this.getBoundingClientRect();

        const widthCenter = tRect.left + (tRect.width / 2) - (rect.width / 2) - contextOffset.left;
        const heightCenter = tRect.top + (tRect.height / 2) - (rect.height / 2) - contextOffset.top;

        if (['top', 'bottom'].indexOf(this.position) !== -1) {
            style.left = `${widthCenter}px`;
        } else if (['right', 'left'].indexOf(this.position) !== -1) {
            style.top = `${heightCenter}px`;
        } else { /* float */
            style.top = `${tRect.top + tRect.height * 0.95 - rect.height}px`;
            style.left = `${widthCenter}px`;
        }

        if (this.position === 'top') {
            style.top = `${tRect.top - rect.height - contextOffset.top - this.offset}px`;
        } else if (this.position === 'bottom') {
            style.top = `${tRect.bottom - contextOffset.top + this.offset}px`;
        } else if (this.position === 'right') {
            style.left = `${tRect.right - contextOffset.left + this.offset}px`;
        } else if (this.position === 'rightTop') {
            style.left = `${tRect.right - contextOffset.left + this.offset}px`;
            style.top = `${tRect.top - (rect.height / 2) - contextOffset.top - this.offset}px`;
        } else if (this.position === 'left') {
            style.left = `${tRect.left - contextOffset.left - rect.width - this.offset}px`;
        }

        this.positionWillChange = false;
        this.open();
    }
    open(e? : MouseEvent|TouchEvent) {
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

            const onAnimationEnd = () => {
                if (!this.tooltip) {
                    return;
                }
                this.tooltip.classList.remove('pop-in');
                this.tooltip.removeEventListener('animationend', onAnimationEnd);
            };
            if (!this.tooltip) {
                return;
            }
            this.tooltip.style.transformOrigin = this._getTransformOrigin();
            this.tooltip.addEventListener('animationend', onAnimationEnd);
            this.tooltip.classList.add('pop-in');

            this.opened = true;
            this.alreadyAnimated = true;
        });
    }
    close() {
        this.opened = false;

        const onAnimationEnd = () => {
            if (!this.tooltip) {
                return;
            }
            this.tooltip.classList.remove('pop-out');
            this.alreadyAnimated = false;
            this.style.visibility = 'hidden';
            this.tooltip.removeEventListener('animationend', onAnimationEnd);
        };
        if (!this.tooltip) {
            return;
        }
        this.tooltip.style.transformOrigin = this._getTransformOrigin();
        this.tooltip.addEventListener('animationend', onAnimationEnd);
        this.tooltip.classList.add('pop-out');
    }
    _getTransformOrigin() {
        switch (this.position) {
        case 'top':
            return '50% 100%';
        case 'right':
            return '0 50%';
        case 'bottom':
            return '50% 0%';
        case 'left':
            return '100% 50%';
        default:
            return '0 50%';
        }
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
            this.targetTracker = window.setInterval(this.updatePosition.bind(this), 1000);
        }
    }
    _computeContext() {
        this.style.left = '0px';
        this.style.top = '0px';
        const contextBounds = this.getBoundingClientRect();
        return {
            top: contextBounds.top,
            left: contextBounds.left,
        };
    }
}
