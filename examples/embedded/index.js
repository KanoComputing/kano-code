import * as code from '../../index.js';
import * as i18n from '../../i18n.js';

const creations = {
    second: {"source":"<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"app_onStart\" id=\"default_app_onStart\" x=\"118\" y=\"91\"><field name=\"FLASH\"></field><statement name=\"CALLBACK\"><block type=\"osc_speed_set\" id=\"8)1U~Yw=Jr1SBKrsz7$k\"><value name=\"SPEED\"><shadow type=\"math_number\" id=\"rvCE7j1u?E3z;iPKS6D-\"><field name=\"NUM\">20</field></shadow></value><next><block type=\"every_x_seconds\" id=\"q?;@C39r]6oCSS2hGy!A\"><field name=\"UNIT\">frames</field><value name=\"INTERVAL\"><shadow type=\"math_number\" id=\"+PdQcXju~,LA_;GCdXR%\"><field name=\"NUM\">1</field></shadow></value><statement name=\"DO\"><block type=\"draw_clear\" id=\"5+g9??NMIEZ{dv{tppAp\"><next><block type=\"draw_move_to\" id=\"[ORy@,!hynWGZAL}J`W)\"><value name=\"X\"><shadow type=\"math_number\" id=\"6L|Ur6~D,dN=d0?+Kqq?\"><field name=\"NUM\">5</field></shadow><block type=\"math_lerp\" id=\"r9?ym,Hv2$^U@(Vqy!]x\"><value name=\"FROM\"><shadow type=\"math_number\" id=\"[|UG!(S!d|LbPaF^s!sq\"><field name=\"NUM\">0</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"fX]LWgsRWn6RUFu07dTZ\"><field name=\"NUM\">800</field></shadow></value><value name=\"PERCENT\"><shadow type=\"math_number\" id=\"=/@@p]_6WyXneY+4EF,_\"><field name=\"NUM\">50</field></shadow><block type=\"osc_value_get\" id=\"uMP=MR,~fTtaPl7{oc{p\"></block></value></block></value><value name=\"Y\"><shadow type=\"math_number\" id=\"IyLlQ6`Cgi@c)8yKhSf}\"><field name=\"NUM\">300</field></shadow></value><next><block type=\"draw_circle\" id=\"=^*SiNIH[|Pz-Hd~{4YG\"><value name=\"RADIUS\"><shadow type=\"math_number\" id=\"qzO~{+ZjVYq(Q3QHXTm{\"><field name=\"NUM\">20</field></shadow></value></block></next></block></next></block></statement></block></next></block></statement></block></xml>","code":"app.onStart(function() {\n  osc.speed = 20;\n  time.every(1, 'frames', function () {\n    ctx.reset();\n    ctx.moveTo(math.lerp(0, 800, osc.value), 300);\n    ctx.circle(20);\n  });\n\n});\n","parts":[{"type":"oscillator","id":"osc","name":"Osc"}]},
};

const lang = i18n.getLang();

i18n.load(lang, { blockly: true, kanoCodePath: '/' })
    .then(() => {
        const targets = [...document.querySelectorAll('.inject')];

        targets.forEach((target) => {
            const id = target.getAttribute('id');
            const editor = new code.Editor();

            const app = creations[id];

            if (app) {
                editor.load(app);
            }
    
            editor.inject(target);
        });
    });
