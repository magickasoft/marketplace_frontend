import {
    curry,
    toString
} from 'lodash/fp';
import Maybe from 'data.maybe';

import {
    getBunchID,
    makeBunch as makeBunch_
} from 'utils/bunch';
import {
    makeBunch as makeChannelBunch
} from 'models/channel';
import {
    decode as decodeDateTime,
    encode as encodeDateTime
} from 'models/date-time';
import {
    decode as decodeImages,
    encode as encodeImages
} from 'models/images';


export const NAMESPACE = '@offers';

export const makeBunch = makeBunch_(NAMESPACE);

export const merge = curry(
    (next, prev) => ({ ...prev, ...next })
);

export function decode(json) {
    return {
        id: toString(json.id),
        title: json.title,
        description: Maybe.fromNullable(json.description),
        images: decodeImages(json),
        subtitle: Maybe.fromNullable(json.subtitle),
        termsAndConditions: Maybe.fromNullable(json.terms_conditions),
        validDate: decodeDateTime(json.valid_date),
        shareable: Boolean(json.is_shareable),
        button: {
            text: Maybe.fromNullable(json.button_text)
        },
        redeem: {
            title: Maybe.fromNullable(json.redeem_title),
            code: Maybe.fromNullable(json.redeem_code),
            url: Maybe.fromNullable(json.redeem_url)
        },
        website: {
            title: Maybe.fromNullable(json.website_title),
            url: Maybe.fromNullable(json.website_url)
        },
        channel: makeChannelBunch(json.channel_id)
    };
}

export function decodeErrors(json) {
    return {
        title: Maybe.fromNullable(json.title),
        description: Maybe.fromNullable(json.description),
        images: decodeImages(json),
        subtitle: Maybe.fromNullable(json.subtitle),
        termsAndConditions: Maybe.fromNullable(json.terms_conditions),
        validDate: Maybe.fromNullable(json.valid_date),
        shareable: Maybe.fromNullable(json.is_shareable),
        button: {
            text: Maybe.fromNullable(json.button_text)
        },
        redeem: {
            title: Maybe.fromNullable(json.redeem_title),
            code: Maybe.fromNullable(json.redeem_code),
            url: Maybe.fromNullable(json.redeem_url)
        },
        website: {
            title: Maybe.fromNullable(json.website_title),
            url: Maybe.fromNullable(json.website_url)
        },
        channel: Maybe.fromNullable(json.channel_id),
        common: Maybe.fromNullable(json.non_field_errors)
    };
}

export function encode(model) {
    return {
        ...encodeImages(model.images),
        title: model.title,
        description: model.description.getOrElse(),
        subtitle: model.subtitle.getOrElse(),
        terms_conditions: model.termsAndConditions.getOrElse(),
        valid_date: encodeDateTime(model.validDate),
        shareable: model.shareable,
        button_text: model.button.text.getOrElse(),
        redeem_title: model.redeem.title.getOrElse(),
        redeem_code: model.redeem.code.getOrElse(),
        redeem_url: model.redeem.url.getOrElse(),
        website_title: model.website.title.getOrElse(),
        website_url: model.website.url.getOrElse(),
        channel_id: getBunchID(model.channel)
    };
}
