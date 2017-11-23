import {
    Just,
    Nothing
} from 'data.maybe';

import {
    LOGOUT_START,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE
} from 'actions/ui/logout';


export const initialState = {
    busy: false,
    errors: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case LOGOUT_START: {
            return {
                ...state,
                busy: true,
                errors: Nothing()
            };
        }

        case LOGOUT_SUCCESS: {
            return initialState;
        }

        case LOGOUT_FAILURE: {
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
