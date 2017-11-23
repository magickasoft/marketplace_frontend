import {
    LOCATION_CHANGE
} from 'react-router-redux';


export const initialState = {
    locationBeforeTransitions: null
};

export function reducer(state, action) {

    switch (action.type) {
        case LOCATION_CHANGE: {
            return {
                ...state,
                locationBeforeTransitions: action.payload
            };
        }

        default: {
            return state;
        }
    }
}
