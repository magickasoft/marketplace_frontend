import {
    map,
    compose,
    unzip
} from 'lodash/fp';
import Maybe from 'data.maybe';

import {
    get,
    toInt,
    filterMap
} from 'utils';

import moment from 'moment';

export const DATETIME = 'DATETIME';
export const CAMPAIGN_ID = 'CAMPAIGN_ID';
export const CAMPAIGN_NAME = 'CAMPAIGN_NAME';


export const METRIC_PUSH_SENT = 'PUSH_SENT';
export const METRIC_PUSH_OPENED = 'PUSH_OPENED';
export const METRIC_OFFER_VIEW = 'OFFER_VIEW';
export const METRIC_OFFER_URL_CLICK = 'OFFER_URL_CLICK';
export const METRIC_UNIQUE_OFFER_VIEW = 'UNIQUE_OFFER_VIEW';
export const METRIC_UNIQUE_OFFER_URL_CLICK = 'UNIQUE_OFFER_URL_CLICK';
export const METRIC_OFFER_ACTIVATE = 'OFFER_ACTIVATE';
export const METRIC_PUSH_DELIVERED = 'PUSH_DELIVERED';

export const DISCRETIZATION_HOUR = 'HOUR';
export const DISCRETIZATION_DAY = 'DAY';
export const DISCRETIZATION_WEEK = 'WEEK';
export const DISCRETIZATION_MONTH = 'MONTH';

export const RATE_PUSH_DELIVERY = 'PUSH_DELIVERY_RATE';
export const RATE_PUSH_OPEN = 'PUSH_OPEN_RATE';
export const RATE_OFFER_ACTIVATE = 'OFFER_ACTIVATE_RATE';
export const RATE_OFFER_URL_CLICK = 'OFFER_URL_CLICK_RATE';

export const decodeSummary = json => map(
    metric => ([
        metric,
        get(metric, json).chain(
            compose(Maybe.fromEither, toInt)
        ).getOrElse(0)
    ]),
    [
        METRIC_PUSH_SENT,
        METRIC_PUSH_OPENED,
        METRIC_OFFER_VIEW,
        METRIC_OFFER_URL_CLICK,
        METRIC_UNIQUE_OFFER_VIEW,
        METRIC_UNIQUE_OFFER_URL_CLICK,
        METRIC_OFFER_ACTIVATE,
        METRIC_PUSH_DELIVERED
    ]
);

export const decodeTable = filterMap(
    json => get(CAMPAIGN_ID, json).map(
        id => name => ({
            campaign: { id, name },
            metrics: decodeSummary(json)
        })
    ).ap(get(CAMPAIGN_NAME, json))
);

export const decodeChart = compose(
    ([ pushSent, pushOpened, offerView, offerUrlClick, offerActivate ]) => ([
        [ METRIC_PUSH_SENT, pushSent ],
        [ METRIC_PUSH_OPENED, pushOpened ],
        [ METRIC_OFFER_VIEW, offerView ],
        [ METRIC_OFFER_URL_CLICK, offerUrlClick ],
        [ METRIC_OFFER_ACTIVATE, offerActivate]
    ]),
    unzip,
    filterMap(
        metrics => get(DATETIME, metrics).map(
            sDatetime => {
                const datetime = toInt(moment(sDatetime).format('x')).getOrElse(0);
                return [
                    [ datetime, get(METRIC_PUSH_SENT, metrics).getOrElse(0) ],
                    [ datetime, get(METRIC_PUSH_OPENED, metrics).getOrElse(0) ],
                    [ datetime, get(METRIC_OFFER_VIEW, metrics).getOrElse(0) ],
                    [ datetime, get(METRIC_OFFER_URL_CLICK, metrics).getOrElse(0) ],
                    [ datetime, get(METRIC_OFFER_ACTIVATE, metrics).getOrElse(0) ]
                ];
            }
        )
    )
);
