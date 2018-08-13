function triggerEvent(node, name, opts) {
    node.dispatchEvent(new CustomEvent(name, opts));
}

export const click = (node) => {
    triggerEvent(node, 'click');
};

export default { click };
