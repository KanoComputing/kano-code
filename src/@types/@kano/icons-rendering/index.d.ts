/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

declare module '@kano/icons-rendering/index.js' {
    function svg(source : TemplateStringsArray, ...args : any[]) : HTMLTemplateElement;
    function dataURI(tpl : HTMLTemplateElement) : string;
}