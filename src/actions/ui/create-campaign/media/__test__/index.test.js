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
    receiveMediaPageStart,
    receiveMediaPageSuccess,
    receiveMediaPageFailure,
    receiveMediaPage,
    __RewireAPI__
} from '..';


const stub$denormalize = sinon.stub();
const stub$receiveOffersPageRequest = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        denormalize: stub$denormalize,
        receiveOffersPageRequest: stub$receiveOffersPageRequest
    });
});

test.beforeEach(() => {
    stub$denormalize.reset();
    stub$denormalize.resetBehavior();
    stub$receiveOffersPageRequest.reset();
    stub$receiveOffersPageRequest.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('receiveMediaPage() is busy', t => {
    t.plan(1);

    const page = random(1, 100);
    const media = {
        busy: true
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, media ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(receiveMediaPage(page))
        .then(() => {
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('receiveMediaPage() success', t => {
    t.plan(1);

    const page = random(1, 100);
    const media = {
        busy: false
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, media ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const response = {
        result: uniqueId('result'),
        entities: uniqueId('entities')
    };
    stub$receiveOffersPageRequest
        .withArgs(page)
        .onFirstCall().returns(Promise.resolve(response));

    return store.dispatch(receiveMediaPage(page))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receiveMediaPageStart(page),
                    batchActions([
                        receiveMediaPageSuccess(response.result),
                        merge(response.entities)
                    ])
                ]
            );
        });
});

test.serial('receiveMediaPage() failure', t => {
    t.plan(1);

    const page = random(1, 100);
    const media = {
        busy: false
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, media ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const errors = uniqueId('errors');
    stub$receiveOffersPageRequest
        .withArgs(page)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(receiveMediaPage(page))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receiveMediaPageStart(page),
                    receiveMediaPageFailure(errors)
                ]
            );
        });
});
