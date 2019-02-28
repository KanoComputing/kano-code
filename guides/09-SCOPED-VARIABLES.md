# Scoped variables

When using asynchronous tasks in Javascript, a function can ask for a callback. That callback will then be called once the task finishes. It can potentially be called with parameters that will be available in the scope of the function

```js

doTheThing(function (x, y) {
    // x and y are available here
});

```

This is not something that cna be transletd in blocks. But we can make it available to users by automatically generating the Javascript code that fit a specific set of blocks.

A block can declare one of its parameters as scoped. When translating that  block into code, the renderer will try to look up the block tree to find a parent block that creates a scope (C-Shaped) and that declares an argument with a matching type.    

## Function blocks

A function block will generate a Javascript function call. This call can have ine or many optional parameters at the end.
If the parameter is scoped, the renderer will try to pass the value from a parent block that has a matching argument.

```js

// Use a symbol to make that variable unique and private. Only this file can use it
const ExampleResult = Symbol();

const api = {
    type: 'module',
    name: 'example',
    symbols: [{
        // This is the runTask function accepting a callback
        type: 'function',
        name: 'runTask',
        parameters: [{
            type: 'function',
            name: 'callback',
            returnType: Function,
            // The callback will receive arguments matching these parameters
            parameters: [{
                type: 'parameter',
                name: 'result',
                returnType: Number,
                // This indicates that the scoped argument will have to match this symbol
                blockly: {
                    scope: ExampleResult,
                },
            }],
        }],
    }, {
        // This is the doSomething function. It accepts a x,y and optional scoped result parameters
        type: 'function',
        name: 'doSomething',
        parameters: [{
            type: 'parameter',
            name: 'x'
            returnType: Number,
            default: 0,
        }, {
            type: 'parameter',
            name: 'y'
            returnType: Number,
            default: 0,
        }, {
            type: 'parameter',
            name: 'result',
            returnType: Number,
            blockly: {
                // Only accepts arguments from the upper scope that matches this type
                scope: ExampleResult,
            },
        }],
    }],
}
```

This API will generate two blocks. The generated code from these blocks will differ depending on the way the blocks are used:

```js
// The doSomething block in the C-shape input of the runTask block
example.runTask((result) => {
    example.doSomething(1, 2, result);
});

// The doSomething block outside the C-shape input of runTask
example.runTask((result) => {

});
example.doSomething(1, 2);
```

## Variable blocks

Variables generate a getter block and a setter block. The getter block can declare itself as scoped. This will make the renderer replace the getter code with the scoped argument.

```js

// Use a symbol to make that variable unique and private. Only this file can use it
const ExampleResult = Symbol();

const api = {
    type: 'module',
    name: 'example',
    symbols: [{
        // This is the runTask function accepting a callback
        type: 'function',
        name: 'runTask',
        parameters: [{
            type: 'function',
            name: 'callback',
            returnType: Function,
            // The callback will receive arguments matching these parameters
            parameters: [{
                type: 'parameter',
                name: 'result',
                returnType: Number,
                // This indicates that the scoped argument will have to match this symbol
                blockly: {
                    scope: ExampleResult,
                },
            }],
        }],
    }, {
        // This is the doSomething function. It accepts a x,y and optional scoped result parameters
        type: 'variable',
        name: 'someData',
        // This has its own return type
        returnType: Number,
        blockly: {
            scope: ExampleResult,
        },
    }],
}

```

This will generate two blocks. The getter block from the variable will render differently depending on if it's in the scope of the C-shaped block.

```js
// The doSomething block in the C-shape input of the runTask block
example.runTask((result) => {
    // The name `result` is the getter block
    otherFunc(1, 2, result);
});

// The doSomething block outside the C-shape input of runTask
example.runTask((result) => {

});
// This is what the block looks like if outside the C-shape
example.someData

```
