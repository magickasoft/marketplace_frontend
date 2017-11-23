import {
    normalize
} from 'normalizr';
import Maybe from 'data.maybe';

import config from 'config';
import {
    user as schemaUser
} from 'models';
import {
    decode as decodeUser,
    encodeLogin as encodeUserLogin,
    decodeLoginErrors as decodeUserLoginErrors,
    encodeRecoveryPassword as encodeUserRecoveryPassword,
    decodeRecoveryPasswordErrors as decodeUserRecoveryPasswordErrors,
    encodeChangePassword as encodeUserChangePassword,
    decodeChangePasswordErrors as decodeUserChangePasswordErrors
} from 'models/user';
import {
    processResponse,
    processErrors
} from './common';


const METHOD = 'logon';

export function auth() {
    return fetch(`${config.url}${config.version}${METHOD}/info/`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .then(response => ([ normalize(decodeUser(response), schemaUser), response.group_mask ]))
    .catch(errors => Promise.reject({
        common: Maybe.fromNullable(errors.non_field_errors)
    }));
}

export function login(fields) {
    return fetch(`${config.url}${config.version}${METHOD}/in/`, {
        method: 'POST',
        body: JSON.stringify(encodeUserLogin(fields)),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .then(response => ([ normalize(decodeUser(response), schemaUser), response.group_mask ]))
    .catch(errors => Promise.reject(decodeUserLoginErrors(errors)));
}

export function logout() {
    return fetch(`${config.url}${config.version}${METHOD}/out/`, {
        method: 'POST',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .catch(errors => Promise.reject({
        common: Maybe.fromNullable(errors.non_field_errors)
    }));
}

export function recoveryPassword(fields) {
    return fetch(`${config.url}${config.version}${METHOD}/password-restore/`, {
        method: 'POST',
        body: JSON.stringify(encodeUserRecoveryPassword(fields)),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .catch(errors => Promise.reject(decodeUserRecoveryPasswordErrors(errors)));
}

export function changePassword(fields) {
    return fetch(`${config.url}${config.version}${METHOD}/password-restore/set-new/`, {
        method: 'POST',
        body: JSON.stringify(encodeUserChangePassword(fields)),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .catch(errors => Promise.reject(decodeUserChangePasswordErrors(errors)));
}
