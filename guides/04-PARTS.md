# Creating a new part for Kano Code

Parts are very much like classes. Users can instantiate them through a menu and they will be added to their creation.

In this guide, we will explain the steps to create a part. We will use the Mouse Part as an example

## The Part itself

To create a part, create a new directory under `src/app/lib/part/parts`. Then create a file called `mouse.ts`. Add the following code:

```ts
import { Part } from '../../part.js';
import { part } from '../../decorators.js';

// Define the unique type for the part and extend the parent Part class
@part('mouse')
export class MousePart extends Part {
    sayHello() {
        console.log('Hello');
    }
}

```

We only define one method `sayHello` as a test for now. We will now define the API for this part. Create a new `api.ts` file:

```ts
import { MousePart } from './mouse.js';
import { IPartAPI } from '../../api.js';

// Define the Mouse API
export const MouseAPI : IPartAPI = {
    type: MousePart.type,
    label: 'Mouse',
    icon: document.createElement('template'),
    color: '#ef5284',
    // symbols use the same definition as the Toolbox Modules. See the previous Toolbox guide
    symbols: [{
        type: 'function',
        name: 'sayHello',
        verbose: 'say hello',
    }],
};

```

This will add one block in the toolbox for the mouse part. That block will generate a valid javascript code that will call the Part's `sayHello` method.

Now we just need to register those files. Add `export * from './mouse/api.js';` in `src/app/lib/part/parts/api.ts` and `export * from './mouse/mouse.js';` in `src/app/lib/part/parts/api.ts`.

It is important to keep those separated are the part can be imported without its definition ny users browsing creations.

Now visit the `intro` example and click on `Add Part`. You should see the mouse part. The icon is missing for now, but we'll take care of that in a moment. Add the Mouse part and drag a `Mouse: say hello` block in. You should see a message appear in your devTools' console.

A part's icon must be a HTMLTemplateElement with an SVG tree inside. You can use the icons-rendering mocule to generate it from an svg icon:

```ts
import { MousePart } from './mouse.js';
import { IPartAPI } from '../../api.js';
import { svg } from '@kano/icons-rendering/index.js';

// generate the icon
const mouse = svg`<svg>...</svg>`;

// Define the Mouse API
export const MouseAPI : IPartAPI = {
    type: MousePart.type,
    label: 'Mouse',
    // Pass the icon to the definition
    icon: mouse,
    color: '#ef5284',
    symbols: [{
        type: 'function',
        name: 'sayHello',
        verbose: 'say hello',
    }],
};
```

We will now add the `x` and `y` blocks returning the current x and y position of the cursor on the output. To access the output apis, we can use the `onInstall` lifecycle step of a part. Update the `mouse.ts` file:

```ts
import { Part, IPartContext } from '../../part.js';
import { part } from '../../decorators.js';
import { subscribeDOM } from '@kano/common/index.js';

@part('mouse')
export class MousePart extends Part {
    onInstall(context : IPartContext) {
        subscribeDOM(context.dom.root, 'mousemove', (e : MouseEvent) => {
            console.log(e.x, e.y);
        });
    }
}
```

Refresh, hover your cursor over the output canvas and watch the console. This is the position of the mouse on the screen, We now need to adjust these values to make them relative to the top left corner of the output.

The output, while having a fixed width and height is scaled to fit the workspace and can be adjusted by the user or change when in full screen. We also need to take that in consideration.

```ts
import { Part, IPartContext } from '../../part.js';
import { part } from '../../decorators.js';
import { subscribeDOM } from '@kano/common/index.js';

@part('mouse')
export class MousePart extends Part {
    private _scale : number = 1;
    private _rect : DOMRect|null = null;
    private _x : number = 0;
    private _y : number = 0;
    onInstall(context : IPartContext) {
        // Listen to the resize event ot update the rect and scale
        context.dom.onDidResize(() => {
            this.resize(context);
        });
        subscribeDOM(context.dom.root, 'mousemove', (e : MouseEvent) => {
            let { x, y } = e;
            // In case no resize event is triggered before the mouse part is added
            if (!this._rect) {
                return;
            }
            // Adjust the cursor position by making the coordinates relative to the top left corner of the output
            // Also applies the scale
            x = Math.max(0, Math.min(context.visuals.width, (x - this._rect.left) * this._scale));
            y = Math.max(0, Math.min(context.visuals.height, (y - this._rect.top) * this._scale));

            console.log(x, y);
        });
        // Trigger an initial resize to populate the scale and rect
        this.resize(context);
    }
    resize(context : IPartContext) {
        this._rect = context.dom.root.getBoundingClientRect() as DOMRect;
        this._scale = context.visuals.width / this._rect.width;
    }
}

```

Refresh and move your cursor over the output. Try to position the cursor on the top left corner and make sure it displays a value close to 0, 0. Do the same for the bottom right corner, you should get values close to 800, 600.

Now that we have the x and y position we will create the matching blocks to retrieve the values.

```ts
import { Part, IPartContext } from '../../part.js';
import { part } from '../../decorators.js';
import { subscribeDOM } from '@kano/common/index.js';

@part('mouse')
export class MousePart extends Part {
    private _scale : number = 1;
    private _rect : DOMRect|null = null;
    private _x : number = 0;
    private _y : number = 0;
    onInstall(context : IPartContext) {
        // Listen to the resize event ot update the rect and scale
        context.dom.onDidResize(() => {
            this.resize(context);
        });
        subscribeDOM(context.dom.root, 'mousemove', (e : MouseEvent) => {
            let { x, y } = e;
            // In case no resize event is triggered before the mouse part is added
            if (!this._rect) {
                return;
            }
            // Adjust the cursor position by making the coordinates relative to the top left corner of the output
            // Also applies the scale
            x = Math.max(0, Math.min(context.visuals.width, (x - this._rect.left) * this._scale));
            y = Math.max(0, Math.min(context.visuals.height, (y - this._rect.top) * this._scale));

            this._x = x;
            this._y = y;
        });
        // Trigger an initial resize to populate the scale and rect
        this.resize(context);
    }
    resize(context : IPartContext) {
        this._rect = context.dom.root.getBoundingClientRect() as DOMRect;
        this._scale = context.visuals.width / this._rect.width;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
}
```

We just store the x and y values. Then create a getter for each. This will make the generated code clearer. `mouse.x` instead of `mouse.getX()`.

Now we update the api to create two blocks. Update `api.ts`:

```ts
export const MouseAPI : IPartAPI = {
    type: MousePart.type,
    label: 'Mouse',
    icon: mouse,
    color: '#ef5284',
    symbols: [{
        type: 'variable',
        name: 'x',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'y',
        returnType: Number,
    }],
};
```

Refresh, and make a creation that every frame moves the draw context to the mouse x and y then draws a circle. Move your cursor on the output canvas and you should see a trail being created.

Using the same APIs we add the x and y velocity of the cursor:

```ts
import { Part, IPartContext } from '../../part.js';
import { part } from '../../decorators.js';
import { subscribeDOM } from '@kano/common/index.js';

@part('mouse')
export class MousePart extends Part {
    private _scale : number = 1;
    private _rect : DOMRect|null = null;
    private _x : number = 0;
    private _y : number = 0;
    private _dx : number = 0;
    private _dy : number = 0;
    private _lastMoveEvent : number|null = null;
    onInstall(context : IPartContext) {
        // Listen to the resize event ot update the rect and scale
        context.dom.onDidResize(() => {
            this.resize(context);
        });
        subscribeDOM(context.dom.root, 'mousemove', (e : MouseEvent) => {
            let { x, y } = e;
            // In case no resize event is triggered before the mouse part is added
            if (!this._rect) {
                return;
            }
            // Adjust the cursor position by making the coordinates relative to the top left corner of the output
            // Also applies the scale
            x = Math.max(0, Math.min(context.visuals.width, (x - this._rect.left) * this._scale));
            y = Math.max(0, Math.min(context.visuals.height, (y - this._rect.top) * this._scale));

            // Record the current timestamp
            const now = Date.now();

            // When no event is received after 100ms, reset the mouse speed
            if (this._lastMoveEvent === null || now - this._lastMoveEvent > 100) {
                this._dx = 0;
                this._dy = 0;
            } else {
                this._dx = x - this._x;
                this._dy = y - this._y;
            }

            this._x = x;
            this._y = y;

            // Update last event time
            this._lastMoveEvent = now;
        });
        // Trigger an initial resize to populate the scale and rect
        this.resize(context);
    }
    resize(context : IPartContext) {
        this._rect = context.dom.root.getBoundingClientRect() as DOMRect;
        this._scale = context.visuals.width / this._rect.width;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get dx() {
        return this._dx;
    }
    get dy() {
        return this._dy;
    }
}
```

```ts
export const MouseAPI : IPartAPI = {
    type: MousePart.type,
    label: 'Mouse',
    icon: mouse,
    color: '#ef5284',
    symbols: [{
        type: 'variable',
        name: 'x',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'y',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'dx',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'dy',
        returnType: Number,
    }],
};
```
