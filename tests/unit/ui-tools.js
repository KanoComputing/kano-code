function triggerEvent(node, name, opts) {
    node.dispatchEvent(new CustomEvent(name, opts));
}

const styles = `
    <style>
        kano-app-editor {
            min-height: 300px;
        }
    </style>
`;
const stylesTemplate = document.createElement('template');
stylesTemplate.innerHTML = styles;

export const click = (node) => {
    triggerEvent(node, 'click');
};

export const setupStyle = () => {
    const inst = stylesTemplate.content.cloneNode(true);
    document.head.appendChild(inst);
};

export default { click };
