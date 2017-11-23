import {
    batchActions
} from 'redux-batched-actions';

import {
    logout as logoutRequest
} from 'services/auth';
import {
    userLogout
} from 'actions/session';


export const LOGOUT_START = 'UI/LOGOUT/LOGOUT_START';

export function logoutStart() {
    return {
        type: LOGOUT_START
    };
}

export const LOGOUT_SUCCESS = 'UI/LOGOUT/LOGOUT_SUCCESS';

export function logoutSuccess() {
    return {
        type: LOGOUT_SUCCESS
    };
}

export const LOGOUT_FAILURE = 'UI/LOGOUT/LOGOUT_FAILURE';

export function logoutFailure(errors) {
    return {
        type: LOGOUT_FAILURE,
        payload: errors
    };
}


export function logout() {
    return (dispatch, getState) => {
        const { ui } = getState();

        if (ui.logout.busy) {
            return Promise.resolve();
        }

        dispatch(
            logoutStart()
        );

        return logoutRequest()
            .then(() => {
                dispatch(
                    batchActions([
                        logoutSuccess(),
                        userLogout()
                    ])
                );
            })
            .catch(errors => {
                dispatch(
                    logoutFailure(errors)
                );
            });
    };
}
