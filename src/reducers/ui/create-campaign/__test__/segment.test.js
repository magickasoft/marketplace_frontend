import test from 'ava';
import {
    uniqueId,
    reduce
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    ADD_LOCATION,
    REMOVE_LOCATION,
    SET_ZOOM,
    SET_MAP_CENTER,
    SHOW_ALL_LOCATIONS,
    RECEIVE_PLACES_LIST_START,
    RECEIVE_PLACES_LIST_SUCCESS,
    RECEIVE_PLACES_LIST_FAILURE
} from 'actions/ui/create-campaign/segment';
import appConfig from 'config/app';
import {
    initialState,
    reducer
} from '../segment';

const DEFAULT_ZOOM = appConfig.segments.defaultZoom;
const DEFAULT_CENTER = appConfig.segments.defaultCenter;

test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
});

test('ADD_LOCATION', t => {

    const action1 = {
        type: ADD_LOCATION,
        payload: {
            bunch: uniqueId('bunch'),
            point: uniqueId('point')
        }
    };

    const location = {
        place: action1.payload.bunch,
        radius: appConfig.segments.defaultRadius
    };

    const state0 = {
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

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state0, state1);
    t.deepEqual({
        selectedLocations: [ location ],
        results: state0.results,
        queryBusy: state0.queryBusy,
        countBusy: state0.countBusy,
        errors: state0.errors,
        activeLocation: Just(location),
        usersCount: state0.usersCount,
        mapCenter: action1.payload.point,
        zoom: state0.zoom,
        bounds: state0.bounds
    }, state1);
});

test('REMOVE_LOCATION', t => {

    const action1 = {
        type: REMOVE_LOCATION,
        payload: uniqueId('bunch1')
    };

    const action2 = {
        type: REMOVE_LOCATION,
        payload: uniqueId('bunch2')
    };

    const location1 = {
        place: action1.payload,
        radius: appConfig.segments.defaultRadius
    };

    const location2 = {
        place: action2.payload,
        radius: appConfig.segments.defaultRadius
    };

    const state0 = {
        selectedLocations: [ location1 ],
        results: Nothing(),
        queryBusy: false,
        countBusy: false,
        errors: Nothing(),
        activeLocation: Just(location1),
        usersCount: 0,
        mapCenter: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        bounds: Nothing()
    };

    const state1 = {
        selectedLocations: [ location1, location2 ],
        results: Nothing(),
        queryBusy: false,
        countBusy: false,
        errors: Nothing(),
        activeLocation: Just(location1),
        usersCount: 0,
        mapCenter: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        bounds: Nothing()
    };

    const state2 = reduce(reducer, state0, [ action1 ]);
    t.not(state0, state2);
    t.deepEqual({
        selectedLocations: [],
        results: state0.results,
        queryBusy: state0.queryBusy,
        countBusy: state0.countBusy,
        errors: state0.errors,
        activeLocation: Nothing(),
        usersCount: state0.usersCount,
        mapCenter: state0.mapCenter,
        zoom: state0.zoom,
        bounds: state0.bounds
    }, state2);

    const state3 = reduce(reducer, state1, [ action1 ]);
    t.not(state1, state3);
    t.deepEqual({
        selectedLocations: [ location2 ],
        results: state1.results,
        queryBusy: state1.queryBusy,
        countBusy: state1.countBusy,
        errors: state1.errors,
        activeLocation: Nothing(),
        usersCount: state1.usersCount,
        mapCenter: state1.mapCenter,
        zoom: state1.zoom,
        bounds: state1.bounds
    }, state3);

    const state4 = reduce(reducer, state1, [ action2 ]);
    t.not(state1, state4);
    t.deepEqual({
        selectedLocations: [ location1 ],
        results: state1.results,
        queryBusy: state1.queryBusy,
        countBusy: state1.countBusy,
        errors: state1.errors,
        activeLocation: Just(location1),
        usersCount: state1.usersCount,
        mapCenter: state1.mapCenter,
        zoom: state1.zoom,
        bounds: state1.bounds
    }, state4);
});

test('RECEIVE_PLACES_LIST_*', t => {
    const action1 = {
        type: RECEIVE_PLACES_LIST_START
    };
    const action2 = {
        type: RECEIVE_PLACES_LIST_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: RECEIVE_PLACES_LIST_SUCCESS,
        payload: uniqueId('results')
    };
    const state0 = {
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

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        selectedLocations: state0.selectedLocations,
        results: state0.results,
        queryBusy: true,
        countBusy: false,
        errors: Nothing(),
        activeLocation: state0.activeLocation,
        usersCount: state0.usersCount,
        mapCenter: state0.mapCenter,
        zoom: state0.zoom,
        bounds: state0.bounds
    });

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        selectedLocations: state1.selectedLocations,
        results: state1.results,
        queryBusy: false,
        countBusy: false,
        errors: Just(action2.payload),
        activeLocation: state1.activeLocation,
        usersCount: state1.usersCount,
        mapCenter: state1.mapCenter,
        zoom: state1.zoom,
        bounds: state1.bounds
    });

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state3, {
        selectedLocations: state2.selectedLocations,
        results: state2.results,
        queryBusy: true,
        countBusy: false,
        errors: Nothing(),
        activeLocation: state2.activeLocation,
        usersCount: state2.usersCount,
        mapCenter: state2.mapCenter,
        zoom: state2.zoom,
        bounds: state2.bounds
    });

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.deepEqual(state4, {
        selectedLocations: state3.selectedLocations,
        results: Just(action3.payload),
        queryBusy: false,
        countBusy: false,
        errors: state3.errors,
        activeLocation: state3.activeLocation,
        usersCount: state3.usersCount,
        mapCenter: state3.mapCenter,
        zoom: state3.zoom,
        bounds: state3.bounds
    });
});

test('SET_ZOOM', t => {
    const action1 = {
        type: SET_ZOOM,
        payload: uniqueId('zoom')
    };

    const state0 = {
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

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        selectedLocations: state0.selectedLocations,
        results: state0.results,
        queryBusy: state0.queryBusy,
        countBusy: state0.countBusy,
        errors: Nothing(),
        activeLocation: state0.activeLocation,
        usersCount: state0.usersCount,
        mapCenter: state0.mapCenter,
        zoom: action1.payload,
        bounds: state0.bounds
    });
});

test('SET_MAP_CENTER', t => {

    const point = {
        lng: 82.91,
        lat: 55.03
    };

    const action1 = {
        type: SET_MAP_CENTER,
        payload: point
    };

    const state0 = {
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

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        selectedLocations: state0.selectedLocations,
        results: state0.results,
        queryBusy: state0.queryBusy,
        countBusy: state0.countBusy,
        errors: Nothing(),
        activeLocation: state0.activeLocation,
        usersCount: state0.usersCount,
        mapCenter: [ 82.91, 55.03 ],
        zoom: state0.zoom,
        bounds: state0.bounds
    });
});

test('SHOW_ALL_LOCATIONS', t => {

    const point1 = [ 82.91, 55.03 ];
    const point2 = [ 37.61, 55.75 ];
    const bounds = [[ 37.61, 55.03 ], [ 82.91, 55.75 ]];

    const action1 = {
        type: SHOW_ALL_LOCATIONS,
        payload: []
    };

    const action2 = {
        type: SHOW_ALL_LOCATIONS,
        payload: [
            { place: { point: point1 } }
        ]
    };

    const action3 = {
        type: SHOW_ALL_LOCATIONS,
        payload: [
            { place: { point: point1 } },
            { place: { point: point2 } }
        ]
    };

    const state0 = {
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

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        selectedLocations: state0.selectedLocations,
        results: state0.results,
        queryBusy: state0.queryBusy,
        countBusy: state0.countBusy,
        errors: Nothing(),
        activeLocation: state0.activeLocation,
        usersCount: state0.usersCount,
        mapCenter: state0.mapCenter,
        zoom: state0.zoom,
        bounds: state0.bounds
    });

    const state2 = reduce(reducer, state0, [ action2 ]);
    t.not(state2, state0);
    t.deepEqual(state2, {
        selectedLocations: state0.selectedLocations,
        results: state0.results,
        queryBusy: state0.queryBusy,
        countBusy: state0.countBusy,
        errors: Nothing(),
        activeLocation: state0.activeLocation,
        usersCount: state0.usersCount,
        mapCenter: point1,
        zoom: state0.zoom,
        bounds: state0.bounds
    });

    const state3 = reduce(reducer, state0, [ action3 ]);
    t.not(state3, state0);
    t.deepEqual(state3, {
        selectedLocations: state0.selectedLocations,
        results: state0.results,
        queryBusy: state0.queryBusy,
        countBusy: state0.countBusy,
        errors: Nothing(),
        activeLocation: state0.activeLocation,
        usersCount: state0.usersCount,
        mapCenter: state0.mapCenter,
        zoom: state0.zoom,
        bounds: Just(bounds)
    });
});
