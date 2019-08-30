# Kano Code Editor query selectors

Accessing the different UI elements of an editor can be done using the a query selector. A selector will look like this:

```js
const result = editor.querySelector('block.app_onStart>input.CALLBACK');
```

This selector asks for the input named `CALLBACK` in the first block with a type of `app_onStart`.

Each selector has a tag, and either an id or type. The tag is defined by the first name provided. In the example above, the tag is `block`.

An id is defined using the `#` character. A class is defined using the `.` character.

A last modifier can be added at the end of the selector using the `:` selector. This will specify a position alignment. When querying for an element's position, you will be able to query for a specific point on that element.

```js
const result = editor.queryPosition('block.app_onStart:100,50');
```

The selector above will find the block, compute its absolute position and return a point on the right, middle of the block.

The two values in the position selector are respectively the horizontal alignment and the vertical alignment, in percent (from 0 to 100).

The `>` character aloows selector to query for nested elements. In the first example, we were querying for an input in a specific block.

## Available tags

Here is the list of tags available for this querying language:

### Editor:

|Tag|Description|Modifiers|Example|
|---|---|---|---|
|`add-part-button`|Returns the Add Part button|`N/A`|`add-part-button`|
|`part`|Returns a part definition or instance|`#`, `.`|`part#button`, `part.button#toolbox`, `part.button>toolbox>flyout-block.onClick`|
|`output`|Returns the output canvas|||
|`button`|Returns a button in the editor|`#`, `.`|`button.restart`, `button.fullscreen`, `button.play`|
|`tab`|Returns the artboard/code tab|`#`, `.`|`tab.artboard`, `tab.code`|

### Blockly:

|Tag|Description|Modifiers|Example|
|---|---|---|---|
|`toolbox`|Returns an entry from the toolbox|`#`|`toolbox#app`|
|`block`|Returns a block in the workspace, by its blockly id or blockly type|`#`, `.`|`block.app_onStart`, `block#jwZlP$I^qn]?T(q)WeRt`|
|`flyout-block`|Returns a block in the current flyout|`.`|`flyout-block.repeat_x_times`, `toolbox#app>flyout-block.onStart`|
|`input`|Returns a matching input or field if exists. Must be used with `block`|`.`|`block.app_onStart>input.callback`|
|`next`|Returns the nextConnection from a blockly block. Must be used with `block`|`.`|`block.draw_clear>next`|

### Challenges

When running a challenge, a user can create a block or part at runtime. These can be given an alias during their create step. These aliases can be used to query blocks or parts later on during a challenge

|Tag|Description|Modifiers|Example|
|---|---|---|---|
|`alias`|Returns a previously saved result|`#`|`alias#block_0>input.NAME`, `alias#part_0`|
|`banner-button`|Returns the button in the challenge's banner. null if the banner is not currently displayed|`N/A`|`banner-button`|


## API

Three methods are available from the editor to query:

 - `queryElement()`: Returns a matching HTMLElement.
 - `queryPosition()`: Returns a matching x, y coordinates.
 - `querySelector()`: Returns a result object matching `{ getHTMLElement() {}, getId() {}, getPosition() {} }`


## Practice

Open an instance of the editor in a browser. Make sure your reset the editor (Cog menu then reset). Open the devTools and select the `console` tab then type:

```js
Kano.Code.mainEditor.queryElement('block.app_onStart')
```

While typing the matching block should become highlighted (On recent chrome). This will return the block's DOM Element.

We will make use of the selectors more in the next chapter about Content Widgets.
