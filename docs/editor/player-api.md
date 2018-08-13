# Player API

You can use the Player to display the output of a creation outside of an Editor.

You will need to register your OutputProfile, then load your creation. This lets the Player create the outputView, runner modules and plugins

```js

code.Player.registerProfile(new MyCustomOutputProfile());

const player = new code.Player();

player.load(myShareData);

player.inject(document.body);

player.setRunning(true);
player.setRunning(false);
player.toggleRunning();

player.setFullscreen(true);
player.setFullscreen(false);
player.toggleFullscreen();

```

Example of a complete configuration:

```js
/**
 * Output plugin customises the output only, can't access the editor as it can be used in the player
 */
class MyOutputPlugin extends Plugin {
    onInstall(outputView) {
        this.outputView = outputView;
    }
    onImport(data) {
        this.outputView.scene = data.scene;
    }
}

/**
 * Editor plugin can access the editor and the outputView through the editor, but will not be
 * loaded in the player. This allows the customisation of the coding experience, as well
 * as the customisation of the output in the coding experience
 */
class MyEditorPlugin extends Plugin {
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {
        this.alert = this.editor.registerAlert({ heading: 'Hello', text: 'World', buttonLabel: 'Ok' });
        // Can access outputView through this.editor.outputView
    }
}

/**
 * An output profile defining an outputView, plugins and the runner modules for this output
 */
class MyOutputProfile {
    get plugins() {
        return [new MyOutputPlugin()];
    }
    get outputViewProvider() {
        return new MyOutputViewProvider();
    }
    get modules() {
        return [DrawModule, EventsModule];
    }
}

/**
 * An editor profile defining a workspace view, plugins and the default toolbox entries
 * It also contains an output profile for the output view
 * 
 */
class EditorProfile {
    get workspaceViewProvider() {
        return new MyWorkspaceViewProvider();
    }
    get outputProfile() {
        return new MyOutputProfile();
    }
    get toolbox() {
        return [DrawToolbox, EventsToolbox];
    }
    get plugins() {
        return [new MyEditorPlugin()];
    }
}

```