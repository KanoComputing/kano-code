# Challenge Widgets

This document will describe the JSON API for each widget that can be added to a challenge step

## Tooltips

A tooltip points to a UI element in the editor. It can contain rich media and its alignment can be custom.

A default tooltip can be dismissed by the user
![Dismissbale tooltip](media://dismissable-tooltip.png)

A sticky tooltip will stay until the end of the step
![Sticky tooltip](media://tooltip.png)

A challenge step can receive an array of tooltips:

```json
{
    "tootltips": [],
}

```

Each tooltip will use this API:

```json
{
    "target": "alias#block_0",
    "text": "Markdown supported",
    "position": "left", // optional
    "sticky": true // optional
}

```

 - `target`: A selector to the target UI element
 - `text`: The content of the tooltip
 - `position`: The positioning of the tooltip (`top`, `right`, `left`, `bottom`) Defaults to `top`
 - `sticky`: Whether the tooltip can be dismissed by the user. Defaults to `false`
