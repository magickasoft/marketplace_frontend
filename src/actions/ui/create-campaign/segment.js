import {
    batchActions
} from 'redux-batched-actions';
import {
    getPlacesList as getPlacesListRequest,
    getUsersCount as getUsersCountRequest
} from 'services/campaign-manager';
import {
    merge
} from 'actions/data';
import appConfig from 'config/app';
import {
    denormalize,
    filterMap
} from 'utils';
import {
    Nothing
} from 'data.maybe';

export const RECEIVE_PLACES_LIST_START = 'UI/CREATE_CAMPAIGN/SEGMENT/RECEIVE_PLACES_LIST_START';

export function receivePlacesListStart() {
    return {
        type: RECEIVE_PLACES_LIST_START
    };
}

export const RECEIVE_PLACES_LIST_SUCCESS = 'UI/CREATE_CAMPAIGN/SEGMENT/RECEIVE_PLACES_LIST_SUCCESS';

export function receivePlacesListSuccess(results) {
    return {
        type: RECEIVE_PLACES_LIST_SUCCESS,
        payload: results
    };
}

export const RECEIVE_PLACES_LIST_FAILURE = 'UI/CREATE_CAMPAIGN/SEGMENT/RECEIVE_PLACES_LIST_FAILURE';

export function receivePlacesListFailure(errors) {
    return {
        type: RECEIVE_PLACES_LIST_FAILURE,
        payload: errors
    };
}

export function receivePlacesList(inputValue) {
    return (dispatch, getState) => {
        const { ui } = getState();
        const [ , segment ] = ui.createCampaign.tabs;

        if (segment.queryBusy || inputValue.length < appConfig.segments.minInputLength) {
            return Promise.resolve();
        }

        dispatch(
            receivePlacesListStart()
        );

        return getPlacesListRequest(inputValue)
            .then(({ result, entities }) => {
                dispatch(
                    batchActions([
                        receivePlacesListSuccess(result),
                        merge(entities)
                    ])
                );
            })
            .catch(errors => {
                dispatch(
                    receivePlacesListFailure(errors)
                );
            });
    };
}

export const ADD_LOCATION = 'UI/CREATE_CAMPAIGN/SEGMENT/ADD_LOCATION';

export function addLocation(location) {
    return {
        type: ADD_LOCATION,
        payload: location
    };
}

export const REMOVE_LOCATION = 'UI/CREATE_CAMPAIGN/SEGMENT/REMOVE_LOCATION';

export function removeLocation(location) {
    return {
        type: REMOVE_LOCATION,
        payload: location
    };
}

export const SET_ACTIVE_LOCATION = 'UI/CREATE_CAMPAIGN/SEGMENT/SET_ACTIVE_LOCATION';

export function setActiveLocation(location) {
    return {
        type: SET_ACTIVE_LOCATION,
        payload: location
    };
}

export const RECEIVE_USERS_COUNT_START = 'UI/CREATE_CAMPAIGN/SEGMENT/RECEIVE_USERS_COUNT_START';

export function receiveUsersCountStart() {
    return {
        type: RECEIVE_USERS_COUNT_START
    };
}

export const RECEIVE_USERS_COUNT_SUCCESS = 'UI/CREATE_CAMPAIGN/SEGMENT/RECEIVE_USERS_COUNT_SUCCESS';

export function receiveUsersCountSuccess(usersCount) {
    return {
        type: RECEIVE_USERS_COUNT_SUCCESS,
        payload: usersCount
    };
}

export const RECEIVE_USERS_COUNT_FAILURE = 'UI/CREATE_CAMPAIGN/SEGMENT/RECEIVE_USERS_COUNT_FAILURE';

export function receiveUsersCountFailure(errors) {
    return {
        type: RECEIVE_USERS_COUNT_FAILURE,
        payload: errors
    };
}


export const selectLocation = location => dispatch => {
    dispatch(addLocation(location));
    return dispatch(getUsersCount());
};

export const deleteLocation = location => dispatch => {
    dispatch(removeLocation(location));
    return dispatch(getUsersCount());
};

export function getUsersCount() {

    return (dispatch, getState) => {

        dispatch(receiveUsersCountStart());

        const { ui, data } = getState();
        const [ , segment ] = ui.createCampaign.tabs;

        const selectedLocations = filterMap(
            l => denormalize(Nothing(), data, l.place).map(
                place => ({ ...l, place })
            ),
            segment.selectedLocations
        );

        return getUsersCountRequest(selectedLocations)
            .then(usersCount => {
                dispatch(receiveUsersCountSuccess(usersCount));
            })
            .catch(errors => {
                dispatch(
                    receiveUsersCountFailure(errors)
                );
            });
    };
}

export const SHOW_ALL_LOCATIONS = 'UI/CREATE_CAMPAIGN/SEGMENT/SHOW_ALL_LOCATIONS';

export function showAllLocations(locations) {
    return {
        type: SHOW_ALL_LOCATIONS,
        payload: locations
    };
}

export const SET_ZOOM = 'UI/CREATE_CAMPAIGN/SEGMENT/SET_ZOOM';

export function setZoom(zoom) {
    return {
        type: SET_ZOOM,
        payload: zoom
    };
}

export const SET_MAP_CENTER = 'UI/CREATE_CAMPAIGN/SEGMENT/SET_MAP_CENTER';

export function setMapCenter(center) {
    return {
        type: SET_MAP_CENTER,
        payload: center
    };
}
