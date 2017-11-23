import {
    Nothing,
    Just
} from 'data.maybe';

import {
    CHANGE_EMAIL,
    CHANGE_PASSWORD,
    SET_REMEMBER_ME,
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from 'actions/ui/login';


export const initialState = {
    fields: {
        email: '',
        password: '',
        remembereMe: true
    },
    busy: false,
    errors: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case CHANGE_EMAIL: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    email: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    email: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CHANGE_PASSWORD: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    password: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    password: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case SET_REMEMBER_ME: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    remembereMe: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    common: Nothing()
                }))
            };
        }

        case LOGIN_START: {
            return {
                ...state,
                busy: true,
                errors: Nothing()
            };
        }

        case LOGIN_SUCCESS: {
            return initialState;
        }

        case LOGIN_FAILURE: {
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
