import test from 'ava';
import sinon from 'sinon';
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
    SELECT,
    RECEIVE_MEDIA_PAGE_START,
    RECEIVE_MEDIA_PAGE_SUCCESS,
    RECEIVE_MEDIA_PAGE_FAILURE
} from 'actions/ui/create-campaign/media';
import {
    initialState,
    reducer,
    __RewireAPI__
} from '..';


const stub$reducerModal = sinon.stub();

test.before(() => {
    __RewireAPI__.__set__({
        reducerModal: stub$reducerModal
    });
});

test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const action2 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    stub$reducerModal
        .withArgs(state0.modal, action1)
        .onFirstCall().returns(state0.modal);

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);

    const nextModal = uniqueId('modal');
    stub$reducerModal
        .withArgs(state1.modal, action2)
        .onFirstCall().returns(nextModal);

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        selected: state1.selected,
        current: state1.current,
        total: state1.total,
        results: state1.results,
        busy: state1.busy,
        errors: state1.errors,
        modal: nextModal
    });
});

test('SELECT', t => {
    const action1 = {
        type: SELECT,
        payload: uniqueId('bunch')
    };
    const state0 = {
        selected: Nothing(),
        current: 1,
        total: Nothing(),
        results: Nothing(),
        busy: false,
        errors: Nothing(),
        modal: uniqueId('modal')
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        selected: Just(action1.payload),
        current: state0.current,
        total: state0.total,
        results: state0.results,
        busy: state0.busy,
        errors: state0.errors,
        modal: state0.modal
    });
});

test('RECEIVE_MEDIA_PAGE_*', t => {
    const action1 = {
        type: RECEIVE_MEDIA_PAGE_START,
        payload: random(1, 100)
    };
    const action2 = {
        type: RECEIVE_MEDIA_PAGE_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: RECEIVE_MEDIA_PAGE_SUCCESS,
        payload: {
            total: random(1, 100),
            results: uniqueId('result')
        }
    };
    const state0 = {
        selected: Nothing(),
        current: random(1, 100),
        total: Just(random(1, 100)),
        results: Just(uniqueId('results')),
        busy: false,
        errors: Just(uniqueId('errors')),
        modal: uniqueId('modal')
    };

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        selected: state0.selected,
        current: action1.payload,
        total: state0.total,
        results: Nothing(),
        busy: true,
        errors: Nothing(),
        modal: state0.modal
    });

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, {
        selected: state1.selected,
        current: state1.current,
        total: state1.total,
        results: state1.results,
        busy: false,
        errors: Just(action2.payload),
        modal: state1.modal
    });

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state3, {
        selected: state2.selected,
        current: action1.payload,
        total: state2.total,
        results: Nothing(),
        busy: true,
        errors: Nothing(),
        modal: state2.modal
    });

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.deepEqual(state4, {
        selected: state3.selected,
        current: state3.current,
        total: Just(action3.payload.total),
        results: Just(action3.payload.results),
        busy: false,
        errors: state3.errors,
        modal: state3.modal
    });
});
