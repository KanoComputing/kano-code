# Adding a custom toolbox entry to the editor

This guide builds on top of the result from the Getting Started guide. Make sure your environment is setup and your have completed the previous guide first.

We will add a new entry in the toolbox on the left. This will be done using the MetaAPI. The MetaAPI defines APIs to be used by the editor. The editor then can translate an API definition into blocks or intellisense information.

We will create a toolbox that contains methods to draw different shapes on the output canvas.

Create a simple API definition:

```js
const Shapes = {
    type: 'module',
    // Hex color for the theme of the API
    color: '#355C7D',
    // This name is not a displayed named, but the actual variable name for the module.
    // It will be used to generate the JavaScript code
    name: 'shapes',
    // This is the displayed name for the toolbox
    verbose: 'Shapes',
    // List of available symbols in that module
    symbols: [{
        type: 'variable',
        name: 'heart',
        verbose: 'Draw a heart',
    }],
};

class EditorProfile extends code.EditorProfile {
    get toolbox() {
        // Add our API to the list using concat
        return Object.values(APIs).concat([Shapes]);
    }
}
```

Refresh and you see a new entry in the toolbox. Inside there is a unique block with no connection name 'Draw a heart'. Drag this block in the workspace and click on the `JavaScript` tab to see the generated code: `shapes.heart`.

This created a module named `shapes` with a single property `heart`. For this module, we want `heart` to be a method. Let's update the definition to make this happen:

```js
const Shapes = {
    //...
    symbols: [{
        type: 'function',
        name: 'heart',
        verbose: 'Draw a heart',
    }],
};
```

Save, refresh and check the toolbox. The block should now have a top and bottom connection as it is now a method. Check the Javascript tab and it reports `shapes.heart();`

Let's make the method take a color parameter.

```js
const Shapes = {
    //...
    symbols: [{
        type: 'function',
        name: 'heart',
        verbose: 'Draw a heart',
        parameters: [{
            // Name of the parameter, used to render javascript
            name: 'color',
            // Displayed name
            verbose: 'Color',
            // Type of the parameter. Will be used for intellisense hints and block connection validation
            returnValue: 'Color',
            // Default value. Will be used to provide a shadow block with a default value
            default: '#F67280',
        }],
    }],
};
```

Now the block has one input pre-filled with a default color. But the text on the block says 'Draw a heart Color'.
This is because the verbose text for the parameter is set to 'Color' in this case, it is understandable that the input if for a color.
We can hide this parameter name by setting the `verbose` key to an empty string `''`.

You have now a custom block in a custom toolbox. It does not do anything for now, and the devTools will display an error as the `shapes` module is defined, but not imnplemented yet.

We will see how to implement these modules in the next guide.
