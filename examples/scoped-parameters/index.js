import * as code from '../../index.js';
import * as i18n from '../../i18n.js';

const XPosition = Symbol();
const YPosition = Symbol();

const Points = {
    type: 'module',
    color: '#355C7D',
    name: 'points',
    verbose: 'Points',
    symbols: [{
        type: 'function',
        name: 'forEach',
        verbose: 'for each',
        parameters: [{
            name: 'callback',
            verbose: '',
            returnType: Function,
            parameters: [{
                name: 'x',
                returnType: Number,
                // Define the type for the scope
                blockly: {
                    scope: XPosition
                }
            }, {
                name: 'y',
                returnType: Number,
                // Define the type for the scope
                blockly: {
                    scope: YPosition
                }
            }],
        }],
    }, {
        type: 'variable',
        name: 'firstX',
        verbose: 'x',
        returnType: Number,
        // Become an argument if this type exists in the scope
        blockly: {
            scope: XPosition,
        },
    }, {
        type: 'variable',
        name: 'firstY',
        verbose: 'y',
        returnType: Number,
        // Become an argument if this type exists in the scope
        blockly: {
            scope: YPosition,
        },
    }],
};

class PointsModule extends code.AppModule {
    static get id() {
        return 'points';
    }
    constructor(output) {
        super(output);
        // Simple list of points
        const points = [
            { x: 0, y: 0 },
            { x: 200, y: 200 },
            { x: 300, y: 200 },
            { x: 400, y: 0 },
        ];

        this.methods = {
            // Returns the first point's x
            get firstX() {
                return points[0].x;
            },
            // Returns the first point's y
            get firstX() {
                return points[0].x;
            },
            // Iterate through all points. Exposes x and y of each points through callback arguments
            forEach(cb) {
                points.forEach(({ x, y }) => cb(x, y));
            },
        };
    }
}

class OutputProfile extends code.DefaultOutputProfile {
    onInstall(output) {
        super.onInstall(output);
        this.modules.push(PointsModule);
    }
}

class EditorProfile extends code.DefaultEditorProfile {
    onInstall(editor) {
        super.onInstall(editor);
        this.toolbox.push(Points);
        this.outputProfile = new OutputProfile();
    }
}

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const editor = new code.Editor();

        editor.registerProfile(new EditorProfile());

        editor.onDidInject(() => {
            // Load asmple app
            editor.load({"source":"<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"app_onStart\" id=\"default_app_onStart\" x=\"118\" y=\"91\"><field name=\"FLASH\"></field><statement name=\"CALLBACK\"><block type=\"draw_move_to\" id=\"k+6Y*O%j+5d+Hp*6x3je\"><value name=\"X\"><shadow type=\"math_number\" id=\"qdIL3%W3EOqoK@yDT=lW\"><field name=\"NUM\">5</field></shadow><block type=\"points_firstX_get\" id=\"FoD=beXo`v[my(4w$SUb\"></block></value><value name=\"Y\"><shadow type=\"math_number\" id=\"7K2LRlhV54(Zlh6cA]Zg\"><field name=\"NUM\">5</field></shadow><block type=\"points_firstY_get\" id=\"DelI8ic8LHndS*CDKDeD\"></block></value><next><block type=\"draw_circle\" id=\"}Z/]R6p^9D6B=z+z-{kn\"><value name=\"RADIUS\"><shadow type=\"math_number\" id=\"*/q*B~fV^|tW;XDiUUFP\"><field name=\"NUM\">100</field></shadow></value><next><block type=\"points_forEach\" id=\"J(F6k|44nLnMIfj8%$)C\"><statement name=\"CALLBACK\"><block type=\"draw_move_to\" id=\"-qh,-Vj]x@}qnI2[Z?S6\"><value name=\"X\"><shadow type=\"math_number\" id=\"XBfNyo,LH3aC^ic];;g(\"><field name=\"NUM\">5</field></shadow><block type=\"points_firstX_get\" id=\"wuo_Hc^xlr21[OAhb_t9\"></block></value><value name=\"Y\"><shadow type=\"math_number\" id=\"12@!c^ij)UdUGwJnlj-$\"><field name=\"NUM\">5</field></shadow><block type=\"points_firstY_get\" id=\"@TfZ@x;7NcGXKuJwF!*b\"></block></value><next><block type=\"draw_circle\" id=\"I1EuV{kUo3Nr6=*|~x%,\"><value name=\"RADIUS\"><shadow type=\"math_number\" id=\"khovjf%3ulg;iE~uRyY]\"><field name=\"NUM\">20</field></shadow></value></block></next></block></statement></block></next></block></next></block></statement></block></xml>","code":"app.onStart(function() {\n  ctx.moveTo(points.firstX, points.firstY);\n  ctx.circle(100);\n  points.forEach(function(x, y) {\n    ctx.moveTo(x, y);\n    ctx.circle(20);\n\n  });\n\n});\n","parts":[]});
        });

        editor.inject(document.body);
    });
