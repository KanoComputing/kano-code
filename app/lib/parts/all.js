import UI from './ui/index.js';
import Data from './data/index.js';
import Hardware from './hardware/index.js';

import Box from './parts/box/index.js';
import Button from './parts/button/index.js';
import Clock from './parts/clock/index.js';
import MapPart from './parts/map/index.js';
import Microphone from './parts/microphone/index.js';
import Mouse from './parts/mouse/index.js';
import Oscillator from './parts/oscillator/index.js';
import ScrollingText from './parts/scrolling-text/index.js';
import Slider from './parts/slider/index.js';
import Speaker from './parts/speaker/index.js';
import Sticker from './parts/sticker/index.js';
import Synth from './parts/synth/index.js';
import Terminal from './parts/terminal/index.js';
import TextInput from './parts/text-input/index.js';
import Text from './parts/text/index.js';
import RSS from './parts/data/rss.js';
import Sports from './parts/data/sports.js';
import Share from './parts/data/kano/share.js';
import ISS from './parts/data/space/iss.js';
import Weather from './parts/data/weather/weather.js';

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
    Speaker,
    Sticker,
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

export { PartTypes, Parts };
