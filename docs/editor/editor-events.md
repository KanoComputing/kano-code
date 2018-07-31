# Editor Events API

Allows plugins to register events for the ditor to dispatch. You can emit an event without registering it,
but other parts of the system ( e.g. Challenges ) uses the registration to listen to these events

```js

editor.registerEvent('custom');

const eventsList = editor.getEvents();

editor.emit('custom');

```