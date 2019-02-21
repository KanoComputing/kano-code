# Challenge widgets

A set of widgets are available to use in challenges to provide hints and guidance to users on how to progress.

## Banner

Displays a banner at the top of the source editor. You can customise the text content of the banner. The text supports markdown syntax. See [Markdown](#Markdown).

Syntax:

Shorthand
```json
{
    "banner": "Some content for the banner"
}
```

Complete
```json
{
    "banner": {
        "text": "Some content for the banner",
        "nextButton": true,
    }
}
```

## Tooltips

Displays one or more tooltip on the editor. Each tooltip will have a target element, position and content. The content supports markdown syntax. See [Markdown](#Markdown).

Syntax:

|Key|Description|Example|
|---|---|---|---|
|`target`|An editor selector pointing at the element the tooltip will point at|`toolbox#app`, `part#button>toolbox`|
|`text`|The content of the tooltip. Supports markdown|`Anything really ${toolbox#app} *CONTENT*`|
|`position`|Which way the tooltip will face its target|`top`, `right`, `bottom`, `left`|
|`offset`|How far off the tooltip will be from its target, in pixels|`20`, `-4`|

Example:

```json
{
    "tooltips": [{
        "target": "part#button>toolbox",
        "text": "Some rich content",
        "position": "right",
        "offset": 20,
    }],
}
```

## Beacon

Displays a single beacon in the editor.

Syntax: A single editor selector. The position modifier can be used at the end of the selector to align the beacon horixontally and vertically

Example:

Position the beacon on the right, middle of the app toolbox entry
```json
{
    "beacon": "toolbox#app:100,50"
}
```

## Highlight
 > TBD
## Markdown

When widgets allows you to display rich content, it will use the markdown syntax. This syntax is enhanced to help display content meaningful to the current challenge.

Emojis added to the source text will be transformed into images using `twemoji` for a unified rendering across platforms.

You can use the template syntax `${}` with an editor selector. If the element returned by the selector is supported, it will be replaced with a preview.

Examples: 

```json
{
    "text": "Open the toolbox looking like this: ${toolbox#app}",
}
```

Supported elements are:

|Element|Description|Example|
|---|---|---|---|
|Toolbox entry|Displays a preview of the toolbnox entry|`toolbox#app`, `part#button>toolbox`|
|Part|Displays a preview of a part|`part.button`|
