import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
// TODO: Route using something else
// import '../../../../../iron-lazy-pages/iron-lazy-pages.js';
import '@kano/web-components/kano-alert/kano-alert.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import { Config } from '../../scripts/kano/make-apps/actions/config.js';
import '../../scripts/kano/make-apps/actions/routing.js';
import '../../scripts/kano/make-apps/utils.js';
import { Router } from '../../scripts/kano/util/router.js';
import { Editor } from '../../scripts/kano/make-apps/actions/editor.js';
import 'page/page.js';

/*
 * Returns true iff client is a Pi. Please be aware that it is not a foolproof
 * method at the moment
 */
function isPi() {
    let userAgent = window.navigator.userAgent;

    return userAgent.indexOf('armv6l') !== -1 ||
           userAgent.indexOf('armv7l') !== -1;
}

/*
 * True when the Kano Code IDE runs embedded inside the Kano Electron App.
 */
function runningInKanoApp() {
    return window.navigator.userAgent.indexOf("Electron") > -1;
}

window.ClientUtil = window.ClientUtil || { isPi, runningInKanoApp };
class KanoRouting extends Store.StateReceiver(PolymerElement) {
    static get is() { return 'kano-routing'; }
    static get template() {
        return html`<style>
                    :host {
                        display: block;
                        @apply --layout-vertical;
                    }

                    :host iron-lazy-pages {
                        @apply --layout-vertical;
                        @apply --layout-flex;
                    }

                    :host iron-lazy-pages>* {
                        @apply --layout-flex;
                        overflow: auto;
                    }
                </style>
                <kano-alert id="mobile-info-dialog" heading="Coding on your mobile?" text="We’ve got something just for you!" entry-animation="from-big-animation" with-backdrop="">
                    <button class="kano-alert-primary" slot="actions" on-tap="_goToTapcode">Try it</button>
                </kano-alert>
                <iron-lazy-pages>
                    <template is="dom-if" data-route="story" data-path="../../views/kano-view-story/kano-view-story.js" restamp>
                        <kano-view-story show-save-prompt="{{leaveAlert}}"></kano-view-story>
                    </template>
                    <template is="dom-if" data-route="tutorial" data-path="../../views/kano-view-tutorial/kano-view-tutorial.js" restamp>
                        <kano-view-tutorial></kano-view-tutorial>
                    </template>
                    <template is="dom-if" data-route="editor" data-path="../../views/kano-view-editor/kano-view-editor.js" restamp>
                        <kano-view-editor show-save-prompt="{{leaveAlert}}"></kano-view-editor>
                    </template>
                    <template is="dom-if" data-route="flags" data-path="../../views/kano-view-flags/kano-view-flags.js" restamp>
                        <kano-view-flags></kano-view-flags>
                    </template>
                    <template is="dom-if" data-route="demo" data-path="../../views/kano-view-demo/kano-view-demo.js" restamp>
                        <kano-view-demo></kano-view-demo>
                    </template>
                </iron-lazy-pages>
            </template>
`;
    }
    static get properties() {
        return {
            context: {
                type: Object,
                linkState: 'routing.context',
            },
            user: {
                type: Object
            },
            page: {
                type: String,
                reflectToAttribute: true,
                observer: '_onPageChanged',
                linkState: 'routing.page',
            },
            loading: {
                type: Boolean,
                observer: '_loadingChanged',
            },
            leaveAlert: {
                type: Boolean,
                value: true,
                observer: '_onLeaveAlertChanged',
            },
        };
    }
    constructor() {
        super();
        this._exit = this._exit.bind(this);
        const { config } = this.getState();
        page('/', this._showPageThunk('editor'));
        page('/remix/:slug', this._showPageThunk('editor'));
        page('/demo', this._showPageThunk('demo'));
        page('/story/:id', this._showPageThunk('story'));
        page('/tutorial', this._showPageThunk('tutorial'));
        page('/app/:slug', (ctx) => {
            window.location = config.WORLD_URL + "/shared/" + ctx.params.slug;
        });
        // Add the flags page when not in production
        if (config.ENV !== 'production') {
            page('/flags', this._showPageThunk('flags'));
        }
        // Fallback to / if no match is found
        page('*', () => {
            page.redirect('/' + document.location.search);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('exit-confirmed', this._exit);
        page(); // force trigger the initial root page
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('exit-confirmed', this._exit);
    }
    /**
     * Creates a function to be used by page.js
     * @param  {String} name  Name of the view component to load
     * @return {Function}     A function ready to be used in page.js
     */
    _showPageThunk(name) {
        return (ctx) => {
            this.dispatch({ type: 'UPDATE_CONTEXT', context: ctx });
            // Set the page to null, before the real value to force a restamp of the view
            if (this.page === name) {
                this.dispatch({ type: 'UPDATE_PAGE', page: null });
            }
            this.dispatch({ type: 'UPDATE_PAGE', page: name });
        };
    }
    _computeLoadingClass(loading) {
        return loading ? 'loading' : '';
    }
    _isMobile() {
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        return viewportWidth < 600;
    }
    _loadingChanged(newValue, oldValue) {
        // When loading goes from true to false, trigger an event to notify a page load end
        if (oldValue === true && newValue === false) {
            this.dispatchEvent(new CustomEvent('kano-routing-load-finish', { bubbles: true, composed: true }));
            if (this._isMobile()) {
                this.$['mobile-info-dialog'].open();
            }
        }
    }
    _onLeaveAlertChanged(alert) {
        if (alert) {
            window.onbeforeunload = () => {
                return 'Any unsaved changes to your app will be lost. Continue?';
                return false;
            }
        } else {
            window.onbeforeunload = null;
        }
    }
    _onPageChanged() {
        let disableLogout;

        const { config, editor } = this.getState();

        const host = Router.parseQsParam(this.context.querystring, 'host');
        const port = Router.parseQsParam(this.context.querystring, 'port');
        const worldUrl = Router.parseQsParam(this.context.querystring, 'worldUrl');
        const projectsUrl = Router.parseQsParam(this.context.querystring, 'projectsUrl');
        const disableLogoutQuery = Router.parseQsParam(this.context.querystring, 'disableLogout');

        Config.updateConfigKey('HOST', host, config.HOST);
        Config.updateConfigKey('PORT', port, config.PORT);
        Config.updateConfigKey('WORLD_URL', worldUrl, config.WORLD_URL);
        Config.updateConfigKey('PROJECTS_URL', projectsUrl, config.PROJECTS_URL);
        
        
        if (disableLogoutQuery === null) {
            disableLogout = !editor.logoutEnabled;
        } else if (disableLogoutQuery === 'false' || disableLogoutQuery === '0') {
            disableLogout = false;
        }
        
        Editor.updateLogoutEnabled(!disableLogout);
        
        /* For compatibility with old Kano2 App we enable the Hardware API when
        * Kano Code runs within electron.
        *
        * WARNING: This will be removed in the future. For future applications,
        *          always explicitely use the query string to enable hardware support.
        */
        Config.updateConfigKey('USE_HARDWARE_API', ClientUtil.runningInKanoApp(), config.USE_HARDWARE_API);
       
        const hardwareQuery = Router.parseQsParam(this.context.querystring, 'hardware');
        if (hardwareQuery) {
            Config.updateConfigKey('USE_HARDWARE_API', hardware !== 'false', config.USE_HARDWARE_API);
        }
        this.updateView();
    }
    updateView() {
        const { page } = this;
        let template;
        const templates = this.shadowRoot.querySelectorAll('dom-if');
        for (let i = 0; i < templates.length; i += 1) {
            template = templates[i];
            // Enable or disable template depending on route match
            template.if = template.dataset.route === page;
            if (template.if) {
                this.loading = true;
                import(template.dataset.path)
                    .then(() => {
                        this.loading = false;
                    })
            }
        }
    }
    _goToTapcode() {
        const { config } = this.getState();
        this.leaveAlert = false;
        location.href = `${config.TAPCODE_URL}/challenge/line_burst`;
    }
    _exit() {
        const { config } = this.getState();
        this.leaveAlert = false;
        location.href = config.PROJECTS_URL;
    }
}
customElements.define(KanoRouting.is, KanoRouting);
