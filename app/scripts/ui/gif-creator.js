import UI from './ui';

export default class GifCreator extends UI {
    constructor () {
        super({
            type: 'gif-creator',
            label: 'Gif Creator',
            image: 'assets/ui/canvas.png',
            hue: 60
        });
        this.addBlock({
            id: 'add_picture',
            message0: 'add a picture from %1',
            args0: [{
                type: "input_value",
                name: "PICTURE"
            }],
            previousStatement: null,
            javascript: (hw) => {
                return function (block) {
                    let pic = Blockly.JavaScript.valueToCode(block, 'PICTURE'),
                        code = `devices.get('${hw.id}').addPicture(${pic})`;
                    return code;
                };
            },
            natural: (hw) => {
                return function (block) {
                    let pic = Blockly.Natural.valueToCode(block, 'PICTURE'),
                        code = `add a picture to ${hw.id} from ${pic}`;
                    return code;
                };
            }
        });
    }
    addPicture (pic) {
        return this.getElement().addPicture(pic);
    }
}
