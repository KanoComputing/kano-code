/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */


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
