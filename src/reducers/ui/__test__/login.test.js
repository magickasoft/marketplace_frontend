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
    CHANGE_PASSWORD,
    SET_REMEMBER_ME,
    LOGIN_START,
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from 'actions/ui/login';
import {
    initialState,
    reducer
} from '../login';


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
    const errorsPassword = uniqueId('errors');
    const state0 = {
        fields: {
            email: uniqueId('email'),
            password: uniqueId('password'),
            remembereMe: generateBool()
        },
        busy: false,
        errors: Just({
            email: Just(uniqueId('errors')),
            password: Just(errorsPassword),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state0, state1);
    t.deepEqual({
        fields: {
            email: action1.payload,
            password: state0.fields.password,
            remembereMe: state0.fields.remembereMe
        },
        busy: state0.busy,
        errors: Just({
            email: Nothing(),
            password: Just(errorsPassword),
            common: Nothing()
        })
    }, state1);
});

test('CHANGE_PASSWORD', t => {
    const action1 = {
        type: CHANGE_PASSWORD,
        payload: uniqueId('value')
    };
    const errorsEmail = uniqueId('errors');
    const state0 = {
        fields: {
            email: uniqueId('email'),
            password: uniqueId('password'),
            remembereMe: generateBool()
        },
        busy: false,
        errors: Just({
            email: Just(errorsEmail),
            password: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state0, state1);
    t.deepEqual({
        fields: {
            email: state0.fields.email,
            password: action1.payload,
            remembereMe: state0.fields.remembereMe
        },
        busy: state0.busy,
        errors: Just({
            email: Just(errorsEmail),
            password: Nothing(),
            common: Nothing()
        })
    }, state1);
});

test('SET_REMEMBER_ME', t => {
    const action1 = {
        type: SET_REMEMBER_ME,
        payload: generateBool()
    };
    const errorsEmail = uniqueId('errors');
    const errorsPassword = uniqueId('errors');
    const state0 = {
        fields: {
            email: uniqueId('email'),
            password: uniqueId('password'),
            remembereMe: !action1.payload
        },
        busy: false,
        errors: Just({
            email: Just(errorsEmail),
            password: Just(errorsPassword),
            common: Just(uniqueId('errors'))
        })
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        fields: {
            email: state0.fields.email,
            password: state0.fields.password,
            remembereMe: action1.payload
        },
        busy: state0.busy,
        errors: Just({
            email: Just(errorsEmail),
            password: Just(errorsPassword),
            common: Nothing()
        })
    });
});

test('LOGIN_*', t => {
    const action1 = {
        type: LOGIN_START
    };
    const action2 = {
        type: LOGIN_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: LOGIN_SUCCESS
    };
    const state0 = {
        fields: {
            email: uniqueId('email'),
            password: uniqueId('password'),
            remembereMe: generateBool()
        },
        busy: false,
        errors: Just({
            email: Just(uniqueId('errors')),
            password: Just(uniqueId('errors')),
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
            email: '',
            password: '',
            remembereMe: true
        },
        busy: false,
        errors: Nothing()
    });
});
