import {
    Just,
    Nothing
} from 'data.maybe';

import {
    USER as ROLE_USER
} from 'models/user';
import {
    USER_LOGIN,
    USER_LOGOUT,
    RECEIVE_COUNTRIES_START,
    RECEIVE_COUNTRIES_FAILURE,
    RECEIVE_COUNTRIES_SUCCESS
} from 'actions/session';


export const initialState = {
    user: Nothing(),
    role: ROLE_USER,
    countries: {
        results: Nothing(),
        busy: false,
        errors: Nothing()
    }
};

export function reducer(state, action) {
    switch (action.type) {
        case USER_LOGIN: {
            return {
                ...state,
                user: Just(action.payload.bunch),
                role: action.payload.role
            };
        }

        case USER_LOGOUT: {
            return {
                ...state,
                user: Nothing(),
                role: ROLE_USER
            };
        }

        case RECEIVE_COUNTRIES_START: {
            return {
                ...state,
                countries: {
                    ...state.countries,
                    busy: true,
                    errors: Nothing()
                }
            };
        }

        case RECEIVE_COUNTRIES_FAILURE: {
            return {
                ...state,
                countries: {
                    ...state.countries,
                    busy: false,
                    errors: Just(action.payload)
                }
            };
        }

        case RECEIVE_COUNTRIES_SUCCESS: {
            return {
                ...state,
                countries: {
                    ...state.countries,
                    results: Just(action.payload),
                    busy: false
                }
            };
        }

        default: {
            return state;
        }
    }
}
