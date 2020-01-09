/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Palette } from './modules/palette.js';
import { Space } from './modules/space.js';
import { General } from './modules/general.js';
import { Paths } from './modules/paths.js';
import { Repeats } from './modules/repeats.js';
import { Setters } from './modules/setters.js';
import { Shapes } from './modules/shapes.js';
import { Stamp } from './modules/stamp.js';
import { Text } from './modules/text.js';
import { IResourceInformation } from '../../../output/resources.js';
import { ISession } from './utils.js';

export interface ICanvasAPISettings {
    ctx : CanvasRenderingContext2D;
    width : number;
    height : number;
    ratio? : number;
    stickers? : IResourceInformation;
}

export class Canvas {
    public session : ISession;
    public general : General;
    public palette = Palette;
    public paths : Paths;
    public repeats: Repeats;
    public setters : Setters;
    public shapes : Shapes;
    public space : Space;
    public stamp: Stamp;
    public text : Text;
    constructor(settings : ICanvasAPISettings) {
        this.session = this.createSession(settings);
        this.general = new General(this.session);
        this.paths = new Paths(this.session);
        this.repeats = new Repeats(this.session);
        this.setters = new Setters(this.session);
        this.shapes = new Shapes(this.session);
        this.space = new Space(this.session);
        this.stamp = new Stamp(this.session);
        this.text = new Text(this.session);
        this.reset(settings);
    }
    createSession(settings : ICanvasAPISettings) : ISession {
        return {
            ctx: settings.ctx,
            width: settings.width,
            height: settings.height,
            ratio: settings.ratio || 1,
            stickers: settings.stickers || {
                categorisedResource: [],
                categoryEnum: [],
                resourceSet: [],
                getUrl: () => { return '' },
                getRandom: () => { return '' },
                getRandomFrom: () => { return '' },
                cacheValue: () => { return new HTMLCanvasElement()},
                load: () => { return Promise.resolve(); },
            },
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
    }
    reset(settings : ICanvasAPISettings) {
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
        return this.session;
    }
}

export default Canvas;
