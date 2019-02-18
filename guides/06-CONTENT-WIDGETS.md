# Content Widgets

Content Widgets are a way to personalise the editor by displaying widgets over the editor. A practical example being how challenges display banners and beacons in relevant positions with a cusotm timing.

In this guide we will see how to create, layout and destroy a custom content widget. The Content Widget API relies on the Query Selector engine. Make sure you checked out the previous chapter first.

## The widget's definition

A widget must define two things: its DomNode and its position.

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
        return 'block.app_onStart';
    },
};
```

This is the most basic widget you can define. As you can see it creates a button as DomNode and position itself on top of a `app_onStart` block.

You can display this widget using:

```js
editor.onDidInject(() => {
    editor.addContentWidget(contentWidget);
});
```

Make sure you add your content widgets after the editor was injected. You should now see a button on top of the default block.

We will now change its relative position by updating the selector. We want to position this widget on the top right of the block:

```js
const customWidget = {
    domNode: null,
    getDomNode() {
        if (!this.domNode) {
            this.domNode = document.createElement('button');
            this.domNode.textContent = 'Content Widget';
        }
        return this.domNode;
    },
    getPosition() {
        // Update alignment
        return 'block.app_onStart:100,0';
    },
};
```

Refresh and check the position of the widget this time. It should align to the right but doesn't. The reason being the widget doesn't follow the position of the block when the editor resizes. To fix this. we need to tell the editor to layout the widget again when something changes:

```js
editor.onDidInject(() => {
    // Listen to changes from the source editor, in this case it will be blocks moving
    editor.sourceEditor.onDidSourceChange(() => {
        // Call `layoutContentWidget` with the same widget
        editor.layoutContentWidget(contentWidget);
    });
    editor.addContentWidget(contentWidget);
});
```

Refresh and drag the block around. The widget now follows the block when moved.

 > If you want to prevent the widget from being interactive and catching mouse or touch events, use the CSS rule `pointer-events` and set it to `none`.

We will now add some styling and a listener to the widget. As it is a simple DOM element, complex interactions can be added.

```js
const contentWidget = {
    domNode: null,
    getDomNode() {
        if (!this.domNode) {
            this.domNode = document.createElement('button');
            this.domNode.textContent = 'Content Widget';
            this.domNode.style.background = '#212121';
            this.domNode.style.color = 'white';
            this.domNode.style.border = '1px solid #2196F3';
            this.domNode.style.padding = '2px 4px';
            this.domNode.style.fontFamily = 'Arial';
            this.domNode.style.fontSize = '14px';
            // Remove itself when clicked
            this.domNode.addEventListener('click', () => {
                editor.removeContentWidget(this);
            });
        }
        return this.domNode;
    },
    getPosition() {
        return 'block.app_onStart:100,0';
    },
};

editor.onDidInject(() => {
    editor.sourceEditor.onDidSourceChange(() => {
        editor.layoutContentWidget(contentWidget);
    });
    editor.addContentWidget(contentWidget);
});
```

You can now use content widgets to display hints, quick actions or UI elements in challenges.

A full example can be found under `examples/content-widget`
