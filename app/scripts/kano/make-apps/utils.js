(function (Kano) {
    var Utils = {};
    Kano.MakeApps = Kano.MakeApps || {};
    Kano.MakeApps.Utils = Utils;

    /**
     * Fetch a part API file from the part type and prefix
     */
    function fetchPartAPI(prefix, partType) {
        return fetch(`/scripts/kano/make-apps/behaviors/${prefix}-${partType}-behavior.js`)
            .then(r => {
                if (!r.ok) {
                    return Promise.reject();
                }
                return r.text();
            }).catch(e => {
                
            });
    }

    Utils.sendToKit = (p, app) => {
        // Create a body object containing the app for the program
        let program = {
            parts: app.parts,
            code: app.code.snapshot.javascript,
            mode: app.mode
        },
            headers = new Headers(),
            getPartsAPICode = fetch('/scripts/kano/make-apps/parts-api/parts-api.js')
                .then(r => {
                    if (!r.ok) {
                        return Promise.reject();
                    }
                    return r.text();
                }),

            getAppModulesCode = fetch('/scripts/kano/app-modules/index.js')
                .then(r => {
                    if (!r.ok) {
                        return Promise.reject();
                    }
                    return r.text();
                }),

            promises = [getPartsAPICode, getAppModulesCode];

        // Get the parts API code bundle that contains the whole parts definition
        Promise.all(promises).then(codes => {
                program.partsAPI = codes[0];
                program.appModules = codes[1];
                headers.set('Content-Type', 'application/json');
                // Send the program to the kit
                return fetch(`http://localhost:3000/program/${p}`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ program })
                });
            });
    };

})(window.Kano = window.Kano || {});
