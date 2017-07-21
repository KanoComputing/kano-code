var listener;

window.__pageChanged__ = function (newValue) {
    window.__currentPage__ = newValue;
};

listener = function (e) {
    window.removeEventListener('kano-routing-load-finish', listener);
    window.__routeLoaded__ = true;
    window.__routingEl__ = e.path ? e.path[0] : e.target;
    window.__routingEl__.addEventListener('page-changed', window.__pageChanged__);
    window.__currentPage__ = window.__routingEl__.page;
};
window.addEventListener('kano-routing-load-finish', listener);

window.__findElement__ = function (root, selectors) {
    function findElement(selectors) {
        var currentElement = root, i;
        if (currentElement.shadowRoot) {
            currentElement = currentElement.shadowRoot;
        }
        for (i = 0; i < selectors.length; i++) {
            if (i > 0) {
                currentElement = currentElement.shadowRoot;
            }

            currentElement = currentElement.querySelector(selectors[i]);

            if (!currentElement) {
                break;
            }
        }

        return currentElement;
    }

    if (!(document.body.createShadowRoot || document.body.attachShadow)) {
        selectors = [selectors.join(' ')];
    }
    return findElement(selectors);
};

window.__findElements__ = function (root, selector) {
    return root.querySelectorAll(selector);
};

window.__isVisible__ = function (element) {
    var rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
};

window.__getPartByIdFromEditor__ = function (editorEl, partId) {
    let part, i;
    for (i = 0; i < editorEl.addedParts.length; i++) {
        part = editorEl.addedParts[i];
        if (part.id === partId) {
            return part;
        }
    }
    return null;
}


Object.defineProperty(window, 'onbeforeunload', {
    get: function () {
        return null;
    },
    set: () => {}
});
