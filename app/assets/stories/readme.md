This file describes the different tools for a content creator to build their story in `make-apps`

# The guts of a story

In `make-apps` a story is a sequence of scenes. Each scene can be a ready made component, like a full screen video or the app editor itself. But you can also create your own.

The order and metadata of each scenes are defines in the `index.json` file. Here is an example of this file:

```js
{
    "id": "my_story", // Defines the id of the story
    "name": "My Story", // Defines the name of the story
    "next": "next_story_id", //(Optional) sets the id of the next challenge
    "description": "", // Optional description (not implemented yet)
    // list of scenes. Will be displayed in that order
    "scenes": [{
        "id": "_0", // Scene id (not implemented yet)
        "component": "my_story/my-story-intro-1", // Scene component
        "data": {} // Additional data to give to the component
    },{
        "id": "_1",
        "component": "my_story/my-story-intro-2",
        "data_path": "my_story_1_data.json"
    },{
        "id": "_5",
        "component": "common/editor",
        "data_path": "space_tracker_1_data.json"
    }]
}
```

The `component` key defines what will be displayed on the screen. You can choose a ready-made one by starting with `common` or a custom one with the name of your story's folder

You build the component like so `<common|[your_story_folder]>/<[name_of_the_scene]>`

The available ready-made scenes are:
 - video
 - editor

## Creating your own scene

To do so, create a folder inside which you will put an html file. The folder and html file MUST use the same name

### Naming

You MUST use this naming convention:
 - Start with `kano-scene-<name-of-your-app>-<additional-info>`
 - You must only use lowercase letters, numbers and dashes
 - You are free to add more info (Like `intro`, `outro`, `video-break`) and can use numbers if you have for example a long intro.

### Content

To fit in the story editor, you must use this skeleton code inside your html file:

```html
<dom-module id="kano-scene-<my-scene>">
    <style>
    /* Here add some styling */
    :host {
        display: block;
    }
    /* Start your selectors with :host e.g.
    :host .myClass {

    }
    */
    </style>
    <template>
        <!-- Here lies the content of your scene -->
    </template>
</dom-module>
<script type="text/javascript">
    /* globals Polymer, KanoBehaviors */
    // In this class, you can add methods that you will be able to call from the template
    class KanoSceneMyScene {

        get behaviors () {
            return [KanoBehaviors.SceneComponentBehavior];
        }

        beforeRegister () {
            this.is = 'kano-scene-<my-scene>';
        }

        // Code inside this method will run at the beginning
        ready () {

        }

    }
    Polymer(KanoSceneMyScene);
</script>

```

Just write HTML/CSS and javascript to make a nice scene.

#### Access the elements

You can access your html elements with this shorthand: `this.$['element-id']` e.g.

```html

<dom-module id="kano-scene-my-scene">
    <style>
    :host {
        display: block;
    }
    :host h1 {
        opacity: 0;
        transform: opacity ease-in 300ms;
    }
    </style>
    <template>
        <h1 id="title">My awesome title</h1>
    </template>
</dom-module>
<script type="text/javascript">
    /* globals Polymer, KanoBehaviors */
    class KanoSceneMyScene {
        get behaviors () {
            return [KanoBehaviors.SceneComponentBehavior];
        }
        beforeRegister () {
            this.is = 'kano-scene-my-scene';
        }
        ready () {
            this.$['title'].style.opacity = 1; // This accesses the title using its id and changes its opacity to display it
            // Since a transform on the opacity is specified in the CSS, the title will fade in over 300ms
        }
    }
    Polymer(KanoSceneMyScene);
</script>

```

#### Event binding

You can bind functions to events quite easily using the `on-` prefix. e.g:

```html

<dom-module id="kano-scene-my-scene">
    <style>
    :host {
        display: block;
    }
    </style>
    <template>
        <button on-tap="whenTapped">Next</button>
    </template>
</dom-module>
<script type="text/javascript">
    /* globals Polymer, KanoBehaviors */
    class KanoSceneMyScene {
        get behaviors () {
            return [KanoBehaviors.SceneComponentBehavior];
        }
        beforeRegister () {
            this.is = 'kano-scene-my-scene';
        }
        ready () {

        }
        whenTapped () {
            // This function will be called when a mouse click/finger tap happen on the button
        }
    }
    Polymer(KanoSceneMyScene);
</script>

```

You can find a list of events available for elements in here: [Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)

#### Finishing the scene

To switch to the next scene or end the story, you can use the `finish` method. This method is available by default and can be used as any other method e.g.

```html
<button on-tap="finish">Next</button>
```

Or

```js

ready () {
    // End the scene 5secs after its beginning
    // Here, using () => {} instead of function () {} will allow you to use `this`
    setTimeout(() => {
        this.finish();
    }, 5000);
}

```

## Using ready-made scenes

### Video

There is not much to configure, just use `common/video` as component and define the src in the `data`:

```json
{
    "component": "common/video",
    "data": {
        "src": "/path/to/the/video"
    }
}
```

### App editor

This one is a big piece. The json file containing the data to create step by step guided stories through the app editor is usually quite big. So you should use `data_path` and write the steps in a separate file e.g.


```json
{
    "id": "my-story",
    "scenes": {
        "component": "common/editor",
        "data_src": "my_story_editor.json"
    }
}
```

Then you can create the `my_story_editor.json` file and start creating the steps.

#### Main properties

Here is how the JSON file can look like:

```json
{
    "mode": "normal",
    "parts": ["map", "iss"],
    "modules": ["control", "operators", "variables"],
    "filterBlocks": {
        "color": ["random_colour"],
        "normal": ["set_background_color"],
        "button": ["get_label"]
    },
    "defaultApp": "{...}",
    "steps": ["..."]
}
```

 - `mode`: Which mode to set the editor to (normal, lightboard, camera...)
 - `parts`: An array containing the parts you want to be available from the `add parts` menu
 - `modules`: An array containing the default categories listed in the blocks view. available are: (`controls`, `operators`, `variables`, `background`). The `events` category is here by default
 - `filterBlocks`: A set of whitelist for the blocks of a category, part or mode. If no set, every blocks will be included, otherwise, only the blocks defined in the array will appear.
 - `steps`: This array contain objects defining each step of the scene and is the most complicated
 - `defaultApp`: A stringified app from Kano Code that will be loaded at the beginning. Use this to load default parts and blocks

#### Step

The main property of a step is the validation. It is a rule that describe the action the user must do to jump to the next step. e.g.

```json

{
    "validation": {
        "open-parts": true
    }
}

```

This is one of the simplest validation, waiting for an event. During the lifetime of the app editor, almost every action made by the user will trigger an event.
By using the name of the event and using `true`, your are just saying *Wait for that event and go to next step*.

But for most events, you need to add more validation:

#### Match property (`background`, `selected-part-change`)

You can define a `property` key that will check that a value has changed.
The property is a path. e.g. `position.x`, `position.y`, `rotation`...
But you can also use the `*` to watch any events

Examples:

Wait for the background to change
```json

{
    "validation": {
        "background": {
            "property": "userStyle.background"
        }
    }
}
```

You can also use the `count` key to wait for a number of events before jump to the next step.
Wait for a part to move. Here `position.x` and `position.y` will be watched. The validator will wait for 30 changes in the position.

```json

{
    "validation": {
        "selected-part-change": {
            "property": "position.*",
            "count": 30
        }
    }
}
```

#### Match part type (`add-part`, `select-new-part`)

This allows you to specify an action on a part type. Used on the creation of a part or its selection on the `add parts` menu.


This wait for the user to select the `ISS` part in the `add parts` menu
```json
"validation": {
    "select-new-part": {
        "type": "iss"
    }
}
```

In the case of the creation of a part by the user, you can specify an `id` that will hold a reference to the newly added part so that you can use it later on.

This wait for the user to create a `Map` part
```json
"validation": {
    "add-part": {
        "type": "map",
        "id": "map_1"
    }
}
```

#### Match part target (`select-part`, `open-part-config`, `enable-refresh`, `disable-refresh`, `manual-refresh`, `selected-part-change`)

This one allows you to wait for an event on a particular part using the `target` key. This is to use with the saved `id` in `Match part type`.


Here you wait for the user to open the configuration menu of the `Map` part created earlier that you saved under the id `map_1`
```json
"validation": {
    "open-part-config": {
        "target": "map_1"
    }
}
```

#### Match category (`open-flyout`)

This allows you to specify which target category we are waiting for to be opened.


This wait for the user to open the `events` flyout
```json
"validation": {
    "blockly": {
        "open-flyout": "events"
    }
}
```

This wait for the user to open a `Map` flyout (`map_1` being a part previously created)
```json
"validation": {
    "blockly": {
        "open-flyout": {
            "part": "map_1"
        }
    }
}
```

#### Other events

Blockly events must be declared under the `blockly` key e.g. :

```json
"validation": {
    "blockly": {
        "create": {
            "type": "map"
        }
    }
}
```

 - `close-flyout` (Blockly event)

#### Highlight

You can highlight an element in the UI using the `focus` key. The key needs to be an location (See location a bit further).

#### Tooltips

You can display tooltips on the screen that points to a UI element using the `tooltips` key. This is an array of objects like this:

```json
{
    "location": "<target ui element (See a bit further)>",
    "position": "<[top|right|bottom|left]>",
    "text": "<markdown content>",
    "next_button": "<[true|false]>",
    "bounce": "<[true|false]>"
}
```

The `text` attribute will be processed as markdown. Thus, you can add bits of HTML in your tooltips and modals. You can display a block in theses texts by using the `<kano-blockly-block type="math_number"></kano-blockly-block>` HTML element. By changing the type, you change the displayed block. For blocks added by a mode, just prefix the name of the block with `modeId#` where modeId is the id of the current mode e.g. `normal#set_background_color`. For the blocks added with parts, you can use the same syntax but with the id of the previously added part e.g. `button_1#set_label`.

If the `next_button` key is set, a `Next` button will be added at the end of the tooltip and will go to the next step when clicked on. When using this key, no need to specify a validation

The bounce property will make the tooltip bounce on the target

#### Arrow

You can display an arrow on the screen. This arrow will use two elements on the UI as anchors and position itself in between.
To define the arrow, use the `arrow` key and set the values as follow:

```json
{
    "arrow": {
        "source": "<source location>",
        "target": "<target location>",
        "size": "<arrow size (defaults to 70)>"
    }
}
```

The location of the source and target are defined the same way the highlight and tooltips are. Read the `Location` chapter to learn more.

#### Beacons

You can display a beacon on the screen. This beacon will be placed on the element described by the `target`. The beacon will bounce every 3 seconds
To define the beacon, use the `beacon` key and set the values as follow:

```json
{
    "beacon": {
        "target": "<target location>"
    }
}
```

The location of the source and target are defined the same way the highlight and tooltips are. Read the `Location` chapter to learn more.

### Phantom blocks

You can define a `phantom block` that will appear at a target position to indicate where to drop a block. You can only use this in a step with a blockly connect validation.

```json
"phantom_block": {
    "location": {
        "block": "block_0"
    },
    "target": "DO"
}
```

The Location field is the same as the highlight/tootlip/arrow one. You must specify a target, which correspond to an input name of a block


### Location

You can define the target of the tooltip using the `location` key.

To target a part of the UI use the dotted notation e.g. `sidebar.parts.part-iss`.

Each name in the chain is the id of an element on the screen.

To target a dynamically created part during the story, define the path and part using an object with `path` and `part` keys e.g.

You wait for a part to be created with this validation:

```json
{
    "add-part": {
        "type": "iss",
        "id": "iss_1"
    }
}
```

Later on you will be able to target this part using:

```json
{
    "path": "workspace-controls",
    "part": "iss_1"
}
```

To target a created block in a blockly workspace, define an object and use the `block` key e.g.

You wait for the block to be created with this validation:
```json
{
    "blockly": {
        "create": {
            "target": "map_1",
            "type": "show_marker",
            "id": "show_marker"
        }
    }
}
```
Later on you will be able to target this block using:
```json
{
    "block": "show_marker"
}
```

To target a category in a blockly workspace, define an object and use the `category` key e.g.

```json

{
    "category": "events"
}

```

You can also target categories added with parts

```json
{
    "category": {
        "part": "map_1"
    }
}
```

### Available blocks

> Control (`control`)

 - `repeat_x_times`
 - `loop_forever`
 - `every_x_seconds`
 - `controls_if`
 - `logic_compare`
 - `logic_operation`
 - `logic_negate`
 - `logic_boolean`


> Operators (`operators`)

 - `math_arithmetic`
 - `text_join`
 - `math_single`
 - `math_trig`
 - `math_constant`
 - `math_number_property`
 - `math_round`
 - `math_modulo`
 - `math_constrain`
 - `math_max`
 - `math_min`
 - `math_sign`
 - `math_random`

> Variable (`variables`)

 - `text`
 - `math_number`
 - `colour_picker`
 - `random_colour`
 - `variables_set`
 - `variables_get`

> Events (`events`)

 - `part_event`

> Background (`background`)

 - `set_background_color`

> UI Part

 - `ui_move_by`
 - `ui_rotate_clockwise`
 - `ui_rotate_counter_clockwise`
 - `ui_scale_rel`
 - `ui_set_x_y`
 - `ui_set_x`
 - `ui_set_y`
 - `ui_show_hide`
 - `ui_toggle_visibility`
 - `ui_x`
 - `ui_y`

> Data Part

 - `refresh`
 - `set_config`
 - `get_value_at`
 - `get_value`
 - `for_each`


> Speaker

 - `say`

> Box

 - `set_stroke_size`
 - `set_stroke_colour`
 - `set_background_colour`

> Button

 - `set_label`
 - `set_background_colour`
 - `set_text_colour`

> Image

 - `set_image_to`
 - `source`

> Map

 - `show_marker`

> Scrolling Text

 - `scroll`

> Text Input

 - `input_text_get_value`
 - `input_text_get_placeholder`
 - `input_text_set_value`
 - `input_text_set_placeholder`

> Text

 - `set_value`
 - `get_text`
