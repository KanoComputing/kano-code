Defines a widget with content to display along side elements in the editor.

A widget defines a domNode for its contents and a selector for its position.

Example

```js
const customWidget = {
    domNode: null,
    getDomNode() {
        // Make sure it is created lazily. Never create if not needed
        if (!this.domNode) {
            this.domNode = document.createElement('button');
            this.domNode.textContent = 'Content Widget';
        }
        return this.domNode;
    },
    getPosition() {
        return 'block.app_onStart:100,0';
    },
};

editor.onDidInject(() => {
    editor.addContentWidget(customWidget);
});
```

Result

![Content widget example](media://content-widget.png)
