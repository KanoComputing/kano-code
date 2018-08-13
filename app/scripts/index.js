import { BlockAnimation } from './splash.js';
import { config } from './config/config.js';
import I18n from '../lib/i18n/index.js';

window.Kano = window.Kano || {};
window.Kano.MakeApps = window.Kano.MakeApps || {};
window.Kano.MakeApps.Msg = window.Kano.MakeApps.Msg || {};

const { userAgent } = window.navigator;

const Bootstrap = {
    loaded: false,
    loadEventFired: false,
    kanoAppInserted: false,
    isCore: config.TARGET === 'osonline',
    isPi: userAgent.indexOf('armv6l') !== -1 || userAgent.indexOf('armv7l') !== -1,
    getLang() {
        return 'en-US';
    },
    redirectCore() {
        if (this.isCore && document.referrer === '') {
            window.location.href = 'https://world.kano.me/projects';
            return;
        }
        if (Bootstrap.isPi && window.location.href.indexOf('apps.kano.me') !== -1) {
            window.location.href = window.location.href.replace('apps.kano.me', 'make-apps-kit.kano.me');
        }
    },
    /**
     * Makes the transition between the splash and the app itself
     * Makes sure that the splash is displayed at least 1.5s to prevent flashing
     */
    onFirstPageLoaded() {
        const duration = new Date() - Bootstrap.started;
        const splash = document.getElementById('splash');
        document.removeEventListener('kano-routing-load-finish', Bootstrap.onFirstPageLoaded);
        if (duration < 1500) {
            Bootstrap.timeout = setTimeout(Bootstrap.onFirstPageLoaded, 1500 - duration);
            return;
        }

        // Hide and delete splash animation
        splash.style.opacity = 0;
        setTimeout(() => {
            clearTimeout(window.splashTimeoutId);
            splash.parentNode.removeChild(splash);
        }, 400);

        Bootstrap.loaded = true;
    },
    onElementsLoaded() {
        if (this.kanoAppInserted) {
            return;
        }
        const editor = document.createElement('kano-app');
        const splash = document.getElementById('splash');
        document.body.insertBefore(editor, splash);
        document.addEventListener('kano-routing-load-finish', Bootstrap.onFirstPageLoaded);
        Bootstrap.kanoAppInserted = true;
    },
    addBlocklyMsg(msg) {
        window.CustomBlocklyMsg = window.CustomBlocklyMsg || {};
        Object.assign(window.CustomBlocklyMsg, msg);
    },
    /**
     * Imports the elements bundle and the messages depending on the locale
     */
    lazyLoadElements() {
        const lang = this.getLang();

        Promise.all([
            I18n.load(`/locale/editor/${lang}.json`),
            I18n.load(`/locale/blockly/${lang}.json`).then(m => this.addBlocklyMsg(m)),
            I18n.load(`/node_modules/@kano/kwc-blockly/blockly_built/msg/json/constants.json`).then(m => this.addBlocklyMsg(m)),
            I18n.load(`/node_modules/@kano/kwc-blockly/blockly_built/msg/json/en.json`).then(m => this.addBlocklyMsg(m)),
            import('../elements/elements.js'),
        ]).then(() => {
            this.onElementsLoaded();
        });
    },
    /**
     * Optionally load the webcomponents polyfill and then load the elements bundle
     */
    deferLoading() {
        // Race condition cause of safari fix hack
        if (this.loadEventFired) {
            return;
        }
        this.loadEventFired = true;
        clearTimeout(this.loadTimeoutId);
        this.lazyLoadElements();
    },
    registerSW() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => {
                    // SW registration successfull
                })
                .catch((e) => {
                    console.error(e);
                });
        } else {
            // Add fallback using appcache
            document.write('<iframe src="/appcache.html" width="0" height="0" style="display: none"></iframe>');
        }
    },
    start() {
        this.redirectCore();
        this.splash = new BlockAnimation(document.getElementById('blocks'));
        this.splash.init();
        this.started = new Date();
        // Attach the loading of the dependencies when the page is loaded
        if (window.addEventListener) {
            window.addEventListener('load', this.deferLoading.bind(this), false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', this.deferLoading.bind(this));
        } else {
            window.onload = this.deferLoading.bind(this);
        }
        // I am ashamed of this hack, but sometimes safari just doesn't fire the load event :(
        this.loadTimeoutId = setTimeout(this.deferLoading.bind(this), 1000);

        this.registerSW();
    },
};

Bootstrap.start();
