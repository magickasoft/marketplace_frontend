import {
    curry,
    toString
} from 'lodash/fp';

import {
    makeBunch as makeBunch_
} from 'utils/bunch';

export const NAMESPACE = '@locations';

export const makeBunch = makeBunch_(NAMESPACE);

export const merge = curry(
    (next, prev) => ({ ...prev, ...next })
);

export function decode(json) {
    return {
        id: toString(json.id),
        name: json.name,
        point: json.point,
        radius: json.radius
    };
}

export function encode(model) {
    return {
        id: model.id,
        mapbox_id: model.placeId,
        name: model.name,
        point: model.point,
        radius: model.radius
    };
}
