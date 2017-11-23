import test from 'ava';
import sinon from 'sinon';
import {
    uniqueId,
    reduce
} from 'lodash/fp';

import {
    MERGE,
    UPDATE
} from 'actions/data';
import {
    initialState,
    reducer,
    __RewireAPI__
} from '..';


const stub$dataMerge = sinon.stub();
const stub$entityUpdate = sinon.stub();

test.before(() => {
    __RewireAPI__.__set__({
        dataMerge: stub$dataMerge,
        entityUpdate: stub$entityUpdate
    });
});

test.beforeEach(() => {
    stub$dataMerge.reset();
    stub$dataMerge.resetBehavior();
    stub$entityUpdate.reset();
    stub$entityUpdate.resetBehavior();
});

test('not handled action', t => {
    const action1 = {
        type: uniqueId('type')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('UPDATE', t => {
    const action1 = {
        type: UPDATE,
        payload: {
            bunch: uniqueId('bunch'),
            diff: uniqueId('diff')
        }
    };
    const action2 = {
        type: UPDATE,
        payload: {
            bunch: uniqueId('bunch'),
            diff: uniqueId('diff')
        }
    };
    const state0 = uniqueId('state0');

    const updated1 = uniqueId('updated');
    stub$entityUpdate
        .withArgs(state0, action1.payload.bunch, action1.payload.diff)
        .onFirstCall().returns(updated1);

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, updated1);

    const updated2 = uniqueId('updated');
    stub$entityUpdate
        .withArgs(state1, action2.payload.bunch, action2.payload.diff)
        .onFirstCall().returns(updated2);

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, updated2);
});

test('MERGE', t => {
    const action1 = {
        type: MERGE,
        payload: uniqueId('data')
    };
    const action2 = {
        type: MERGE,
        payload: uniqueId('data')
    };
    const state0 = uniqueId('state');

    const merged1 = uniqueId('merged');
    stub$dataMerge
        .withArgs(state0, action1.payload)
        .onFirstCall().returns(merged1);

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, merged1);

    const merged2 = uniqueId('merged');
    stub$dataMerge
        .withArgs(state1, action2.payload)
        .onFirstCall().returns(merged2);

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, merged2);
});
