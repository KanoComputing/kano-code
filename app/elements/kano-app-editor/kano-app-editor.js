class KanoAppEditor {

    get behaviors () {
        return [KanoBehaviors.AppEditorBehavior];
    }

    beforeRegister () {
        this.is = 'kano-app-editor';
        this.properties = {
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
            selected: {
                type: Object,
                observer: 'selectedChanged',
                value: null
            },
            running: {
                type: Boolean,
                value: false,
                notify: true
            },
            leftPanelView: {
                type: String,
                value: 'code'
            },
            selectedTrigger: {
                type: Object
            },
            leftViewOpened: {
                type: Boolean,
                value: true,
                observer: 'leftViewOpenedChanged'
            },
            background: {
                type: Object
            },
            defaultCategories: {
                type: Array
            },
            wsSize: {
                type: Object
            }
        };
        this.observers = [
            'addedPartsChanged(addedParts.*)',
            'selectedPartChanged(selected.*)'
        ];
        this.listeners = {
            'left-panel.iron-select': 'pageEntered',
            'left-panel.iron-deselect': 'pageLeft'
        };
    }
    selectedPartChanged (e) {
        let property = e.path.split('.');
        property.shift();
        property = property.join('.');
        this.notifyChange('selected-part-change', {
            property,
            value: e.value
        });
    }
    addedPartsChanged () {
        this.fire('change');
    }
    pageEntered (e) {
        let name = e.detail.item.getAttribute('name');
        // Trigger a resize on blockly when we get back to the
        // code editor page
        if (name === 'code') {
            this.$['block-editor'].showCodeEditor();
        } else if (name === 'parts') {
            this.fire('change', { type: 'open-parts' });
        }
    }
    pageLeft (e) {
        if (e.detail.item.getAttribute('name') === 'code') {
            this.$['block-editor'].hideCodeEditor();
        }
    }
    selectedChanged (newValue) {
        if (newValue) {
            if (!this.leftViewOpened) {
                this.toggleLeftView();
            }
            this.set('leftPanelView', 'code');
        }
    }
    previous () {
        this.set('leftViewOpened', false);
    }
    leftViewOpenedChanged () {
        this.triggerResize();
    }
    isPartsOpened () {
        return this.leftViewOpened && this.leftPanelView === 'parts';
    }
    removePart (e) {
        let model = e.detail,
            parts = this.addedParts;
        for (let i = 0, len = parts.length; i < len; i++) {
            if (parts[i].id === model.id) {
                this.splice('addedParts', i, 1);
                if (model.partType === 'module') {
                    this.push('parts', model);
                }
                if (!this.addedParts.length) {
                    this.set('leftPanelView', 'parts');
                }
                return;
            }
        }
    }
    /**
     * Opens the sharing modal and share the app
     */
    share () {
        let modal = this.$['share-modal'];
        modal.open();
    }
    confirmShare (e) {
        this.fire('share', e.detail);
        this.dismissShare();
    }
    dismissShare () {
        let modal = this.$['share-modal'];
        modal.close();
    }
    /**
     * Save the current work in the local storage
     * TODO trigger that every 5sec or so if there is any changes
     */
    save (snapshot=false) {
        let savedParts = this.addedParts.reduce((acc, part) => {
            let savedPart = {};
            savedPart.model = part.toJSON();
            savedPart.codes = part.codes;
            acc.push(savedPart);
            return acc;
        }, []),
            savedApp = {};
        savedApp.parts = savedParts;
        savedApp.background = this.background;
        if (snapshot) {
            savedApp.snapshot = true;
            savedApp.selectedPart = this.addedParts.indexOf(this.selected);
            savedApp.blockEditorPage = this.$['block-editor'].selectedPage;
            savedApp.selectedTrigger = this.$['block-editor'].trigger;
        }

        return savedApp;
    }
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
                if (parts[i].type === savedPart.model.type) {
                    savedPart.model = Object.assign({}, parts[i], savedPart.model);
                    break;
                }
            }
            part = new UI(savedPart.model, this.wsSize);
            part.codes = savedPart.codes;
            return part;
        });
        this.set('addedParts', addedParts);
        this.set('background', savedApp.background);
        if (savedApp.snapshot) {
            this.$['workspace-controls'].selectPart(addedParts[savedApp.selectedPart]);
            this.$['block-editor'].set('trigger', savedApp.selectedTrigger);
            this.$['block-editor'].showPage(savedApp.blockEditorPage);
        }
    }
    toggleParts () {
        // Either just toggle the showed view or display/hide the whole
        // leftView
        if (!this.leftViewOpened) {
            this.toggleLeftView();
            this.set('leftPanelView', 'parts');
            return;
        }
        this.set('leftPanelView', this.leftPanelView === 'parts' ? 'code' : 'parts');
    }
    toggleLeftView () {
        if (this.running) {
            return;
        }
        this.set('leftViewOpened', !this.leftViewOpened);
        // If we just opened the leftView, show the parts page
        if (this.leftViewOpened) {
            this.set('selectedPage', 'parts');
            this.$['block-editor'].showCodeEditor();
        } else {
            this.$['block-editor'].hideCodeEditor();
        }
    }
    closeUiDrawer () {
        this.$['ui-drawer'].opened = false;
    }
    triggerResize () {
        window.dispatchEvent(new Event('resize'));
    }
    attached () {
        this.$.workspace.size = this.wsSize;
        this.set('background', new UI({
            name: 'My App',
            customizable: {
                style: ['background']
            }
        }, this.wsSize))
        setTimeout(() => {
            this.triggerResize();
        }, 200);
        interact(this.$['right-panel']).dropzone({
            // TODO rename to kano-part-item
            accept: 'kano-ui-item',
            ondrop: (e) => {
                let model = e.relatedTarget.model,
                    part;
                model.position = null;
                part = new UI(model, this.wsSize);
                this.push('addedParts', part);
                this.fire('change', {
                    type: 'add-part',
                    part
                });
            }
        });
        this.$.workspace.addEventListener('viewport-resize', this.updateWorkspaceRect.bind(this));
    }
    detached () {
        UI.clear();
    }
    updateWorkspaceRect (e) {
        this.set('workspaceRect', e.detail);
    }
    /**
     * Add draggable properties to the added element in the workspace
     * @param  {Event} e
     */
    workspaceUiReady (e) {
        let element = e.detail;
        interact(element).draggable({
            onmove: this.getDragMoveListener(true),
            onend: (e) => {
                let model = e.target.model;
                this.fire('change', {
                    type: 'move-part',
                    part: model
                });
            },
            restrict: {
                restriction: this.$.workspace.getViewport(),
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            }
        });
        this.set('leftPanelView', 'code');
    }
    getDragMoveListener (scale=false) {
        return (event) => {
            let target = event.target,
                pos = target.model.position,
                delta = {
                    x: event.dx,
                    y: event.dy
                };

            // Do not move when running
            if (this.running) {
                return;
            }

            if (scale) {
                delta = this.scaleToWorkspace(delta);
            }

            pos.x += delta.x;
            pos.y += delta.y;

            target.set('model.position.x', pos.x);
            target.set('model.position.y', pos.y);
        };
    }
    scaleToWorkspace (point) {
        let rect = this.workspaceRect,
            fullSize = this.wsSize;

        return {
            x: point.x / rect.width * fullSize.width,
            y: point.y / rect.height * fullSize.height
        };
    }
    sidebarUiReady (e) {
        let clone;
        interact(e.detail).draggable({
            onmove: (event) => {
                var target = event.target,
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
    }
    /**
     * Toggle the running state of the current app
     */
    toggleRunning () {
        this.running = !this.running;
        if (this.running) {
            this.set('leftViewOpened', false);
            this.$['block-editor'].hideCodeEditor();
        } else {
            this.set('leftViewOpened', true);
            this.$['block-editor'].showCodeEditor();
        }
        this.notifyChange('running', {
            value: this.running
        });
    }
}
Polymer(KanoAppEditor);
