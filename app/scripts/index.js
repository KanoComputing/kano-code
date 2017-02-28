(function () {
    var Bootstrap = {},
        MobileAlert = {},
        userAgent = window.navigator.userAgent;

    Bootstrap.loaded = false;
    Bootstrap.loadEventFired = false;
    Bootstrap.kanoAppInserted = false;

    Bootstrap.isCore = window.Kano.MakeApps.config.TARGET === 'osonline';
    Bootstrap.isPi = userAgent.indexOf('armv6l') !== -1 || userAgent.indexOf('armv7l') !== -1;

    Bootstrap.webComponentsSupported = ('registerElement' in document &&
                                        'import' in document.createElement('link') &&
                                        'content' in document.createElement('template'));

    Bootstrap.getLang = function () {
        return 'en-US';
    };

    /**
     * Redirects to the projects page on the Core Kit™ on first landing
     */
    Bootstrap.redirectCore = function () {
        if (Bootstrap.isCore && document.referrer === "") {
            location.href = 'https://world.kano.me/projects';
            return;
        }
        if (Bootstrap.isPi && location.href.indexOf('apps.kano.me') !== -1) {
            location.href = location.href.replace('apps.kano.me', 'make-apps-kit.kano.me');
            return;
        }
    };

    MobileAlert.hideSplash = function () {
        var splash = document.getElementById('splash');
        splash.style.opacity = 0;
        setTimeout(function () {
            clearTimeout(window.splashTimeoutId);
            splash.parentNode.removeChild(splash);
        }, 400);
    };

    MobileAlert.showAlertBox = function (showed) {
        var alertBox = document.getElementById('alert'),
            blocks = document.getElementById('blocks');
        if (showed) {
            blocks.parentNode.removeChild(blocks);
            alertBox.style.display = "flex";
        } else {
            alertBox.style.display = "none";
        }
    }

    MobileAlert.showContinueButton = function () {
        var button = document.getElementById('close-btn');
        button.style.display = 'inline-block';
        button.addEventListener('click', function () {
            MobileAlert.hideSplash();
        });
    };

    MobileAlert.isMobile = function () {
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        return width < 600;
    };

    MobileAlert.show = function (showButton) {
        if (MobileAlert.isMobile()) {
            if (!showButton) {
                MobileAlert.showAlertBox(true);
            } else {
                MobileAlert.showContinueButton();
            }
        } else {
            if (showButton) {
                MobileAlert.hideSplash();
            }
        }
    };

    MobileAlert.show(false);

    /**
     * Makes the transition between the splash and the app itself
     * Makes sure that the splash is displayed at least 1.5s to prevent flashing
     */
    Bootstrap.onFirstPageLoaded = function () {
        var duration = new Date() - Bootstrap.started;
        if (duration < 1500) {
            Bootstrap.timeout = setTimeout(Bootstrap.onFirstPageLoaded, 1500 - duration);
            return;
        }
        document.removeEventListener('kano-routing-load-finish', Bootstrap.onFirstPageLoaded);
        MobileAlert.show(true);
        Bootstrap.loaded = true;
    }

    Bootstrap.onElementsLoaded = function () {
        var app, splash;
        if (Bootstrap.kanoAppInserted) {
            return;
        }
        app = document.createElement('kano-app');
        splash = document.getElementById('splash');
        document.body.insertBefore(app, splash);
        document.addEventListener('kano-routing-load-finish', Bootstrap.onFirstPageLoaded);
        Bootstrap.kanoAppInserted = true;
    }

    /**
     * Imports the elements bundle and the messages depending on the locale
     */
    Bootstrap.lazyLoadElements = function () {
        var elements = [],
            lang = Bootstrap.getLang(),
            loaded = 0;

        elements.push('/elements/msg/' + lang + '.html');
        elements.push('/elements/elements.html');

        elements.forEach(function (elementURL) {
            var elImport = document.createElement('link');
            elImport.rel = 'import';
            elImport.href = elementURL;
            elImport.addEventListener('load', function () {
                loaded++;
                if (loaded === elements.length) {
                    Bootstrap.onElementsLoaded();
                }
            });
            document.head.appendChild(elImport);
        });
    }

    /**
     * Optionally load the webcomponents polyfill and then load the elements bundle
     */
    Bootstrap.deferLoading = function () {
        var wcPoly;
        // Race condition cause of safari fix hack
        if (Bootstrap.loadEventFired) {
            return;
        }
        Bootstrap.loadEventFired = true;
        clearTimeout(Bootstrap.loadTimeoutId);
        if (!Bootstrap.webComponentsSupported) {
            wcPoly = document.createElement('script');
            wcPoly.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
            wcPoly.onload = Bootstrap.lazyLoadElements;
            document.head.appendChild(wcPoly);
        } else {
            Bootstrap.lazyLoadElements();
        }
    };

    Bootstrap.registerSW = function () {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(function () {
                    // SW registration successfull
                })
                .catch(function (e) {
                    console.error(e);
                });
        } else {
            // Add fallback using appcache
            document.write('<iframe src="/appcache.html" width="0" height="0" style="display: none"></iframe>');
        }
    };

    Bootstrap.start = function () {
        Bootstrap.redirectCore();
        Bootstrap.started = new Date();
        // Attach the loading of the dependencies when the page is loaded
        if (window.addEventListener) {
            window.addEventListener('load', Bootstrap.deferLoading, false);
        } else if (window.attachEvent) {
            window.attachEvent('onload', Bootstrap.deferLoading);
        } else {
            window.onload = Bootstrap.deferLoading;
        }
        // I am ashamed of this hack, but sometimes safari just doesn't fire the load event :(
        Bootstrap.loadTimeoutId = setTimeout(Bootstrap.deferLoading, 1000);

        window.Polymer = {
            dom: 'shadow',
            lazyRegister: false,
            useNativeCSSProperties: true
        };

        Bootstrap.registerSW();
    };

    Bootstrap.start();

})();
