import {
    curry,
    compose,
    property
} from 'lodash/fp';
import Maybe from 'data.maybe';

import config from 'config';
import {
    decodeChart
} from 'models/analytic';
import {
    processResponse,
    processErrors
} from 'services/common';
import {
    queryMetrics,
    queryDiscretization,
    queryInterval,
    queriesToString
} from 'services/queries';
import {
    METHOD as PARENT_METHOD
} from './';


export const METHOD = `${PARENT_METHOD}/chart`;

const pMetrics = property('metrics');

export const getGeneral = curry(
    (metrics, interval, discretization) => {
        const query = queriesToString([
            queryMetrics(metrics),
            queryInterval(interval),
            queryDiscretization(discretization)
        ]);

        return fetch(`${config.url}${config.version}${METHOD}/?${query}`, {
            method: 'GET',
            headers: new Headers(config.headers),
            credentials: config.credentials
        })
        .then(processResponse, processErrors)
        .then(compose(decodeChart, pMetrics))
        .catch(errors => Promise.reject({
            common: Maybe.fromNullable(errors.non_field_errors)
        }));
    }
);

export const getById = curry(
    (metrics, discretization, interval, campaignId) => {
        const query = queriesToString([
            queryMetrics(metrics),
            queryDiscretization(discretization),
            queryInterval(interval)
        ]);

        return fetch(`${config.url}${config.version}${METHOD}/${campaignId}?${query}`, {
            method: 'GET',
            headers: new Headers(config.headers),
            credentials: config.credentials
        })
            .then(processResponse, processErrors)
            .then(compose(decodeChart, pMetrics))
            .catch(errors => Promise.reject({
                common: Maybe.fromNullable(errors.non_field_errors)
            }));
    }
);
