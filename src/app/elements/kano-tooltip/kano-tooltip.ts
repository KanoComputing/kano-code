import { LitElement, css, html, property, query, customElement } from 'lit-element/lit-element.js';

export type TooltipPosition = 'top'|'right'|'bottom'|'left'|'float'|'rightTop';
export type CaretType = 'center'|'start';

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
            }
            :host([position="top"]) {
                transform-origin: 50% 100%;
                padding-bottom: 8px;
            }
            :host([position="right"]) {
                transform-origin: 0% 50%;
                padding-left: 8px;
            }
            :host([position="bottom"]) {
                transform-origin: 50% 0%;
                padding-top: 8px;
            }
            :host([position="left"]) {
                transform-origin: 100% 50%;
                padding-right: 8px;
            }
            .tooltip {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                background-color: var(--kano-tooltip-background-color, white);
                border-radius: 10px;
                border-width: var(--kano-tooltip-border-width, 2px);
                border-color: var(--kano-tooltip-border-color, transparent);
                border-style: solid;
                font-size: 16px;
                line-height: 16px;
                box-shadow: 0 4px 4px 0px rgba(0, 0, 0, 0.15);
            }
            :host .tooltip .caret-shadow {
                position: absolute;
                width: var(--kano-tooltip-caret-width, 13px);
                height: var(--kano-tooltip-caret-width, 13px);
                background: #fff;
                padding: 0px;
                transform: rotate(45deg);
            }
            :host([position="top"][caret="start"]) .tooltip .caret-shadow {
                left: 26px;
            }
            :host([position="top"]) .tooltip .caret-shadow {
                top: 100%;
                left: 50%;
                border-bottom-right-radius: var(--kano-tooltip-caret-radius, 6px);
                box-shadow: 2px 2px 2px -1px rgba(0, 0, 0, 0.1);
                margin-left: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                margin-top: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                border-bottom-color: var(--kano-tooltip-border-color, transparent);
                border-bottom-width: var(--kano-tooltip-border-width, 2px);
                border-right-color: var(--kano-tooltip-border-color, transparent);
                border-right-width: var(--kano-tooltip-border-width, 2px);
                border-bottom-style: solid;
                border-right-style: solid;
            }
            :host([position="right"][caret="start"]) .tooltip .caret-shadow {
                top: 26px;
            }
            :host([position="right"]) .tooltip .caret-shadow {
                top: 50%;
                right: calc(100% + 0.5px);
                border-bottom-left-radius: var(--kano-tooltip-caret-radius, 6px);
                box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
                margin-top: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                margin-right: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                border-bottom-color: var(--kano-tooltip-border-color, transparent);
                border-bottom-width: var(--kano-tooltip-border-width, 2px);
                border-left-color: var(--kano-tooltip-border-color, transparent);
                border-left-width: var(--kano-tooltip-border-width, 2px);
                border-bottom-style: solid;
                border-left-style: solid;
            }
            :host([position="rightTop"]) .tooltip .caret-shadow {
                top: 75%;
                right: 100%;
                border-bottom-left-radius: var(--kano-tooltip-caret-radius, 6px);
                box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
                margin-top: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                margin-right: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                border-bottom-color: var(--kano-tooltip-border-color, transparent);
                border-bottom-width: var(--kano-tooltip-border-width, 2px);
                border-left-color: var(--kano-tooltip-border-color, transparent);
                border-left-width: var(--kano-tooltip-border-width, 2px);
                border-bottom-style: solid;
                border-left-style: solid;
            }
            :host([position="bottom"][caret="start"]) .tooltip .caret-shadow {
                left: 26px;
            }
            :host([position="bottom"]) .tooltip .caret-shadow {
                bottom: 100%;
                left: 50%;
                border-top-left-radius: var(--kano-tooltip-caret-radius, 6px);
                box-shadow: -4px -4px 4px -4px rgba(0, 0, 0, 0.1);
                margin-left: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                margin-bottom: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                border-top-color: var(--kano-tooltip-border-color, transparent);
                border-top-width: var(--kano-tooltip-border-width, 2px);
                border-left-color: var(--kano-tooltip-border-color, transparent);
                border-left-width: var(--kano-tooltip-border-width, 2px);
                border-top-style: solid;
                border-left-style: solid;
            }
            :host([position="left"][caret="start"]) .tooltip .caret-shadow {
                top: 26px;
            }
            :host([position="left"]) .tooltip .caret-shadow {
                top: 50%;
                left: 100%;
                border-top-right-radius: var(--kano-tooltip-caret-radius, 6px);
                box-shadow: 2px 0 2px -1px rgba(0, 0, 0, 0.1);
                margin-top: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                margin-left: calc(var(--kano-tooltip-caret-width, 13px) / -2);
                border-top-color: var(--kano-tooltip-border-color, transparent);
                border-top-width: var(--kano-tooltip-border-width, 2px);
                border-right-color: var(--kano-tooltip-border-color, transparent);
                border-right-width: var(--kano-tooltip-border-width, 2px);
                border-top-style: solid;
                border-right-style: solid;
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
            <div class="tooltip" id="tooltip">
                <div class="caret-shadow" ?hidden$=${this.caretHidden(this.position)}></div>
                <slot></slot>
            </div>
        `;
    }
    @query('#tooltip')
    private tooltip? : HTMLElement;

    @property({ type: String })
    public position : TooltipPosition = 'top';

    @property({ type: String })
    public caret : CaretType = 'center';

    @property({ type: Number })
    public offset = 20;

    private _target? : HTMLElement;
    public trackTarget = false;
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
        let updatePosition = false;

        if (changedProps.has('position')) {
            updatePosition = true;
        } else if (changedProps.has('caret')) {
            updatePosition = true;
        } else if (changedProps.has('offset')) {
            updatePosition = true;
        }
        if (updatePosition) {
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
    updatePosition(forceOpen : boolean = true) {
        this.positionWillChange = true;
        const { target } = this;
        let tRect;

        if (!target) {
            return;
        }

        this.setAttribute('position', this.position);
        this.setAttribute('caret', this.caret);

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

        const alignWidth = tRect.width < rect.width;
        const alignHeight = tRect.height < rect.height;

        let targetAnchorLeft = tRect.left + (tRect.width / 2);
        let targetAnchorTop = tRect.top + (tRect.height / 2);

        let caretLeft = (rect.width / 2);
        let caretTop = (rect.height / 2);

        if (this.caret === 'start') {
            caretLeft = alignWidth ? 29 : 0;
            caretTop = alignHeight ? 29 : 0;
            targetAnchorLeft = alignWidth ? targetAnchorLeft : tRect.left;
            targetAnchorTop = alignHeight ? targetAnchorTop : tRect.top;
        }

        const widthCenter = targetAnchorLeft - caretLeft - contextOffset.left;
        const heightCenter = targetAnchorTop - caretTop - contextOffset.top;

        if (['top', 'bottom'].indexOf(this.position) !== -1) {
            style.left = `${widthCenter}px`;
        } else if (['right', 'left'].indexOf(this.position) !== -1) {
            style.top = `${heightCenter}px`;
        } else { /* float */
            style.top = `${tRect.top + tRect.height * 0.95 - rect.height}px`;
            style.left = `${widthCenter}px`;
        }

        // Take the caret thickness in account
        const offset = this.offset;

        if (this.position === 'top') {
            style.top = `${tRect.top - rect.height - contextOffset.top - offset}px`;
        } else if (this.position === 'bottom') {
            style.top = `${tRect.bottom - contextOffset.top + offset}px`;
        } else if (this.position === 'right') {
            style.left = `${tRect.right - contextOffset.left + offset}px`;
        } else if (this.position === 'rightTop') {
            style.left = `${tRect.right - contextOffset.left + offset}px`;
            style.top = `${tRect.top - (rect.height / 2) - contextOffset.top - offset}px`;
        } else if (this.position === 'left') {
            style.left = `${tRect.left - contextOffset.left - rect.width - offset}px`;
        }

        this.positionWillChange = false;
        if (forceOpen) {
            this.open();
        }
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
        const anchor = this.caret === 'center' ? '50%' : '26px';
        switch (this.position) {
        case 'top':
            return `${anchor} calc(100% + 8px)`;
        case 'right':
            return `-8px ${anchor}`;
        case 'bottom':
            return `${anchor} -8px`;
        case 'left':
            return `8px ${anchor}`;
        default:
            return `-8px ${anchor}`;
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
