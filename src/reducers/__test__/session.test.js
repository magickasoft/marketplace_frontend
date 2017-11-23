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
    USER_LOGIN,
    USER_LOGOUT
} from 'actions/session';
import {
    initialState,
    reducer
} from '../session';


test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('USER_LOGIN', t => {
    const action1 = {
        type: USER_LOGIN,
        payload: {
            bunch: uniqueId('bunch'),
            role: uniqueId('role')
        }
    };
    const state0 = {
        user: Nothing()
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        user: Just(action1.payload.bunch),
        role: action1.payload.role
    });
});

test('USER_LOGOUT', t => {
    const action1 = {
        type: USER_LOGOUT
    };
    const state0 = {
        user: Just(uniqueId('user'))
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        user: Nothing(),
        role: 0
    });
});
