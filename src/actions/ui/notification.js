import {
    curry
} from 'lodash/fp';

const SUCCESS_NOTIFIACTION = 'success';
const ERROR_NOTIFIACTION = 'error';
const WARNING_NOTIFIACTION = 'warning';
const INFO_NOTIFICATION = 'info';

export const SHOW_NOTIFICATION = 'UI/NOTIFICATION/SHOW_NOTIFICATION';

export const showNotification = curry(
    (level, opts) => ({
        type: SHOW_NOTIFICATION,
        payload: { ...opts, level }
    })
);

export const successNotification = showNotification(SUCCESS_NOTIFIACTION);
export const errorNotification = showNotification(ERROR_NOTIFIACTION);
export const warningNotification = showNotification(WARNING_NOTIFIACTION);
export const infoNotification = showNotification(INFO_NOTIFICATION);

export const HIDE_NOTIFICATION = 'UI/NOTIFICATION/HIDE_NOTIFICATION';

export const hideNotification = curry(
    uid => ({
        type: HIDE_NOTIFICATION,
        payload: { uid }
    })
);
