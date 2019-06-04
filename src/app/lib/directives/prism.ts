import 'prismjs/prism.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export function highlight(src : string, language : string) {
    const html = window.Prism.highlight(src, window.Prism.languages[language]);
    return unsafeHTML(html);
}
