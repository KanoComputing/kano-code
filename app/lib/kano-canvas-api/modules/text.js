function Text(session) {
    this.session = session;
}

/*
* Set updated font with new key / val setting
*
* @param {String} key
* @param {*} val
* @return void
*/
Text.prototype.updateFont = function (key, val) {
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
Text.prototype.bold = function (state) {
    state = typeof state === 'undefined' ? true : state;
    this.updateFont('bold', state);
};

/*
* Set italic state (Defaults to true)
*
* @param {Boolean} state
* @return void
*/
Text.prototype.italic = function (state) {
    state = typeof state === 'undefined' ? true : state;
    this.updateFont('italic', state);
};

/*
* Set text size
*
* @param {Number} size
* @return void
*/
Text.prototype.textSize = function (size) {
    this.updateFont('size', size);
};

/*
* Set font family
*
* @param {String} font
* @return void
*/
Text.prototype.fontFamily = function (font) {
    this.updateFont('font', font);
};

/*
* Set text alignment
*
* @param {String} alignment
* @return void
*/
Text.prototype.textAlign = function (alignment) {
    this.updateFont('align', alignment);
};

/*
* Set text baseline mode
*
* @param {String} baseline
* @return void
*/
Text.prototype.textBaseline = function (baseline) {
    baseline = baseline || 'alphabetic';
    this.updateFont('baseline', baseline);
};

/*
* Set font mixed attributes
*
* @param {*..} attributes
* @return void
*/
Text.prototype.font = function () {
    var val, i;

    for (i = 0; i < arguments.length; i += 1) {
        val = arguments[i];
        if (typeof val === 'number') {
            this.textSize(val);
        } else if (val === 'left', val === 'right', val === 'center') {
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
Text.prototype.text = function (val) {
    var x = this.session.pos.x * this.session.ratio,
        y = this.session.pos.y * this.session.ratio;

    this.session.ctx.fillStyle = this.session.settings.fill;
    this.session.ctx.fillText(val, x, y);
};

export { Text };
