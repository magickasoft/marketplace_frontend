import {
    Nothing,
    Just
} from 'data.maybe';

import {
    RECEIVE_PAGE_START,
    RECEIVE_PAGE_SUCCESS,
    RECEIVE_PAGE_FAILURE
} from 'actions/ui/campaigns-list';


export const initialState = {
    current: 1,
    total: Nothing(),
    results: Nothing(),
    busy: false,
    errors: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case RECEIVE_PAGE_START: {
            return {
                ...state,
                current: action.payload,
                results: Nothing(),
                busy: true,
                errors: Nothing()
            };
        }

        case RECEIVE_PAGE_SUCCESS: {
            return {
                ...state,
                total: Just(action.payload.total),
                results: Just(action.payload.results),
                busy: false
            };
        }

        case RECEIVE_PAGE_FAILURE: {
            return {
                ...state,
                busy: false,
                errors: Just(action.payload)
            };
        }

        default: {
            return state;
        }
    }
}
