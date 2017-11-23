import test from 'ava';
import {
    uniqueId,
    reduce
} from 'lodash/fp';
import {
    Just
} from 'data.maybe';


import {
    ENABLE_PUSH,
    CHANGE_PREVIEW_TYPE,
    CHANGE_TITLE,
    CHANGE_MESSAGE
} from 'actions/ui/create-campaign/push';
import {
    initialState,
    reducer
} from '../push';

import {push as pushConfig} from 'config/app';


test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
});

test('ENABLE_PUSH', t => {
    const action1 = {
        type: ENABLE_PUSH,
        payload: uniqueId('value')
    };
    const state0 = {
        enabled: uniqueId('enabled')
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        enabled: action1.payload
    });
});

test('CHANGE_PREVIEW_TYPE', t => {
    const action1 = {
        type: CHANGE_PREVIEW_TYPE,
        payload: uniqueId('new_preview_type')
    };
    const state0 = {
        previewType: uniqueId('preview_type')
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        previewType: action1.payload
    });
});

test('CHANGE_TITLE', t => {
    const action1 = {
        type: CHANGE_TITLE,
        payload: uniqueId('value')
    };
    const state0 = {
        fields: {
            foo: uniqueId('foo'),
            title: uniqueId('title')
        }
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        fields: {
            foo: state0.fields.foo,
            title: Just(action1.payload)
        }
    });
});

test('CHANGE_TITLE long', t => {
    const value = 'a'.repeat(pushConfig.displayedTitleLength + 1);
    const action1 = {
        type: CHANGE_TITLE,
        payload: value
    };
    const state0 = {
        fields: {}
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.true(state1.fields.title.get().length === pushConfig.displayedTitleLength);
});

test('CHANGE_MESSAGE', t => {
    const action1 = {
        type: CHANGE_MESSAGE,
        payload: uniqueId('value')
    };
    const state0 = {
        fields: {
            foo: uniqueId('foo'),
            message: uniqueId('message')
        }
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        fields: {
            foo: state0.fields.foo,
            message: Just(action1.payload)
        }
    });
});

test('CHANGE_MESSAGE long', t => {
    const value = 'a'.repeat(pushConfig.displayedMessageLength + 1);
    const action1 = {
        type: CHANGE_MESSAGE,
        payload: value
    };
    const state0 = {
        fields: {}
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.true(state1.fields.message.get().length === pushConfig.displayedMessageLength);
});
