import Camera from './camera';
import Speaker from './speaker';
import TextInput from './text-input';
import Canvas from './canvas';
import Button from './button';
import Label from './label';
import GifCreator from './gif-creator';
import LayoutVertical from './layout-vertical';

// Group models by type
let models = {
    'speaker': Speaker,
    'text-input': TextInput,
    'camera': Camera,
    'canvas': Canvas,
    'button': Button,
    'label': Label,
    'gif-creator': GifCreator,
    'layout-vertical': LayoutVertical
};

// Get an array of each instance
let flattened = Object.keys(models).map((type) => {
    return new models[type]();
});

export default {
    /**
     * Create a new model based on the type
     */
    create (type) {
        let m = new models[type]();
        return m;
    },
    getAll () {
        return flattened;
    }
};
