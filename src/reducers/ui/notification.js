import {
    SHOW_NOTIFICATION,
    HIDE_NOTIFICATION
} from 'actions/ui/notification';
import {
    reject
} from 'lodash/fp';

export const initialState = [];

export function reducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {

        case SHOW_NOTIFICATION: {

            return [
                ...state,
                { ...payload, uid: payload.uid || Date.now() }
            ];
        }
        case HIDE_NOTIFICATION: {

            // return state.filter(notification => (notification.uid !== payload.uid));
            return reject(notification => notification.uid === payload.uid, state);
        }
        default: {
            return state;
        }
    }
}
