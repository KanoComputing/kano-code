import { Editor, Mode } from '../lib/index.js';
import { Store as ChallengeStore, Challenge } from '../lib/challenge/index.js';
import VM from '../lib/vm.js';
import Runner from '../lib/runner.js';
import FileUpload from '../lib/editor/file-upload.js';

window.Kano = window.Kano || {};

window.Kano.Code = window.Kano.Code || {};
window.Kano.Code.Editor = Editor;
window.Kano.Code.Mode = Mode;
window.Kano.Code.Challenge = Challenge;
window.Kano.Code.Challenge.Store = ChallengeStore;
window.Kano.Code.VM = VM;
window.Kano.Code.Runner = Runner;
window.Kano.Code.FileUpload = FileUpload;
