import {
    map
} from 'lodash/fp';
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
} from 'actions/ui/stories-list/editor-picks';
import {
    initialModel as initialListModel,
    update as updateList
} from './';


export const initialState = {
    results: Nothing(),
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
                    map(
                        ([ date, list ]) => ([
                            date,
                            updateList(action.payload, list)
                        ])
                    )
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
                results: Just(
                    map(
                        ([ date, msg ]) => ([
                            date,
                            updateList(msg, initialListModel)
                        ]),
                        action.payload
                    )
                ),
                busy: false,
                errors: Nothing()
            };
        }

        default: {
            return state;
        }
    }
}
