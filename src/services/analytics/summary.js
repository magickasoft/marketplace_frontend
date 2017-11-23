import {
    curry
} from 'lodash/fp';
import Maybe from 'data.maybe';

import config from 'config';
import {
    decodeSummary,
    decodeTable
} from 'models/analytic';
import {
    processResponse,
    processErrors
} from 'services/common';
import {
    queryMetrics,
    queryInterval,
    queryPage,
    querySort,
    queriesToString
} from 'services/queries';
import {
    METHOD as PARENT_METHOD
} from './';


export const METHOD = `${PARENT_METHOD}/summary`;

export const getGeneral = curry(
    (metrics, interval, page, sort) => {
        const query = queriesToString([
            queryMetrics(metrics),
            queryInterval(interval),
            queryPage(page),
            querySort(sort)
        ]);

        return fetch(`${config.url}${config.version}${METHOD}/?${query}`, {
            method: 'GET',
            headers: new Headers(config.headers),
            credentials: config.credentials
        })
            .then(processResponse, processErrors)
            .then(response => ({
                total: response.count,
                results: decodeTable(response.results)
            }))
            .catch(errors => Promise.reject({
                common: Maybe.fromNullable(errors.non_field_errors)
            }));
    }
);

export const getById = curry(
    (metrics, campaignId) => {
        const query = queriesToString([
            queryMetrics(metrics)
        ]);

        return fetch(`${config.url}${config.version}${METHOD}/${campaignId}?${query}`, {
            method: 'GET',
            headers: new Headers(config.headers),
            credentials: config.credentials
        })
            .then(processResponse, processErrors)
            .then(decodeSummary)
            .catch(errors => Promise.reject({
                common: Maybe.fromNullable(errors.non_field_errors)
            }));
    }
);
