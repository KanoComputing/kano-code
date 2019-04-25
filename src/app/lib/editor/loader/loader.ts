import { ContributionManager } from '../../contribution.js';
import Editor from '../editor.js';

export interface IFileLoader {
    load(editor : Editor, content : string) : any;
}

export const FileLoaders = new ContributionManager<IFileLoader>();
