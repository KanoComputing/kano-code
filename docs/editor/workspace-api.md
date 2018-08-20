# Workspace API

While integrating Kano Code, the coding experience can be customised through the Workspace API.
It defines:
 - What tools are provided on the right hand side of the screen
 - What API will be given to the user for their coding
 - What plugins should be loaded

## What tools are provided on the right hand side of the screen

The Right hand side of the screen in Kano Code is reserved for coding tools and can be defined using a `WorkspaceViewProvider`:

```js
// Object syntax
const CustomWorkspaceViewProvider = {
    root: document.createElement('div'),
    outputViewRoot: this.root,
}

// class syntax
class MyWorkspaceProvider extends WorkspaceProvider {
    constructor(editor) {
        super(editor);
        this._root = document.createElement('div');
        this._root.innerHTML = `
            <div id="output"></div>
            <div id="tools">This is my custom workspace</div>
        `;
        this._outputRoot = this.root.querySelector('#output');
    }
    get root() {
        return this._root;
    }
    get outputViewRoot() {
        return this.output;
    }
}

```

The Dom node you provide with `root` will be used to display your tools on the right hand side. The output view will be added to the `outputViewRoot`.

## What API will be given to the user for their coding

The `Toolbox` describes the API users will have access to during their coding experience. This is used by the sourceEditor to generate blocks or a typescript definition for IntelliSense.

The entries provided to the toolbox must be MetaAPI module definitions.

```js
const DrawToolbox = {
    type: 'module',
    name: 'draw',
};

```

## What plugins should be loaded

An EditorPlugin customises the Coding experience through the editor API.

```js

class MyPlugin extends code.Plugin {
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {}
    onImport() {}
    onCreationImport() {}
    onExport(data) {
        return data;
    }
    onCreationExport(data) {
        return data;
    }
}

```

## EditorProfile

The WorkspaceViewProvider, Toolbox, Plugins and the OutputProfile can be given all together to the editor using an EditorProfile.

```js

// Object syntax:
const CustomEditorProfile = {
    plugins: [new MyPlugin()],
    toolbox: [Module],
    workspaceViewProvider: new MyWorkspaceViewProvider(),
    outputProfile: new CustomOutputProfile(),
}

// class syntax extending the parent EditorProfile
class MyOutputProfile extends code.EditorProfile {
    get plugins() {
        return [new MyPlugin()];
    }
    get modules() {
        return [Module];
    }
    get workspaceViewProvider() {
        return new MyWorkspaceViewProvider();
    }
    get outputProfile() {
        return new CustomOutputProfile();
    }
}

```
