import {
    curry,
    property,
    compose,
    toString,
    castArray
} from 'lodash/fp';
import Maybe, {
    Nothing
} from 'data.maybe';

import {
    toInt
} from 'utils';
import {
    getBunchID,
    makeBunch as makeBunch_
} from 'utils/bunch';
import {
    makeBunch as makeCountryBunch
} from 'models/country';


export const NAMESPACE = '@channels';

export const makeBunch = makeBunch_(NAMESPACE);

export const merge = curry(
    (next, prev) => ({ ...prev, ...next })
);

const pPrimary = property('primary');
const pSpecial = property('special');
const pExtra = property('extra');

const defaultCompositeColor = [ Nothing(), Nothing() ];

export function decodeCompositeColor(composite) {
    return Maybe.fromNullable(composite).map(
        ([ color, opacity ]) => ([
            Maybe.fromNullable(color),
            Maybe.fromEither(toInt(opacity))
        ])
    );
}

export function decode(json) {
    const mHeaderBg = Maybe.fromNullable(json.header_bg);
    const mHeaderColors = Maybe.fromNullable(json.header_colors);

    const [ mHeaderColor ] = mHeaderColors
        .chain(compose(decodeCompositeColor, pPrimary))
        .getOrElse(defaultCompositeColor);
    const [ mHeaderColorSpecial ] = mHeaderColors
        .chain(compose(decodeCompositeColor, pSpecial))
        .getOrElse(defaultCompositeColor);
    const [ mPageBackground ] = decodeCompositeColor(json.page_bg_color)
        .getOrElse(defaultCompositeColor);

    return {
        id: toString(json.id),
        title: json.title,
        description: Maybe.fromNullable(json.description),
        country: makeCountryBunch(json.country_code),
        deletable: !json.can_not_be_deleted,
        header: {
            color: mHeaderColor,
            colorSpecial: mHeaderColorSpecial,
            background: mHeaderBg
                .chain(compose(decodeCompositeColor, pPrimary))
                .getOrElse(defaultCompositeColor),
            backgroundExtra: mHeaderBg
                .chain(compose(decodeCompositeColor, pExtra))
                .getOrElse(defaultCompositeColor),
            icon: Maybe.fromNullable(json.icon_url),
            logo: Maybe.fromNullable(json.header_logo_url)
        },
        page: {
            background: mPageBackground,
            wallpaper: Maybe.fromNullable(json.page_bg_image_url)
        }
    };
}

export function decodeErrors(json) {
    return {
        title: Maybe.fromNullable(json.title),
        description: Maybe.fromNullable(json.description),
        country: Maybe.fromNullable(json.country_code),
        header: {
            color: Maybe.fromNullable(json.header_colors),
            colorSpecial: Maybe.fromNullable(json.header_colors),
            background: Maybe.fromNullable(json.header_bg),
            backgroundExtra: Maybe.fromNullable(json.header_bg),
            icon: Maybe.fromNullable(json.icon_url),
            logo: Maybe.fromNullable(json.header_logo_url)
        },
        page: {
            background: Maybe.fromNullable(json.page_bg_color),
            wallpaper: Maybe.fromNullable(json.page_bg_image_url)
        },
        common: Maybe.fromNullable(json.non_field_errors)
            .orElse(() => Maybe.fromNullable(json.detail).map(castArray))
    };
}

export function compositeColorsDefaults([ defaultColor, defaultOpacity ], [ color, opacity ]) {
    return [
        color.getOrElse(defaultColor),
        opacity.getOrElse(defaultOpacity)
    ];
}

export const encode = curry((defaults, model) => ({
    id: model.id,
    title: model.title,
    description: model.description.getOrElse(),
    country_code: model.country.map(getBunchID).getOrElse(),
    header_colors: {
        primary: [
            model.header.color.getOrElse(defaults.header.color),
            100
        ],
        special: [
            model.header.colorSpecial.getOrElse(defaults.header.colorSpecial),
            100
        ]
    },
    header_bg: {
        primary: compositeColorsDefaults(defaults.header.background, model.header.background),
        extra: compositeColorsDefaults(defaults.header.backgroundExtra, model.header.backgroundExtra)
    },
    icon_url: model.header.icon.getOrElse(),
    header_logo_url: model.header.logo.getOrElse(),
    page_bg_color: [
        model.page.background.getOrElse(),
        100
    ],
    page_bg_image_url: model.page.wallpaper.getOrElse()
}));
