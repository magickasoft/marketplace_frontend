import {
    Just,
    Nothing
} from 'data.maybe';

import {
    CHANGE_NEW_PASSWORD,
    CHANGE_REPETITION_PASSWORD,
    CHANGE_PASSWORD_START,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE
} from 'actions/ui/change-password';


export const initialState = {
    fields: {
        newPassword: '',
        repetitionPassword: ''
    },
    busy: false,
    errors: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case CHANGE_NEW_PASSWORD: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    newPassword: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    newPassword: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CHANGE_REPETITION_PASSWORD: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    repetitionPassword: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    repetitionPassword: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CHANGE_PASSWORD_START: {
            return {
                ...state,
                busy: true,
                errors: Nothing()
            };
        }

        case CHANGE_PASSWORD_SUCCESS: {
            return initialState;
        }

        case CHANGE_PASSWORD_FAILURE: {
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
