import { directive, Part } from 'lit-html/lit-html.js';
const templateMap = new WeakMap();

export const templateContent = directive((template: HTMLTemplateElement) => (part: Part) => {
    if (templateMap.get(part) === template) {
        return;
    }
    templateMap.set(part, template)
    const content = (template.cloneNode(true) as HTMLTemplateElement).content;
    part.setValue(content);
    part.commit();
});
