/*
 * DOM utility module
 *
 * A small module containing utilities to work with the DOM
 */

const VENDOR_PREFIXES = [ '', '-ms-', '-webkit-', '-moz-', '-o-' ];

/*
 * Returns true if element has given className
 *
 * @param {HTMLElement} element
 * @return {Boolean}
 */
function hasClass(element, className) {
    return element.className.split(' ').indexOf(className) !== -1;
}

/*
 * Removes class from element if it currently has it
 *
 * @param {HTMLElement} element
 * @param {String} className
 */
function removeClass(element, className) {
    var classNames = element.className.split(' ');

    if (!hasClass(element, className)) {
        return;
    }

    classNames.splice(classNames.indexOf(classNames), 1);
    element.className = classNames.join(' ');
}

/*
 * Adds class to element if doesn't currently have it
 *
 * @param {HTMLElement} element
 * @param {String} className
 */
function addClass(element, className) {
    if (hasClass(element, className)) { return; }

    element.className += ' ' + className;
}

/*
 * Toggles class on element - adds it or removes it if a state value is passed
 * depending wether it's truthy of not
 *
 * @param {HTMLElement} element
 * @param {String} className
 * @param {Boolean=} state
 */
function toggleClass(element, className, state) {
    state = typeof state !== 'undefined' ? state : !hasClass(element, className);

    if (state) {
        addClass(element, className);
    } else {
        removeClass(element, className);
    }
}

/*
 * Given element is parent or a parent's child
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 */
function isIn(element, parent) {
    while (element.parentNode) {
        if (element === parent) { return true; }
        element = element.parentNode;
    }

    return false;
}

/*
 * Set inline CSS property to element with all vendor prefixes
 *
 * @param {HTMLElement} element
 * @param {String} property
 * @param {String} value
 */
function addVendorProperty(element, property, value) {
    var prefix;

    for (prefix of VENDOR_PREFIXES) {
        element.style[prefix + property] = value;
    }
}

/*
 * Unset inline CSS property of element with all vendor prefixes
 *
 * @param {HTMLElement} element
 * @param {String} property
 * @param {String} value
 */
function removeVendorProperty(element, property) {
    var prefix;

    for (prefix of VENDOR_PREFIXES) {
        element.style[prefix + property] = null;
    }
}

/*
 * Simulate mouse event on element with given x and y coordinates
 *
 * @param {HTMLElement} element
 * @param {Number} x
 * @param {Number} y
 */
function triggerMouseEvent(element, type = 'click', x = 0, y = 0) {
    var ev = document.createEvent('MouseEvent');

    ev.initMouseEvent(
        type, true, true, window, null, x, y,
        0, 0, false, false, false, false, 0, null
        );

    var evObj = document.createEvent('Events');

    evObj.initEvent(type, true, false);
    element.dispatchEvent(ev);
}

/*
 * Simulate click events on element with given x and y coordinates
 *
 * @param {HTMLElement} element
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} mouseDownOnly
 */
function click(element, x = 0, y = 0, mouseDownOnly = false) {
    triggerMouseEvent(element, 'mousedown', x, y);

    if (!mouseDownOnly) {
        triggerMouseEvent(element, 'click', x, y);
        triggerMouseEvent(element, 'mouseup', x, y);
    }
}

export { hasClass, toggleClass, addClass, removeClass, isIn, addVendorProperty, removeVendorProperty, click };
