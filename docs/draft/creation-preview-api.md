# [DRAFT] Creation Preview API

For each creation, a preview can be generated from the editor. A preview can be a still image, a gif or left for the EditorProfile to decide.

Early draft pseudo-code:

```js

class CreationPreviewProvider extends code.CreationPreviewProvider {
    get type() {
        return 'image';
    }
    get size() {
        return {
            width: 500,
            height: 500,
        };
    }
    render(ctx) {
        ctx.fillRect(0, 0, this.size.width, this.size.height);
    }
}

```