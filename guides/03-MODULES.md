# Implementing an API Module

In the previous chapters, we saw how to import and create a new API definition. The editor can use this to create blocks or intellisense hints.
But the modules defined do not have any implementation yet. In this guide we will see how to implement such a module.

Let's start with the default APIs. Drag a random color block in the workspace and check the console in the devTools. You should see an error stating `color is not defined`.

These modules must be independeant from the editor as they can be used in standalone creations. When exported, these modules MUST work with no dependency on any editor code.

To handle these cases, we can create an `OutputProfile`. This will define the modules, the output rendering and plugins that can be loaded without an editor context.

Start by creating a new `OutputProfile`:

```js
class OutputProfile extends code.OutputProfile {}
```

Then let your EditorProfile know that you want it to run alongside your OutputProfile.

```js
class EditorProfile extends code.EditorProfile {
    get toolbox() {
        return Object.values(APIs).concat([Shapes]);
    }
    get outputProfile() {
        return new OutputProfile();
    }
}
```
This creates a one way dependency. The editor needs the output to work properly, but the output does not need the editor to render a creation.

Start with importing the Modules at the top of your file:

```js
import * as Modules from '../../modules.js';
```
