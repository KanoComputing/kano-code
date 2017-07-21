'use strict';

let webdriver = require('selenium-webdriver'),
    fs = require('fs'),
    path = require('path'),
    should = require('should'),
    user = null,
    capability = webdriver.Capabilities.chrome(),
    driver;

const DEFAULT_TIMEOUT = process.env.EXTERNAL_SERVER ? 20000 : 10000,
      // testing user creating in staging env
      USER = {
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAa2Fuby5tZSIsInVzZXJuYW1lIjoiYXV0b21hdGVkLXRlc3QiLCJpYXQiOjE0NjMyMjkxMDR9.-wowXt2oF7iCSuyxxfcJJoirsYsT0-dwbbe9FxhIusU'
        },
      INIT_SCRIPT = fs.readFileSync(path.join(__dirname, '../../scripts/init.js')).toString(),
      ELEMENTS_SELECTORS = {},
      EDITOR_SELECTORS = {};

ELEMENTS_SELECTORS.editor = {
    editor: ['kano-app-editor']
};

EDITOR_SELECTORS['Add Parts'] = ['kano-workspace', 'kano-editor-normal', 'kano-default-workspace', '#add-part-button'];
EDITOR_SELECTORS['Add Parts Dialog'] = ['#parts-modal'];
EDITOR_SELECTORS['done in add parts dialog'] = ['kano-add-parts', 'header button'];
EDITOR_SELECTORS['Confirm part deletion dialog'] = ['#dialog-confirm-delete'];
EDITOR_SELECTORS['Default workspace'] = ['kano-workspace', 'kano-editor-normal', 'kano-default-workspace'];

user = USER;

function buildDriver(capability) {
    return new webdriver.Builder()
        .withCapabilities(capability)
        .build();
}

if (process.env.CAPABILITY) {
    try {
        capability = JSON.parse(process.env.CAPABILITY);
    } catch (e) {
        capability = webdriver.Capabilities[process.env.CAPABILITY]();
    }
} else {
    capability = webdriver.Capabilities.chrome();
}

driver = buildDriver(capability);
if (capability.browserName !== 'safari') {
    driver.manage().timeouts().setScriptTimeout(DEFAULT_TIMEOUT);
    driver.manage().timeouts().pageLoadTimeout(DEFAULT_TIMEOUT);
    driver.manage().timeouts().implicitlyWait(DEFAULT_TIMEOUT);
}

function getDriver() {
    return driver;
}

function getPort() {
    return process.env.TEST_PORT || 4444;
}

function logoutUser() {
    user = null;
    return Promise.resolve();
}
function loginUser() {
    user = USER;
    return Promise.resolve();
}

class World {
    constructor () {
        this.webdriver = webdriver;
        this.driver = driver;

        this.shadowEnabled = false;
        this.routeMap = {
            'editor': '/',
            'story': '/story'
        };

        this.loginUser = loginUser;
        this.logoutUser = logoutUser;

        this.store = {};
    }
    setup () {
        this.driver.executeScript(INIT_SCRIPT);
    }
    getLogs () {
        return this.driver.manage().logs().get('browser');
    }
    getEditorFromPage (page) {
        return ELEMENTS_SELECTORS[page].editor;
    }
    getEditorElement (element) {
        return this.waitForEditorReady()
            .then(() => this.getCurrentViewElement())
            .then(viewElement => {
                let selectors = this.getEditorFromPage(this.page)
                if (element) {
                    selectors = selectors.concat(EDITOR_SELECTORS[element]);
                }
                return this.findElement(viewElement, selectors);
            });
    }
    waitForEditorReady () {
        return this.driver.wait(() => {
            return this.getCurrentViewElement()
                .then(viewElement => {
                    return this.findElement(viewElement, this.getEditorFromPage(this.page));
                }).then(editorElement => {
                    return this.driver.executeScript('return arguments[0].modeReady', editorElement);
                })
        }, 4000);
    }
    isRouteLoaded () {
        return this.driver.executeScript(`return window.__routeLoaded__;`);
    }
    waitForRouteLoad () {
        driver.wait(() => {
            return this.isRouteLoaded();
        }, 8000, `Page didn't load`);
    }
    waitForPage (page, timeout=2000) {
        return driver.wait(() => {
            return this.driver.executeScript(`return window.__currentPage__ === '${page}';`);
        }, timeout, `Page '${page}' not displayed`);
    }
    getCurrentViewElement () {
        let element;
        return this.driver.wait(() => {
            return this.driver.executeScript(`return window.__routingEl__.$$('.iron-selected');`)
                .then(e => {
                    element = e;
                    return !!element;
                });
        }, 2000).then(() => element);
    }
    findElement (root, selectors) {
        return this.driver.executeScript('return window.__findElement__(arguments[0], arguments[1])', root, selectors);
    }
    findElements (root, selector) {
        return this.driver.executeScript(`return arguments[0].querySelectorAll('${selector}')`, root);
    }
    waitForElementToBeVisible (element, timeout=2000) {
        return this.driver.wait(() => {
            return this.driver.executeScript('return window.__isVisible__(arguments[0])', element)
                .then(visible => visible.should.be.true());
        }, timeout, 'Element is not visible');
    }
    ensureElementIsNotVisible (element, timeout=200) {
        return this.driver.wait(() => {
            return this.driver.executeScript('return window.__isVisible__(arguments[0])', element)
            .then(visible => visible.should.be.false());
        }, timeout, 'Element is visible');
    }
    getPartById (editorEl, partId) {
        return this.driver.executeScript('return window.__getPartByIdFromEditor__(arguments[0], arguments[1]);', editorEl, partId);
    }
    ensurePartDoesNotExist (editorEl, partId) {
        return this.getPartById(editorEl, partId)
            .then(part => should.not.exist(part));
    }
    ensurePartExists (editorEl, partId) {
        return this.getPartById(editorEl, partId)
            .then(part => should.exist(part));
    }
    /**
     * Empty the localStorage
     */
    clearStorage () {
        return this.driver.executeScript(`localStorage.clear('KW_TOKEN', arguments[0]);`, this.user);
    }
    /**
     * Open the app to a speficied route
     */
    openApp (page, ext) {
        let route,
            viewPath;
        ext = ext || '';
        page = page || 'editor';
        route = this.routeMap[page];
        if (!route) {
            return Promise.reject(new Error(`Tried to open a non registered page: ${page}`));
        }
        this.page = page;
        return this.driver.get(`http://localhost:${getPort()}${route}${ext}`)
            .then(() => this.clearStorage())
            .then(() => {
                if (user) {
                    return this.driver.executeScript(`
                        localStorage.setItem('KW_TOKEN', '${user.token}');
                        `);
                }
            })
            .then(() => this.setup())
            .then(() => this.waitForRouteLoad(viewPath))
            .then(() => this.waitForPage(page));
    }
    openAddPartsDialog () {
        return this.getEditorElement('Add Parts')
            .then(button => button.click())
            .then(() => this.getEditorElement('Add Parts Dialog'))
            .then(dialog => {
                return this.wait(500)
                    .then(() => this.waitForElementToBeVisible(dialog))
                    .then(() => dialog);
            });
    }
    getPartsInAddPartsDialog (dialog) {
        return this.driver.executeScript(`return arguments[0].querySelector('kano-add-parts').shadowRoot`, dialog)
            .then(addPartsEl => this.findElements(addPartsEl, '.categories  kano-add-parts-item'));
    }
    addPart (dialog) {
        let key = `__addedPart__${Date.now()}__`;
        return this.getEditorElement()
            .then(editorEl => {
                return this.driver.executeScript(`arguments[0].addEventListener('added-parts-changed', function (e) {
                    if (e.detail.path === 'addedParts.#0') {
                        window.${key} = e.detail.value.id;
                    }
                })`, editorEl);
            })
            .then(() => this.getPartsInAddPartsDialog(dialog))
            .then(partsEls => {
                let idx = Math.floor(Math.random() * partsEls.length);
                return partsEls[idx].click();
            })
            .then(() => {
                return this.driver.wait(() => {
                    return this.driver.executeScript(`return window.${key};`);
                }, 2000);
            });
    }
    wait (duration) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }
}

module.exports.World = World;
module.exports.getDriver = getDriver;
module.exports.getPort = getPort;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
