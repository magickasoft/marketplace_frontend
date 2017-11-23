import {
    map
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
    decode
} from 'models/story';
import {
    queryEditorPicks,
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


export const METHOD = `${PARENT_METHOD}/story-queue`;

export function getStoriesQueuePage(isDailyDose) {
    const query = queriesToString([
        queryEditorPicks(isDailyDose)
    ]);

    return fetch(`${config.url}${config.version}${METHOD}?${query}`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => {
            const { data, count_for_review } = response;
            return ({
                items: map(obj => {
                    const { result, entities } = normalize(
                        map(decode, obj.data),
                        new schema.Array(story),
                    );
                    return {
                        date: obj.date,
                        result,
                        entities
                    };
                }, data),
                countForReview: count_for_review
            });
        })
        .catch(errors => Promise.reject(decodeDetailErrors(errors)));
}
