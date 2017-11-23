import {
    curry,
    castArray
} from 'lodash/fp';
import Maybe from 'data.maybe';

import {
    getBunchID,
    makeBunch as makeBunch_
} from 'utils/bunch';
import {
    decode as decodeDateTime,
    encode as encodeDateTime
} from 'models/date-time';
import {
    decode as decodeImages,
    encode as encodeImages
} from 'models/images';
import {
    makeBunch as makeChannelBunch,
    decode as decodeChannel
} from 'models/channel';


export const NAMESPACE = '@stories';

export const makeBunch = makeBunch_(NAMESPACE);

export const STATUS_DRAFT = 0;
export const STATUS_REVIEWED = 1;
export const STATUS_APPROVED = 2;
export const STATUS_PUBLISHED = 3;
export const STATUS_DELETED = 4;

export const merge = curry(
    (next, prev) => ({ ...prev, ...next })
);

export function decode(json) {
    return {
        id: json.id,
        title: json.title,
        description: Maybe.fromNullable(json.description),
        text: json.text,
        audioUrl: Maybe.fromNullable(json.audio_url),
        videoUrl: Maybe.fromNullable(json.video_url),
        isDailyDose: json.is_daily_dose,
        channel: Maybe.fromNullable(json.channel)
            .map(decodeChannel)
            .getOrElse(makeChannelBunch(json.channel_id)),
        publishDate: decodeDateTime(json.publish_date),
        images: decodeImages(json),
        status: json.status
    };
}

export function decodeErrors(json) {
    return {
        title: Maybe.fromNullable(json.title),
        description: Maybe.fromNullable(json.description),
        text: Maybe.fromNullable(json.text),
        audioUrl: Maybe.fromNullable(json.audio_url),
        videoUrl: Maybe.fromNullable(json.video_url),
        isDailyDose: Maybe.fromNullable(json.is_daily_dose),
        channel: Maybe.fromNullable(json.channel_id),
        publishDate: Maybe.fromNullable(json.publish_date),
        images: decodeImages(json),
        status: Maybe.fromNullable(json.status),
        common: Maybe.fromNullable(json.non_field_errors),
        detail: Maybe.fromNullable(json.detail).map(castArray)
    };
}

export function encode(model) {
    return {
        ...encodeImages(model.images),
        title: model.title,
        description: model.description.getOrElse(),
        text: model.text,
        audio_url: model.audioUrl.getOrElse(),
        video_url: model.videoUrl.getOrElse(),
        is_daily_dose: model.isDailyDose,
        channel_id: getBunchID(model.channel),
        publish_date: encodeDateTime(model.publishDate),
        status: model.status
    };
}
