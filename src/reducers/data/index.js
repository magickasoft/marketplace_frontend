import {
    MERGE,
    UPDATE
} from 'actions/data';
import {
    dataMerge
} from './data-merge';
import {
    entityUpdate
} from './entity-update';


export const initialState = {};

export function reducer(state, action) {
    switch (action.type) {
        case MERGE: {
            return dataMerge(state, action.payload);
        }

        case UPDATE: {
            return entityUpdate(state, action.payload.bunch, action.payload.diff);
        }

        default: {
            return state;
        }
    }
}
