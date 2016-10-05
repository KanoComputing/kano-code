(function () {
    var webComponentsSupported = ('registerElement' in document &&
        'import' in document.createElement('link') &&
        'content' in document.createElement('template')),
        msg = 'Loading',
        loaded = false,
        loadEventFired = false,
        kanoAppInserted = false,
        loadTimeoutId, started,
        timeout, wcPoly,
        isCore, userAgent,
        isPi;


    /**
     * Redirects to the projects page on the Core Kit™ on first landing
     */
    isCore = window.TARGET === 'osonline';
    userAgent = window.navigator.userAgent;
    isPi = userAgent.indexOf('armv6l') !== -1 || userAgent.indexOf('armv7l') !== -1;

    if (isCore && document.referrer === "") {
        location.href = 'https://world.kano.me/projects';
        return;
    }
    if (isPi && location.href.indexOf('apps.kano.me') !== -1) {
        location.href = location.href.replace('apps.kano.me', 'make-apps-kit.kano.me');
        return;
    }

    /**
     * Makes the transition between the loader and the app itself
     * Makes sure that the loader is displayed at least 1.5s to prevent flashing
     */
    function onFirstPageLoaded() {
        var duration = new Date() - started,
            loader,
            logo;
        if (duration < 1500) {
            timeout = setTimeout(onFirstPageLoaded, 1500 - duration);
            return;
        }
        document.removeEventListener('kano-routing-load-finish', onFirstPageLoaded);
        loader = document.getElementById('loader');
        logo = document.getElementById('logo');
        loader.className += ' animate-out';
        logo.className += ' animate-out';
        loaded = true;
        setTimeout(function () {
            loader.parentNode.removeChild(loader);
        }, 400);
    }

    function startBreathing() {
        setTimeout(function () {
            var title = document.getElementById('title');
            if (!title) {
                return;
            }
            title.className += ' animate-breathe';
        }, 300);
    }

    function onElementsLoaded() {
        if (kanoAppInserted) {
            return;
        }
        var app = document.createElement('kano-app'),
            loader = document.getElementById('loader');
        document.body.insertBefore(app, loader);
        document.addEventListener('kano-routing-load-finish', onFirstPageLoaded);
        kanoAppInserted = true;
    }

    /**
     * Imports the elements bundle
     */
    function lazyLoadElements() {
        var elements = [
            '/elements/elements.html'
        ];

        elements.forEach(function (elementURL) {
            var elImport = document.createElement('link');
            elImport.rel = 'import';
            elImport.href = elementURL;
            elImport.addEventListener('load', onElementsLoaded);
            document.head.appendChild(elImport);
        });
    }

    /**
     * Optionally load the webcomponents polyfill and then load the elements bundle
     */
    function deferLoading() {
        // Race condition cause of safari fix hack
        if (loadEventFired) {
            return;
        }
        loadEventFired = true;
        clearTimeout(loadTimeoutId);
        // Animate the loader to keep the user chill
        animateLoader();
        if (!webComponentsSupported) {
            wcPoly = document.createElement('script');
            wcPoly.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
            wcPoly.onload = lazyLoadElements;
            document.head.appendChild(wcPoly);
        } else {
            lazyLoadElements();
        }
    }

    /**
     * Display a random fact about coding, and shows a binary to text loading message
     */
    function animateLoader() {
        var messageBoard = document.getElementById('message-board'),
            funFacts = [
                'Code is a set of instructions (or rules) that computers can understand',
                'People write code, code powers computers and computers power many everyday objects like phones, watches, microwaves and cars',
                'Almost anything powered by electricity uses code',
                'There are many names for people who code: coders, programmers, developers, computer scientists, software engineers, etc.',
                'Computers run on binary code—written in 1s and 0s—which is very difficult for humans to work with',
                'Computers can understand different languages (like Python, C, C++, Javascript, Lua...) which translate our instructions into binary',
                'Learning to code is like learning a new language (learning to construct sentences, etc.)',
                'A text file written in a particular language is called a program',
                'Ada Lovelace is the first computer programmer. She created the first program ever',
                'The first video game was created in 1961'
            ],
            rndIndex = Math.floor(Math.random() * funFacts.length),
            title = document.getElementById('title'),
            loader = document.getElementById('loader'),
            letters = [],
            msgCopy = msg,
            updateLetter,
            len,
            i;

        updateLetter = function (i) {
            setTimeout(function () {
                var l = msgCopy.split('');
                l[i] = letters[i].shift();
                msgCopy = l.join('');
                title.innerText = msgCopy + '   ';
                if (!letters[i].length) {
                    l = msgCopy.split('');
                    l[i] = msg[i];
                    msgCopy = l.join('');
                    title.innerText = msgCopy + '   ';
                    startBreathing();
                    return;
                }
                updateLetter(i);
            }, (Math.random() * 100) + 50);
        };

        for (i = 0, len = msgCopy.length; i < len; i++) {
            letters.push(msgCopy[i].charCodeAt(0).toString(2).split(''));
            updateLetter(i);
        }
        started = new Date();
        messageBoard.innerText = funFacts[rndIndex];
        loader.style.opacity = 1;
    }


    // Attach the loading of the dependencies when the page is loaded
    if (window.addEventListener) {
        window.addEventListener("load", deferLoading, false);
    } else if (window.attachEvent) {
        window.attachEvent("onload", deferLoading);
    } else {
        window.onload = deferLoading;
    }

    // I am ashamed of this hack, but sometimes safari just doesn't fire the load event :(
    loadTimeoutId = setTimeout(deferLoading, 1000);

    window.Polymer = {
        dom: 'shadow',
        lazyRegister: false
    };

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

})();
