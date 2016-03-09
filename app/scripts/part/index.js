//import Speaker from './speaker';
import TextInput from './text-input';
import UiImage from './image';
import Button from './button';
//import GifCreator from './gif-creator';
import Video from './video';
import Cat from './cat';
import Twitter from './twitter';
import MakeArt from './make-art';

let part;

// Group models by type
let models = {
    //'speaker': Speaker,
    'text-input': TextInput,
    'image': UiImage,
    'button': Button,
    //'gif-creator': GifCreator,
    'video': Video,
    'cat': Cat,
    'twitter': Twitter,
    'make-art': MakeArt
};

// Get an array of each instance
let flattened = Object.keys(models).map((type) => {
    return new models[type]();
});

export default part = {
    /**
     * Create a new model based on the type
     */
    create (type) {
        let m = new models[type]();
        return m;
    },
    fromSaved (plain) {
        let newUi = part.create(plain.type);
        newUi.load(plain);
        return newUi;
    },
    getAll () {
        return flattened;
    }
};
