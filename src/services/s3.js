import {
    constant
} from 'lodash/fp';
import Maybe from 'data.maybe';

import config from 'config';
import {
    processResponse,
    processErrors
} from './common';


export function sign(file) {
    return fetch(`${config.url}${config.version}s3_sign/`, {
        method: 'POST',
        body: JSON.stringify({
            file_name: file.name || 'default.png',
            file_type: file.type
        }),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .then(
        ({ data, image_url: preview }) => {
            const postData = new FormData();

            for (const key in data.fields) {
                if (data.fields.hasOwnProperty(key)) {
                    postData.append(key, data.fields[ key ]);
                }
            }

            postData.append('file', file);

            return fetch(data.url, {
                method: 'POST',
                body: postData
            })
            .then(constant(preview), processErrors);
        }
    )
    .catch(errors => Promise.reject({
        common: Maybe.fromNullable(errors.non_field_errors)
    }));
}
