import {
    curry,
    reduce
} from 'lodash/fp';
import Maybe from 'data.maybe';

import {
    get
} from 'utils';

export const ASSET_CHANNEL_ICON = '32x32';
export const ASSET_CHANNEL_HEADER_BACKGROUND = '360x244';

export const ASSET_STORY_SMALL = '720x308';
export const ASSET_STORY_LARGE = '720x1136';

export const ASSET_OFFER_SMALL = '656x280';
export const ASSET_OFFER_MEDIUM = '240x280';
export const ASSET_OFFER_LARGE_HALF = '720x688';
export const ASSET_OFFER_LARGE = '720x1136';

export const CHANNEL_ICON = 'channel_icon';
export const CHANNEL_HEADER_BACKGROUND = 'channel_header_background';

export const SIZE_SMALL = 'small_image_url';
export const SIZE_MEDIUM = 'medium_image_url';
export const SIZE_LARGE_HALF = 'large_image_half_url';
export const SIZE_LARGE = 'large_image_url';


export const sizes = [
    SIZE_SMALL,
    SIZE_MEDIUM,
    SIZE_LARGE_HALF,
    SIZE_LARGE
];

const mergeUrlToAccBySize = curry(
    (acc, size, url) => ({
        ...acc,
        [ size ]: url
    })
);

export function decode(json) {
    return reduce(
        (acc, size) => Maybe.fromNullable(json[ size ]).map(
            mergeUrlToAccBySize(acc, size)
        ).getOrElse(acc),
        {},
        sizes
    );
}

export function encode(model) {
    return reduce(
        (acc, size) => get(size, model).map(
            mergeUrlToAccBySize(acc, size)
        ).getOrElse(acc),
        {},
        sizes
    );
}
