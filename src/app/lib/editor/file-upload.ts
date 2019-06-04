import { Plugin } from './plugin.js';
import Editor from './editor.js';
import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { IEditorWidget } from './widget/widget.js';

export interface IFileDropOverlayProvider {
    [K : string] : any;
    animateDragEnter() : void;
    animateDragLeave() : void;
    animateDrop() : void;
    getDomNode() : HTMLElement;
}

export interface IDroppedFile {
    file : File;
    content : string|ArrayBuffer;
}

export class FileUpload extends Plugin {
    private targetEl : HTMLElement;
    private overlayProvider : IFileDropOverlayProvider;
    private overlay? : IEditorWidget;
    private editor? : Editor;
    private _onDidUpload : EventEmitter<IDroppedFile> = new EventEmitter();
    private currentTarget : EventTarget|null = null;
    get onDidUpload() { return this._onDidUpload.event; }
    constructor(targetEl : HTMLElement, overlayProvider : IFileDropOverlayProvider) {
        super();
        this.targetEl = targetEl;
        this.overlayProvider = overlayProvider;

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
    addOverlay() {
        if (this.overlay || !this.editor) {
            return;
        }
        const domNode = this.overlayProvider.getDomNode();

        domNode.style.left = '0px';
        domNode.style.top = '0px';
        domNode.style.width = '100%';
        domNode.style.height = '100%';
        domNode.style.pointerEvents = 'none';

        this.overlay = {
            getDomNode() { return domNode; },
            getPosition() { return null; },
        };

        this.editor.addContentWidget(this.overlay);
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
    _onDrop(e : DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (this.editor) {
            this.editor.domNode.style.pointerEvents = 'initial';
        }
        this._animateDrop();
        const { files } = e.dataTransfer!;
        if (!files.length) {
            return;
        }
        const [file] = files;
        FileUpload._readFile(file)
            .then((content) => {
                this._onFileDropped({ file, content });
            })
            .catch((err) => {
                console.error(err);
            });
    }
    _onFileDropped(file : IDroppedFile) {
        this._onDidUpload.fire(file);
    }
    static _readFile(f : Blob) : Promise<string|ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result) {
                    resolve(reader.result);
                }
            };

            reader.onerror = reject;

            reader.readAsText(f);
        });
    }
    _onDragenter(e : DragEvent) {
        this.currentTarget = e.target;
        if (e.dataTransfer && e.dataTransfer.effectAllowed === 'move') {
            return;
        }
        this._animateDragEnter();
    }
    _onDragleave(e : DragEvent) {
        if (this.currentTarget !== e.target) {
            return;
        }
        this.currentTarget = null;
        this._animateDragLeave();
    }
    _animateDragEnter() {
        if (!this.overlayProvider) {
            return;
        }
        this.addOverlay();
        this.overlayProvider.animateDragEnter();
    }
    _animateDragLeave() {
        if (!this.overlayProvider) {
            return;
        }
        this.overlayProvider.animateDragLeave();
    }
    _animateDrop() {
        if (!this.overlayProvider) {
            return;
        }
        this.overlayProvider.animateDrop();
    }
    onDispose() {
        if (this.editor && this.overlay) {
            this.editor.removeContentWidget(this.overlay);
        }
    }
}

export default FileUpload;
