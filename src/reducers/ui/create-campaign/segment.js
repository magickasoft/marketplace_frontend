import {
    Just,
    Nothing
} from 'data.maybe';
import {
    filter,
    isEqual,
    map
} from 'lodash/fp';
import {
    head
} from 'utils';
import {
    SET_ACTIVE_LOCATION,
    SHOW_ALL_LOCATIONS,
    SET_ZOOM,
    SET_MAP_CENTER,
    ADD_LOCATION,
    REMOVE_LOCATION,
    RECEIVE_PLACES_LIST_START,
    RECEIVE_PLACES_LIST_SUCCESS,
    RECEIVE_PLACES_LIST_FAILURE,
    RECEIVE_USERS_COUNT_START,
    RECEIVE_USERS_COUNT_SUCCESS,
    RECEIVE_USERS_COUNT_FAILURE
} from 'actions/ui/create-campaign/segment';

import {
    convertPointObjToTuple,
    fitBounds
} from 'models/point';

import appConfig from 'config/app';

const DEFAULT_CENTER = appConfig.segments.defaultCenter;
const DEFAULT_ZOOM = appConfig.segments.defaultZoom;

export const initialState = {
    selectedLocations: [],
    results: Nothing(),
    queryBusy: false,
    countBusy: false,
    errors: Nothing(),
    activeLocation: Nothing(),
    usersCount: 0,

    mapCenter: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    bounds: Nothing()
};

export function reducer(state, action) {
    switch (action.type) {
        case ADD_LOCATION: {

            const location = {
                place: action.payload.bunch,
                radius: appConfig.segments.defaultRadius
            };

            return {
                ...state,
                selectedLocations: [ ...state.selectedLocations, location ],
                activeLocation: Just(location),

                mapCenter: action.payload.point,
                zoom: DEFAULT_ZOOM,
                bounds: Nothing()
            };
        }

        case REMOVE_LOCATION: {
            const selectedLocations = filter(el => !isEqual(action.payload, el.place), state.selectedLocations);

            return {
                ...state,
                selectedLocations,
                activeLocation: state.activeLocation.chain(
                    ({ place }) => isEqual(action.payload, place) ? Nothing() : state.activeLocation
                ),

                bounds: Nothing()
            };
        }

        case SET_ACTIVE_LOCATION: {
            return {
                ...state,
                activeLocation: Just({
                    ...action.payload,
                    place: action.payload.place.bunch
                }),

                mapCenter: action.payload.place.point,
                zoom: DEFAULT_ZOOM,
                bounds: Nothing()
            };
        }

        case SHOW_ALL_LOCATIONS: {
            const mapState = action.payload.length === 1 ? {
                bounds: Nothing(),
                mapCenter: head(action.payload).map(l => l.place.point).getOrElse(DEFAULT_CENTER),
                zoom: DEFAULT_ZOOM
            } : {
                bounds: fitBounds(map(l => l.place.point, action.payload))
            };

            return {
                ...state,
                activeLocation: Nothing(),
                ...mapState
            };
        }

        case SET_ZOOM: {
            return {
                ...state,
                zoom: action.payload
            };
        }

        case SET_MAP_CENTER: {
            return {
                ...state,
                mapCenter: convertPointObjToTuple(action.payload)
            };
        }

        case RECEIVE_PLACES_LIST_START: {
            return {
                ...state,
                queryBusy: true,
                errors: Nothing()
            };
        }

        case RECEIVE_PLACES_LIST_SUCCESS: {
            return {
                ...state,
                results: Just(action.payload),
                queryBusy: false
            };
        }

        case RECEIVE_PLACES_LIST_FAILURE: {
            return {
                ...state,
                queryBusy: false,
                errors: Just(action.payload)
            };
        }

        case RECEIVE_USERS_COUNT_START: {
            return {
                ...state,
                countBusy: true,
                errors: Nothing()
            };
        }

        case RECEIVE_USERS_COUNT_SUCCESS: {
            return {
                ...state,
                countBusy: false,
                usersCount: action.payload
            };
        }

        case RECEIVE_USERS_COUNT_FAILURE: {
            return {
                ...state,
                countBusy: false,
                errors: Just(action.payload)
            };
        }

        default: {
            return state;
        }
    }
}
