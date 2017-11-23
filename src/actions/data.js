import {
    curry
} from 'lodash/fp';

export const MERGE = 'DATA/MERGE';

export function merge(data) {
    return {
        type: MERGE,
        payload: data
    };
}

export const UPDATE = 'DATA/UPDATE';

export const update = curry(
    (diff, bunch) => ({
        type: UPDATE,
        payload: {
            diff,
            bunch
        }
    })
);
