# Implementing an API Module

In the previous chapters, we saw how to import and create a new API definition. The editor can use this to create blocks or intellisense hints.
But the modules defined do not have any implementation yet. In this guide we will see how to implement such a module.

Drag you heart block in and check the devTools console. An error message will be displayed `shapes is not defined`. To fix that, we need to define the shapes module.

This modules must be independent from the editor as they can be used in standalone creations. When exported, these modules MUST work with no dependency on any editor code.

To handle these cases, we can create an `OutputProfile`. This will define the modules, the output rendering and plugins that can be loaded without an editor context.

Start by creating a new `OutputProfile`:

```js
class OutputProfile extends code.OutputProfile {
    onInstall(output) {
        super.onInstall(output);
        // Add the modules to this.modules
    }
}
```

Then let your EditorProfile know that you want it to run alongside your OutputProfile. There are 2 ways to do this, first you could just push your Shapes module into your toolbox array.

```js
class EditorProfile extends code.DefaultEditorProfile {
    onInstall(editor) {
        super.onInstall(editor);
        this.toolbox.push(Shapes);
        this.outputProfile = new OutputProfile();
    }
}
```
Secondly, you can specify an order for your toolbox. This is done by importing your APIs and then creating a new toolbox array listing the order that your modules should be displayed. This also allows you to filter out modules you do not want in your editor.
```js
import * as APIs from '../path/to/app/lib/modules/api.js';

class EditorProfile extends code.DefaultEditorProfile {
    onInstall(editor) {
        super.onInstall(editor);
        this.toolbox = [
            APIs.AppAPI,
            APIs.ControlAPI,
            APIs.LogicAPI,
            Shapes,
            APIs.MathAPI,
            APIs.VariablesAPI,
            APIs.ColorAPI,
            APIs.ListsAPI,
            APIs.DrawAPI,
            APIs.StampAPI,
        ];
        this.outputProfile = new OutputProfile();
    }
}
```
This creates a one way dependency. The editor needs the output to work properly, but the output does not need the editor to render a creation.

Now let's create the shapes module:

```js
// Extends the default module
class ShapesModule extends code.AppModule {
    // The id must match the name from the API definition
    static get id() {
        return 'shapes';
    }
    constructor(output) {
        super(output);

        // Add a method to the API
        this.addMethod('heart', (color) => {
            console.log(color);
        });
    }
}
```

Add this new module to the list in the `OutputProfile`:

```js
class OutputProfile extends code.OutputProfile {
    onInstall(output) {
        super.onInstall(output);
        this.modules.push(ShapesModule);
    }
}
```

Refresh, drag a heart block in and the console should now print the default hex color. From there it's up to you to decide what this block will do. In this case, we'll grab the canvas and print a heart.

```js
class ShapesModule extends code.AppModule {
    static get id() {
        return 'shapes';
    }
    constructor(output) {
        super(output);
        // Grab the canvas from the output
        // The output exposes 3 APIs: visuals, to render on a canvas,
        // audio using the WebAudio API and dom, allowing a more advanced
        // configuration.
        const { canvas } = output.visuals;
        const ctx = canvas.getContext('2d');

        this.addMethod('heart', (color) => {
            // Save so we can restore canvas state at the end
            ctx.save();
            // Set the fill color
            ctx.fillStyle = color;
            // from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
            ctx.beginPath();
            ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
            ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
            ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
            ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
            ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
            ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
            ctx.fill();
            // Restore the state
            ctx.restore();
        });
    }
}
```

Drag the heart block and see it being painted on the canvas. You can change the color using the picker and see it change.

As a stretch goal, you can add some parameters to the definition to control the x, y position and the scale, and add thos methods to the implementation.
