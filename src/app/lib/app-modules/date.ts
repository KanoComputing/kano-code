import { AppModule } from './app-module.js';

interface IDate {
    year? : number;
    month? : number;
    day? : number;
    hour? : number;
    minute? : number;
    seconds? : number;
}

export class DateModule extends AppModule {
    constructor(output : any) {
        super(output);

        this.addMethod('getCurrent', '_getCurrent');
        this.addMethod('getFormattedDate', '_getFormattedDate');
        this.addMethod('getFormattedTime', '_getFormattedTime');
    }

    static get id() { return 'date'; }

    _getCurrent() {
        const current : IDate = {};
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
