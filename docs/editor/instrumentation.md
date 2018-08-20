# Kano Code instrumentation API

Provide a way to instrumentize parts of the runner modules to get notified when and if the code runs.
Useful to create coding challenges based on a piece of code running.

```js

class Module extends code.AppModule {
    static get name() {
        return 'draw';
    }
    constructor() {
        super();
        this.addMethod('circle', '_circle');
    }
}

const instrument = output.runner.instrumentize('draw.circle');

subscribe(instrument, 'method-called', (method, args) => {
    method === 'draw.circle';
    args === [12, 7];
    instrument.dispose();
});
```
