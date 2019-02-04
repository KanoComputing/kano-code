import { ISession } from '../utils';

export class Text {
    private session : ISession;
    constructor(session : ISession) {
        this.session = session;
    }
    /*
    * Set updated font with new key / val setting
    *
    * @param {String} key
    * @param {*} val
    * @return void
    */
    updateFont(key? : 'bold'|'italic'|'size'|'font'|'align'|'baseline', val? : any) {
        var size,
        format;
        if (key) {
            this.session.settings.text[key] = val;
        }

        size = this.session.settings.text.size * this.session.ratio;
        format = '';

        if (this.session.settings.text.italic) {
            format += 'italic ';
        }
        if (this.session.settings.text.bold) {
            format += 'bold ';
        }

        this.session.ctx.font = format + size + 'px ' + this.session.settings.text.font;
        this.session.ctx.textAlign = this.session.settings.text.align;
        this.session.ctx.textBaseline = this.session.settings.text.baseline;
    };

    /*
    * Set bold state (Defaults to true)
    *
    * @param {Boolean} state
    * @return void
    */
    bold(state : boolean) {
        state = typeof state === 'undefined' ? true : state;
        this.updateFont('bold', state);
    };

    /*
    * Set italic state (Defaults to true)
    *
    * @param {Boolean} state
    * @return void
    */
    italic(state : boolean) {
        state = typeof state === 'undefined' ? true : state;
        this.updateFont('italic', state);
    };

    /*
    * Set text size
    *
    * @param {Number} size
    * @return void
    */
    textSize(size : number) {
        this.updateFont('size', size);
    };

    /*
    * Set font family
    *
    * @param {String} font
    * @return void
    */
    fontFamily(font : string) {
        this.updateFont('font', font);
    };

    /*
    * Set text alignment
    *
    * @param {String} alignment
    * @return void
    */
    textAlign(alignment : CanvasTextAlign) {
        this.updateFont('align', alignment);
    };

    /*
    * Set text baseline mode
    *
    * @param {String} baseline
    * @return void
    */
    textBaseline(baseline : CanvasTextBaseline) {
        baseline = baseline || 'alphabetic';
        this.updateFont('baseline', baseline);
    };

    /*
    * Set font mixed attributes
    *
    * @param {*..} attributes
    * @return void
    */
    font() {
        var val, i;

        for (i = 0; i < arguments.length; i += 1) {
            val = arguments[i];
            if (typeof val === 'number') {
                this.textSize(val);
            } else if (val === 'left' || val === 'right' || val === 'center') {
                this.textAlign(val);
            } else if (typeof val === 'string') {
                this.fontFamily(val);
            }
        }
    };

    /*
    * Draw text with current cursor position as origin and current text settings
    *
    * @param {String} font
    * @return void
    */
    text(val : string) {
        var x = this.session.pos.x * this.session.ratio,
            y = this.session.pos.y * this.session.ratio;

        this.session.ctx.fillStyle = this.session.settings.fill;
        this.session.ctx.fillText(val, x, y);
    };
}

export default Text;
