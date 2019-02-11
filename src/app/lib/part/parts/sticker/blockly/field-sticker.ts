import { Blockly, utils, goog } from '@kano/kwc-blockly/blockly.js';
import { FieldIcon } from '../../../../blockly/fields/icon.js';
import { html, render } from 'lit-html/lit-html.js';
import '@kano/styles/color.js';
import '@kano/styles/typography.js';

interface IItemData {
    label : string;
    stickers : { id : string, src : string }[];
}

const styles = html`
<style>
    .content {
        border: 1px solid #23272C;
        background: var(--color-black);
        border-radius: 3px;
        padding: 4px;
        overflow: auto;
        max-height: 340px;
    }
    .heading {
        color: white;
        font-family: var(--font-body);
    }
    .stickers {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        max-width: 240px;
    }
    .sticker {
        border: 1px solid grey;
        border-radius: 3px;
        background: white;
        margin: 2px;
        padding: 2px;
        cursor: pointer;
        transition: transform linear 50ms;
    }
    .sticker:hover {
        transform: scale(1.5);
    }
    .content::-webkit-scrollbar {
        width: 5px;
    }
    .content::-webkit-scrollbar-track,
    .content::-webkit-scrollbar-thumb {
        border-radius: 8px;
    }
    .content::-webkit-scrollbar-track {
        background: #414A51;
        margin: 9px 0px 8px;
    }
    .content::-webkit-scrollbar-thumb {
        background: #22272D;
    }
    .content::-webkit-scrollbar-thumb:hover {
        cursor: pointer;
    }
</style>
`;

function getWidgetTemplate(items : IItemData[], callback : (id : string) => any) {
    return html`
        ${styles}
        <div class="content">
            ${items.map(item => html`
                <div class="heading">${item.label}</div>
                <div class="stickers">
                    ${item.stickers.map((sticker) => html`
                        <img class="sticker" width="24px" height="24px" src=${sticker.src} @click=${() => callback(sticker.id)}/>
                    `)}
                </div>
            `)}
        </div>
    `;
}

export class FieldSticker extends FieldIcon {
    private domNode : HTMLElement|null = null;
    private items : IItemData[];
    constructor(value : string, items : IItemData[], optValidator? : () => void) {
        super(value, optValidator);
        this.items = items;
    }
    showEditor_() {
        if (!this.domNode) {
            this.domNode = document.createElement('div');
            render(getWidgetTemplate(this.items, (id) => this.setValue(id)), this.domNode);
        }
        Blockly.WidgetDiv.show(
            this,
            this.sourceBlock_.RTL,
            FieldSticker.widgetDispose_,
        );
        const div = Blockly.WidgetDiv.DIV;
        div.appendChild(this.domNode);
        this.position();
        if ('animate' in HTMLElement.prototype) {
            div.animate({
                opacity: [0, 1],
            }, {
                duration: 100,
                easing: 'ease-out',
            });
        }
    }
    position() {
        const viewportBBox = utils.getViewportBBox();
        const anchorBBox = this.getScaledBBox_();
        const elementSize = goog.style.getSize(this.domNode);
        Blockly.WidgetDiv.positionWithAnchor(
            viewportBBox,
            anchorBBox,
            elementSize,
            this.sourceBlock_.RTL,
        );
    }
    getItemForValue(value : string) : { id : string, src : string }|null {
        for (let i = 0; i < this.items.length; i += 1) {
            const found = this.items[i].stickers.find(s => s.id === value);
            if (found) {
                return found;
            }
        }
        return null;
    }
    getIcon(value : string) {
        const item = this.getItemForValue(value);
        if (item) {
            return item.src;
        }
        return '';
    }
    static widgetDispose_() {}
}
