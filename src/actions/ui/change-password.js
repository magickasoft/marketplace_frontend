import Cookie from 'js-cookie';
import {
    batchActions
} from 'redux-batched-actions';

import {
    successNotification
} from 'actions/ui/notification';

import {
    changePassword as changePasswordRequest
} from 'services/auth';

export const CHANGE_NEW_PASSWORD = 'UI/CHANGE_PASSWORD/CHANGE_NEW_PASSWORD';

export function changeNewPassword(value) {
    return {
        type: CHANGE_NEW_PASSWORD,
        payload: value
    };
}

export const CHANGE_REPETITION_PASSWORD = 'UI/CHANGE_PASSWORD/CHANGE_REPETITION_PASSWORD';

export function changeRepetitionPassword(value) {
    return {
        type: CHANGE_REPETITION_PASSWORD,
        payload: value
    };
}

export const CHANGE_PASSWORD_START = 'UI/CHANGE_PASSWORD/CHANGE_PASSWORD_START';

export function changePasswordStart() {
    return {
        type: CHANGE_PASSWORD_START
    };
}

export const CHANGE_PASSWORD_SUCCESS = 'UI/CHANGE_PASSWORD/CHANGE_PASSWORD_SUCCESS';

export function changePasswordSuccess() {
    return {
        type: CHANGE_PASSWORD_SUCCESS
    };
}

export const CHANGE_PASSWORD_FAILURE = 'UI/CHANGE_PASSWORD/CHANGE_PASSWORD_FAILURE';

export function changePasswordFailure(errors) {
    return {
        type: CHANGE_PASSWORD_FAILURE,
        payload: errors
    };
}


export function changePassword(code) {
    return (dispatch, getState) => {
        const { ui } = getState();

        if (ui.changePassword.busy) {
            return Promise.resolve();
        }

        const token = Cookie.get('resotre_password_token');

        dispatch(
            changePasswordStart()
        );

        const fields = {
            ...ui.changePassword.fields,
            token,
            code
        };

        return changePasswordRequest(fields)
            .then(() => {
                dispatch(batchActions([
                    changePasswordSuccess(),
                    successNotification({
                        message: 'Password has been changed successfull',
                        position: 'tc',
                        autoDismiss: 5
                    })
                ]));
            })
            .catch(errors => {
                dispatch(
                    changePasswordFailure(errors)
                );
            });
    };
}
