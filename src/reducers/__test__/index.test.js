import test from 'ava';
import sinon from 'sinon';
import {
    uniqueId,
    reduce
} from 'lodash/fp';

import {
    initialState,
    reducer,
    __RewireAPI__
} from '..';


const stub$reducerUI = sinon.stub();
const stub$reducerData = sinon.stub();
const stub$reducerSession = sinon.stub();
const stub$reducerRouting = sinon.stub();

test.before(() => {
    __RewireAPI__.__set__({
        reducerUI: stub$reducerUI,
        reducerData: stub$reducerData,
        reducerSession: stub$reducerSession,
        reducerRouting: stub$reducerRouting
    });
});

test.beforeEach(() => {
    stub$reducerUI.reset();
    stub$reducerUI.resetBehavior();
    stub$reducerData.reset();
    stub$reducerData.resetBehavior();
    stub$reducerSession.reset();
    stub$reducerSession.resetBehavior();
    stub$reducerRouting.reset();
    stub$reducerRouting.resetBehavior();
});

test('not changed branches', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    stub$reducerUI
        .withArgs(state0.ui, action1)
        .onFirstCall().returns(state0.ui);

    stub$reducerData
        .withArgs(state0.data, action1)
        .onFirstCall().returns(state0.data);

    stub$reducerSession
        .withArgs(state0.session, action1)
        .onFirstCall().returns(state0.session);

    stub$reducerRouting
        .withArgs(state0.routing, action1)
        .onFirstCall().returns(state0.routing);

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('changed branches', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = {
        ui: uniqueId('nextUI'),
        data: uniqueId('nextData'),
        session: uniqueId('nextSession'),
        routing: uniqueId('nextRouting')
    };

    const nextUI = uniqueId('ui');
    stub$reducerUI
        .withArgs(state0.ui, action1)
        .onFirstCall().returns(nextUI);

    const nextData = uniqueId('data');
    stub$reducerData
        .withArgs(state0.data, action1)
        .onFirstCall().returns(nextData);

    const nextSession = uniqueId('session');
    stub$reducerSession
        .withArgs(state0.session, action1)
        .onFirstCall().returns(nextSession);

    const nextRouting = uniqueId('routing');
    stub$reducerRouting
        .withArgs(state0.routing, action1)
        .onFirstCall().returns(nextRouting);

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, {
        ui: nextUI,
        data: nextData,
        session: nextSession,
        routing: nextRouting
    });
});
