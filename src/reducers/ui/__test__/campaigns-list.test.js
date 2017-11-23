import test from 'ava';
import {
    uniqueId,
    random,
    reduce
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    RECEIVE_PAGE_START,
    RECEIVE_PAGE_SUCCESS,
    RECEIVE_PAGE_FAILURE
} from 'actions/ui/campaigns-list';
import {
    initialState,
    reducer
} from '../campaigns-list';


test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('RECEIVE_PAGE_*', t => {
    const action1 = {
        type: RECEIVE_PAGE_START,
        payload: random(1, 100)
    };
    const action2 = {
        type: RECEIVE_PAGE_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: RECEIVE_PAGE_SUCCESS,
        payload: {
            total: random(1, 1000),
            results: uniqueId('results')
        }
    };
    const state0 = {
        current: random(1, 100),
        total: Just(random(1, 1000)),
        results: Just(uniqueId('results')),
        busy: false,
        errors: Just(uniqueId('errors'))
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        current: action1.payload,
        total: state0.total,
        results: Nothing(),
        busy: true,
        errors: Nothing()
    });

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        current: state1.current,
        total: state1.total,
        results: state1.results,
        busy: false,
        errors: Just(action2.payload)
    });

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state1, {
        current: action1.payload,
        total: state2.total,
        results: Nothing(),
        busy: true,
        errors: Nothing()
    });

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.deepEqual(state4, {
        current: state3.current,
        total: Just(action3.payload.total),
        results: Just(action3.payload.results),
        busy: false,
        errors: state3.errors
    });
});
