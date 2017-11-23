import {
    Just,
    Nothing
} from 'data.maybe';

import {
    AUTH_START,
    AUTH_SUCCESS,
    AUTH_FAILURE
} from 'actions/ui/auth';

export const initialState = {
    busy: false,
    errors: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case AUTH_START: {
            return {
                ...state,
                busy: true,
                errors: Nothing()
            };
        }

        case AUTH_SUCCESS: {
            return initialState;
        }

        case AUTH_FAILURE: {
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
