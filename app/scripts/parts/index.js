import Part from './part';
import UI from './ui';
import Hardware from './hardware';
import Data from './data';
import Button from './button';
import Box from './box';
import TextInput from './text-input';
import Text from './text';
import Map from './map';
import ISS from './data/space/iss';
import RSS from './data/rss';
import Sports from './data/sports';
import Weather from './data/weather/weather';
import Share from './data/kano/share';
import Sticker from './sticker';
import ScrollingText from './scrolling-text';
import Speaker from './speaker';
import Microphone from './microphone';
import LightRectangle from './lightboard/light-rectangle';
import LightCircle from './lightboard/light-circle';
import LightFrame from './lightboard/light-frame';
import LightAnimation from './lightboard/light-animation';
import LightAnimationDisplay from './lightboard/light-animation-display';
import PictureList from './picture-list';
import Canvas from './canvas/canvas';
import Clock from './clock';
import Slider from './slider';
import ProximitySensor from './powerups/proximity-sensor';
import MotionSensor from './powerups/motion-sensor';
import GestureSensor from './powerups/gesture-sensor';
import GyroAccelerometer from './powerups/gyro-accelerometer';

let Parts,
    partTypes;

partTypes = {
    'ui': UI,
    'data': Data,
    'hardware': Hardware
};
module.exports = Parts = {
    list: [Button, Box, TextInput, Text, Map, ISS, Weather, Share,
           Sticker, ScrollingText, RSS, Sports, Speaker, Microphone, Clock,
           LightRectangle, LightCircle, LightFrame, LightAnimation, LightAnimationDisplay,
           PictureList, Slider],
    experiments: {
        'dongles': [ProximitySensor, MotionSensor, GestureSensor, GyroAccelerometer]
    },
    create (model, size) {
        return new partTypes[model.partType](model, size);
    },
    clear () {
        return Part.clear();
    },
    init (c) {
        let flags = c.getFlags();
        flags.experiments.forEach(exp => {
            if (Parts.experiments[exp]) {
                Parts.list = Parts.list.concat(Parts.experiments[exp]);
            }
        });
        Parts.list.forEach(part => {
            if (part.experiments) {
                c.addExperiments('blocks', Object.keys(part.experiments));
                flags.experiments.forEach(exp => {
                    if (part.experiments[exp]) {
                        part.blocks = part.blocks.concat(part.experiments[exp]);
                    }
                });
            }
        });
        c.addExperiments('parts', Object.keys(Parts.experiments));
    }
};
