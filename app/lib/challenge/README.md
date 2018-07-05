# Kano Code Challenge Plugin

##

## Generator

This plugin embeds a challenge generator. This generator will add an entry to the settings button on the WorkspaceView.

This entry allows to go in and out of challenge creation mode. This gives two features:
 - The ability to download challenges file from the settings button
 - A set of Challenge blocks allowing the customisation of the generated challenge

### Middlewares

By default the genrator will be able to generate the core bits for a challenge (steps, modules, filters).
If you Kano Code implementation used the challenge file to store metadata, you can use a middleware
to add this metadata to your generated challenges.


Example adding a version number to your generated challenges
```js
challengeGeneratorPlugin = new ChallengeGeneratorPlugin();
challengeGeneratorPlugin.addMiddleware((challenge, generator) => {
    challenge.version = '0.4.7'
    return challenge;
});
editor.addPlugin(challengeGeneratorPlugin);

```

Using the WorkspaceView API:

The challenge genrator plugin will look into your WorkspaceViewProvider for the `challengeGeneratorMiddleware` key,
and add it automatically to its list of middlewares:

Example using the WorkspaceViewProvider to add the number of blocks a generated challenge
```js

class MyWorkspaceViewProvider extends code.WorkspaceViewProvider {
    get challengeGeneratorMiddleware() {
        return (challenge, generator) => {
            if (this.editor.sourceType !== 'blockly') {
                return challenge;
            }
            const { sourceEditor } = this.editor;
            const { Blockly } = sourceEditor;
            const xml = Blockly.Xml.textToDom(sourceEditor.getSource());
            const blocks = xml.querySelectorAll('block');
            challenge.numberOfBlocks = blocks.length;
            return challenge;
        };
    }
}

```

In a plugin:

If a plugin exposes a `challengeGeneratorMiddleware`, it will automatically be added to the list of middlewares.

Example on how the Parts Plugin might generate steps for parts:

```js

class PartsPlugin extends Plugin {
    // ...
    get challengeGeneratorMiddleware() {
        return (challenge, generator) => {
            if (this.editor.sourceType !== 'blockly') {
                return challenge;
            }
            // Get all the parts
            const { addedParts } = this.editor.store.getState();
            const partsSteps = this.generatePartsChallengeSteps(addedParts);
            // Prepend the parts step
            challenge.steps = partsSteps.concat(challenge.steps);
            return challenge;
        };
    }
    // ...
}

```

### Blocks

#### id

This block allows to choose the id on the generated challenge. Only one allowed.

#### Start

The start block will tell the generator where the challenge should really start. It will then generate the preloaded app up until that block as well as all the steps to complete the challenge from there

#### Banner

This block will inject a banner step after the creation of the previous block and before the creation of the next one

### Comments

In creator mode, when adding openning a block comment for the first time (or if the comment has no content) it will
fill it with a JSON object containing

```json
{
    "openFlyoutCopy": "Open this tray",
    "grabBlockCopy": "Drag the block onto your code space",
    "connectCopy": "Connect to this block"
}
```

This data will be used to generate the step creating the very same block.

### Metadata

This block allows you to write extra information that need to be added to the challenge. This data will be merged with the generated challenge.
WARNING: The data in this block will override the data generated, use only if you know what you're doing.
WARNING: The data is merged after everything was generated, including the middlewares