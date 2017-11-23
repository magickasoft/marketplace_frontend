import {
    Just,
    Nothing
} from 'data.maybe';

import {
    CHANGE_EMAIL,
    RECOVERY_PASSWORD_START,
    RECOVERY_PASSWORD_SUCCESS,
    RECOVERY_PASSWORD_FAILURE
} from 'actions/ui/recovery-password';


export const initialState = {
    fields: {
        email: ''
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
                    email: action.payload
                },
                errors: Nothing()
            };
        }

        case RECOVERY_PASSWORD_START: {
            return {
                ...state,
                busy: true,
                errors: Nothing()
            };
        }

        case RECOVERY_PASSWORD_SUCCESS: {
            return initialState;
        }

        case RECOVERY_PASSWORD_FAILURE: {
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
