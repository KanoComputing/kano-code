import { Store } from '../store.js';

const store = Store;

const CONSTANTS = ['AUTHENTICATE', 'UPDATE_PROFILE', 'UPDATE_LEVELS', 'LOGOUT'];
const USER_TYPES = store.types(CONSTANTS);


store.addMutator(function (action) {
    switch (action.type) {
        case USER_TYPES.AUTHENTICATE: {
            this.set('state.user', action.user);
            break;
        }
        case USER_TYPES.UPDATE_PROFILE: {
            this.set('state.user.profile', action.profile);
            break;
        }
        case USER_TYPES.UPDATE_LEVELS: {
            this.set('state.user.profile.levels', action.levels);
            break;
        }
        case USER_TYPES.LOGOUT: {
            this.set('state.user', null);
            break;
        }
    }
});

export const User = {
    authenticate(user) {
        store.dispatch({ type: USER_TYPES.AUTHENTICATE, user });
    },
    updateProfile(profile) {
        store.dispatch({ type: USER_TYPES.UPDATE_PROFILE, profile });
    },
    logout() {
        store.dispatch({ type: USER_TYPES.LOGOUT });
    },
    updateLevels(levels) {
        store.dispatch({ type: USER_TYPES.UPDATE_LEVELS, levels });
    }
};
