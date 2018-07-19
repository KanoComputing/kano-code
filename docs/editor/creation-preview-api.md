# Creation Preview API

For each creation, a preview can be generated from the editor. A preview can be a still image, a gif or left for the EditorProfile to decide.


```js
const = EditorProfile = {
    get creationPreviewProvider() {
        return new code.CreationImagePreviewProvider({
            width: 500,
            height: 500,
        });
    }
}
```

Animated preview (Will encode a GIF with rendered frames)

```js
const = EditorProfile = {
    get creationPreviewProvider() {
        new code.CreationAnimationPreviewProvider({ width: 500, height: 500 }, 10, 10);
    }
}
```

If generating an image or a animated gif is not enough to provide a preview for your custom output, you can render the preview yourself

Example generating an svg file:

```js
class MyCreationPreviewProvider extends code.CreationCustomPreviewProvider {
    createFile(output) {
        const myFile = new Blob(['<svg><rect></rect></svg>'], 'image/svg+xml');
        return myFile;
    }
    display(blob) {
        const root = document.createElement('img');
        root.src = URL.createObjectURL(blob);
        return root;
    }
}

EditorProfile = {
    get creationPreviewProvider() {
        return new MyCreationPreviewProvider();
    }
}

```
