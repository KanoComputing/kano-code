import Plugin from './plugin.js';

class FileUpload extends Plugin {
    constructor(targetEl, overlay) {
        super();
        this.targetEl = targetEl;
        this.overlay = overlay;

        this._onDrop = this._onDrop.bind(this);
        this._onDragenter = this._onDragenter.bind(this);
        this._onDragleave = this._onDragleave.bind(this);
    }
    onInstall(editor) {
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
    static _onDragover(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }
    _onDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.editor.rootEl.style.pointerEvents = 'initial';
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
    _onFileDropped(content) {
        this.emit('upload', content);
    }
    static _readFile(f) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = reject;

            reader.readAsText(f);
        });
    }
    _onDragenter(e) {
        if (e.dataTransfer.effectAllowed === 'move') {
            return;
        }
        this.editor.rootEl.style.pointerEvents = 'none';
        this._animateDragEnter();
    }
    _onDragleave() {
        this.editor.rootEl.style.pointerEvents = 'initial';
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
