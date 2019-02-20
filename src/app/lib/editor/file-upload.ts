import { Plugin } from './plugin.js';
import Editor from './editor.js';
import { EventEmitter } from '@kano/common/index.js';

export interface IFileDropTarget extends HTMLElement {
    animateDragEnter() : void;
    animateDragLeave() : void;
    animateDrop() : void;
}

class FileUpload extends Plugin {
    private targetEl : HTMLElement;
    private overlay : IFileDropTarget;
    private editor? : Editor;
    private _onDidUpload : EventEmitter<any> = new EventEmitter();
    get onDidUpload() { return this._onDidUpload.event; }
    constructor(targetEl : HTMLElement, overlay : IFileDropTarget) {
        super();
        this.targetEl = targetEl;
        this.overlay = overlay;

        this._onDrop = this._onDrop.bind(this);
        this._onDragenter = this._onDragenter.bind(this);
        this._onDragleave = this._onDragleave.bind(this);
    }
    onInstall(editor : Editor) {
        this.editor = editor;
    }
    onInject() {
        this._bindEvents();
    }
    stop() {
        this._unbindEvents();
    }
    _bindEvents() {
        this.targetEl.addEventListener('dragover', FileUpload._onDragover, false);
        this.targetEl.addEventListener('drop', this._onDrop, false);
        this.targetEl.addEventListener('dragenter', this._onDragenter, false);
        this.targetEl.addEventListener('dragleave', this._onDragleave, false);
    }
    _unbindEvents() {
        this.targetEl.removeEventListener('dragover', FileUpload._onDragover);
        this.targetEl.removeEventListener('drop', this._onDrop);
        this.targetEl.removeEventListener('dragenter', this._onDragenter);
        this.targetEl.removeEventListener('dragleave', this._onDragleave);
    }
    static _onDragover(e : any) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }
    _onDrop(e : any) {
        e.preventDefault();
        e.stopPropagation();
        if (this.editor) {
            this.editor.domNode.style.pointerEvents = 'initial';
        }
        this._animateDrop();
        const { files } = e.dataTransfer;
        if (!files.length) {
            return;
        }
        const [file] = files;
        FileUpload._readFile(file)
            .then((content) => {
                this._onFileDropped(content);
            })
            .catch((err) => {
                console.error(err);
            });
    }
    _onFileDropped(content : any) {
        this._onDidUpload.fire(content);
    }
    static _readFile(f : Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result as string);
            };

            reader.onerror = reject;

            reader.readAsText(f);
        });
    }
    _onDragenter(e : any) {
        if (e.dataTransfer.effectAllowed === 'move') {
            return;
        }
        if (this.editor) {
            this.editor.domNode.style.pointerEvents = 'none';
        }
        this._animateDragEnter();
    }
    _onDragleave() {
        if (this.editor) {
            this.editor.domNode.style.pointerEvents = 'initial';
        }
        this._animateDragLeave();
    }
    _animateDragEnter() {
        if (!this.overlay) {
            return;
        }
        this.overlay.animateDragEnter();
    }
    _animateDragLeave() {
        if (!this.overlay) {
            return;
        }
        this.overlay.animateDragLeave();
    }
    _animateDrop() {
        if (!this.overlay) {
            return;
        }
        this.overlay.animateDrop();
    }
}

export default FileUpload;
