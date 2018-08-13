const Router = {};

/*
* Parse query string parameters
*/
Router.parseQsParam = function (qs, name) {
    var regex,
        res;

    if (qs[0] !== '?') {
        qs = '?' + qs;
    }

    if (qs.length > 1) {
        regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        res = regex.exec(qs);
        if (res && res[2]) {
            return decodeURIComponent(res[2].replace(/\+/g, " "));
        }
    }

    return null;
}

export { Router };
