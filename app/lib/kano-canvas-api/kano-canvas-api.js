import { Palette } from './modules/palette.js';
import { Space } from './modules/space.js';
import { General } from './modules/general.js';
import { Paths } from './modules/paths.js';
import { Setters } from './modules/setters.js';
import { Shapes } from './modules/shapes.js';
import { Text } from './modules/text.js';

export class Canvas {
    constructor(settings) {
        this.session = {};
        this.general = new General(this.session);
        this.palette = Palette;
        this.paths = new Paths(this.session);
        this.setters = new Setters(this.session);
        this.shapes = new Shapes(this.session);
        this.space = new Space(this.session);
        this.text = new Text(this.session);
        this.reset(settings);
    }
    reset(settings) {
        this.session.ctx = settings.ctx;
        this.session.width = settings.width;
        this.session.height = settings.height;
        this.session.ratio = settings.ratio || 1;
        this.session.pos = {
            x: settings.width / 2,
            y: settings.height / 2,
        };
        this.general.reset();
        this.space.moveTo(this.session.pos.x, this.session.pos.y);
        this.setters.strokeColor(this.session.settings.stroke.color);
        this.setters.strokeWidth(this.session.settings.stroke.width);
        this.paths.lineCap(this.session.settings.stroke.cap);
        this.text.updateFont();
    }
}

export default Canvas;
