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
    CHANGE_EMAIL,
    RECOVERY_PASSWORD_START,
    RECOVERY_PASSWORD_SUCCESS,
    RECOVERY_PASSWORD_FAILURE
} from 'actions/ui/recovery-password';
import {
    initialState,
    reducer
} from '../recovery-password';


function generateBool() {
    return Boolean(random(0, 1));
}

test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('CHANGE_EMAIL', t => {
    const action1 = {
        type: CHANGE_EMAIL,
        payload: uniqueId('value')
    };
    const errorsEmail = uniqueId('errors');
    const state0 = {
        fields: {
            email: uniqueId('email')
        },
        busy: generateBool(),
        errors: Just({
            email: Just(errorsEmail),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        fields: {
            email: action1.payload
        },
        busy: state0.busy,
        errors: Nothing()
    });
});

test('RECOVERY_PASSWORD_*', t => {
    const action1 = {
        type: RECOVERY_PASSWORD_START
    };
    const action2 = {
        type: RECOVERY_PASSWORD_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: RECOVERY_PASSWORD_SUCCESS
    };
    const state0 = {
        fields: {
            email: uniqueId('email')
        },
        busy: false,
        errors: Just({
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        fields: state0.fields,
        busy: true,
        errors: Nothing()
    });

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        fields: state1.fields,
        busy: false,
        errors: Just(action2.payload)
    });

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state3, {
        fields: state2.fields,
        busy: true,
        errors: Nothing()
    });

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.is(state4, initialState);
    t.deepEqual(state4, {
        fields: {
            email: ''
        },
        busy: false,
        errors: Nothing()
    });
});
