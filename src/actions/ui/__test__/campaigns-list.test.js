import test from 'ava';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import {
    batchActions
} from 'redux-batched-actions';
import {
    uniqueId,
    random
} from 'lodash/fp';

import {
    getMiddlewares
} from 'store';
import {
    merge
} from 'actions/data';
import {
    receivePageStart,
    receivePageSuccess,
    receivePageFailure,
    receivePage,
    __RewireAPI__
} from '../campaigns-list';


const stub$receiveCampaignsPageRequest = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        receiveCampaignsPageRequest: stub$receiveCampaignsPageRequest
    });
});

test.beforeEach(() => {
    stub$receiveCampaignsPageRequest.reset();
    stub$receiveCampaignsPageRequest.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('ui is busy', t => {
    t.plan(2);

    const current = random(1, 100);
    const state = {
        ui: {
            campaignsList: {
                busy: true
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(receivePage(current))
        .then(() => {
            t.false(stub$receiveCampaignsPageRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('success', t => {
    t.plan(1);

    const current = random(1, 100);
    const state = {
        ui: {
            campaignsList: {
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const response = {
        result: uniqueId('result'),
        entities: uniqueId('entities')
    };
    stub$receiveCampaignsPageRequest
        .onFirstCall().returns(Promise.resolve(response));

    return store.dispatch(receivePage(current))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receivePageStart(current),
                    batchActions([
                        receivePageSuccess(response.result),
                        merge(response.entities)
                    ])
                ]
            );
        });
});

test.serial('failure', t => {
    t.plan(1);

    const current = random(1, 100);
    const state = {
        ui: {
            campaignsList: {
                busy: false
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const errors = uniqueId('errors');
    stub$receiveCampaignsPageRequest
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(receivePage(current))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receivePageStart(current),
                    receivePageFailure(errors)
                ]
            );
        });
});
