let email;

export default email = {
    send (data) {
        let mail_data = {
            "type": "apps-share",
            "options"         : {
                "from_name"   : data.name || "",
                "from_email"  : "",
                "to_name"     : "",
                "to_email"    : data.email || "",
                "message"     : "",
                "title"       : data.title || "",
                "url"         : data.url || "",
                "cover_url"   : ""
            }
        };

        return fetch(Kano.MakeApps.config.API_URL + '/mail', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mail_data)
        })
        .then(function (response) {
            return response.json();
        });
    }
};
