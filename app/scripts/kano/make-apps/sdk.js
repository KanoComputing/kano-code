import KanoSharedStorageClient from 'kano-shared-storage-client/kano-shared-storage-client.js';
function stringifyIfObject(val) {
    return typeof val === 'object' ? JSON.stringify(val) : val;
}

function addMultipartData(formData, data) {
    var key, arr, i;

    for (key in data) {
        if (data.hasOwnProperty(key) && key !== 'files') {
            if (data[key] instanceof Array) {
                arr = data[key];

                for (i = 0; i < arr.length; i += 1) {
                    formData.append(key + '[' + i + ']', stringifyIfObject(arr[i]));
                }
            } else {
                formData.append(key, stringifyIfObject(data[key]));
            }
        }
    }
}
function addFiles(formData, files) {
    var file, arr, key, i = 0, filename;

    for (key in files) {
        if (files.hasOwnProperty(key) && files[key]) {

            if (files[key] instanceof Array) {
                arr = files[key];
                filename = arr[i].filename || arr[i].name || null;

                for (i = 0; i < arr.length; i += 1) {
                    formData.append(key + '[' + i + ']', arr[i]);
                }
            } else {
                file = files[key];
                filename = file.filename || file.name || null;
                formData.append(key, file, filename);
            }
        }
    }
}

let token = null;
let user = null;

const clients = new Map();

class SDK {
    constructor(config) {
        this.config = config;
        if (!clients.has(this.config.SHARED_STORAGE_URL)) {
            clients.set(this.config.SHARED_STORAGE_URL, new KanoSharedStorageClient({ sharedStorageURL: this.config.SHARED_STORAGE_URL }));
        }
        this.sharedStorage = clients.get(this.config.SHARED_STORAGE_URL);
    }
    getShareBySlug(slug) {
        return fetch(`${this.config.API_URL}/share/slug/${slug}`)
            .then(res => res.json());
    }
    getToken() {
        return token;
    }
    setToken(t) {
        token = t;
        this.sharedStorage.setToken(t);
    }
    getUser() {
        return user;
    }
    initSession() {
        return this.sharedStorage.getToken()
            .then(token => this.getAuthSession(token))
            .then((session) => {
                token = session.token;
                user = session.user;
                return session.user;
            });
    }
    logout() {
        token = null;
        user = null;
        this.sharedStorage.deleteToken();
    }
    getAuthSession(token) {
        const headers = new Headers();
        headers.append('Accepts', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);
        return fetch(`${this.config.API_URL}/auth/session`, {
            headers: headers,
            mode: 'cors'
        })
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error(res.statusText);
            }
        })
        .then(res => res.session);
    }
    getProgress() {
        const token = this.getToken();
        const headers = new Headers({
            Authorization: `Bearer ${token}`
        });
        return fetch(`${this.config.API_URL}/progress`, { headers })
            .then(res => res.json());
    }
    getUserByUsername(username) {
        const token = this.getToken();
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
        });
        return fetch(`${this.config.API_URL}/users/username/${username}`, { headers })
            .then(res => res.json());
    }
    postShare(shareData) {
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
        });
        const { files } = shareData;
        let body;
        if (files) {
            const formData = new FormData();
            addMultipartData(formData, shareData);
            addFiles(formData, files);
            body = formData;
        } else {
            headers.append('Content-type', 'application/json; charset=utf-8');
            body = JSON.stringify(shareData);
        }
        return fetch(`${this.config.API_URL}/share/${shareData.app}`, { method: 'POST', headers, body })
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error(res.statusText);
                }
            });
    }
    attachToShare(attachmentData) {
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
        });
        const { files } = attachmentData;
        let body;
        if (files) {
            const formData = new FormData();
            addMultipartData(formData, attachmentData);
            addFiles(formData, files);
            body = formData;
        } else {
            headers.append('Content-type', 'application/json; charset=utf-8');
            body = JSON.stringify(attachmentData);
        }
        return fetch(`${this.config.API_URL}/share/attach/${attachmentData.id}`, { method: 'POST', headers, body })
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error(res.statusText);
                }
            });
    }
    setAppStat(app, data) {
        const stats = {};
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
        });
        stats[app] = data;
        const body = JSON.stringify({ stats });
        return fetch(`${this.config.API_URL}/users/profile`, { method: 'PUT', headers, body })
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error(res.statusText);
                }
            });
    }
    getAppStat(app) {
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
        });
        const { id } = this.getUser();
        return fetch(`${this.config.API_URL}/users/${id}`, { headers })
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error(res.statusText);
                }
            })
            .then(res => res.user.profile.stats[app]);
    }
}

export { SDK };
