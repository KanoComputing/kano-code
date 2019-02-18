# Activity Bar

A space on the left of the editor is reserved for the activity bar. THe bar contains a set of button in a column with an icon and a title displayed on hover. Some special activity bar buttons can display a tooltip with more content.

This guide will show you how to add entries to the activity bar.

## API

There are two methods available under `editor.activityBar`. They both create an entry and return a handle to that entry.

```js
const entry = editor.activityBar.registerEntry({
    // Icon size. Either DEFAULT or BIG
    size: editor.activityBar.size.DEFAULT,
    // Title displayed on hover and for accessibility
    title: 'Custom Button',
    // An entry can be disabled
    disabled: false,
    // This will apply a different style and display the icon as more important
    important: false,
    // Displayed icon. Idealy SVG
    icon: '/examples/activity-bar/icon.svg',
});

const entry = editor.activityBar.registerTooltipEntry({
    size: editor.activityBar.size.DEFAULT,
    title: 'Custom Button',
    disabled: false,
    important: false,
    icon: '/examples/activity-bar/icon.svg',
    // DomNode to be added to the tooltip
    root: document.createElement('button'),
    // An offset applied to the tooltip
    offset: 20,
});
```

For this example we will add a simple entry with an icon and print a message when clicked

```js
const entry = editor.activityBar.registerEntry({
    title: 'Custom Button',
    icon: '/examples/activity-bar/icon.png',
});

// On mouse click, tap, keyboard selection, etc...
entry.onDidActivate(() => {
    console.log('Clicked!');
});
```

Refresh the page and observe the devTools console tab when clicking.

An entry can be enabled/disabled at runtime:

```js
entry.disable();
entry.enable();
```

When the entry is not necessary anymore, it can be disposed of

```js
entry.dispose();
```


As a combination of the previous chapter, we will create an activity bar entry that when clicked, displays the type of all blocks in the workspace:


```js
let widgets = [];

function createWidget(block) {
    return {
        domNode: null,
        getDomNode() {
            if (!this.domNode) {
                this.domNode = document.createElement('div');
                this.domNode.textContent = block.type;
            }
            return this.domNode;
        },
        getPosition() {
            return `block#${block.id}`;
        },
    }
}

const entry = editor.activityBar.registerEntry({
    title: 'Display types',
    icon: '/examples/activity-bar/icon.png',
});

// On mouse click, tap, keyboard selection, etc...
entry.onDidActivate(() => {
    const workspace = editor.sourceEditor.getWorkspace();
    const blocks = workspace.getAllBlocks();
    widgets = blocks.map(block => createWidget(block));
    widgets.forEach(w => editor.addContentWidget(w));
});
```