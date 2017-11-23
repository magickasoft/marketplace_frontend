import {
    curry,
    isEmpty,
    toString
} from 'lodash/fp';
import Maybe, {
    Nothing,
    Just
} from 'data.maybe';

import {
    getBunchID,
    makeBunch as makeBunch_
} from 'utils/bunch';
import {
    makeBunch as makeCampaignBunch
} from 'models/campaign';
import {
    makeBunch as makeOfferBunch
} from 'models/offer';
import {
    decode as decodeSegment,
    encode as encodeSegment
} from 'models/segment';
import {
    encode as encodeDateTime
} from 'models/date-time';

export const NAMESPACE = '@offer-info';

export const makeBunch = makeBunch_(NAMESPACE);

export const merge = curry(
    (next, prev) => ({
        ...prev,
        ...next,
        push: {
            ...prev.push,
            ...next.push
        },
        segment: {
            ...prev.segment,
            ...next.segment
        }
    })
);

export function decode(json) {
    return {
        id: toString(json.id),
        campaign: Maybe.fromNullable(json.campaign_id).map(makeCampaignBunch),
        offer: isEmpty(json.offer_external_id) ?
            Nothing() :
            Just(makeOfferBunch(json.offer_external_id)),
        push: {
            title: isEmpty(json.push_title) ?
                Nothing() :
                Just(json.push_title),
            message: isEmpty(json.push_message) ?
                Nothing() :
                Just(json.push_message),
            sendAt: Maybe.fromNullable(json.push_send_at),
            sentAt: Maybe.fromNullable(json.push_sent_at)
        },
        segment: decodeSegment(json.segment)
    };
}

export function decodeErrors(json) {
    return {
        campaign: Maybe.fromNullable(json.campaign_id),
        segment: Maybe.fromNullable(json.segment),
        offer: Maybe.fromNullable(json.offer_external_id),
        push: {
            title: Maybe.fromNullable(json.push_title),
            message: Maybe.fromNullable(json.push_message),
            sendAt: Maybe.fromNullable(json.push_send_at)
        },
        common: Maybe.fromNullable(json.non_field_errors)
    };
}

export const encode = curry((defaults, params) => ({
    campaign_id: getBunchID(params.campaign),
    segment: params.segment.map(encodeSegment).getOrElse(defaults.segment),
    offer_external_id: params.offer.map(getBunchID).getOrElse(defaults.offer),
    push_title: params.push.title.getOrElse(defaults.push.title),
    push_message: params.push.message.getOrElse(defaults.push.message),
    push_send_at: params.push.sendAt.map(encodeDateTime).getOrElse(defaults.push.sendAt)
}));
