# Configuration

When integrating a player or an editor, you will need to configure some parts. This is done through a configuration resolver.
At any given time something could need a configuration value. The resolver returns a value for a requested key.

One example is the sticker part's assets location. When integrating the editor, you can deliver the assets in any way you want. Make sure you resolve the base url using:

```js
code.Output.setConfigResolver((key) => {
    if (key === 'sticker:base-url') {
        return 'https://lol.com/';
    }
});
```

Any key not resolved will use its internal fallback. You can log the `key` to see what keys the editor requests.

Parts and APIs will define what key they need in their respective documentation.
