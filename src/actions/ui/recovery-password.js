import Cookie from 'js-cookie';
import {
    batchActions
} from 'redux-batched-actions';

import {
    successNotification
} from 'actions/ui/notification';

import {
    recoveryPassword as recoveryPasswordRequest
} from 'services/auth';


export const CHANGE_EMAIL = 'UI/RECOVERY_PASSWORD/CHANGE_EMAIL';

export function changeEmail(value) {
    return {
        type: CHANGE_EMAIL,
        payload: value
    };
}

export const RECOVERY_PASSWORD_START = 'UI/RECOVERY_PASSWORD/RECOVERY_PASSWORD_START';

export function recoveryPasswordStart() {
    return {
        type: RECOVERY_PASSWORD_START
    };
}

export const RECOVERY_PASSWORD_SUCCESS = 'UI/RECOVERY_PASSWORD/RECOVERY_PASSWORD_SUCCESS';

export function recoveryPasswordSuccess() {
    return {
        type: RECOVERY_PASSWORD_SUCCESS
    };
}

export const RECOVERY_PASSWORD_FAILURE = 'UI/RECOVERY_PASSWORD/RECOVERY_PASSWORD_FAILURE';

export function recoveryPasswordFailure(errors) {
    return {
        type: RECOVERY_PASSWORD_FAILURE,
        payload: errors
    };
}

export function recoveryPassword() {
    return (dispatch, getState) => {
        const { ui } = getState();

        if (ui.recoveryPassword.busy) {
            return Promise.resolve();
        }

        dispatch(
            recoveryPasswordStart()
        );

        return recoveryPasswordRequest(ui.recoveryPassword.fields)
            .then(params => {
                Cookie.set('resotre_password_token', params.token, {
                    expires: params.timeout
                });

                dispatch(batchActions([
                    recoveryPasswordSuccess(),
                    successNotification({
                        message: params.message,
                        position: 'tc',
                        autoDismiss: 5
                    })
                ]));
            })
            .catch(errors => {
                dispatch(
                    recoveryPasswordFailure(errors)
                );
            });
    };
}
