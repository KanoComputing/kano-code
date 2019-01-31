# Kano Code

## Usage

```js
import { Editor } from '@kano/code/index.js';

const editor = new Editor({ sourceType: 'blockly' });

editor.inject(document.body);

```

## The editor

[Editor's documentation](./app/lib/editor/README.md)

[Challenges documentation](./app/lib/challenge/README.md)

## Development

This project is going under a transition to TypeScript. The TypeScript compiler is setup to allow JavaScript files.
If you are about to create a new file, create a TypeScript file instead of a JavaScript file. If you are about to make a lot of changes to a file, if possible, move it to TypeScript.

### Setup

Install dependencies

```bash
yarn
```

### watch

```bash
yarn tsc --watch
```

### Serve

In a separate terminal

```bash
yarn serve
```

### Demos

While serving, visit any of those:

http://localhost:4000/examples/intro/
http://localhost:4000/examples/pong/
