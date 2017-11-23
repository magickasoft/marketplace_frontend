import {
    curry,
    map,
    concat
} from 'lodash/fp';
import {
    normalize,
    schema
} from 'normalizr';

import config from 'config';
import {
    story
} from 'models';
import {
    decode,
    encode,
    decodeErrors
} from 'models/story';
import {
    queryPage,
    querySort,
    queryStatus,
    queriesToString
} from 'services/queries';
import {
    processResponse,
    processErrors,
    decodeDetailErrors
} from 'services/common';
import {
    METHOD as PARENT_METHOD
} from './';


export const METHOD = `${PARENT_METHOD}/story`;

export function createStory(model) {
    return fetch(`${config.url}${config.version}${METHOD}/`, {
        method: 'POST',
        headers: new Headers(config.headers),
        credentials: config.credentials,
        body: JSON.stringify(encode(model))
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decode(response), story))
        .catch(errors => Promise.reject(decodeErrors(errors)));
}

export function getStory(id) {
    return fetch(`${config.url}${config.version}${METHOD}/${id}/`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decode(response), story))
        .catch(errors => Promise.reject(decodeDetailErrors(errors)));
}

export const getStoriesPage = curry(
    (mStatus, page, field, order) => {
        const query = queriesToString(concat(
            mStatus.map(status => ([ queryStatus(status) ])).getOrElse([]),
            [
                queryPage(page),
                querySort([ order, field ])
            ]
        ));

        return fetch(`${config.url}${config.version}${METHOD}/?${query}`, {
            method: 'GET',
            headers: new Headers(config.headers),
            credentials: config.credentials
        })
            .then(processResponse, processErrors)
            .then(response => normalize(
                {
                    total: response.count,
                    results: map(decode, response.results),
                    countForReview: response.count_for_review
                },
                {
                    results: new schema.Array(story),
                    countForReview: response.count_for_review
                }
            ))
            .catch(errors => Promise.reject(decodeDetailErrors(errors)));
    }
);

export const updateStory = curry(
    (model, id) => fetch(`${config.url}${config.version}${METHOD}/${id}/`, {
        method: 'PUT',
        headers: new Headers(config.headers),
        credentials: config.credentials,
        body: JSON.stringify(encode(model))
    })
        .then(processResponse, processErrors)
        .catch(errors => Promise.reject(decodeErrors(errors)))
);

export function deleteStory(id) {
    return fetch(`${config.url}${config.version}${METHOD}/${id}/`, {
        method: 'DELETE',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decode(response), story))
        .catch(errors => Promise.reject(decodeDetailErrors(errors)));
}
