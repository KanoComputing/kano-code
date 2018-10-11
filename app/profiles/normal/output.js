import '../../elements/kano-editor-normal/kano-editor-normal.js';

import * as code from '../../lib/index.js';

import UI from '../../lib/parts/ui/index.js';
import Data from '../../lib/parts/data/index.js';
import Hardware from '../../lib/parts/hardware/index.js';

import Box from '../../lib/parts/parts/box/index.js';
import Button from '../../lib/parts/parts/button/index.js';
import Clock from '../../lib/parts/parts/clock/index.js';
import MapPart from '../../lib/parts/parts/map/index.js';
import Microphone from '../../lib/parts/parts/microphone/index.js';
import Mouse from '../../lib/parts/parts/mouse/index.js';
import Oscillator from '../../lib/parts/parts/oscillator/index.js';
import ScrollingText from '../../lib/parts/parts/scrolling-text/index.js';
import Slider from '../../lib/parts/parts/slider/index.js';
import Synth from '../../lib/parts/parts/synth/index.js';
import Terminal from '../../lib/parts/parts/terminal/index.js';
import TextInput from '../../lib/parts/parts/text-input/index.js';
import Text from '../../lib/parts/parts/text/index.js';
import RSS from '../../lib/parts/parts/data/rss.js';
import Sports from '../../lib/parts/parts/data/sports.js';
import Share from '../../lib/parts/parts/data/kano/share.js';
import ISS from '../../lib/parts/parts/data/space/iss.js';
import Weather from '../../lib/parts/parts/data/weather/weather.js';

import { PartsOutputPlugin } from '../../lib/parts/index.js';

import { AllModules } from '../../lib/app-modules/all.js';
import { BackgroundOutputPlugin } from '../background/index.js';
import { DrawModuleFactory } from '../../lib/app-modules/draw.js';

const PartTypes = [UI, Data, Hardware];
const Parts = [
    Box,
    Button,
    Clock,
    MapPart,
    Microphone,
    Mouse,
    Oscillator,
    ScrollingText,
    Slider,
    Synth,
    Terminal,
    TextInput,
    Text,
    RSS,
    Sports,
    Share,
    ISS,
    Weather,
];


export class DrawOutputProfile extends code.OutputProfile {
    constructor() {
        super();
        this.partsPlugin = new PartsOutputPlugin(PartTypes, Parts);
        this.backgroundPlugin = new BackgroundOutputPlugin();
        this.provider = document.createElement('kano-workspace-normal');
        this.provider.setAttribute('slot', 'workspace');
        this.provider.width = 512;
        this.provider.height = 384;
        this.drawModule = DrawModuleFactory(this.provider);
    }
    get id() { return 'draw'; }
    get modules() {
        return AllModules.concat([this.drawModule]);
    }
    get plugins() {
        return [this.partsPlugin, this.backgroundPlugin];
    }
    get outputViewProvider() {
        return this.provider;
    }
}

export default DrawOutputProfile;
