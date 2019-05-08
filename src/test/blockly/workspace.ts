import { Workspace, Xml, Blockly } from '@kano/kwc-blockly/blockly.js';

export class WorkspaceTester {
    public workspace = new Workspace();
    private blocks : string[] = [];
    addBlock(id : string, def : any) {
        Blockly.Blocks[id] = def;
        this.blocks.push(id);
    }
    setXml(text : string) {
        const dom = Xml.textToDom(text);
        Xml.domToWorkspace(dom, this.workspace);
    }
    dispose() {
        this.workspace.dispose();
        this.blocks.forEach(id => {
            delete Blockly.Blocks[id];
        });
    }
}