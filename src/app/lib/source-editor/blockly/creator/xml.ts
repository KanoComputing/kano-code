export function parseXml(src : string) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(src, 'application/xml');
    if (dom.documentElement.nodeName === 'parsererror') {
        throw new Error(dom.documentElement.innerText);
    }
    return dom;
}

export function nodeIsNonShadowStatementOrValue(node : Element) {
    return (node.tagName.toLowerCase() === 'statement' || node.tagName.toLowerCase() === 'value' || node.tagName.toLowerCase() === 'next') && !!node.parentElement && node.parentElement.tagName.toLowerCase() !== 'shadow';
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

function isHTMLElement(v : HTMLElement|null) : v is HTMLElement {
    return v instanceof HTMLElement;
}

function getRoot(node : Element) {
    function up(n : Element) : Element {
        if (n.parentElement) {
            return up(n.parentElement);
        }
        return n;
    }
    return up(node);
}

/**
 * Scans a XML document for start blocks. Returns a list of the blocks to start generating from.
 * This will mutate the tree to separate the start node from the tree.
 * @param root The XML document where the start nodes are
 */
export function findStartNodes(root : XMLDocument) {
    const entryNodes = [...root.childNodes] as HTMLElement[];
    return entryNodes.filter(n => n.tagName.toLowerCase() === 'block').map((entryNode) => {
        const startNode = entryNode.querySelector('block[type="generator_start"]') as HTMLElement;
        if (!startNode) {
            entryNode.setAttribute('marker', '');
            const cleanTree = root.cloneNode(true) as HTMLElement;
            if (entryNode.parentNode) {
                // Separate the node from its tree to help generating the defaultApp
                entryNode.parentNode!.removeChild(entryNode);
            }
            const cleanEl = cleanTree.querySelector('[marker]') as HTMLElement;
            entryNode.removeAttribute('marker');
            if (!cleanEl) {
                throw new Error('Could not find start nodes: Failed to find node with marker in cloned tree');
            }
            return entryNode;
        }
        const nextNode = startNode.querySelector('next>block');
        if (!nextNode) {
            if (startNode.parentNode) {
                startNode.parentNode.removeChild(startNode);
            }
            return null;
        }
        startNode.setAttribute('marker', '');
        const cleanTree = root.cloneNode(true) as HTMLElement;
        if (startNode.parentNode) {
            // Remove the start node from the original clone, this leaves the default blocks on
            // the workspace
            startNode.parentNode.removeChild(startNode);
        }
        const cleanEl = cleanTree.querySelector('[marker]') as HTMLElement;
        startNode.removeAttribute('marker');
        if (!cleanEl) {
            throw new Error('Could not find start nodes: Failed to find node with marker in cloned tree');
        }
        return cleanEl;
    }).filter(isHTMLElement);
}

export enum DiffResultType {
    NODE,
    INNER_TEXT,
    EQUAL,
}

export interface INodeDiffResult {
    type : DiffResultType.NODE;
    from : HTMLElement|null;
    to : HTMLElement|null;
}

export interface IInnerTextDiffResult {
    type : DiffResultType.INNER_TEXT;
    from : string|null;
    to : string|null;
    aNode : HTMLElement;
    bNode : HTMLElement;
}

export interface IEqualDiffResult {
    type : DiffResultType.EQUAL;
}

export type IDiffResult = INodeDiffResult|IInnerTextDiffResult|IEqualDiffResult;

/**
 * Compares two blockly DOM tree and returns the first difference
 * @param treeA A Blockly tree to compare from
 * @param treeB A Blockly tree to compare to
 */
export function findFirstTreeDiff(treeA : HTMLElement, treeB : HTMLElement) : IDiffResult {
    function next(a : HTMLElement, b : HTMLElement) : IDiffResult {
        const nodeDiff : INodeDiffResult = { type: DiffResultType.NODE, from: a, to: b };
        if (a.tagName.toLowerCase() !== b.tagName.toLowerCase()) {
            return nodeDiff;
        }
        const aType = a.getAttribute('type');
        const bType = b.getAttribute('type');
        if (aType !== bType) {
            return nodeDiff; 
        }
        if (a.children.length === 0) {
            const aText = a.textContent;
            const bText = b.textContent;
            if (aText !== bText) {
                return { type: DiffResultType.INNER_TEXT, from: aText, to: bText, aNode: a, bNode: b }; 
            }
        }
        let aChild;
        let bChild;
        const biggest = Math.max(a.children.length, b.children.length);
        for (var i = 0; i < biggest; i += 1) {
            aChild = a.children[i] as HTMLElement;
            bChild = b.children[i] as HTMLElement;
            if (!bChild) {
                return { type: DiffResultType.NODE, from: aChild, to: null };
            }
            if (!aChild) {
                return { type: DiffResultType.NODE, from: null, to: bChild };
            }
            const result = next(aChild, bChild);
            if (result.type !== DiffResultType.EQUAL) {
                return result;
            }
        }
        return { type: DiffResultType.EQUAL };
    }
    return next(treeA, treeB);
}

export function getSelectorForNode(node : HTMLElement, limit : HTMLElement) {
    const selectors : string[] = [];
    function step(node : HTMLElement|null) : string {
        if (!node || node === limit) {
            return selectors.join('>');
        }
        const tagName = node.tagName.toLowerCase();
        switch (tagName) {
            case 'statement':
            case 'value':
            case 'field': {
                const name = node.getAttribute('name');
                if (name) {
                    selectors.unshift(`input#${name}`);
                }
                break;
            }
            case 'shadow': {
                selectors.unshift('shadow');
                break;
            }
            case 'next': {
                selectors.unshift('next');
                break;
            }
        }
        return step(node.parentElement);
    }
    return step(node);
}
