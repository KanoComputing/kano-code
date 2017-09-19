Polymer({
    is: 'kano-app-editor',
    behaviors: [
        Kano.Behaviors.AppEditorBehavior,
        Kano.Behaviors.AppElementRegistryBehavior,
        Kano.Behaviors.MediaQueryBehavior,
        Kano.Behaviors.I18nBehavior
    ],
    properties: {
        parts: {
            type: Array
        },
        addedParts: {
            type: Array,
            value: () => {
                return [];
            },
            notify: true
        },
        code: {
            type: Object,
            notify: true,
            value: () => {
                return {
                    snapshot: {
                        blocks: ''
                    }
                };
            }
        },
        workspaceTab: {
            type: String,
            value: 'workspace',
            observer: '_workspaceTabChanged'
        },
        remixMode: {
            type: Boolean,
            value: false
        },
        selected: {
            type: Object
        },
        running: {
            type: Boolean,
            value: false,
            notify: true,
            observer: '_runningChanged'
        },
        editableLayout: {
            type: Boolean,
            value: false
        },
        background: {
            type: Object,
            notify: true,
            value: () => {
                return {
                    name: 'My app',
                    userStyle: {
                        background: '#ffffff'
                    }
                };
            }
        },
        defaultCategories: {
            type: Object
        },
        isResizing: {
            type: Boolean,
            value: false
        },
        selectedParts: {
            type: Array
        },
        mode: {
            type: Object
        },
        partsMenuOpen: {
            type: Boolean,
            value: false
        },
        unsavedChanges: {
            type: Boolean,
            value: false,
            notify: true
        },
        lockdown: {
            type: Boolean,
            reflectToAttribute: true,
            observer: '_onLockdownChanged'
        }
    },
    observers: [
        'selectedPartChanged(selected.*)',
        'backgroundChanged(background.*)',
        'resetAppState(addedParts.splices)',
        'updateColors(addedParts.splices)',
        'updateColors(defaultCategories.*)',
        '_codeChanged(code.*)',
        '_partsChanged(parts.slices)',
        '_onPartsSet(parts)'
    ],
    listeners: {
        'mode-ready': '_onModeReady',
        'add-part': '_addPart',
        'remove-part': '_removePartReceived',
        'save-button-clicked': 'share',
        'open-parts-modal': '_openPartsModal',
        'edit-background': '_openBackgroundDialog',
        'iron-resize': '_refitPartModal',
        'feature-not-available-offline': '_openOfflineDialog',
        'opened-changed': '_manageModals'
    },
     //Make sure that no conflicting modals are opened at the same time
    _manageModals (e) {
        const notifier = Polymer.dom(e).rootTarget.id,
            nonConcurringModalIds = [
                'parts-modal',
                'edit-background-dialog',
                'edit-part-dialog'
            ];

        //Check if the notifier is on the check list and if it's opened
        if (nonConcurringModalIds.indexOf(notifier) < 0 || !this.$[notifier].opened) {
            return;
        }

        //Close all non-concurring modals except the one that has just been opened
        nonConcurringModalIds.forEach(modal => {
            if (modal !== notifier && this.$[modal].opened) {
                this.$[modal].close();
            }
        });
    },
    _openBackgroundDialog () {
        this.$['edit-background-dialog'].open();
        this.toggleClass('open', true, this.$['code-overlay']);
    },
    _backgroundEditorDialogClosed (e) {
        let target = e.path ? e.path[0] : e.target;
        if (target === this.$['edit-background-dialog']) {
            this.toggleClass('open', false, this.$['code-overlay']);
        }
    },
    _openPartsModal () {
        this.$['parts-modal'].open();
        this.partsMenuOpen = true;
        this.async(() => {
            this.notifyChange('open-parts');
        }, 500);
    },
    _closePartsModal () {
        this.$['parts-modal'].close();
    },
    _partsModalClosed () {
        this.$['add-parts'].reset();
        this.partsMenuOpen = false;
        this.notifyChange('close-parts');
    },
    _addParts (e) {
        this._closePartsModal();
        Object.keys(e.detail).forEach(type => {
            for (let i = 0; i < e.detail[type]; i++) {
                this._addPart({ detail: type });
            }
        });
    },
    _partsChanged () {
        this.fire('parts-changed', this.parts);
    },
    _newPartRequest (e) {
        let model;

        // Too early
        if (!Array.isArray(this.parts)) {
            this.queuedHardware = this.queuedHardware || [];
            this.queuedHardware.push(e.detail);
            return;
        }

        if (!this.queuedHardware || this.queuedHardware.indexOf(e.detail) === -1) {
            this._addHardwarePart(e.detail.product);
        }
    },
    _addHardwarePart (product) {
        let model;
        for (var i = 0; i < this.parts.length; i++) {
            model = this.parts[i];
            if (model.supportedHardware && model.supportedHardware.indexOf(product) >= 0) {
                this._addPart({ detail: model.type });
                break;
            }
        }
    },
    _addPart (e) {
        let viewport = this.$.workspace.getViewport(),
            viewportRect = viewport.getBoundingClientRect(),
            model, part;
        for (let i = 0; i < Kano.MakeApps.Parts.list.length; i++) {
            model = Kano.MakeApps.Parts.list[i];
            if (model.type === e.detail) {
                break;
            }
        }
        model.position = this._getNewPartPosition(viewportRect);
        part = Kano.MakeApps.Parts.create(model, this.mode.workspace.viewport);
        this.push('addedParts', part);
        this._addedPartsCount++;
        this.notifyChange('add-part', { part });
    },
    _getNewPartPosition (viewportRect) {
        let layoutIndex = this._addedPartsCount % 9,
            layoutIterationIndex = Math.floor(this._addedPartsCount / 9),
            x, y;

        // Position the part on a 3x3 grid in the workspace
        x = (((layoutIndex % 3) * viewportRect.width / 3) + viewportRect.width / 6);
        y = ((Math.floor(layoutIndex / 3) * viewportRect.height / 3)  + viewportRect.height / 6);

        // Make sure the 10th part and so on have an offset
        x += layoutIterationIndex * 20;
        y += layoutIterationIndex * 20;

        // Finally, restrict the position of the part to the workspace
        x = Math.min(x, viewportRect.width - 20);
        y = Math.min(y, viewportRect.height - 20);

        return { x, y };
    },
    _onModeReady () {
        this.modeReady = true;
        this.triggerResize();
    },
    _partEditorDialogClosed (e) {
        let target = e.path ? e.path[0] : e.target;
        if (target === this.$['edit-part-dialog']) {
            // Ensure the id will update
            this.set('selected.id', null);
            this.set('selected.name', this.$['edit-part-dialog-content'].name);
            this.toggleClass('open', false, this.$['code-overlay']);
            this.notifyChange('close-part-settings', { part: this.selected });
            this.editableLayout = false;
            // Stop eventual actions the part editor might be doing
            this.$['edit-part-dialog-content'].stop();
        }
    },
    _isPauseOverlayHidden (running, editableLayout) {
        return running || editableLayout;
    },
    _codeChanged () {
        this.code = this._formatCode(this.code);
        // Do not restart if the code didn't change
        if (this.prevCode && this.code.snapshot.javascript === this.prevCode) {
            return;
        }
        // Mark code as unsaved
        if (this.prevCode) {
            this.unsavedChanges = true;
        }

        // Restart code if not editing
        if (!this.editableLayout) {
            this.toggleRunning(false);
            this.toggleRunning(true);
        }

        this.prevCode = this.code.snapshot.javascript;
    },
    _proxyChange (e) {
        // Bug on chrome 49 on the kit, the event from kano-blockly stops here
        e.preventDefault();
        e.stopPropagation();
        this.fire('change', e.detail);
    },
    deletePartClicked () {
        this._removePartInitiated(this.selected);
    },
    _removePartInitiated (part) {
        this.toBeRemoved = part;
        this.fire('tracking-event', {
            name: 'part_remove_dialog_opened'
        })
        if (this.checkBlockDependency(part)) {
            this.$['dialog-external-use'].open();
        } else {
            this.$['dialog-confirm-delete'].open();
        }
    },
    _removePartReceived (e) {
        let part = e.detail;
        this._removePartInitiated(part);
    },
    _modalClosed (e) {
        if (e.detail.confirmed) {
            switch (Polymer.dom(e).rootTarget.id) {
                case 'dialog-confirm-delete': {
                    this._dialogConfirmedDelete();
                    break;
                }
                case 'dialog-reset-warning': {
                    this._dialogConfirmedReset();
                    break;
                }
            }
        } else {
            switch (Polymer.dom(e).rootTarget.id) {
                case 'dialog-confirm-delete': {
                    this.fire('tracking-event', {
                        name: 'part_remove_dialog_closed'
                    });
                    break;
                }
                case 'dialog-reset-warning': {
                    this.fire('tracking-event', {
                        name: 'workspace_reset_dialog_closed'
                    });
                    break;
                }
            }
        }
    },
    _dialogConfirmedDelete () {
        this._closePartSettings();
        this._deletePart(this.toBeRemoved);
        this.notifyChange('remove-part', {
            part: this.toBeRemoved
        });
    },
    _dialogConfirmedReset () {
        this.set('addedParts', []);
        this.set('code', this._formatCode({}));
        this.set('background', {
            name: 'My app',
            userStyle: {
                background: '#ffffff'
            }
        });
        this.fire('tracking-event', {
            name: 'workspace_reset_dialog_confirmed'
        });
        this.save();
        Kano.MakeApps.Parts.Part.clear();
        this.$.workspace.reset();
        if (!this.remixMode) {
            localStorage.removeItem(`savedApp-${this.mode.id}`);
        }
        this.unsavedChanges = false;
        this._addedPartsCount = 0;
    },
    checkBlockDependency (part) {
        let xmlString, xml, parser, blocks, block, blockId, pieces;
        // Get the blockly xml and parse it
        xmlString = this.code.snapshot.blocks;
        parser = new DOMParser();
        xml = parser.parseFromString(xmlString, 'text/xml');
        // Get all the 'block' elements
        blocks = xml.getElementsByTagName('block');
        // Check for every one of them...
        for (let k = 0, len = blocks.length; k < len; k++) {
            block = blocks[k];
            blockId = block.getAttribute('type');
            pieces = blockId.split('#');
            // ...if the type of the block is the part we're trying to delete
            if (pieces[0] === part.id) {
                return true;
            }
        }
        return false;
    },
    updateColors () {
        if (!this.defaultCategories) {
            return;
        }
        this.debounce('updateColors', () => {
            Kano.MakeApps.Utils.updatePartsColors(this.addedParts);
        }, 10);
    },
    isPartDeletionDisabled () {
        return this.partEditorOpened || this.backgroundEditorOpened || this.running;
    },
    backgroundChanged (e) {
        let property = e.path.split('.');
        property.shift();
        property = property.join('.');
        this.notifyChange('background', {
            property,
            value: e.value
        });
    },
    selectedPartChanged (e) {
        let property = e.path.split('.');
        property.shift();
        property = property.join('.');
        this.notifyChange('selected-part-change', {
            property,
            value: e.value
        });
    },
    computeBackground () {
        let style = this.background.userStyle;
        return Object.keys(style).reduce((acc, property) => {
            acc += `${property}:${style[property]};`;
            return acc;
        }, '');
    },
    /**
     * Save the current work in the local storage
     */
    save (snapshot=false, to_json=true) {
        let savedParts = this.addedParts.reduce((acc, part) => {
            acc.push((to_json) ? part.toJSON() : part);
            return acc;
        }, []),
            savedApp = {};
        savedApp.parts = savedParts;
        savedApp.code = this.code;
        savedApp.background = this.background;
        savedApp.mode = this.mode.id;
        if (snapshot) {
            savedApp.snapshot = true;
            savedApp.selectedPart = this.addedParts.indexOf(this.selected);
        }

        return savedApp;
    },
    share (e) {
        if (e && e.detail && e.detail.keyboardEvent) {
            e.detail.keyboardEvent.preventDefault();
            e.detail.keyboardEvent.stopPropagation();
        }

        Kano.MakeApps.Utils.onLine().then((isOnline) => {
            if (isOnline) {
                this.fire('share', this.compileApp());
            } else {
                this._openOfflineDialog();
            }
        });
    },
    compileApp () {
        return {
            app: this.save(false, false),
            workspaceInfo: JSON.stringify(this.save()),
            background: this.background.userStyle.background,
            mode: this.mode,
            code: this.code,
            parts: this.addedParts
        };
    },
    generateCover () {
        return this.$.workspace.generateCover();
    },
    /**
     * Load the saved work from the local storage
     */
    load (savedApp, parts) {
        let addedParts,
            part,
            partsDict;
        if (!savedApp) {
            return;
        }

        addedParts = savedApp.parts.map((savedPart) => {
            for (let i = 0, len = parts.length; i < len; i++) {
                if (parts[i].type === savedPart.type) {
                    savedPart = Object.assign({}, parts[i], savedPart);
                    break;
                }
            }
            part = Kano.MakeApps.Parts.create(savedPart,
                                              this.mode.workspace.viewport);
            return part;
        });
        savedApp.code = this._formatCode(savedApp.code);
        this.set('addedParts', addedParts);

        // Update AppModules
        partsDict = this.$.workspace.getPartsDict();
        Kano.AppModules.loadParts(partsDict);

        // Force a color update and a register block to make sure the loaded code will be
        // rendered with the right colors
        Kano.MakeApps.Utils.updatePartsColors(this.addedParts);
        this.$['root-view'].computeBlocks();
        this.set('code', savedApp.code);
        if (savedApp.background) {
            this.set('background', savedApp.background);
        }
        this.unsavedChanges = false;
    },
    _formatCode (code) {
        code = code || {};
        code.snapshot = code.snapshot || {};
        return code;
    },
    reset () {
        this.$['dialog-reset-warning'].open();
    },
    onPartSettings () {
        // No part selected, show the background editor
        if (!this.selected) {
            this._toggleFullscreenModal(false);
            this._openBackgroundDialog();
            this.notifyChange('open-background-settings');
        } else {
            this._toggleFullscreenModal(this.selected.fullscreenEdit);
            this.$['edit-part-dialog'].open();
            this.notifyChange('open-part-settings', { part: this.selected });
        }
    },
    _closePartSettings () {
        this.$['edit-part-dialog'].close();
    },
    _toggleFullscreenModal (isFullScreen) {
        this.$['edit-part-dialog'].fitInto = isFullScreen ? window : this.$['blocks-panel'];
        this.$['edit-part-dialog'].withBackdrop = isFullScreen;
        this.toggleClass('large-modal', isFullScreen, this.$['edit-part-dialog-content']);
        //If modal is not fullscreen, use a custom overlay
        this.toggleClass('open', !isFullScreen, this.$['code-overlay']);
    },
    _repositionPanel (e) {
        const target = this.$[Polymer.dom(e).rootTarget.id];
        this.async(() => target.parentElement.refit(), 10);
    },
    _deletePart (part) {
        let index = this.addedParts.indexOf(part);
        this.splice('addedParts', index, 1);
        Kano.MakeApps.Parts.freeId(part);
        this.$.workspace.clearSelection();

        // Save the app to localStorage after part is removed
        localStorage.setItem(`savedApp-${this.mode.id}`, JSON.stringify(this.save()));
    },
    _onPartsSet (parts) {
        if (!this.queuedHardware) {
            return;
        }

        this.async(() => {
            let product,
                partTypes;

            // Unqueue any parts that have been set already
            this.addedParts.forEach((p) => {
                for (var i = 0; i < this.queuedHardware.length; i++) {
                    if (this.queuedHardware[i].product === p.type) {
                        this.splice('queuedHardware', i, 1);
                    }
                }
            });

            for (var i = 0; i < this.queuedHardware.length; i++) {
                product = this.queuedHardware[i].product;
                partTypes = this.parts.map(p => p.type);
                if (partTypes.indexOf(product) > -1) {
                    this._addHardwarePart(product);
                    this.splice('queuedHardware', i, 1);
                }
            }
        }, 5);

    },
    onPartReady (e) {
        let clone;
        interact(e.detail).draggable({
            onmove: (event) => {
                let target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // translate the element
                target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

                // update the posiion attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
            restrict: {
                restriction: this.$.section
            },
            onend: () => {
                this.$.section.removeChild(clone);
            }
        }).on('move', (event) => {
            let interaction = event.interaction;

            // if the pointer was moved while being held down
            // and an interaction hasn't started yet
            if (interaction.pointerIsDown && !interaction.interacting()) {
                let original = event.currentTarget,
                    rect = original.getBoundingClientRect(),
                    style;

                // create a clone of the currentTarget element
                clone = Polymer.dom(original).cloneNode(true);
                style = clone.style;
                clone.model = original.model;
                clone.colour = original.colour;
                style.position = 'absolute';
                style.top = `${rect.top}px`;
                style.left = `${rect.left}px`;
                style.zIndex = 11;

                // insert the clone to the page
                this.$.section.appendChild(clone);

                // start a drag interaction targeting the clone
                interaction.start({ name: 'drag' },
                                    event.interactable,
                                    clone);
            }
        });
    },
    triggerResize () {
        window.dispatchEvent(new Event('resize'));
    },
    bindEvents () {
        this.updateWorkspaceRect = this.updateWorkspaceRect.bind(this);

        this.$.workspace.addEventListener('viewport-resize', this.updateWorkspaceRect);
    },
    detachEvents () {
        this.$.workspace.removeEventListener('viewport-resize', this.updateWorkspaceRect);
    },
    ready () {
        this.reset = this.reset.bind(this);
        this._exportApp = this._exportApp.bind(this);
        this._importApp = this._importApp.bind(this);
        this.modeReady = false;
    },
    attached () {
        this._addedPartsCount = 0;
        this.target = document.body;
        this.partEditorOpened = false;
        this.backgroundEditorOpened = false;
        this.codeEditor = this.$['root-view'];

        this.bindEvents();
        this._registerElement('workspace-panel', this.$['workspace-panel']);
        this._registerElement('blocks-panel', this.$['blocks-panel']);
        this._registerElement('parts-panel', this.$['parts-modal']);
    },
    detached () {
        Kano.MakeApps.Parts.clear();
        this.detachEvents();
    },
    _exportApp () {
        let savedApp = this.save(),
            a = document.createElement('a'),
            file = new Blob([JSON.stringify(savedApp)], {type: 'application/kcode'}),
            url = URL.createObjectURL(file);
        document.body.appendChild(a);
        a.download = 'my-app.kcode';
        a.href = url;
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.fire('tracking-event', {
            name: 'app_exported'
        });
    },
    _importApp () {
        this.fileInput = document.createElement('input');
        this.fileInput.setAttribute('type', 'file');
        this.fileInput.style.display = 'none';
        this.fileInput.addEventListener('change', (evt) => {
            let f = evt.target.files[0];
            if (f) {
                let r = new FileReader();
                r.onload = (e) => {
                    // Read the mode
                    let app = JSON.parse(e.target.result);
                    this.set('mode', Kano.MakeApps.Mode.modes[app.mode]);
                    Kano.MakeApps.Parts.clear();
                    this.load(app, Kano.MakeApps.Parts.list);
                };
                r.readAsText(f);
                document.body.removeChild(this.fileInput);
            }
        });
        document.body.appendChild(this.fileInput);
        this.fileInput.click();
        this.fire('tracking-event', {
            name: 'app_imported'
        });
    },
    _setCodeDisplay(code, workspaceTab) {
        if (workspaceTab === 'workspace') {
            return;
        }
        return js_beautify(code, { 'indent_size': 2 });
    },
    updateWorkspaceRect (e) {
        this.set('workspaceRect', e.detail);
    },
    /**
     * Add draggable properties to the added element in the workspace
     * @param  {Event} e
     */
    workspaceUiReady (e) {
        let element = e.detail;
        if (element.instance) {
            return ;
        }
        if (!this.draggables) {
            this.draggables = [];
        }
        this.draggables.push(element);
        this._enableDrag(element);
    },
    getDragMoveListener (scale=false) {
        return (event) => {
            let target = event.target,
                pos = target.model.position,
                delta = {
                    x: event.dx,
                    y: event.dy
                };

            if (scale) {
                delta = this.scaleToWorkspace(delta);
            }

            pos.x += delta.x;
            pos.y += delta.y;

            target.set('model.position.x', pos.x);
            target.set('model.position.y', pos.y);
        };
    },
    scaleToWorkspace (point) {
        let rect = this.workspaceRect,
            fullSize = this.mode.workspace.viewport;

        return {
            x: point.x / rect.width * fullSize.width,
            y: point.y / rect.height * fullSize.height
        };
    },
    _runButtonClicked () {
        this.fire('tracking-event', {
            name: this.running ? 'app_paused' : 'app_played'
        })
        this.toggleRunning();
    },
    toggleRunning (state) {
        this.running = typeof state === 'undefined' ? !this.running : state;
    },
    _cleanDraggables () {
        if (!this.draggables) {
            this.draggables = [];
        }
        // If a part is removed, the element will disappear from the array
        this.draggables = this.draggables.filter((d) => !!d);
    },
    _disableDrag () {
        this._cleanDraggables();
        this.draggables.forEach((draggable) => {
            interact(draggable).draggable(false);
        });
    },
    _enableDrag (el) {
        let draggables,
            restrictEl;
        this._cleanDraggables();
        if (el) {
            draggables = [el];
        } else {
            draggables = this.draggables;
        }
        draggables.forEach((draggable) => {
            if (!draggable.model) {
                return;
            }
            restrictEl = draggable.model.restrict === 'workspace' ? this.$.workspace.getViewport().getRestrictElement() : this.$['workspace-panel'];
            interact(draggable).draggable({
                onmove: this.getDragMoveListener(true),
                onend: (e) => {
                    let model = e.target.model;
                    this.notifyChange('move-part', {
                        part: model
                    });
                },
                restrict: {
                    restriction: restrictEl
                }
            });
        });
    },
    _onLockdownChanged (value) {
        //Catch click events with backdrop
        if (value) {
            this.$.backdrop.open();
        } else {
            this.$.backdrop.close();
        }
    },
    _refitPartModal () {
        this.$['edit-part-dialog'].refit();
    },
    getMakeButtonClass (running, editableLayout) {
        let classes = [];
        if (running) {
            classes.push('running');
        } else {
            classes.push('stopped');
        }
        if (editableLayout) {
            classes.push('editable-layout');
        }
        return classes.join(' ');
    },
    applyHiddenClass () {
        return this.running ? '' : 'hidden';
    },
    getMakeButtonLabel () {
        if (this.running) {
            return 'Stop';
        }

        return 'Make';
    },
    /**
     * Resize the workspace
     */
    resizeWorkspace (e) {
        this.pauseEvent(e);
        this.isResizing = true;
    },
    /**
     * Completed the resize action
     */
    completedResizing () {
        this.isResizing = false;
    },
    /**
     * Used to prevent text selection when dragging
     */
    pauseEvent (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    },
    /**
     * Mouse moved handler
     */
    mouseMoved (e) {
        let workspacePanel = this.$['workspace-panel'],
            container = this.$.section,
            offsetPanel,
            workspaceRelSize;

        if (!this.isResizing) {
            return;
        }
        this.pauseEvent(e);

        offsetPanel = container.getBoundingClientRect().right - e.clientX;
        workspacePanel.style.width = `${offsetPanel}px`;

        //We need to trigger the resize of the kano-ui-workspace and the blockly workspace
        window.dispatchEvent(new Event('resize'));
    },
    _runningChanged () {
        this.notifyChange('running', {
            value: this.running
        });
        if (!this.running) {
            this._enableDrag();
        } else {
            // Disable drag when starts
            this._disableDrag();
            this.set('editableLayout', false);
        }
    },
    _onLockdownClicked () {
        this.fire('lockdown-clicked');
    },
    getBlockly () {
        return this.$['root-view'].getBlockly();
    },
    getBlocklyWorkspace () {
        return this.$['root-view'].getBlocklyWorkspace();
    },
    getWorkspace () {
        return this.$.workspace;
    },
    resetAppState () {
        this.running = false;

        setTimeout(() => {
            this.running = true;
        }, 0);

        this.fire('tracking-event', {
            name: 'app_restarted'
        });
    },
    _openOfflineDialog () {
        this.$['dialog-offline'].open();
    },
    isModeSimple (mode) {
        return mode.id === "simple";
    },
    _workspaceTabChanged (current, previous) {
        if (current && previous) {
            this.fire('tracking-event', {
                name: 'workspace_view_changed',
                data: {
                    view: current
                }
            });
        }
    }
});
