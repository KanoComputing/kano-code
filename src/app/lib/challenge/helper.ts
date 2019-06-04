import { IStepData } from '../creator/creator.js';
import { Engine } from './engine.js';

export interface IStepHelper {
    test(challenge : Engine, step : IStepData) : boolean;
    enter(challenge : Engine, step : IStepData) : void;
    leave(challenge : Engine, step : IStepData) : void;
}
