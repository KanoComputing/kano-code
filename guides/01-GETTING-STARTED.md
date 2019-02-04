# Getting started

This guide will walk you through creating an instance of the Code Editor with a customised toolbox.

## Project setup

Make sure you have Node and yarn setup to pull the dependencies and run a local web server.

In a new directory, run `yarn init -y`, this will setup your project. You can now add kano code a s a dependency with `yarn add @kano/code`.

If you haven't yet, install the ES6 web server with: `yarn global add @kano/es6-server`. This is a development server that allows fast prototyping without worrying about module resolution or bundling.

Start the development server with `es6-server` (`es6-server.cmd` on Windows), and visit the resported URL (`http://localhost:4000`). You should get a 404 error as no index file exists yet.

## Creating the web page

Start by creating a `index.html` file with this content: 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Kano Code Example</title>
    <style>
        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }
        kano-app-editor {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <script src="./index.js" type="module"></script>
</body>
</html>
```

This is a very basic html page with some styles to make the editor use the whole page. It also imports a `index.js` file. Let's create it:

```js
import * as i18n from '@kano/code/i18n.js';

const lang = i18n.getLang();

console.log(lang);

```

Refresh the web page, open the devTools (Cmd+Shift+I or Ctrl+Shift+I) and you should see the reported language. This is an important step for creating an editor as it will help us load all the text in the right language.

Now it's time to load all the language files:

```js
import * as i18n from '@kano/code/i18n.js';

const lang = i18n.getLang();

// Load the languages packs. Including the blockly languages packs
i18n.load(lang, { blockly: true })
    .then(() => {
        console.log('loaded');
    });
```

After refresh, you should be able to see the locale files being loaded in the network tab of the devTools. Now it's time to create the editor:

```js
import * as code from '@kano/code/index.js';
import * as i18n from '@kano/code/i18n.js';

const lang = i18n.getLang();

// Load the languages packs. Including the blockly languages packs
i18n.load(lang, { blockly: true })
    .then(() => {
        const editor = new code.Editor();

        editor.inject(document.body);
    });
```

This will now display a completely empty editor in the page. Let's add some block in the toolbox, import the toolbox APIs at the top of the file:

```js
import * as APIs from '@kano/code/toolbox.js';
```

Now let's create a new EditorProfile. This will contain the editor's configuration for this session. It can be used to define the toolbox, output view, plugins and react to lifecycle event.

```js
class EditorProfile extends code.EditorProfile {
    get toolbox() {
        return Object.values(APIs);
    }
}
```

Now, before injecting the editor. register your Profile:

```js
const editor = new code.Editor();

editor.registerProfile(new EditorProfile());

editor.inject(document.body);

```

Refresh and you can now see the toolbox fileld with the default entries.