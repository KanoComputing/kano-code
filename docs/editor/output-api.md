# Output API

Kano Code provides a way to edit a source code and preview the output immediately (Coding experience) .
The created code and the output thet goes with it can then be exported to be used outside of an editor (Playing experience).

When creating your own Kano Code integration, you must specify the characteristics of that output:
 - What to render
 - What JavaScript APIs will be available in the VM
 - What plugins should be loaded

## What to render

The visual output on the right of the editor can be customised using an OutputViewProvider.

```js

// Object syntax
const CustomOutputViewProvider = {
    root: document.createElement('canvas'),
    start() {},
    stop() {},
    onExport(data) { return data; },
    onImport() {},
    onCreationExport(data) { return data; },
    onCreationImport() {},
};

// class syntax
class MyOutputViewProvider extends code.OutputViewProvider {
    constructor() {
        super();
        this._root = document.createElement('canvas');
    }
    get root() {
        return this._root;
    }
    start() {}
    stop() {}
    onExport(data) { return data; }
    onImport() {}
    onCreationExport(data) { return data; }
    onCreationImport() {}
}

```

The root property must be a DOM node. If your Kano Code integration does not require a visual output, you can just return an empty `div`.

## What JavaScript APIs will be available in the VM

Kano Code wraps the code written by a user in a VM, preventing the access to other APIs than the one provided. The Kano Code runner accepts module that will exposed symbols inside this VM.

```js
class CustomModule extends code.AppModule {
    static get name() { return 'draw'; }
    static get aliases() { return ['paint']; }
    constructor(...args) {
        super(...args);

        this.addMethod('square', '_square');
        this.addLifecycleStep('start', 'onStart');
        this.addLifecycleStep('stop', 'onStop');
    }
    onStart() {
        // Called each time the user code starts
    }
    onStop() {
        // Called each time the user code stops
    }
    getSymbols() {
        return ['square'];
    }
    doThing() {}
}

```

The `name` property will be exposed as a symbol to the VM. Aliases to that symbols can be defined using the `aliases` property.
More symbols can be exposed using the `getSymbol` method. The symbols exported there will point to the methods added to the module. In this example, the following symbols will be exposed inside the VM:

```js
// name
draw.square();
// aliases
paint.square();
// getSymbols
square();
```

## What plugins should be loaded

An output can be customised through Plugins. Each plugin will be installed and will received the instance of the output:

```js

class MyPlugin extends code.Plugin {
    onInstall(output) {
        this.output = output;
    }
    onExport(data) { return data; }
    onImport() {}
    onCreationExport(data) { return data; }
    onCreationImport() {}
}

```

The methods `onExport`, `onImport`, `onCreationExport` and `onCreationImport` will behave the same way as the one on the `OutputViewProvider`.

## OutputProfile

The OutputViewProvider, Runner Modules and Plugins can be given all together to an output using an OutputProfile.

```js

// Object syntax:
const CustomOutputProfile = {
    id: 'custom',
    plugins: [new MyPlugin()],
    modules: [MyModule],
    outputViewProvider: new MyOutputViewProvider(),
}

// class syntax extending the parent OutputProfile
class MyOutputProfile extends code.OutputProfile {
    get id() {
        return 'custom';
    }
    get plugins() {
        return [new MyPlugin()];
    }
    get modules() {
        return [MyModule];
    }
    get outputViewProvider() {
        return new MyOutputViewProvider();
    }
}

```

The class syntax, while being more verbose, ensures that your OutputProfile implements the expected interface.

You must provide an `id` with your OutputProfile. This id will be saved within any export and used by Kano Code to retrieve which OutputProfile should be used with which export.
