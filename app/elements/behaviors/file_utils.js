/* globals unescape */

/**
 * @namespace FileUtils
 */
window.FileUtils = window.FileUtils || {};

/*
 * Convert base64/URLEncoded data component to raw binary data held in a string
 *
 * @param {String} dataURI
 * @return Blob
 */
window.FileUtils.dataURItoBlob = function dataURItoBlob(dataURI) {
    let byteString,
        mimeString,
        ia,
        i;

    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    ia = new Uint8Array(byteString.length);
    for (i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
};
