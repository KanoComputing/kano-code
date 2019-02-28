# Kano Code

## Usage

```js
import { Editor } from '@kano/code/index.js';

const editor = new Editor({ sourceType: 'blockly' });

editor.inject(document.body);

```

## Development

This project is going under a transition to TypeScript. The TypeScript compiler is setup to allow JavaScript files.
If you are about to create a new file, create a TypeScript file instead of a JavaScript file. If you are about to make a lot of changes to a file, if possible, move it to TypeScript.

### Setup

Install dependencies

```sh
yarn
```

### watch

```sh
yarn tsc --watch
```

### Serve

In a separate terminal

```sh
yarn serve
```

Browse the directories under `examples` to run the editor.

### Test

While writing tests, run

```sh
yarn serve-test
```

And open the prompted URL to run your tests. You can click on a suite to only run that suite.

### Documentation

The documentation is not hosted at the moment. Clone the project and run

```
yarn docs
yarn serve
```

Then navigate to http://localhost:4000/docs/
