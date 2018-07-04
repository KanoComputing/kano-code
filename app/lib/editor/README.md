# Editor

![alt text](../../../docs/views.png "Kano Code")

## Toolbox

The editor will have a `toolbox` property. This property allows you to define the toolbox for the source code editor.
You can define the entries of the toolbox through `setEntries`:

```js
const editor = new Editor();

editor.toolbox.setEntries([MathToolbox, ColorToolbox]);
```

The entries provided to the toolbox must be MetaAPI module definitions.

### API

 - `addEntry(entry, position)`:
    Adds an entry to the toolbox at the provided index or at the end. Will return a disposable object.
```js
// Add the entry
const entry = toolbox.addEntry({ type: 'module', name: 'my-entry' });

// Dispose of the entry
entry.dispose();
```
 - `removeEntry(entry)`:
    Remove an entry
```js
const mod = { type: 'module', name: 'my-entry' };
// Add the entry
toolbox.addEntry(mod);

// Remove the entry
toolbox.removeEntry(mod);

```

## Runner

The editor will expose a `runner` property. This is the module taking care of watching the changes from the editor
and running the generated code. It will run it in a VM-ish with the exposed API that you want.

```js
import { Editor, AppModule } from '@kano/code/index.js';

// Create a custom module with one method `doTheThing`
// In the Runner VM, the method can be called using
// `myModule.doTheThing`
class CustomModule extends AppModule {
    static get name() { return 'myModule'; }
    constructor(...args) {
        super(...args);

        this.addMethod('doTheThing', 'doThing');
        this.addLifecycleStep('start', 'onStart');
        this.addLifecycleStep('stop', 'onStop');
    }
    onStart() {
        // Called each time the user code starts
    }
    onStop() {
        // Called each time the user code stops
    }
    doThing() {}
}

const editor = new Editor();

editor.runner.addModule(CustomModule);
```

The modules provided to the runner must extend the AppModule class.

You can omit the name static property on your module and the runner will not add your module to the VM.
It will though call the lifecycle steps.

## WorkspaceView and OutputView

A WorkspaceView is is the space on the right. You can provide anything there.
A WorkspaceProvider must have an `outputView`

An OutputView is where the output of the source code running will be displayed.
This can also be non visible if you want a non graphics based output.


The default WorkspaceView and OutputView will provide a canvas and an empty toolbox

```js
import { WorkspaceViewProvider, OutputViewProvider, Editor } from '@kano/code/index.js';

// Create a custom OutputViewProvider
// Implement the lifecycle methods
class MyOutputProvider extends OutputViewProvider {
    constructor(editor) {
        super(editor);
        this.root = document.createElement('canvas');
    }
    start() {
        // Clear the canvas
    }
    stop() {
        // Stop rendering loops
    }
    renderOnCanvas(ctx) {
        // Render the current view on a canvas to create a cover image
    }
}

// Create a custom WorkspaceViewProvider
// Set its outputView to the custom OutputView
// Add custom tools
class MyWorkspaceProvider extends WorkspaceProvider {
    constructor(editor) {
        super(editor);
        this.root = document.createElement('div');
        this.root.innerHTML = `
            <div id="output"></div>
            <div id="tools">This is my custom workspace</div>
        `;
        this.outputRoot = this.root.querySelector('#output');
        this.output = new MyOutputProvider(editor);
        this.outputRoot.appendChild(this.output.root);
    }
    get outputView() {
        return this.output;
    }
}

const editor = new Editor();

const myWorkspace = new MyWorkspaceProvider(editor);

// Register the WorkspaceView
editor.registerWorkspaceProvider(myWorkspace);

```

## Dialogs

The Editor allows you to register your custom alert/confirm/dialogs.
Each dialog will have `fitInto` and `overlayInto` property, accepting a DOM element on top of which you want the dialog to fit

### Alert

Used to display a simple information on screen, No interaction or choice is required from the user
except that they closes this dialog.

![alt text](../../../docs/dialogs/alert.png "Alert")

```js
const alert = editor.registerAlert({
    heading: 'My heading',
    text: 'My text',
    buttonLabel: 'Got it',
});

alert.open(); // Opens the alert
alert.close();
alert.on('close', () => {
    alert.dispose();
});
```

### Confirm

Used to ask the user a yes/no question. The dialog displays custom text, a confirm and a dismiss
action.

![alt text](../../../docs/dialogs/confirm.png "Confirm")
```js
const alert = editor.registerConfirm({
    heading: 'My heading',
    text: 'My text',
    confirmLabel: 'Yes',
    dismissLabel: 'No',
});

alert.open(); // Opens the alert
alert.close();
// These two will be called before `onClose`
alert.on('confirm', () => {});
alert.on('dismiss', () => {});
alert.on('close', () => {});
alert.dispose();
```

### Dialogs

Used to display custom content in a dialog. The inside of the dialog is for you to fill

```js
import * as code from '@kano/code/app/lib/index.js';

class MyDialogProvider extends code.DialogProvider {
    createDom() {
        const root = document.createElement('div');
        root.innerHTML = `
            <h1>My dialog</h1>
            <p>My custom content</p>
        `;
        return root;
    }
}

const alert = editor.registerDialogProvider(new MyDialogProvider());

alert.open(); // Opens the alert
alert.close();
alert.on('close', () => {});
alert.dispose();
```

### KeyBindings

Used to register shortcuts in the editor.

```js

const altPBinding = editor.keybindings.register('alt+p', () => {});

altPBinding.dispose();

```