import UI from './ui';

export default class Canvas extends UI {
    constructor () {
        super({
            type: 'canvas',
            label: 'Canvas',
            image: 'assets/ui/canvas.png',
            hue: 60
        });
        this.addBlock({
            id: 'draw_picture',
            message0: 'draw picture from %1',
            args0: [{
                type: "input_value",
                name: "PICTURE"
            }],
            previousStatement: null,
            javascript: (hw) => {
                return function (block) {
                    let pic = Blockly.JavaScript.valueToCode(block, 'PICTURE'),
                        code = `devices.get('${hw.id}').drawPicture(${pic})`;
                    return code;
                };
            },
            natural: (hw) => {
                return function (block) {
                    let pic = Blockly.Natural.valueToCode(block, 'PICTURE'),
                        code = `draw picture on ${hw.id} from ${pic}`;
                    return code;
                };
            }
        });
    }
    drawPicture (pic) {
        return this.getElement().drawPicture(pic);
    }
}
