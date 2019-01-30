import { Store } from '../store.js';
Store.addMutator(function (action) {
    switch (action.type) {
        case 'LOAD_EDITOR_APP': {
            const app = action.data || {"parts":[],"code":{"snapshot":{"javascript":"global.when('start', function () {\n});\n","blocks":"<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"part_event\" id=\"default_part_event_id\" x=\"60\" y=\"68\"><field name=\"EVENT\">global.start</field></block></xml>"}},"background":{"name":"My app","userStyle":{"background":"#ffffff"}},"mode":action.mode}
            this.set('state.editor.app', app);
            break;
        }
        case 'LOAD_APP_FROM_STORY': {
            this.set('state.story.loadingApp', action.data);
            break;
        }
    }
});
