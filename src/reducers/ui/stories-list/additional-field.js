import {
    Nothing,
    Just
} from 'data.maybe';

import {
    COUNT_REVIEW
} from 'actions/ui/stories-list/additional-field';

export const initialState = {
    countForReview: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case COUNT_REVIEW: {
            return {
                ...state,
                countForReview: Just(action.payload)
            };
        }

        default: {
            return state;
        }
    }
}
