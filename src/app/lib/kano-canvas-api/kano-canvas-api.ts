import { Palette } from './modules/palette.js';
import { Space } from './modules/space.js';
import { General } from './modules/general.js';
import { Paths } from './modules/paths.js';
import { Setters } from './modules/setters.js';
import { Shapes } from './modules/shapes.js';
import { Text } from './modules/text.js';
import { ISession } from './utils.js';

export interface ICanvasAPISettings {
    ctx : CanvasRenderingContext2D;
    width : number;
    height : number;
    ratio : number;
}

export class Canvas {
    public session : ISession;
    public general : General;
    public palette = Palette;
    public paths : Paths;
    public setters : Setters;
    public shapes : Shapes;
    public space : Space;
    public text : Text;
    constructor(settings : ICanvasAPISettings) {
        this.session = this.reset(settings);
        this.general = new General(this.session);
        this.paths = new Paths(this.session);
        this.setters = new Setters(this.session);
        this.shapes = new Shapes(this.session);
        this.space = new Space(this.session);
        this.text = new Text(this.session);
    }
    reset(settings : ICanvasAPISettings) {
        this.session = {
            ctx: settings.ctx,
            width: settings.width,
            height: settings.height,
            ratio: settings.ratio,
            pos: {
                x: settings.width / 2,
                y: settings.height / 2,
            },
            settings: {
                bg: null,
                fill: '#000000',
                text: {
                    align: 'start',
                    baseline: 'alphabetic',
                    bold: false,
                    italic: false,
                    font: 'Bariol',
                    size: 16,
                },
                stroke: {
                    color: '#000000',
                    cap: 'butt',
                    width: 1,
                },
            },
        };
        this.general.reset();
        this.space.moveTo(this.session.pos.x, this.session.pos.y);
        this.setters.strokeColor(this.session.settings.stroke.color);
        this.setters.strokeWidth(this.session.settings.stroke.width);
        this.paths.lineCap(this.session.settings.stroke.cap);
        this.text.updateFont();
        return this.session;
    }
}

export default Canvas;
