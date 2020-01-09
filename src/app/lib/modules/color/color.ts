/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { AppModule } from '../../app-modules/app-module.js';

export class ColourModule extends AppModule {
    constructor(output : any) {
        super(output);

        this.addMethod('random', '_random');
        this.addMethod('create', '_create');
        this.addMethod('lerp', '_lerp');
    }

    static get id() { return 'colour'; }

    HSVtoRGB(h : number, s : number, v : number) {
        let r;
        let g;
        let b;
        let i;
        let f;
        let p;
        let q;
        let t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
        default: r = 0, g = 0, b = 0;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    }

    RGBtoHEX(r : number, g : number, b : number) {
        const hexColor = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).substr(1);
        return `#${hexColor}`;
    }

    HEXtoRGBComponents(hex : string) {
        const match = hex.replace(/#/, '').match(/.{1,2}/g);
        if (!match) {
            return { r: 0, g: 0, b: 0 };
        }
        return {
            r: parseInt(match[0], 16),
            g: parseInt(match[1], 16),
            b: parseInt(match[2], 16),
        };
    }

    _random() {
        const rgb = this.HSVtoRGB(Math.random() * 100, 0.8, 1);
        return this.RGBtoHEX(rgb.r, rgb.g, rgb.b);
    }

    _luminance(hex : string, lum : number = 0) {
        let rgb = '#',
            c,
            i;
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }

        // convert to decimal and change luminosity
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += (`00${  c}`).substr(c.length);
        }

        return rgb;
    }

    _create(type : 'rgb'|'hsv', one : number, two : number, three : number) {
        if (type === 'rgb') {
            let red,
                green,
                blue;
            one = Math.min(100, one);
            two = Math.min(100, two);
            three = Math.min(100, three);
            red = Math.round(one * 2.55);
            green = Math.round(two * 2.55);
            blue = Math.round(three * 2.55);
            return this.RGBtoHEX(red, green, blue);
        } else if (type === 'hsv') {
            let hue,
                saturation,
                value,
                rgb;
            one %= 100;
            two = Math.min(100, two);
            three = Math.min(100, three);
            hue = one / 100;
            saturation = two / 100;
            value = three / 100;
            rgb = this.HSVtoRGB(hue, saturation, value);
            return this.RGBtoHEX(rgb.r, rgb.g, rgb.b);
        }
    }

    _lerp(from : string, to : string, percentage : number) {
        const fromRGB = this.HEXtoRGBComponents(from);
        const toRGB = this.HEXtoRGBComponents(to);
        percentage = Math.min(Math.max(percentage, 0), 100);
        const newColor : { r? : number, g? : number, b? : number } = {};
        newColor.r = Math.round(fromRGB.r + (toRGB.r - fromRGB.r) * percentage / 100);
        newColor.g = Math.round(fromRGB.g + (toRGB.g - fromRGB.g) * percentage / 100);
        newColor.b = Math.round(fromRGB.b + (toRGB.b - fromRGB.b) * percentage / 100);
        return this.RGBtoHEX(newColor.r, newColor.g, newColor.b);
    }
}

export default ColourModule;
