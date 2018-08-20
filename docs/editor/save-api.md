# Save API

Describes how the source and output can be serialized to be exported then imported


Upon export, the editor will run the `onExport` lifecycle method of plugins.
For convenience, the methods will also be read from the OutputViewProvider.

```js

// Manage import/exports through a plugin
class MyPlugin extends code.Plugin {
    onExport(data) {
        data.custom = 45;
        return data;
    }
    onImport(data) {
        // Reload added data
        console.log(data.custom);
    }
}

// Manage import/exports using the OutputViewProvider
class CustomOutputViewProvider extends code.OutputViewProvider {
    onExport(data) {
        data.custom = 37;
        return data;
    }
    onImport(data) {
        // Reload added data
        console.log(data.custom);
    }
}

```
