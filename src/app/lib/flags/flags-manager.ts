
export interface IFlags {
    [K : string] : boolean;
}

export class FlagsManager {
    public flags : IFlags = {};
    private _flags : IFlags = {};
    register(key : string) {
        if (this.flags.hasOwnProperty(key)) {
            throw new Error(`Could not register new flag: Flag '${key}' is already registered`);
        }
        Object.defineProperty(this.flags, key, {
            set: (value : boolean) => {
                this.saveFlag(key, value);
                console.log(`Flag ${key} ${value ? 'enabled' : 'disabled'}. Will take effect after reload.`);
            },
            get: () => {
                return this.getFlag(key);
            }
        });
    }
    saveFlag(key : string, value : boolean) {
        if (!this.flags.hasOwnProperty(key)) {
            return;
        }
        this._flags[key] = value;
        this.persistFlag(key, value);
    }
    getFlag(key : string) {
        if (!this.flags.hasOwnProperty(key)) {
            throw new Error(`Could read flag value: Flag '${key}' is not registered`);
        }
        if (!this._flags[key]) {
            this._flags[key] = this.readFlag(key);
        }
        return this._flags[key];
    }
    readFlag(key : string) {
        const item = localStorage.getItem(key);
        return !!item && item === '1';
    }
    persistFlag(key : string, value : boolean) {
        localStorage.setItem(`kc://flags/${key}`, value ? '1' : '0');
    }
}

// Singleton
export const Flags = new FlagsManager();

// Make the flags accessible through the Kano.Code debug API
window.Kano = window.Kano || {};
window.Kano.Code = window.Kano.Code || {};
window.Kano.Code.flags = Flags.flags;
