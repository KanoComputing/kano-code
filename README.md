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
