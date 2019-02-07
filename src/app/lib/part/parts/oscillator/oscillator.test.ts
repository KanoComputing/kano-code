import { OscillatorPart } from './oscillator.js';

suite('OscillatorPart', () => {
    test('#onStart()', () => {
        return new Promise((resolve) => {
            const osc = new OscillatorPart();
    
            Object.defineProperty(osc, '_updateValue', {
                value: () => resolve(),
            });
    
            osc.onStart();
        });
    });
    test('#speed', () => {
        return new Promise((resolve) => {
            const testSpeed = 12;
            const button = new OscillatorPart();

            button.core.onDidInvalidate(() => {
                assert.equal(button.core.speed, testSpeed);
                resolve();
            });

            button.speed = testSpeed;
        });
    });
    test('#delay', () => {
        return new Promise((resolve) => {
            const testDelay = 13;
            const button = new OscillatorPart();

            button.core.onDidInvalidate(() => {
                assert.equal(button.core.delay, testDelay);
                resolve();
            });

            button.delay = testDelay;
        });
    });
    test('#wave', () => {
        return new Promise((resolve) => {
            const testWave = 'triangle';
            const button = new OscillatorPart();

            button.core.onDidInvalidate(() => {
                assert.equal(button.core.wave, testWave);
                resolve();
            });

            button.wave = testWave;
        });
    });
});
