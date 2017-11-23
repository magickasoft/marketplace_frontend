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
    Nothing,
    Just
} from 'data.maybe';

import {
    getMiddlewares
} from 'store';
import {
    makeBunch
} from 'utils/bunch';
import {
    update,
    merge
} from 'actions/data';
import {
    createCampaignStart,
    createCampaignSuccess,
    createCampaignFailure,
    updateCampaignStart,
    updateCampaignSuccess,
    updateCampaignFailure,
    createCampaign,
    updateCampaign,
    createOrUpdateCampaign,
    __RewireAPI__
} from '../campaign';


const stub$denormalize = sinon.stub();
const stub$createCampaignRequest = sinon.stub();
const stub$updateCampaignRequest = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        denormalize: stub$denormalize,
        createCampaignRequest: stub$createCampaignRequest,
        updateCampaignRequest: stub$updateCampaignRequest
    });
});

test.beforeEach(() => {
    stub$denormalize.reset();
    stub$denormalize.resetBehavior();
    stub$createCampaignRequest.reset();
    stub$createCampaignRequest.resetBehavior();
    stub$updateCampaignRequest.reset();
    stub$updateCampaignRequest.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('createCampaign() success', t => {
    t.plan(1);

    const fields = uniqueId('fields');
    const response = {
        result: uniqueId('result'),
        entities: uniqueId('entities')
    };
    stub$createCampaignRequest
        .withArgs(fields)
        .onFirstCall().returns(Promise.resolve(response));

    return store.dispatch(createCampaign(fields))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    createCampaignStart(),
                    batchActions([
                        createCampaignSuccess(response.result),
                        merge(response.entities)
                    ])
                ]
            );
        });
});

test.serial('createCampaign() failure', t => {
    t.plan(1);

    const fields = uniqueId('fields');
    const errors = uniqueId('errors');
    stub$createCampaignRequest
        .withArgs(fields)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(createCampaign(fields))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    createCampaignStart(),
                    createCampaignFailure(errors)
                ]
            );
        });
});

test.serial('updateCampaign() campaign does not exist', t => {
    t.plan(2);

    const diff = uniqueId('diff');
    const bunch = makeBunch(uniqueId('namespace'), uniqueId('id'));
    const state = {
        data: uniqueId('data')
    };
    stub$getState
        .onFirstCall().returns(state);

    stub$denormalize
        .withArgs(Nothing(), state.data, bunch)
        .onFirstCall().returns(Nothing());

    return store.dispatch(updateCampaign(diff, bunch))
        .then(() => {
            t.false(stub$updateCampaignRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('updateCampaign() success', t => {
    t.plan(1);

    const diff = uniqueId('diff');
    const id = uniqueId('id');
    const bunch = makeBunch(uniqueId('namespace'), id);
    const state = {
        data: uniqueId('data')
    };
    stub$getState
        .onFirstCall().returns(state);

    const campaign = uniqueId('campaign');
    stub$denormalize
        .withArgs(Nothing(), state.data, bunch)
        .onFirstCall().returns(Just(campaign));

    stub$updateCampaignRequest
        .withArgs(diff, id)
        .onFirstCall().returns(Promise.resolve());

    return store.dispatch(updateCampaign(diff, bunch))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    batchActions([
                        updateCampaignStart(),
                        update(diff, bunch)
                    ]),
                    updateCampaignSuccess()
                ]
            );
        });
});

test.serial('updateCampaign() failure', t => {
    t.plan(1);

    const diff = {
        foo: uniqueId('foo')
    };
    const id = uniqueId('id');
    const bunch = makeBunch(uniqueId('namespace'), id);
    const state = {
        data: uniqueId('data')
    };
    stub$getState
        .onFirstCall().returns(state);

    const campaign = {
        bunch,
        foo: uniqueId('foo'),
        bar: uniqueId('bar')
    };
    stub$denormalize
        .withArgs(Nothing(), state.data, bunch)
        .onFirstCall().returns(Just(campaign));

    const errors = uniqueId('errors');
    stub$updateCampaignRequest
        .withArgs(diff, id)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(updateCampaign(diff, bunch))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    batchActions([
                        updateCampaignStart(),
                        update(diff, bunch)
                    ]),
                    batchActions([
                        updateCampaignFailure(errors),
                        update({
                            foo: campaign.foo
                        }, bunch)
                    ])
                ]
            );
        });
});

test.serial('createOrUpdateCampaign() ui is busy', t => {
    t.plan(1);

    const state = {
        ui: {
            createCampaign: {
                tabs: [
                    {
                        busy: true
                    }
                ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(createOrUpdateCampaign())
        .then(() => {
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('createOrUpdateCampaign() campaign updating', t => {
    t.plan(1);

    const stub$updateCampaign = sinon.stub();
    __RewireAPI__.__set__({
        updateCampaign: stub$updateCampaign
    });

    const campaign = {
        bunch: Just(uniqueId('bunch')),
        fields: uniqueId('fields'),
        busy: false
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [
                    campaign
                ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);


    const stub$updateCampaignCurried = sinon.stub();
    const updateCampaignAction = () => Promise.resolve();
    stub$updateCampaignCurried
        .withArgs(campaign.bunch.get())
        .onFirstCall().returns(updateCampaignAction);
    stub$updateCampaign
        .withArgs(campaign.fields)
        .onFirstCall().returns(stub$updateCampaignCurried);

    return store.dispatch(createOrUpdateCampaign())
        .then(() => {
            t.deepEqual(store.getActions(), []);

            __RewireAPI__.__reset__('createCampaign');
            __RewireAPI__.__reset__('updateCampaign');
        });
});

test.serial('createOrUpdateCampaign() campaign creating', t => {
    t.plan(1);

    const stub$createCampaign = sinon.stub();
    __RewireAPI__.__set__({
        createCampaign: stub$createCampaign
    });

    const campaign = {
        bunch: Nothing(),
        fields: uniqueId('fields'),
        busy: false
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [
                    campaign
                ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const createCampaignAction = () => Promise.resolve();
    stub$createCampaign
        .withArgs(campaign.fields)
        .onFirstCall().returns(createCampaignAction);

    return store.dispatch(createOrUpdateCampaign())
        .then(() => {
            t.deepEqual(store.getActions(), []);

            __RewireAPI__.__reset__('createCampaign');
            __RewireAPI__.__reset__('updateCampaign');
        });
});
