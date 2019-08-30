import { Editor } from '../editor.js';

export function registerUITagHandlers(editor : Editor) {
    editor.queryEngine.registerTagHandler('output', () => {
        return {
            getId: () => 'output',
            getHTMLElement: () => {
                return editor.output.dom.root;
            },
        }
    });
    editor.queryEngine.registerTagHandler('button', (selector) => {
        const target = selector.id || selector.class;
        if (!target) {
            throw new Error('Could not query button: Either and id or a class must be defined');
        }
        const getToolbar = () => {
            return editor.domNode.workspaceToolbar;
        };

        const getToolbarEntry = (id : string) => {
            const toolbar = getToolbar();
            if (!toolbar) {
                throw new Error('Could not find toolbar entry: Toolbar is not accessible');
            }
            const entry = (toolbar as any).entries.find((e : any) => e.id === id);
            if (!entry) {
                throw new Error(`Could not find toolbar entry with id '${id}'`);
            }
            const element = toolbar.getDomForEntry(entry) as HTMLElement;
            if (!element) {
                throw new Error(`Could not find toolbar entry with id '${id}'`);
            }
            return element;
        };
        const toolbarEntry = (id : string) => {
            return {
                getId: () => target,
                getHTMLElement: () => {
                    return getToolbarEntry(id);
                },
            }
        };
        switch (target) {
            case 'restart': {
                return toolbarEntry('restart');
            }
            case 'fullscreen': {
                return toolbarEntry('fullscreen');
            }
            case 'play': {
                return {
                    getId: () => target,
                    getHTMLElement: () => {
                        const toolbar = getToolbar();
                        if (!toolbar || !toolbar.shadowRoot) {
                            throw new Error('Could not find play button: Toolbar is not accessible');
                        }
                        const element = toolbar.shadowRoot.querySelector('#entry-play') as HTMLElement;
                        if (!element) {
                            throw new Error('Could not find play button');
                        }
                        return element;
                    }
                };
            }
            default: {
                throw new Error(`Could not query button: id '${target}' is unknown`);
            }
        }
    });
    editor.queryEngine.registerTagHandler('tab', (selector) => {
        const target = selector.id || selector.class;
        if (!target) {
            throw new Error('Could not query button: Either and id or a class must be defined');
        }
        const targetMap : { [K : string] : string } = {
            artboard: 'workspace',
            code: 'code-display',
        };
        const tabId = targetMap[target];
        return {
            getId: () => target,
            getHTMLElement: () => {
                const element = editor.domNode.getTabDom(tabId);
                if (!element) {
                    throw new Error(`Could not query editor tab: tab '${target}' is unknown`);
                }
                return element as HTMLElement;
            },
        };
    });
}