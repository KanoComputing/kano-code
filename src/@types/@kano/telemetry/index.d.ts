
declare module '@kano/telemetry/index.js' {
    import { IDisposable } from '@kano/common/index.js';
    interface ITelemetryClientOptions {
        scope? : string;
    }
    interface ITrackEventOptions {
        name : string;
        properties? : { [K : string] : any }
    }
    class TelemetryClient {
        constructor(opts : ITelemetryClientOptions);
        trackEvent(opts : ITrackEventOptions) : void;
        mount(client : TelemetryClient) : IDisposable;
    }
}
