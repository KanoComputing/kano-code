/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Workspace, Xml, Blockly, Block } from '@kano/kwc-blockly/blockly.js';

interface IBlockDefinition {
    [K : string] : any;
    init?(this : Block) : any;
}

export class WorkspaceTester {
    public workspace = new Workspace();
    private blocks : string[] = [];
    addBlock(id : string, def : IBlockDefinition) {
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