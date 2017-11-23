import {
    curry,
    compose,
    join,
    map
} from 'lodash/fp';


export const ORDER_ASC = 'asc';
export const ORDER_DESC = 'desc';

export const orderingToString = order => {
    switch (order) {
        case ORDER_ASC: {
            return '-';
        }

        case ORDER_DESC: {
            return '';
        }

        default: {
            throw new Error('Ordering does not match.');
        }
    }
};

export const FIELD_TITLE = 'title';
export const FIELD_NAME = 'name';
export const FIELD_CHANNEL = 'channel_id';
export const FIELD_STATUS = 'status';
export const FIELD_PUBLISH_DATE = 'publish_date';
export const FIELD_IS_DAILY_DOSE = 'is_daily_dose';

const QUERY_METRIC = '#METRIC';
const QUERY_METRICS = '#METRICS';
const QUERY_START = '#START';
const QUERY_END = '#END';
const QUERY_INTERVAL = '#INTERVAL';
const QUERY_PAGE = '#PAGE';
const QUERY_SORT = '#SORT';
const QUERY_DISCRETIZATION = '#DISCRETIZATION';
const QUERY_EDITOR_PICKS = '#EDITOR_PICKS';
const QUERY_STATUS = '#STATUS';

const encodeQuery = curry(
    (query, value) => `${encodeURIComponent(query)}=${encodeURIComponent(value)}`
);

export const createQuery = curry(
    (query, value) => ([ query, value ])
);

export const queryMetric = createQuery(QUERY_METRIC);
export const queryMetrics = createQuery(QUERY_METRICS);
export const queryStart = createQuery(QUERY_START);
export const queryEnd = createQuery(QUERY_END);
export const queryInterval = createQuery(QUERY_INTERVAL);
export const queryPage = createQuery(QUERY_PAGE);
export const querySort = createQuery(QUERY_SORT);
export const queryDiscretization = createQuery(QUERY_DISCRETIZATION);
export const queryEditorPicks = createQuery(QUERY_EDITOR_PICKS);
export const queryStatus = createQuery(QUERY_STATUS);

export const queriesToString = compose(
    join('&'),
    map(([ query, value ]) => {
        switch (query) {
            case QUERY_METRIC: {
                return encodeQuery('metrics', value);
            }

            case QUERY_METRICS: {
                return queriesToString(
                    map(queryMetric, value)
                );
            }

            case QUERY_START: {
                return encodeQuery('start', value);
            }

            case QUERY_END: {
                return encodeQuery('end', value);
            }

            case QUERY_INTERVAL: {
                const [ start, end ] = value;

                return queriesToString([
                    queryStart(start),
                    queryEnd(end)
                ]);
            }

            case QUERY_PAGE: {
                return encodeQuery('page', value);
            }

            case QUERY_SORT: {
                const [ ordering, field ] = value;
                const orderingString = orderingToString(ordering);

                return encodeQuery('ordering', `${orderingString}${field}`);
            }

            case QUERY_DISCRETIZATION: {
                return encodeQuery('discretization', value);
            }

            case QUERY_EDITOR_PICKS: {
                return encodeQuery('editor_picks', value);
            }

            case QUERY_STATUS: {
                return encodeQuery('status', value);
            }

            default: {
                throw new Error('Query does not match.');
            }
        }
    })
);
