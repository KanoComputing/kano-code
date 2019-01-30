import { Store } from '../../scripts/kano/make-apps/store.js';

// @polymerBehavior
export const ViewBehavior = {
    properties: {
        context: {
            type: Object
        },
        user: {
            type: Object,
            notify: true
        }
    },
    created () {
        this.notifyOnLoad = true;
    },
    attached () {
        const { config } = Store.getState();
        this.config = config;
        if (this.notifyOnLoad) {
            this.fire('view-loaded');
        }
        this.async(() => {
            this.fire('ga-page-tracking-event', {
                title: document.title,
                path: window.location.pathname
            });
            this.fire('page-view', {
                path: window.location.pathname
            });
        });
    }
};
