import { Workspace } from '@kano/kwc-blockly/blockly.js';

export function parseXml(src : string) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(src, 'application/xml');
    if (dom.documentElement.nodeName === 'parsererror') {
        throw new Error(dom.documentElement.innerText);
    }
    return dom;
}

export function getAncestor(target : Element, test : (node : Element) => boolean) {
    function walk(node : Element|null) : Element|null {
        if (!node) {
            return null;
        }
        return test(node) ? node : walk(node.parentElement);
    }
    return walk(target.parentElement)
}

export function findStartNodes(root : XMLDocument) {
    const clone = root.cloneNode(true);
    const entryNodes = [...clone.childNodes] as HTMLElement[];
    return entryNodes.map((entryNode) => {
        const startNode = entryNode.querySelector('block[type="generator_start"]') as HTMLElement;
        if (!startNode) {
            return {
                preloaded: null,
                start: entryNode,
                root: entryNode,
            };
        }
        const nextNode = startNode.querySelector('next>block');
        if (!nextNode) {
            if (startNode.parentNode) {
                startNode.parentNode.removeChild(startNode);
            }
            return {
                preloaded: entryNode,
                start: null,
                root: null,
            };
        }
        if (startNode.parentNode) {
            // Replace the generator block with the real first block
            startNode.parentNode.insertBefore(nextNode, startNode);
            startNode.parentNode.removeChild(startNode);
        }
        // Tag the start of the challenge
        nextNode.setAttribute('challenge-start-node', '');
        // Create a new tree for the generator to parse
        const cleanRoot = entryNode.cloneNode(true) as HTMLElement;
        // Grab the entry point of the challenge
        const cleanStartNode = cleanRoot.querySelector('[challenge-start-node]') as HTMLElement;
        if (nextNode.parentNode) {
            // Remove the start node from the original clone, this leaves the default blocks on
            // the workspace
            nextNode.parentNode.removeChild(nextNode);
        }
        return {
            preloaded: entryNode,
            start: cleanStartNode,
            root: cleanRoot,
        };
    });
}