import {
    Nothing,
    Just
} from 'data.maybe';

import {
    PROCESSING_INFO_START,
    PROCESSING_INFO_SUCCESS,
    PROCESSING_INFO_FAILURE
} from 'actions/ui/create-campaign/offer-info';


export const initialState = {
    busy: false,
    errors: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case PROCESSING_INFO_START: {
            return {
                ...state,
                busy: true,
                errors: Nothing()
            };
        }

        case PROCESSING_INFO_SUCCESS: {
            return {
                ...state,
                busy: false
            };
        }

        case PROCESSING_INFO_FAILURE: {
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
