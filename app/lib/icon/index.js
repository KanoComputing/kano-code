
function toSrc(data) {
    return `data:image/svg+xml;base64,${btoa(data)}`;
}

function toTemplate(string) {
    const template = document.createElement('template');
    template.innerHTML = string;
    return template;
}

function litteral(strings, ...values) {
    return values.reduce((acc, v, idx) => `${acc}${v}${strings[idx + 1]}`, strings[0]).trim();
}

export const svg = (strings, ...values) => toTemplate(litteral(strings, ...values));

export const img = (strings, ...values) => {
    const svgString = litteral(strings, ...values);
    const src = toSrc(svgString);
    return toTemplate(`<img src="${src}">`);
};
