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

Documentation is hosted at https://code-docs.kano.me. The website infrastructure is deployed using terraform. To update the infrastructure, change the files under `terraform` and run:

```
cd terraform
terraform init
terraform apply
```

The documentation is deployed by jenkins and scoped to the version in `package.json`

### Publish

Run `yarn publish`, update version. Make sure to update version in kit-app-ui as well.