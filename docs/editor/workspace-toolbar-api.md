# WorkspaceToolbar API

When creating a workspace provider, you can inject a `kc-workspace-toolbar` element and export its location.
The editor will then link the toolbar to its runner. You will also be able to provide custom entries.

If the toolbar element is anywhere in the root of the workspace view, the editor will be able to find it.
If it is deeper in the tree behind a shadow root, you can use the `toolbar` property to provide it to the editor

Early draft code:

```js

class WP extends code.WorkspaceViewProvider {
    constructor() {
        super();
        this._root = document.createElement('div');
        this._root.innerHTML = `
            <div id="output"></div>
            <kc-workspace-toolbar></kc-workspace-toolbar>
        `;
        this._toolbar = this.root.querySelector('kc-workspace-toolbar');
    }
    get toolbar() {
        return this._toolbar;
    }
}

```

## Entries

You can add entries to the toolbar from the workspaceViewProvider. The API is safe to use, even if no toolbar is created, the API methods will exist.
This allows plugin to use the API and the editor will ensure that it doesn't break anything

```js

const debugEntry = workspaceToolbar.addEntry({
    id: 'debug',
    title: 'Debug mode',
    icon: './icons/debug.svg',
});

debugEntry.on('activate', () => {});

debugEntry.updateTitle('new title');
debugEntry.updateIcon('./icons/new.svg');

debugEntry.dispose();

```

## Settings entries

You can also customise the entries in the settings menu provded by the toolbar with a similar API

```js

const debugEntry = workspaceToolbar.addSettingsEntry({
    title: 'Debug mode',
    icon: './icons/debug.svg',
});

debugEntry.on('activate', () => {});

debugEntry.updateTitle('new title');
debugEntry.updateIcon('./icons/new.svg');

debugEntry.dispose();

```