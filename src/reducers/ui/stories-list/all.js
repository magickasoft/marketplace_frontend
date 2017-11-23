import {
    Nothing,
    Just
} from 'data.maybe';

import {
    LIST_ACTION,
    SHOW_DELETE_DIALOG,
    HIDE_DELETE_DIALOG,
    RECEIVE_PAGE_START,
    RECEIVE_PAGE_FAILURE,
    RECEIVE_PAGE_SUCCESS
} from 'actions/ui/stories-list/all';
import {
    initialModel as initialListModel,
    update as updateList
} from './';


export const initialState = {
    total: Nothing(),
    results: Nothing(),
    query: Nothing(),
    deleteDialog: Nothing(),
    busy: false,
    errors: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case LIST_ACTION: {
            return {
                ...state,
                results: state.results.map(
                    updateList(action.payload)
                )
            };
        }

        case SHOW_DELETE_DIALOG: {
            return {
                ...state,
                deleteDialog: Just(action.payload)
            };
        }

        case HIDE_DELETE_DIALOG: {
            return {
                ...state,
                deleteDialog: Nothing()
            };
        }

        case RECEIVE_PAGE_START: {
            return {
                ...state,
                query: Just(action.payload),
                busy: true
            };
        }

        case RECEIVE_PAGE_FAILURE: {
            return {
                ...state,
                results: Nothing(),
                busy: false,
                errors: Just(action.payload)
            };
        }

        case RECEIVE_PAGE_SUCCESS: {
            return {
                ...state,
                total: Just(action.payload.total),
                busy: false,
                results: Just(
                    updateList(action.payload.listAction, initialListModel)
                ),
                errors: Nothing()
            };
        }

        default: {
            return state;
        }
    }
}
