import {
    curry,
    toString
} from 'lodash/fp';
import Maybe from 'data.maybe';

import {
    makeBunch as makeBunch_
} from 'utils/bunch';
import {
    decode as decodeOfferInfo
} from 'models/offer-info';


export const NAMESPACE = '@campaigns';

export const makeBunch = makeBunch_(NAMESPACE);

export const STATE_CREATED = 1;
export const STATE_ACTIVE = 2;
export const STATE_COMPLETED = 3;
export const STATE_STARTED = 4;

export const merge = curry(
    (next, prev) => ({ ...prev, ...next })
);

export function decode(json) {
    return {
        id: toString(json.id),
        name: json.name,
        description: json.description,
        startDate: json.start_date,
        endDate: Maybe.fromNullable(json.end_date),
        state: json.state,
        offerInfo: Maybe.fromNullable(json.last_offer_info).map(decodeOfferInfo)
    };
}

export function decodeErrors(json) {
    return {
        name: Maybe.fromNullable(json.name),
        description: Maybe.fromNullable(json.description),
        startDate: Maybe.fromNullable(json.start_date),
        endDate: Maybe.fromNullable(json.end_date),
        common: Maybe.fromNullable(json.non_field_errors)
    };
}

export function encode(model) {
    return {
        name: model.name,
        description: model.description,
        start_date: model.startDate,
        end_date: model.endDate.getOrElse()
    };
}
