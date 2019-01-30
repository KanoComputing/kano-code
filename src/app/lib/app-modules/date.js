import { AppModule } from './app-module.js';

export class DateModule extends AppModule {
    constructor() {
        super();

        this.addMethod('getCurrent', '_getCurrent');
        this.addMethod('getFormattedDate', '_getFormattedDate');
        this.addMethod('getFormattedTime', '_getFormattedTime');
    }

    static get id() { return 'date'; }

    _getCurrent() {
        const current = {};
        const date = new Date();
        current.year = date.getFullYear();
        current.month = date.getMonth() + 1;
        current.day = date.getDate();
        current.hour = date.getHours();
        current.minute = date.getMinutes();
        current.seconds = date.getSeconds();
        return current;
    }

    _getFormattedDate() {
        return (new Date()).toLocaleDateString();
    }

    _getFormattedTime() {
        return (new Date()).toLocaleTimeString();
    }
}

export default DateModule;
