import {
    curry,
    toString
} from 'lodash/fp';

import {
    makeBunch as makeBunch_
} from 'utils/bunch';

export const NAMESPACE = '@places';

export const makeBunch = makeBunch_(NAMESPACE);

export const merge = curry(
    (next, prev) => ({ ...prev, ...next })
);

export function decode(json) {
    return {
        id: toString(json.id),
        name: json.place_name,
        point: json.center
    };
}
