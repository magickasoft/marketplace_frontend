import {
    Nothing,
    Just
} from 'data.maybe';

import {
    LAUNCH_CAMPAIGN_START,
    LAUNCH_CAMPAIGN_FAILURE,
    LAUNCH_CAMPAIGN_SUCCESS
} from 'actions/ui/create-campaign/summary';


export const initialState = {
    busy: false,
    done: false,
    errors: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case LAUNCH_CAMPAIGN_START: {
            return {
                ...state,
                busy: true,
                errors: Nothing()
            };
        }

        case LAUNCH_CAMPAIGN_FAILURE: {
            return {
                ...state,
                busy: false,
                errors: Just(action.payload)
            };
        }

        case LAUNCH_CAMPAIGN_SUCCESS: {
            return {
                ...state,
                busy: false,
                done: true
            };
        }

        default: {
            return state;
        }
    }
}
