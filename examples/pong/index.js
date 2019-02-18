import * as code from '../../index.js';
import * as i18n from '../../i18n.js';
import { PongOutputProfile } from './profile.js';

const lang = i18n.getLang();

// Load Kano Code locales and elements
i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {

    // Create the editor
    const editor = new code.Editor();

    // Create the toolbox defining three methods in the pong module
    const PongToolbox = {
        type: 'module',
        name: 'pong',
        verbose: 'Pong',
        color: '#ff6f00',
        symbols: [{
            type: 'function',
            name: 'setBackgroundColor',
            verbose: 'Background color',
            parameters: [{
                name: 's',
                verbose: '',
                returnType: 'Color',
                default: '#000000',
            }],
        }, {
            type: 'function',
            name: 'setBallSize',
            verbose: 'Ball size',
            parameters: [{
                name: 's',
                verbose: '',
                returnType: Number,
                default: 20,
            }],
        }, {
            type: 'function',
            name: 'setBallColor',
            verbose: 'Ball color',
            parameters: [{
                name: 'c',
                verbose: '',
                returnType: 'Color',
                default: '#ffffff',
            }],
        }],
    };

    const AIToolbox = {
        type: 'module',
        name: 'ai',
        verbose: 'A.I.',
        color: '#ff6f00',
        symbols: [{
            type: 'variable',
            name: 'position',
            verbose: 'AI paddle position',
            returnType: Number,
        }, {
            type: 'function',
            name: 'move',
            verbose: 'Move AI paddle by',
            parameters: [{
                type: Number,
                name: 'amount',
                verbose: '',
                default: 1,
            }],
        }],
    };

    const BallToolbox = {
        type: 'module',
        name: 'ball',
        verbose: 'Ball',
        color: '#ff6f00',
        symbols: [{
            type: 'variable',
            name: 'position',
            verbose: 'Ball position',
            returnType: Number,
        }],
    };

    class PongProfile extends code.DefaultEditorProfile {
        onInstall(editor) {
            super.onInstall(editor);
            this.outputProfile = new PongOutputProfile();
            this.toolbox.push(
                PongToolbox,
                AIToolbox,
                BallToolbox,
            );
            this.workspaceViewProvider.source = "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"app_onStart\" id=\"l|j!a9vaY]-`RKlm;JH{\" x=\"67\" y=\"63\"><field name=\"FLASH\"></field><statement name=\"CALLBACK\"><block type=\"every_x_seconds\" id=\"d[fnQF,CX9-{h_6gyvyI\"><field name=\"UNIT\">frames</field><value name=\"INTERVAL\"><shadow type=\"math_number\" id=\"TA+9Q)bf0q$ln_g4@$eu\"><field name=\"NUM\">1</field></shadow></value><statement name=\"DO\"><block type=\"controls_if\" id=\"5iMs.K!W:p`6SZ%fA%XI\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"feWu0@cp4:i~)3is`lJw\"><field name=\"OP\">LT</field><value name=\"A\"><block type=\"ai_position_get\" id=\"yl_g9J?E-:q[j]h^|m`N\"></block></value><value name=\"B\"><block type=\"ball_position_get\" id=\"ug{(Qz|vk(c.=qeQqdxB\"></block></value></block></value><statement name=\"DO0\"><block type=\"ai_move\" id=\"b=A/q,pEYNwwM|%q+fi[\"><value name=\"AMOUNT\"><shadow type=\"math_number\" id=\"/23M?zLYc=S(F:HJ)ym_\"><field name=\"NUM\">1</field></shadow></value></block></statement><statement name=\"ELSE\"><block type=\"ai_move\" id=\"1Xa3]N6#-oT5-hjVN5N?\"><value name=\"AMOUNT\"><shadow type=\"math_number\" id=\"KhCGjN*s-@FgoH$u|=[N\"><field name=\"NUM\">-1</field></shadow></value></block></statement></block></statement></block></statement></block></xml>";
        }
    }

    editor.registerProfile(new PongProfile());

    editor.inject();
    editor.onDidInject(() => {
        editor.output.setRunningState(true);
    });
});
