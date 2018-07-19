# Creation Storage API

Provides a way to store creations from the user. After the user inputs a title and description, your
StorageProvider will be called to write the `creationBundle`

```js

class MyCreationStorageProvider extends code.CreationStorageProvider {
    write(creationBundle) {
        // Save the bundle here
        // You can return a Promise if storing will take some time
    }
}

class MyEditorProfile extends code.EditorProfile {
    get creationStorageProvider() {
        return new MyCreationStorageProvider();
    }
}

```