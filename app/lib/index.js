import Editor from './editor/editor.js';
import UserPlugin from './user.js';
import { PartsPlugin } from './parts/index.js';
import LocalStoragePlugin from './storage/local-storage.js';
import FileUploadPlugin from './editor/file-upload.js';
import I18n from './i18n/index.js';
import { WorkspaceViewProvider, WorkspaceViewProviderMixin } from './editor/workspace/index.js';
import { OutputViewProvider, OutputViewProviderMixin } from './output/index.js';
import AppModule from './app-modules/app-module.js';

import { OutputProfile } from './output/profile.js';
import { EditorProfile } from './editor/profile.js';

import { Player } from './player/index.js';
import { Plugin } from './editor/plugin.js';

import { DialogProvider } from './editor/dialogs/dialog-provider.js';

export {
    Editor,
    Player,
    UserPlugin,
    PartsPlugin,
    LocalStoragePlugin,
    FileUploadPlugin,
    I18n,
    WorkspaceViewProvider,
    WorkspaceViewProviderMixin,
    OutputViewProvider,
    OutputViewProviderMixin,
    AppModule,
    OutputProfile,
    EditorProfile,
    Plugin,
    DialogProvider,
};
