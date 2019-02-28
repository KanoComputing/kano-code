import { PartInlineDisplay } from '../../inline-display.js';
import { WeatherPart } from './weather.js';
import { html, render } from 'lit-html/lit-html.js';
import { memoize } from '../../../util/decorators.js';

function getTemplate(units : string, callback : () => any) {
    return html`
        <style>
            select {
                color: #8F9195;
                background: transparent;
                font-family: var(--font-body);
                border-radius: 3px;
                margin-right: 8px;
            }
            option {
                color: black;
            }
        </style>
        <select @change=${() => callback()} .selectedIndex=${units === 'metric' ? 0 : 1}>
            <option value="metric">Metric</option>
            <option value="imperial">Imperial</option>
        </select>
    `;
}

export class WeatherInlineDisplay extends PartInlineDisplay<HTMLDivElement> {
    public domNode : HTMLDivElement = document.createElement('div');
    private part : WeatherPart;
    constructor(part : WeatherPart) {
        super(part);
        this.part = part;
        this.domNode.style.display = 'flex';
        this.domNode.style.flexDirection = 'row';
        this.domNode.style.justifyContent = 'flex-end';
        render(getTemplate(part._units, () => this._updateUnits()), this.domNode);
    }
    @memoize
    getSelect() : HTMLSelectElement {
        return this.domNode.querySelector('select') as HTMLSelectElement;
    }
    _updateUnits() {
        const select = this.getSelect();
        const index = select.selectedIndex;
        const option = select.options[index];
        this.part._units = option.value as 'metric'|'imperial';
    }
    onInject() {}
    onDispose() {}
}