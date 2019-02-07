import { Part, IPartContext } from '../../part.js';
import { part, property, component } from '../../decorators.js';
import { PartComponent } from '../../component.js';
import { IDisposable } from '@kano/common/index.js';
import { legacyTransform } from './legacy.js';

class TerminalComponent extends PartComponent {
    @property({ type: Boolean, value: false })
    public visible : boolean = false;
}

@part('terminal')
export class TerminalPart extends Part {
    @component(TerminalComponent)
    public core : TerminalComponent;
    private domNode : HTMLElement = document.createElement('div');
    private _invalidateSub : IDisposable;
    private message : string = '';
    private lastLine : HTMLElement|null = null;
    private _renderingInterval? : number;
    static transformLegacy(app : any) {
        legacyTransform(app);
    }
    constructor() {
        super();
        this.core = this._components.get('core') as TerminalComponent;
        this._invalidateSub = this.core.onDidInvalidate(() => this.render());

        this.domNode.style.position = 'absolute';
        this.domNode.style.top = '0';
        this.domNode.style.left = '0';
        this.domNode.style.right = '0';
        this.domNode.style.bottom = '0';
        this.domNode.style.overflow = 'hidden';
        this.domNode.style.background = 'rgba(0, 0, 0, 0.9)';
        this.domNode.style.color = 'green';
    }
    onInstall(context : IPartContext) {
        context.dom.root.appendChild(this.domNode);
        this.render();
    }
    render() {
        if (!this.core.invalidated) {
            return;
        }
        this.domNode.style.visibility = this.core.visible ? 'visible' : 'hidden';
        this.core.apply();
    }
    print(message : string) {
        this.message += message;
    }
    printLine(message : string) {
        this.print(`${message}\n`);
    }
    _printStack() {
        let lines : string[];
        if (this.message === '') {
            return;
        }
        lines = this.message.split('\n');
        if (!this.lastLine) {
            this.lastLine = document.createElement('div');
            this.domNode.appendChild(this.lastLine);
        }
        lines.forEach((line, index) => {
            if (index === 0) {
                this.lastLine!.innerText = this.lastLine!.innerText + line;
                return;
            }
            const div = document.createElement('div');
            div.innerText = line;
            this.domNode.appendChild(div);
        });
        while (this.domNode.children.length > 30) {
            this.domNode.removeChild(this.domNode.firstChild!);
        }
        this.domNode.scrollTop = this.domNode.scrollHeight;
        if (this.domNode.lastChild) {
            this.lastLine = this.domNode.lastChild as HTMLElement;
        }
        this.message = '';
    }
    clear() {
        while (this.domNode.firstChild) {
            this.domNode.removeChild(this.domNode.firstChild);
        }
        this.lastLine = null;
        this.message = '';
    }
    set visible(state : boolean) {
        this.core.visible = state;
        this.core.invalidate();
    }
    _stopRendering() {
        clearInterval(this._renderingInterval);
    }
    _startRendering() {
        this._stopRendering();
        // Only do a real print at 20 fps. This will bulk all the DOM writes
        // that happens really fast
        this._renderingInterval = window.setInterval(this._printStack.bind(this), 1000 / 20);
    }
    onStart() {
        super.onStart();
        this._startRendering();
    }
    onStop() {
        super.onStop();
        this._stopRendering();
        this.clear();
    }
    dispose() {
        super.dispose();
        this._invalidateSub.dispose();
    }
}