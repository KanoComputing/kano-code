import { TerminalPart } from './terminal.js';
import { PartContextStub } from '../../../../../test/part-context-stub.js';

suite('TerminalPart', () => {
    test('#onInstall()', () => {
        const stub = new PartContextStub();
        const terminal = new TerminalPart();

        terminal.onInstall(stub);

        assert.equal((terminal as any).domNode, stub.dom.root.firstChild);
    });
    test('#render()', () => {
        const terminal = new TerminalPart();

        terminal.core.visible = true;

        terminal.render();

        assert.equal((terminal as any).domNode.style.visibility, 'visible');
    });
});
