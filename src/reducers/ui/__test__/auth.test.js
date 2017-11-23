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
    AUTH_START,
    AUTH_SUCCESS,
    AUTH_FAILURE
} from 'actions/ui/auth';
import {
    initialState,
    reducer
} from '../auth';


test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('AUTH_*', t => {
    const action1 = {
        type: AUTH_START
    };
    const action2 = {
        type: AUTH_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: AUTH_SUCCESS
    };
    const state0 = {
        busy: false,
        errors: Just(uniqueId('errors'))
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        busy: true,
        errors: Nothing()
    });

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        busy: false,
        errors: Just(action2.payload)
    });

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state1, {
        busy: true,
        errors: Nothing()
    });

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.is(state4, initialState);
    t.deepEqual(state4, {
        busy: false,
        errors: Nothing()
    });
});
