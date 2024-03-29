/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */


// Hardcoded legacy block name conversions

export interface IExceptionMapItem {
    category?: string;
    blocks: Map<string, string>;
}

export const blockExceptions = new Map<string, IExceptionMapItem>([
    ['app', {
        blocks: new Map<string, string>([['app_onStart', 'onStart']]),
    }],
    ['draw', {
        category: 'ctx',
        blocks: new Map<string, string>([['random', 'stamp_random']]),
    }],
]);