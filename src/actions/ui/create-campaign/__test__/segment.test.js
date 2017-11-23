import test from 'ava';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import {
    batchActions
} from 'redux-batched-actions';
import {
    uniqueId
} from 'lodash/fp';
import {
    Nothing
} from 'data.maybe';

import {
    getMiddlewares
} from 'store';
import {
    merge
} from 'actions/data';
import {
    receivePlacesListStart,
    receivePlacesListSuccess,
    receivePlacesListFailure,
    receivePlacesList,
    __RewireAPI__
} from '../segment';


const stub$denormalize = sinon.stub();
const stub$getPlacesListRequest = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        denormalize: stub$denormalize,
        getPlacesListRequest: stub$getPlacesListRequest
    });
});

test.beforeEach(() => {
    stub$denormalize.reset();
    stub$denormalize.resetBehavior();
    stub$getPlacesListRequest.reset();
    stub$getPlacesListRequest.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('receivePlacesList() ui is busy', t => {
    t.plan(1);

    const query = 'test';

    const segment = {
        queryBusy: true
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, segment ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(receivePlacesList(query))
        .then(() => {
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('receivePlacesList() success', t => {
    t.plan(1);

    const query = 'test';

    const segment = {
        queryBusy: false,
        results: Nothing()
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, segment ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const response = {
        result: uniqueId('result'),
        entities: uniqueId('entities')
    };
    stub$getPlacesListRequest
        .withArgs(query)
        .onFirstCall().returns(Promise.resolve(response));

    return store.dispatch(receivePlacesList(query))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receivePlacesListStart(),
                    batchActions([
                        receivePlacesListSuccess(response.result),
                        merge(response.entities)
                    ])
                ]
            );
        });
});

test.serial('receivePlacesList() failure', t => {
    t.plan(1);

    const query = 'test';

    const segment = {
        queryBusy: false,
        results: Nothing()
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, segment ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const errors = uniqueId('errors');
    stub$getPlacesListRequest
        .withArgs(query)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(receivePlacesList(query))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receivePlacesListStart(),
                    receivePlacesListFailure(errors)
                ]
            );
        });
});
