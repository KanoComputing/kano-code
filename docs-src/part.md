Create a new part like so

```ts
@part('my-part')
class MyPart extends Part {
    onInstall(context : IPartContext) {
        // Do something with the visuals, audio or dom from the output:
        // context.visuals
        // context.audio
        // context.dom
    }
}

```

This part can then access the context API to draw on the canvas, play or record audio or add elements to the output DOM.
