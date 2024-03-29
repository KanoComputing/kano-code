/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Utils, ISession } from '../utils.js';

export class General {
    private session : ISession;
    constructor(session : ISession) {
        this.session = session;
    }
    /*
    * Clear the stage from current drawing
    *
    * @return void
    */
    clear() {
        let width = this.session.width * this.session.ratio,
            height = this.session.height * this.session.ratio;

        this.session.ctx.clearRect(0, 0, width, height);

        if (this.session.settings.bg) {
            this.background(this.session.settings.bg);
        }
    }
    /*
    * Set a background color
    *
    * @param {String} color
    * @return void
    */
    background(color : string) {
        color = Utils.parseColor(color);
        this.session.ctx.canvas.style.backgroundColor = color;
        this.session.settings.bg = color;
    }
    /*
    * Reset this.session settings to default and clear the stage
    *
    * @return void
    */
    reset() {
        this.session.pos = Utils.getCenter(this.session);

        this.session.settings = {
            bg: null,
            fill: '#333',
            stroke: {
                width: 0,
                color: '#222',
                cap: 'butt',
            },
            text: {
                size: 25,
                font: 'Bariol',
                align: 'center',
                bold: false,
                italic: false,
                baseline: 'alphabetic',
            },
        };

        this.clear();
    }
    /*
    * Get a random number between two numbers, rounded to an integer unless
    * float attribute is set to true
    *
    * @param {Number}* min
    * @param {Number}* max
    * @param {Boolena}* float
    * @return {Number}
    */
    random(min : number, max : number, float : number) {
        let out;

        if (typeof min !== 'number' || typeof max !== 'number') {
            return Math.random();
        }

        out = Math.random() * (max - min) + min;

        if (float) {
            return out;
        }

        return Math.floor(out);
    };
}

export default General;
