import {
    curry,
    toString,
    map
} from 'lodash/fp';

import {
    makeBunch as makeBunch_
} from 'utils/bunch';

import {
    decode as decodeLocation,
    encode as encodeLocation
} from 'models/location';

export const NAMESPACE = '@segments';

export const makeBunch = makeBunch_(NAMESPACE);

export const merge = curry(
    (next, prev) => ({ ...prev, ...next })
);

export function decode(json) {
    return {
        id: toString(json.id),
        name: json.name,
        locations: map(decodeLocation, json.locations)
    };
}

export function encode(model) {
    return {
        id: model.id,
        locations: map(encodeLocation, model.locations)
    };
}
