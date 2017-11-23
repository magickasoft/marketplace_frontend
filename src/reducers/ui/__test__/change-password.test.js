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
    CHANGE_NEW_PASSWORD,
    CHANGE_REPETITION_PASSWORD,
    CHANGE_PASSWORD_START,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE
} from 'actions/ui/change-password';
import {
    initialState,
    reducer
} from '../change-password';


test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, initialState, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('CHANGE_NEW_PASSWORD', t => {
    const action1 = {
        type: CHANGE_NEW_PASSWORD,
        payload: uniqueId('value')
    };
    const state0 = {
        fields: {
            newPassword: uniqueId('password'),
            repetitionPassword: uniqueId('password')
        },
        busy: false,
        errors: Just({
            newPassword: uniqueId('errors'),
            repetitionPassword: uniqueId('errors'),
            common: uniqueId('errors')
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state0, state1);
    t.deepEqual({
        fields: {
            newPassword: action1.payload,
            repetitionPassword: state0.fields.repetitionPassword
        },
        busy: false,
        errors: Just({
            newPassword: Nothing(),
            repetitionPassword: state0.errors.get().repetitionPassword,
            common: Nothing()
        })
    }, state1);
});

test('CHANGE_REPETITION_PASSWORD', t => {
    const action1 = {
        type: CHANGE_REPETITION_PASSWORD,
        payload: uniqueId('value')
    };
    const state0 = {
        fields: {
            newPassword: uniqueId('password'),
            repetitionPassword: uniqueId('password')
        },
        busy: false,
        errors: Just({
            newPassword: uniqueId('errors'),
            repetitionPassword: uniqueId('errors'),
            common: uniqueId('errors')
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state0, state1);
    t.deepEqual({
        fields: {
            newPassword: state0.fields.newPassword,
            repetitionPassword: action1.payload
        },
        busy: false,
        errors: Just({
            newPassword: state0.errors.get().newPassword,
            repetitionPassword: Nothing(),
            common: Nothing()
        })
    }, state1);
});

test('CHANGE_PASSWORD_*', t => {
    const action1 = {
        type: CHANGE_PASSWORD_START
    };
    const action2 = {
        type: CHANGE_PASSWORD_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: CHANGE_PASSWORD_SUCCESS
    };
    const state0 = {
        fields: {
            newPassword: uniqueId('password'),
            repetitionPassword: uniqueId('password')
        },
        busy: false,
        errors: Just(uniqueId('errors'))
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
            newPassword: '',
            repetitionPassword: ''
        },
        busy: false,
        errors: Nothing()
    });
});
