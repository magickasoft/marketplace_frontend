import {
    Nothing,
    Just
} from 'data.maybe';

import {
    RECEIVE_CHANNELS_PAGE_START,
    RECEIVE_CHANNELS_PAGE_FAILURE,
    RECEIVE_CHANNELS_PAGE_SUCCESS,
    ENABLE_DELETING,
    DISABLE_DELETING,
    DELETE_CHANNEL_START,
    DELETE_CHANNEL_FAILURE
} from 'actions/ui/partners';


export const initialState = {
    current: 1,
    total: Nothing(),
    results: Nothing(),
    busy: false,
    errors: Nothing(),
    editing: Nothing(),
    deleting: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case RECEIVE_CHANNELS_PAGE_START: {
            return {
                ...state,
                busy: true,
                current: action.payload,
                results: Nothing()
            };
        }

        case RECEIVE_CHANNELS_PAGE_FAILURE: {
            return {
                ...state,
                busy: false,
                errors: Just(action.payload)
            };
        }

        case RECEIVE_CHANNELS_PAGE_SUCCESS: {
            return {
                ...state,
                busy: false,
                total: Just(action.payload.total),
                results: Just(action.payload.results),
                errors: Nothing()
            };
        }

        case ENABLE_DELETING: {
            return {
                ...state,
                deleting: Just({
                    bunch: action.payload,
                    busy: false,
                    errors: Nothing()
                })
            };
        }

        case DISABLE_DELETING: {
            return {
                ...state,
                deleting: Nothing()
            };
        }

        case DELETE_CHANNEL_START: {
            return {
                ...state,
                deleting: state.deleting.map(deleting => ({
                    ...deleting,
                    busy: true
                }))
            };
        }

        case DELETE_CHANNEL_FAILURE: {
            return {
                ...state,
                deleting: state.deleting.map(deleting => ({
                    ...deleting,
                    busy: false,
                    errors: Just(action.payload)
                }))
            };
        }

        default: {
            return state;
        }
    }
}
