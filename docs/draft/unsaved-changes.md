# [DRAFT] Unsaved changes plugin

Editor plugin that records sourceEditor changes and save events.

  - Adds a listener on the sourceEditor
  - Can be flagged as `saved` ( Discard the recent changes )
  - Displays a dialog if the editor is about to leave without the changes being saved

```js
// Create the plugin. Options are the same as the Confirm Dialog would accept.
const unsavedChangesPlugin = new UnsavedChangesPlugin({
    heading: '',
    text: '',
    confirmButton: '',
    dismissButton: '',
});

editor.addPlugin(unsavedChangesPlugin);

// Let the plugin know that the changes were saved and that it is safe to leave
unsavedChangesPlugin.markAsSaved(true);

// When the user asks to leave even with unsaved changes or there were no unsaved changes.
unsavedChangesPlugin.on('leave', () => {});
// When the user decides to stay after being prompted that their changes would be lost
unsavedChangesPlugin.on('cancel', () => {});

// Trigger this when the user decides to leave. The plugin will notify whether your application should
// close the editor or not
unsavedChangesPlugin.leave();

```

## Still to decide

As Kano Code as of right now doesn't have a Save/Share API, this plugin cannot listen to these events
to mark itself as saved.

Depending on the integration of the editor, the meaning of `saved` can change a lot. I suggest we keep the `markAsSaved` method in the plugin
for the person integrating the editor to decide what this means.

If a strong definition of `saved` comes up later on, the method `markAsSaved` can be called on the save event of the editor