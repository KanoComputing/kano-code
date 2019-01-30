import { Editor, Mode } from '../lib/index.js';
import { Store as ChallengeStore, Challenge } from '../lib/challenge/index.js';
import VM from '../lib/vm.js';
import Runner from '../lib/runner.js';
import FileUpload from '../lib/editor/file-upload.js';
import Hardware from '../lib/hardware/index.js';
import Parts from '../lib/parts/index.js';
import ShareRunner from '../lib/share-runner.js';
import I18n from '../lib/i18n/index.js';

window.Kano = window.Kano || {};

window.Kano.Code = window.Kano.Code || {};

window.Kano.Code.Editor = Editor;
window.Kano.Code.Mode = Mode;
window.Kano.Code.Challenge = Challenge;
window.Kano.Code.Challenge.Store = ChallengeStore;
window.Kano.Code.VM = VM;
window.Kano.Code.Runner = Runner;
window.Kano.Code.FileUpload = FileUpload;
window.Kano.Code.Hardware = Hardware;
window.Kano.Code.Parts = Parts;
window.Kano.Code.ShareRunner = ShareRunner;
window.Kano.Code.I18n = I18n;

