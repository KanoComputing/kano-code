
function toSrc(data : string) : string {
    return `data:image/svg+xml;base64,${btoa(data)}`;
}

function toTemplate(string : string) : HTMLTemplateElement {
    const template = document.createElement('template');
    template.innerHTML = string;
    return template;
}

function litteral(strings : string[], ...values : any[]) {
    return values.reduce((acc, v, idx) => `${acc}${v}${strings[idx + 1]}`, strings[0]).trim();
}

export const svg = (strings : string[], ...values : any[]) => toTemplate(litteral(strings, ...values));

export const base64 = (strings : string[], ...values : any[]) => {
    const svgString = litteral(strings, ...values);
    return toSrc(svgString);
};

export const img = (strings : string[], ...values : any[]) => {
    const svgString = litteral(strings, ...values);
    const src = toSrc(svgString);
    return toTemplate(`<img src="${src}"/>`);
};
