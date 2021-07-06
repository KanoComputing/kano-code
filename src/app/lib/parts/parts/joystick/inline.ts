import { PartInlineDisplay } from '../../inline-display.js';
import { JoystickPart } from './joystick.js';
import { html, render } from 'lit-html/lit-html.js';
import { memoize } from '../../../util/decorators.js';
import { JoystickAxis } from './enums.js';

function getTemplate(axis : JoystickAxis, callback : () => any) {
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
                text-align: center;
            }
        </style>
        <select @change=${callback} .selectedIndex=${axis}>
            <option value="${JoystickAxis.xy}">⇧ ⇩ ⇦ ⇨</option>
            <option value="${JoystickAxis.x}">⇦ ⇨</option>
            <option value="${JoystickAxis.y}">⇧ ⇩</option>
        </select>
    `;
}

export class JoystickInlineDisplay extends PartInlineDisplay<HTMLDivElement> {
    public domNode : HTMLDivElement = document.createElement('div');
    private part : JoystickPart;
    constructor(part : JoystickPart) {
        super(part);
        this.part = part;
        this.domNode.style.display = 'flex';
        this.domNode.style.flexDirection = 'row';
        this.domNode.style.justifyContent = 'flex-end';
        render(getTemplate(part.axis, () => this._updateUnits()), this.domNode);
    }
    @memoize
    getSelect() : HTMLSelectElement {
        return this.domNode.querySelector('select') as HTMLSelectElement;
    }
    _updateUnits() {
        const select = this.getSelect();
        const index = select.selectedIndex;
        const option = select.options[index];
        this.part.axis = parseInt(option.value, 10) as JoystickAxis;
    }
    onInject() {}
    onDispose() {}
}
