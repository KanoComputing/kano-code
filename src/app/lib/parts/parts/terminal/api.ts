/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { TerminalPart } from './terminal.js';
import { IPartAPI } from '../../api.js';
import { svg } from '@kano/icons-rendering/index.js';
import { _ } from '../../../i18n/index.js';

const terminal = svg`<svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g><path d="M30.36,26.82,18,17.47a3.69,3.69,0,0,0-2.26-.74,3.89,3.89,0,0,0-3.83,3.83,3.94,3.94,0,0,0,1.58,3.1L22,29.92l-8.47,6.25a4,4,0,0,0-1.6,3.12,3.89,3.89,0,0,0,3.83,3.83A3.69,3.69,0,0,0,18,42.38l12.28-9.32,0,0a3.79,3.79,0,0,0,0-6.2Z"></path><path d="M48.39,40.76H31.89a3.45,3.45,0,1,0,0,6.87h16.5a3.45,3.45,0,1,0,0-6.87Z"></path></g></svg>`;

export const TerminalAPI : IPartAPI = {
    type: TerminalPart.type,
    color: '#00c7b6',
    label: _('PART_TERMINAL_LABEL', 'Terminal'),
    icon: terminal,
    symbols: [{
        type: 'variable',
        name: 'visible',
        verbose: _('PART_TERMINAL_VISIBLE', 'visible'),
        returnType: 'Enum',
        enum: [
            [_('PART_TERMINAL_SHOW', 'show'), 'true'],
            [_('PART_TERMINAL_HIDE', 'hide'), 'false'],
        ],
        default: true,
        setter: true,
        getter: false,
    }, {
        type: 'function',
        name: 'printLine',
        verbose: _('PART_TERMINAL_PRINT', 'print'),
        parameters: [{
            type: 'parameter',
            name: 'line',
            verbose: _('PART_TERMINAL_LINE', 'line'),
            returnType: String,
            default: '',
        }],
    }, {
        type: 'function',
        name: 'print',
        verbose: _('PART_TERMINAL_PRINT', 'print'),
        parameters: [{
            type: 'parameter',
            name: 'line',
            verbose: '',
            returnType: String,
            default: '',
        }],
    }, {
        type: 'function',
        name: 'clear',
        verbose: _('PART_TERMINAL_CLEAR', 'clear'),
    }],
};
