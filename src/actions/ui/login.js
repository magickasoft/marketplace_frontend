import {
    batchActions
} from 'redux-batched-actions';

import {
    login as loginRequest
} from 'services/auth';
import {
    merge
} from 'actions/data';
import {
    userLogin
} from 'actions/session';


export const CHANGE_EMAIL = 'UI/LOGIN/CHANGE_EMAIL';

export function changeEmail(value) {
    return {
        type: CHANGE_EMAIL,
        payload: value
    };
}

export const CHANGE_PASSWORD = 'UI/LOGIN/CHANGE_PASSWORD';

export function changePassword(value) {
    return {
        type: CHANGE_PASSWORD,
        payload: value
    };
}

export const SET_REMEMBER_ME = 'UI/LOGIN/SET_REMEMBER_ME';

export function setRememberMe(value) {
    return {
        type: SET_REMEMBER_ME,
        payload: value
    };
}

export const LOGIN_START = 'UI/LOGIN/LOGIN_START';

export function loginStart() {
    return {
        type: LOGIN_START
    };
}

export const LOGIN_SUCCESS = 'UI/LOGIN/LOGIN_SUCCESS';

export function loginSuccess() {
    return {
        type: LOGIN_SUCCESS
    };
}

export const LOGIN_FAILURE = 'UI/LOGIN/LOGIN_FAILURE';

export function loginFailure(errors) {
    return {
        type: LOGIN_FAILURE,
        payload: errors
    };
}

export function login() {
    return (dispatch, getState) => {
        const { ui } = getState();

        if (ui.login.busy) {
            return Promise.resolve();
        }

        dispatch(
            loginStart()
        );

        return loginRequest(ui.login.fields)
            .then(([{ result, entities }, role ]) => {
                dispatch(
                    batchActions([
                        loginSuccess(),
                        merge(entities),
                        userLogin(result, role)
                    ])
                );
            })
            .catch(errors => {
                dispatch(
                    loginFailure(errors)
                );
            });
    };
}
