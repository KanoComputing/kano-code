import * as sinon from 'sinon/pkg/sinon-esm.js';
import { MicrophonePart } from './microphone.js';
import { IPartContext } from '../../part.js';
import { generate } from '../../../../../test/generate.js';

suite('MicrophonePart', () => {
    test('#onInstall()', () => {
        const mic = new MicrophonePart();

        const context = {
            audio: {
                microphone: {
                    start: () => null,
                },
            },
        } as unknown as IPartContext;

        const startStub = sinon.stub(context.audio.microphone, 'start');

        mic.onInstall(context);

        assert(startStub.called);
    });
    test('#volume', () => {
        const volumeValue = generate.number();
        const mic = new MicrophonePart();

        const context = {
            audio: {
                microphone: {
                    start() {},
                    started: true,
                    volume: 0,
                    pitch: 0,
                },
            },
        } as unknown as IPartContext;

        const getter = sinon.stub().returns(volumeValue);
        sinon.stub(context.audio.microphone, 'volume').get(getter);
        mic.onInstall(context);
        assert.equal(mic.volume, volumeValue);
        assert(getter.called);
    });
    test('#pitch', () => {
        const pitchValue = generate.number();
        const mic = new MicrophonePart();

        const context = {
            audio: {
                microphone: {
                    start() {},
                    started: true,
                    volume: 0,
                    pitch: 0,
                },
            },
        } as unknown as IPartContext;

        const getter = sinon.stub().returns(pitchValue);
        sinon.stub(context.audio.microphone, 'pitch').get(getter);
        mic.onInstall(context);
        assert.equal(mic.pitch, pitchValue);
        assert(getter.called);
    });
});
