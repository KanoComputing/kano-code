/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { html } from '@kano/styles/template.js';

const dark = html`<style>
    html {
        --kc-primary-color: #414a51;
        --kc-secondary-color: #292f35;

        --kc-highlight-color: #22272d;

        --kc-color-superdark: #202428;

        --kc-border-color: var(--kc-color-superdark);

        --kwc-blockly-background: var(--kc-primary-color);
        --kwc-blockly-toolbox-color: white;
        --kwc-blockly-toolbox-selected-color: var(--kc-highlight-color);
        --kano-app-editor-workspace-background: var(--kc-secondary-color);
        --kano-app-editor-workspace-controls: #19111C;
        --kano-app-editor-workspace-controls-hover: #261e2c;
        --kano-app-editor-workspace-border: #22272d;
        --kano-app-part-editor-border: var(--kc-color-superdark);
        --kano-app-part-editor-icons: #9fa4a8;
        --kwc-blockly-scrollbars-color: var(--kc-secondary-color);
        
        --kwc-blockly-toolbox: {
            padding-top: 0;
            background: var(--kc-secondary-color); 
        };
    }
</style>`;


document.head.appendChild(dark.content);
