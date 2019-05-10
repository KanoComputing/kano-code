import { selectorToMarkedString } from '../../../../../vendor/monaco-editor/esm/vs/language/css/_deps/vscode-css-languageservice/services/selectorPrinting';

export function parseXml(src : string) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(src, 'application/xml');
    if (dom.documentElement.nodeName === 'parsererror') {
        throw new Error(dom.documentElement.innerText);
    }
    return dom;
}

export function nodeIsNonShadowStatementOrValue(node : Element) {
    return (node.tagName.toLowerCase() === 'statement' || node.tagName.toLowerCase() === 'value') && !!node.parentElement && node.parentElement.tagName.toLowerCase() !== 'shadow';
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
        }
        return step(node.parentElement);
    }
    return step(node);
}