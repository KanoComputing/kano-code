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

window.dataLayer = window.dataLayer || [];

// @polymerBehavior
export const GABehavior = {
      properties: {
          account: {
              type: Boolean,
              value: false
          },
          userType: {
              type: String,
              value: null
          },
          visitType: {
              type: String,
              value: null
          }
      },
      /**
       * Check whether the user has ever had an account
       */
      checkAccount () {
          let account = this.account || this.checkVisitType() === 'Logged in' || ClientUtil.isPi();
          if (!account) {
              let storedAccount = localStorage.getItem('KW_ACCOUNT');
              account = storedAccount ? JSON.parse(storedAccount) : false;
          };
          this.set('account', account);
          return account;
      },
      /**
       * Check whether the user is using a Kano Kit
       */
      checkUserType () {
          let userType = this.userType;
          if (!userType) {
              userType = ClientUtil.isPi() ? 'paid' : 'free';
          }
          this.set('userType', userType);
          return userType;
      },
      /**
       * Function for checking number of challenges completed this session
       */
      checkUserProgress () {
          let storedProgress = sessionStorage.getItem('KW_PROGRESS'),
              userProgress;
          if (storedProgress) {
              userProgress = JSON.parse(storedProgress);
          } else {
              userProgress = {
                  completedStories: []
              }
              sessionStorage.setItem('KW_PROGRESS', JSON.stringify(userProgress));
          }
          return userProgress;
      },
      /**
       * Check whether the user is currently logged in
       */
      checkVisitType () {
          let visitType = this.visitType;
          if (!visitType) {
              let storedSession = localStorage.getItem('KW_SESSION'),
                  sessionData = storedSession ? JSON.parse(storedSession) : null;
              visitType = sessionData ? 'Logged in' : 'Logged out';
              this.set('visitType', visitType);
          }
          return visitType;
      },
      /**
       * Wrapper for dispatching events to GTM datalayer
       *
       * @param {Object || String} trackingEvent
       */
      dispatchTrackingEvent (trackingEvent) {
          let payload = trackingEvent;
          if (trackingEvent !== Object(trackingEvent)) {
              payload = {
                  event: trackingEvent
              };
          }
          window.dataLayer.push(payload);
      },
      /**
       * Function to dispatch virtualPageViews with all
       * the required information
       *
       * @param {String} title
       * @param {String} pathname
       */
      dispatchVirtualPageView (title, pathname) {
          let payload = {
              account             : this.checkAccount(),
              challengesCompleted : this.checkUserProgress().completedStories.length,
              event               : 'virtualPageView',
              userType            : this.checkUserType(),
              virtualPageTitle    : title,
              virtualPageURL      : pathname,
              visitType           : this.checkVisitType()
          };
          this.dispatchTrackingEvent(payload);
      },
      /**
       * Update the account based on the user logging in, if there
       * wasn't a previous account
       */
      trackAccount () {
          if (!this.account) {
              this.set('account', true);
              this.dispatchTrackingEvent({
                  account: true
              });
              localStorage.setItem('KW_ACCOUNT', true);
          }
      },
      /**
       * Function for update number of challenges completed this session
       *
       * @param {String} challenge
       */
      trackUserProgress (challenge) {
          let userProgress = this.checkUserProgress();
          if (challenge && userProgress.completedStories.indexOf(challenge) === -1) {
              userProgress.completedStories.push(challenge);
          }
          this.dispatchTrackingEvent({
              challengesCompleted: userProgress.completedStories.length
          });
          sessionStorage.setItem('KW_PROGRESS', JSON.stringify(userProgress));
      },
      /**
       * Update the visitType based in user logging in or out and dispatch
       * the updated tracking event
       *
       * @param {String} type
       */
      trackVisitType (type) {
          if (this.visitType !== type) {
              this.dispatchTrackingEvent({
                visitType: type
              });
              this.set('visitType', type);
          }
          if (type === 'Logged in') {
              this.trackAccount();
          }
      }
};
