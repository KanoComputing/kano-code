import { PartContextStub } from '../../../../../test/part-context-stub.js';
import { SynthPart } from './synth.js';

suite('SynthPart', () => {
    test('onInstall()', () => {
        const stub = new PartContextStub();

        const synth = new SynthPart();

        synth.onInstall(stub);

        assert(stub.wasCalled(stub.audio.context.createGain));
        assert(stub.wasCalled((synth as any).gainNode.connect, [stub.audio.destination]));
    });
    test('setVolume()', () => {
        return new Promise((resolve) => {
            const stub = new PartContextStub();
            const synth = new SynthPart();

            synth.onInstall(stub);

            synth.core.onDidInvalidate(() => {
                assert.equal(synth.core.volume, 54);
                // Test the attenuation
                assert.equal((synth as any).gainNode.gain.value, 54 * 0.00185);
                resolve();
            });
    
            synth.setVolume(54);
    
        });
    });
});
