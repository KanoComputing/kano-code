import UI from './ui';

export default class Camera extends UI {
    constructor () {
        super({
            type: 'camera',
            label: 'Camera',
            image: 'assets/ui/camera.png',
            hue: 60
        });
        this.addBlock({
            id: 'get_last_picture',
            output: true,
            message0: 'last picture',
            javascript: (hw) => {
                return function (block) {
                    return [`devices.get('${hw.id}').getLastPicture()`];
                };
            },
            natural: (hw) => {
                return function (block) {
                    return [`${hw.label}'s last picture`];
                };
            }
        });
        this.addBlock({
            id: 'take_picture',
            message0: 'take picture then,',
            message1: '%1',
            args1: [{
                type: "input_statement",
                name: "DO"
            }],
            javascript: (hw) => {
                return function (block) {
                    let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                        code = `devices.get('${hw.id}').takePicture().then(function () {${statement}})`;
                    return code;
                };
            },
            natural: (hw) => {
                return function (block) {
                    let statement = Blockly.Natural.statementToCode(block, 'DO'),
                        code = `take a picture with ${hw.label} then ${statement}`;
                    return code;
                };
            }
        });
        this.addEvent({
            label: 'took a picture',
            id: 'picture-taken'
        });
    }
    getLastPicture () {
        return this.getElement().getLastPicture();
    }
    takePicture () {
        return this.getElement().takePicture();
    }
    stop () {
        super.stop.apply(this, arguments);
        return this.getElement().stop();
    }
    start () {
        return this.getElement().start();
    }
    addEventListener () {
        super.addEventListener.apply(this, arguments);
        let element = this.getElement();
        return element.addEventListener.apply(element, arguments);
    }
    removeListeners () {
        let element = this.getElement();
        this.listeners.forEach((listener) => {
            element.removeEventListener.apply(element, listener);
        });
        super.removeListeners();
    }
}
