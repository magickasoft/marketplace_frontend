import {
    batchActions
} from 'redux-batched-actions';

import {
    auth as authRequest
} from 'services/auth';
import {
    merge
} from 'actions/data';
import {
    userLogin
} from 'actions/session';


export const AUTH_START = 'UI/AUTH/AUTH_START';

export function authStart() {
    return {
        type: AUTH_START
    };
}

export const AUTH_SUCCESS = 'UI/AUTH/AUTH_SUCCESS';

export function authSuccess() {
    return {
        type: AUTH_SUCCESS
    };
}

export const AUTH_FAILURE = 'UI/AUTH/AUTH_FAILURE';

export function authFailure(errors) {
    return {
        type: AUTH_FAILURE,
        payload: errors
    };
}


export function auth() {
    return (dispatch, getState) => {
        const { ui } = getState();

        if (ui.auth.busy) {
            return Promise.resolve();
        }

        dispatch(
            authStart()
        );

        return authRequest()
            .then(([{ result, entities }, role ]) => {
                dispatch(
                    batchActions([
                        authSuccess(),
                        merge(entities),
                        userLogin(result, role)
                    ])
                );
            })
            .catch(errors => {
                dispatch(
                    authFailure(errors)
                );
            });
    };
}
