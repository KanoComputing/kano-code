import 'marked/lib/marked.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export function marked(src : string) {
    return unsafeHTML(window.marked(src));
}
