/* globals Polymer, Kano, interact, Part */

function getDefaultBackground() {
    return {
        name: 'My app',
        userStyle: {
            background: '#F5F5F5'
        }
    };
}

Polymer({
    is: 'kano-app-editor',
    behaviors: [Kano.Behaviors.AppEditorBehavior],
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
        selected: {
            type: Object,
            value: null,
            observer: 'selectedChanged'
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
            value: getDefaultBackground()
        },
        defaultCategories: {
            type: Object
        },
        isResizing: {
            type: Boolean,
            value: false
        },
        partsPanelState: {
            type: String,
            observer: '_partsPanelStateChanged'
        },
        selectedParts: {
            type: Array
        },
        showShareButton: {
            type: Boolean,
            value: false
        },
        drawerPage: {
            type: String,
            value: 'sidebar'
        },
        drawerWidth: {
            type: String,
            value: '80%'
        },
        title: {
            type: String
        },
        mode: {
            type: Object
        }
    },
    observers: [
        'addedPartsChanged(addedParts.*)',
        'selectedPartChanged(selected.*)',
        'backgroundChanged(background.*)',
        'updateColors(addedParts.splices)',
        'updateColors(defaultCategories.*)',
        '_codeChanged(code.*)'
    ],
    _partsPanelStateChanged (state) {
        if (this.editableLayout && state === 'main') {
            this.$.workspace.toggleEditableLayout();
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
        this.toggleRunning(false);
        this.toggleRunning(true);
        this.prevCode = this.code.snapshot.javascript;
    },
    _proxyChange (e) {
        // Bug on chrome 49 on the kit, the event from kano-blockly stops here
        e.preventDefault();
        e.stopPropagation();
        this.fire('change', e.detail);
    },
    deletePartClicked () {
        if (this.checkBlockDependency(this.selected)) {
            return this.$['external-use-warning'].open();
        } else {
            this.$['confirm-delete'].open();
        }
    },
    modalClosed (e) {
        if (e.detail.confirmed) {
            this._deletePart(this.selected);
        }
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
    toggleMenu () {
        this.fire('toggle-menu');
    },
    setColorRange (hs, range, items = []) {
        // Set the increment value, which will decide how much to change the lightness between all colors
        let increment = range / (items.length + 1);
        // Grab the HS values from the color map
        items.forEach((item, i) => {
            // Calculate the lightness
            let L = (50 - (range / 2)) + (increment * (i + 1)); // unary + is to coerce String j into number
            // Set the color
            item.colour = `hsl(${hs[0]}, ${hs[1]}%, ${L}%)`;
        });
    },
    updateColors () {
        if (!this.defaultCategories) {
            return;
        }
        this.debounce('updateColors', () => {
            this._updateColors();
        }, 10);
    },
    _updateColors () {
        let range = 33.33,
            colorMapHS = {
                system: [206, 100],
                ui: [89, 52],
                hardware: [289, 32],
                data: [1, 61]
            },
            grouped = this.addedParts.reduce((acc, part) => {
                acc[part.partType] = acc[part.partType] || [];
                acc[part.partType].push(part);
                return acc;
            }, {});

        grouped.ui = grouped.ui || [];

        Object.keys(grouped).forEach((partType) => {
            let parts = grouped[partType];
            this.setColorRange(colorMapHS[partType], range, parts);
        });
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
    addedPartsChanged () {
        this.fire('change');
    },
    computeBackground () {
        let style = this.background.userStyle;
        return Object.keys(style).reduce((acc, property) => {
            acc += `${property}:${style[property]};`;
            return acc;
        }, '');
    },
    previous () {
        if (this.leftPanelView === 'background') {
            this.set('leftViewOpened', false);
        } else {
            this.set('leftPanelView', 'background');
        }
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
        this.fire('share', {
            app: this.save(false, false),
            workspaceInfo: JSON.stringify(this.save()),
            background: this.background.userStyle.background,
            mode: this.mode,
            code: this.code,
            parts: this.addedParts
        });
    },
    generateCover () {
        return this.$.workspace.generateCover();
    },
    /**
     * Load the saved work from the local storage
     */
    load (savedApp, parts) {
        let addedParts,
            part;
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
        // Force a color update and a register block to make sure the loaded code will be
        // rendered with the right colors
        this._updateColors();
        this.$['root-view'].computeBlocks();
        this.set('code', savedApp.code);
        this.set('background', savedApp.background);
    },
    _formatCode (code) {
        code = code || {};
        code.snapshot = code.snapshot || {};
        return code;
    },
    reset () {
        this.set('addedParts', []);
        this.set('code', this._formatCode({}));
        this.set('background', getDefaultBackground());
        this.save();

        this.$.workspace.reset();
    },
    closeDrawer () {
        this.$.partsPanel.closeDrawer();
    },
    selectedChanged (newValue) {
        // The selection is cleared
        if (!newValue) {
            this.drawerPage = 'background-editor';
        }
    },
    panelStateChanged () {
        let isClosing = this.partsPanelState !== 'drawer',
            eventName,
            eventData;
        if (this.drawerPage === 'sidebar') {
            eventName = isClosing ? 'close-parts' : 'open-parts';
        } else if (this.drawerPage === 'part-editor') {
            if (!isClosing) {
                eventData = { part: this.selected };
            }
            eventName = isClosing ? 'close-part-settings' : 'open-part-settings';
        } else if (this.drawerPage === 'background-editor') {
            eventName = isClosing ? 'close-background-settings' : 'open-background-settings';
        }
        this.debounce('notifyPanelState', () => {
            this.notifyChange(eventName, eventData);
        }, 10);
    },
    toggleParts () {
        if (this.drawerPage === 'sidebar' && this.partsPanelState === 'drawer') {
            this.$.partsPanel.closeDrawer();
        } else {
            this.drawerPage = 'sidebar';
            this.drawerWidth = '80%';
            this._openDrawer();
        }
    },
    _openDrawer () {
        // HACK. Removes the will-change transform from the drawer inside the paper-drawer-panel shadow dom because
        // it creates a new stacking context and prevent children using position: fixed to refer to the viewport
        let drawer = Polymer.dom(this.$.partsPanel.root).querySelector('#drawer');
        this.$.partsPanel.openDrawer();
        drawer.style.willChange = 'initial';
    },
    onPartSettings () {
        // No part selected, show the background editor
        if (!this.selected) {
            if (this.partsPanelState === 'drawer' && this.drawerPage === 'background-editor') {
                this.$.partsPanel.closeDrawer();
            } else {
                this.drawerPage = 'background-editor';
                this.drawerWidth = '60%';
                this._openDrawer();
            }
        } else {
            this.drawerPage = 'part-editor';
            this.drawerWidth = '60%';
            this._openDrawer();
            this.notifyChange('open-part-settings', { part: this.selected });
        }
    },
    closeSettings () {
        if (this.drawerPage === 'background-editor' || this.drawerPage === 'part-editor') {
            this.$.partsPanel.closeDrawer();
        }
    },
    _deletePart (part) {
        let index = this.addedParts.indexOf(part);
        part.blockIds.forEach(id => {
            Kano.MakeApps.Blockly.removeLookupString(id);
        });
        this.splice('addedParts', index, 1);
        this.$.workspace.clearSelection();
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
        let sidebar = this.$.drawer;
        this.updateWorkspaceRect = this.updateWorkspaceRect.bind(this);
        this.panelStateChanged = this.panelStateChanged.bind(this);

        this.$.workspace.addEventListener('viewport-resize', this.updateWorkspaceRect);
        if (sidebar.classList.contains('animatable')) {
            sidebar.addEventListener('transitionend', this.panelStateChanged);
        } else {
            this.$.partsPanel.addEventListener('selected-changed', this.panelStateChanged);
        }
    },
    detachEvents () {
        let sidebar = this.$.drawer;
        this.$.workspace.removeEventListener('viewport-resize', this.updateWorkspaceRect);
        if (sidebar.classList.contains('animatable')) {
            sidebar.removeEventListener('transitionend', this.panelStateChanged);
        } else {
            this.$.partsPanel.removeEventListener('selected-changed', this.panelStateChanged);
        }
    },
    ready () {
        this.makeButtonIconPaths = {
            stopped: 'M 4,18 10.5,14 10.5,6 4,2 z M 10.5,14 17,10 17,10 10.5,6 z',
            running: 'M 2,18 6,18 6,2 2,2 z M 11,18 15,18 15,2 11,2 z'
        };
        this.reset = this.reset.bind(this);
        this._exportApp = this._exportApp.bind(this);
        this._importApp = this._importApp.bind(this);
    },
    attached () {
        this.target = document.body;
        this.title = this.title ? "My " + this.title.toLowerCase() : "Kano Code";

        this.partEditorOpened = false;
        this.backgroundEditorOpened = false;

        interact(this.$['left-panel']).dropzone({
            // TODO rename to kano-part-item
            accept: 'kano-ui-item:not([instance])',
            ondrop: (e) => {
                let model = e.relatedTarget.model,
                    part,
                    viewport = this.$.workspace.getViewport(),
                    viewportRect = viewport.getBoundingClientRect(),
                    viewportScale = this.$.workspace.getViewportScale(),
                    targetRect = e.relatedTarget.getBoundingClientRect();
                model.position = {
                    x: (targetRect.left - viewportRect.left) / viewportScale.x,
                    y: (targetRect.top - viewportRect.top) / viewportScale.y
                };
                part = Kano.MakeApps.Parts.create(model, this.mode.workspace.viewport);
                this.push('addedParts', part);
                this.fire('change', {
                    type: 'add-part',
                    part
                });
            }
        });
        this.bindEvents();

        if (!window.navigator.userAgent.match("Electron")) {
            window.onbeforeunload = () => {
                return 'Any unsaved changes to your app will be lost. Continue?';
            }
        }
    },
    detached () {
        Kano.MakeApps.Parts.clear();
        this.detachEvents();

        window.onbeforeunload = null;
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
        this.toggleRunning();
    },
    /**
     * Toggle the running state of the current app
     */
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
            restrictEl = draggable.model.restrict === 'workspace' ? this.$.workspace.getViewport().getRestrictElement() : this.$['left-panel'];
            interact(draggable).draggable({
                onmove: this.getDragMoveListener(true),
                onend: (e) => {
                    let model = e.target.model;
                    this.fire('change', {
                        type: 'move-part',
                        part: model
                    });
                },
                restrict: {
                    restriction: restrictEl
                }
            });
        });
    },
    trapEvent (e) {
        e.preventDefault();
        e.stopPropagation();
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

    applyElevateClass () {
        return this.running ? 'elevate' : '';
    },

    applyHiddenClass () {
        return this.running ? '' : 'hidden';
    },
    _getRunningStatus (running) {
        return running ? 'running' : 'stopped';
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
        let leftPanel = this.$['left-panel'],
            container = this.$.section,
            offsetLeftPanel;

        if (!this.isResizing) {
            return;
        }
        this.pauseEvent(e);

        offsetLeftPanel = e.clientX - container.getBoundingClientRect().left;
        offsetLeftPanel = offsetLeftPanel;
        leftPanel.style.width = `${offsetLeftPanel}px`;

        //We need to trigger the resize of the kano-ui-workspace and the blockly workspace
        window.dispatchEvent(new Event('resize'));
    },
    _runningChanged () {
        this.notifyChange('running', {
            value: this.running
        });
        // Removes the elevate class only after the animation
        if (!this.running) {
            this._enableDrag();
        } else {
            // Disable drag when starts
            this._disableDrag();
            this.set('editableLayout', false);
            this.closeDrawer();
        }
    },
    getBlocklyWorkspace () {
        return this.$['root-view'].getBlocklyWorkspace();
    },
    partsMenuLabel () {
        return this.partsPanelState === 'drawer' && this.drawerPage === 'sidebar' ? 'close' : 'add part';
    },
    applyOpenClass () {
        return this.partsPanelState === 'drawer' && this.drawerPage === 'sidebar' ? 'open' : '';
    },
    getWorkspace () {
        return this.$.workspace;
    }
});
