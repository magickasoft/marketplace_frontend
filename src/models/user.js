import {
    curry,
    some,
    toString
} from 'lodash/fp';
import Maybe from 'data.maybe';

import {
    makeBunch as makeBunch_
} from 'utils/bunch';


export const NAMESPACE = '@users';

export const makeBunch = makeBunch_(NAMESPACE);

export const COUNTRY_MANAGER /* 10000 */ = 16;
export const SUPER_MANAGER   /* 01000 */ = 8;
export const COUNTRY_EDITOR  /* 00100 */ = 4;
export const SUPER_EDITOR    /* 00010 */ = 2;
export const ADMIN           /* 00001 */ = 1;
export const USER            /* 00000 */ = 0;

export const somePermission = curry(
    (permissions, type) => some(permission => permission & type, permissions)
);

export const isCountryManager = somePermission([ COUNTRY_MANAGER ]);
export const isSuperManager = somePermission([ SUPER_MANAGER ]);
export const isCountryEditor = somePermission([ COUNTRY_EDITOR ]);
export const isSuperEditor = somePermission([ SUPER_EDITOR ]);
export const isAdmin = somePermission([ ADMIN ]);

export const merge = curry(
    (next, prev) => ({ ...prev, ...next })
);

export function decode(json) {
    return {
        id: toString(json.pk),
        email: json.email,
        username: json.username,
        firstName: Maybe.fromNullable(json.first_name),
        lastName: Maybe.fromNullable(json.last_name)
    };
}

export function encodeLogin(model) {
    return {
        email: model.email,
        password: model.password,
        remember_me: model.remembered
    };
}

export function decodeLoginErrors(json) {
    return {
        email: Maybe.fromNullable(json.email),
        password: Maybe.fromNullable(json.password),
        common: Maybe.fromNullable(json.non_field_errors)
    };
}

export function encodeRecoveryPassword(model) {
    return {
        email: model.email
    };
}

export function decodeRecoveryPasswordErrors(json) {
    return {
        email: Maybe.fromNullable(json.email),
        common: Maybe.fromNullable(json.non_field_errors)
    };
}

export function encodeChangePassword(model) {
    return {
        new_password: model.newPassword,
        new_password_repetition: model.repetitionPassword,
        token: model.token,
        restore_code: model.code
    };
}

export function decodeChangePasswordErrors(json) {
    return {
        newPassword: Maybe.fromNullable(json.new_password),
        repetitionPassword: Maybe.fromNullable(json.new_password_repetition),
        common: Maybe.fromNullable(json.non_field_errors)
    };
}
