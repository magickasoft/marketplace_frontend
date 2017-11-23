import {
    Nothing,
    Just
} from 'data.maybe';

import {
    SELECT,
    RECEIVE_MEDIA_PAGE_START,
    RECEIVE_MEDIA_PAGE_SUCCESS,
    RECEIVE_MEDIA_PAGE_FAILURE
} from 'actions/ui/create-campaign/media';
import {
    initialState as initialModalState,
    reducer as reducerModal
} from './modal';


export const initialState = {
    selected: Nothing(),
    current: 1,
    total: Nothing(),
    results: Nothing(),
    busy: false,
    errors: Nothing(),
    modal: initialModalState
};

export function reducer(state, action) {
    switch (action.type) {
        case SELECT: {
            return {
                ...state,
                selected: Just(action.payload)
            };
        }

        case RECEIVE_MEDIA_PAGE_START: {
            return {
                ...state,
                busy: true,
                current: action.payload,
                results: Nothing(),
                errors: Nothing()
            };
        }

        case RECEIVE_MEDIA_PAGE_SUCCESS: {
            return {
                ...state,
                busy: false,
                total: Just(action.payload.total),
                results: Just(action.payload.results)
            };
        }

        case RECEIVE_MEDIA_PAGE_FAILURE: {
            return {
                ...state,
                busy: false,
                errors: Just(action.payload)
            };
        }

        default: {
            const nextModal = reducerModal(state.modal, action);

            if (state.modal === nextModal) {
                return state;
            }

            return {
                ...state,
                modal: nextModal
            };
        }
    }
}
