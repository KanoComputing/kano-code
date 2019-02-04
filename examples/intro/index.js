import * as code from '../../index.js';
import * as APIs from '../../toolbox.js';
import * as i18n from '../../i18n.js';
import * as Modules from '../../modules.js';

const Shapes = {
    type: 'module',
    // Hex color for the theme of the API
    color: '#355C7D',
    // This name is not a displayed named, but the actual variable name for the module.
    // It will be used to generate the JavaScript code
    name: 'shapes',
    // This is the displayed name for the toolbox
    verbose: 'Shapes',
    // List of available symbols in that module
    symbols: [{
        type: 'function',
        name: 'heart',
        verbose: 'Draw a heart',
        parameters: [{
            name: 'color',
            verbose: '',
            returnValue: 'Color',
            default: '#F67280',
        }],
    }],
};

class ShapesModule extends code.AppModule {
    static get id() {
        return 'shapes';
    }
    constructor(output) {
        super(output);
        // Grab the canvas from the output
        const { canvas } = output.visuals;
        const ctx = canvas.getContext('2d');

        this.addMethod('heart', (color) => {
            ctx.fillStyle = color;
            // from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
            ctx.beginPath();
            ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
            ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
            ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
            ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
            ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
            ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
            ctx.fill();
        });
    }
}

class OutputProfile extends code.OutputProfile {
    get modules() {
        return Object.values(Modules).concat([ShapesModule]);
    }
}

class EditorProfile extends code.EditorProfile {
    get toolbox() {
        return Object.values(APIs).concat([Shapes]);
    }
    get outputProfile() {
        return new OutputProfile();
    }
}

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor();

        editor.registerProfile(new EditorProfile());

        editor.inject(document.body);
    });
