import {
    isEmpty
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    CHANGE_NAME,
    CHANGE_DESCRIPTION,
    CHANGE_START_DATE,
    CHANGE_END_DATE,
    CREATE_CAMPAIGN_START,
    CREATE_CAMPAIGN_SUCCESS,
    CREATE_CAMPAIGN_FAILURE,
    UPDATE_CAMPAIGN_START,
    UPDATE_CAMPAIGN_SUCCESS,
    UPDATE_CAMPAIGN_FAILURE
} from 'actions/ui/create-campaign/campaign';

export const initialState = {
    bunch: Nothing(),
    fields: {
        name: '',
        description: '',
        startDate: '',
        endDate: Nothing()
    },
    busy: false,
    errors: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case CHANGE_NAME: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    name: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    name: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CHANGE_DESCRIPTION: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    description: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    description: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CHANGE_START_DATE: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    startDate: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    startDate: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CHANGE_END_DATE: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    endDate: isEmpty(action.payload) ?
                        Nothing() :
                        Just(action.payload)
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    endDate: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CREATE_CAMPAIGN_START: {
            return {
                ...state,
                busy: true,
                errors: Nothing()
            };
        }

        case CREATE_CAMPAIGN_SUCCESS: {
            return {
                ...state,
                bunch: Just(action.payload),
                busy: false
            };
        }

        case CREATE_CAMPAIGN_FAILURE: {
            return {
                ...state,
                busy: false,
                errors: Just(action.payload)
            };
        }

        case UPDATE_CAMPAIGN_START: {
            return {
                ...state,
                busy: true,
                errors: Nothing()
            };
        }

        case UPDATE_CAMPAIGN_SUCCESS: {
            return {
                ...state,
                busy: false
            };
        }

        case UPDATE_CAMPAIGN_FAILURE: {
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
