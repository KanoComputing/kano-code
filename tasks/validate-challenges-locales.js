const fs = require('fs');
const path = require('path');

const LOCALES_PATH = path.join(__dirname, '../app/assets/stories/locales/');
const EN_CHALLENGES_PATH = path.join(LOCALES_PATH, '/en-US/');

function listFolders(p) {
    return new Promise((resolve, reject) => {
        fs.readdir(p, (err, files) => {
            if (err) {
                return reject(err);
            }
            files = files.filter(file => fs.statSync(path.join(p, file)).isDirectory());
            resolve(files);
        });
    });
}

function readJSON(p) {
    return new Promise((resolve, reject) => {
        fs.readFile(p, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(JSON.parse(data.toString()));
        });
    });
}

function indexExists(challenge, locale) {
    return fs.accessSync(path.join(LOCALES_PATH, locale, challenge, 'index.json'));
}

function validateChallengeLocale(challenge, locale, ignoreMissing) {
    try {
        indexExists(challenge, 'en-US');
    } catch (e) {
        throw new Error(`Missing index.json for locale 'en' in challenge '${challenge}'`);
    }
    try {
        indexExists(challenge, locale);
    } catch (e) {
        if (ignoreMissing) {
            return true;
        }
        throw new Error(`Missing index.json for locale '${locale}' in challenge '${challenge}'`);
    }
    return Promise.all(['en-US', locale].map(l => readJSON(path.join(LOCALES_PATH, l, challenge, 'index.json'))))
        .then(indices => {
            if (indices[0].scenes.length > indices[1].scenes.length) {
                throw new Error(`Missing scene in locale '${locale}' of challenge '${challenge}'`);
            }
            indices[0].scenes.forEach(scene => scene.__location = path.join(LOCALES_PATH, 'en-US', challenge));
            indices[1].scenes.forEach(scene => scene.__location = path.join(LOCALES_PATH, locale, challenge));
            return Promise.all(indices[0].scenes.map((scene, i) => validateChallengeLocaleScene(scene, indices[1].scenes[i])));
        });
}

function getSceneData(scene) {
    let data = scene.data || {};
    if (scene.data_path) {
        return readJSON(path.join(scene.__location, scene.data_path))
            .then(d => {
                Object.assign(data, d);
                return data;
            });
    } else {
        return Promise.resolve(data);
    }
}

function validateChallengeLocaleScene(scene, localeScene) {
    return Promise.all([
        getSceneData(scene),
        getSceneData(localeScene)
    ]).then(data => {
        let sceneData = data[0],
            localeSceneData = data[1];
        if (sceneData.steps.length > localeSceneData.steps.length) {
            throw new Error(`Missing steps in '${localeScene.__location}'`);
        }
        if (sceneData.mode !== localeSceneData.mode) {
            throw new Error(`Mode mismatch in '${localeScene.__location}'`);
        }
        if (!sceneData.parts.every((part, i) => localeSceneData.parts[i] === part)) {
            throw new Error(`Parts mismatch in '${localeScene.__location}'`);
        }
        if (!sceneData.modules.every((m, i) => localeSceneData.modules[i] === m)) {
            throw new Error(`Modules mismatch in '${localeScene.__location}'`);
        }
        if (!sceneData.variables.every((v, i) => localeSceneData.variables[i] === v)) {
            throw new Error(`Variables mismatch in '${localeScene.__location}'`);
        }
        return true;
    });
}

function validateChallenge(challenge, ignoreMissing) {
    return listFolders(LOCALES_PATH).then(locales => {
        locales = locales.filter(locale => locale !== 'en-US');
        return Promise.all(locales.map(locale => validateChallengeLocale(challenge, locale, ignoreMissing)));
    });
}

module.exports = {
    validateChallenges: function (ignoreMissing) {
        return listFolders(EN_CHALLENGES_PATH).then(challenges => {
            return Promise.all(challenges.map(ch => validateChallenge(ch, ignoreMissing)));
        });
    }
}
