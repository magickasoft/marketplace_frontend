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
    LAUNCH_CAMPAIGN_START,
    LAUNCH_CAMPAIGN_FAILURE,
    LAUNCH_CAMPAIGN_SUCCESS
} from 'actions/ui/create-campaign/summary';
import {
    initialState,
    reducer
} from '../summary';


test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('LAUNCH_CAMPAIGN_*', t => {
    const action1 = {
        type: LAUNCH_CAMPAIGN_START
    };
    const action2 = {
        type: LAUNCH_CAMPAIGN_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: LAUNCH_CAMPAIGN_SUCCESS
    };
    const state0 = {
        busy: false,
        done: false,
        errors: Just({
            name: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        busy: true,
        done: state0.done,
        errors: Nothing()
    });

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        busy: false,
        done: state1.done,
        errors: Just(action2.payload)
    });

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state3, {
        busy: true,
        done: state2.done,
        errors: Nothing()
    });

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.deepEqual(state4, {
        busy: false,
        done: true,
        errors: Nothing()
    });
});
