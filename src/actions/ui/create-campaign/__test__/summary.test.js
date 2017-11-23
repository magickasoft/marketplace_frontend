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
    STATE_STARTED as CAMPAIGN_STATE_STARTED
} from 'models/campaign';
import {
    update
} from 'actions/data';
import {
    launchCampaignStart,
    launchCampaignSuccess,
    launchCampaignFailure,
    launchCampaign,
    __RewireAPI__
} from '../summary';


const stub$denormalize = sinon.stub();
const stub$launchCampaignRequest = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        denormalize: stub$denormalize,
        launchCampaignRequest: stub$launchCampaignRequest
    });
});

test.beforeEach(() => {
    stub$denormalize.reset();
    stub$denormalize.resetBehavior();
    stub$launchCampaignRequest.reset();
    stub$launchCampaignRequest.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('launchCampaign() ui is busy', t => {
    t.plan(1);

    const summary = {
        busy: true
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, null, null, summary ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(launchCampaign())
        .then(() => {
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('launchCampaign() campaign.bunch is Nothing', t => {
    t.plan(1);

    const campaign = {
        bunch: Nothing()
    };
    const summary = {
        busy: false
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ campaign, null, null, null, summary ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(launchCampaign())
        .then(() => {
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('launchCampaign() campaignEntity does not exist', t => {
    t.plan(1);

    const campaign = {
        bunch: Just(
            makeBunch(uniqueId('namespace'), uniqueId('id'))
        )
    };
    const summary = {
        busy: false
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ campaign, null, null, null, summary ]
            }
        },
        data: uniqueId('data')
    };
    stub$getState
        .onFirstCall().returns(state);

    const stub$denormalizeCurried = sinon.stub();
    stub$denormalizeCurried
        .withArgs(campaign.bunch.get())
        .onFirstCall().returns(Nothing());

    stub$denormalize
        .withArgs(Nothing(), state.data)
        .onFirstCall().returns(stub$denormalizeCurried);

    return store.dispatch(launchCampaign())
        .then(() => {
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('launchCampaign() success', t => {
    t.plan(1);

    const campaignId = uniqueId('id');
    const campaignEntity = {
        bunch: makeBunch(uniqueId('namespace'), campaignId),
        state: uniqueId('state')
    };
    const campaign = {
        bunch: Just(campaignEntity.bunch)
    };
    const summary = {
        busy: false
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ campaign, null, null, null, summary ]
            }
        },
        data: uniqueId('data')
    };
    stub$getState
        .onFirstCall().returns(state);

    const stub$denormalizeCurried = sinon.stub();
    stub$denormalizeCurried
        .withArgs(campaignEntity.bunch)
        .onFirstCall().returns(Just(campaignEntity));

    stub$denormalize
        .withArgs(Nothing(), state.data)
        .onFirstCall().returns(stub$denormalizeCurried);

    stub$launchCampaignRequest
        .withArgs(campaignId)
        .onFirstCall().returns(Promise.resolve());

    return store.dispatch(launchCampaign())
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    batchActions([
                        launchCampaignStart(),
                        update({
                            state: CAMPAIGN_STATE_STARTED
                        }, campaignEntity.bunch)
                    ]),
                    launchCampaignSuccess()
                ]
            );
        });
});

test.serial('launchCampaign() failure', t => {
    t.plan(1);

    const campaignId = uniqueId('id');
    const campaignEntity = {
        bunch: makeBunch(uniqueId('namespace'), campaignId),
        state: uniqueId('state')
    };
    const campaign = {
        bunch: Just(campaignEntity.bunch)
    };
    const summary = {
        busy: false
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ campaign, null, null, null, summary ]
            }
        },
        data: uniqueId('data')
    };
    stub$getState
        .onFirstCall().returns(state);

    const stub$denormalizeCurried = sinon.stub();
    stub$denormalizeCurried
        .withArgs(campaignEntity.bunch)
        .onFirstCall().returns(Just(campaignEntity));

    stub$denormalize
        .withArgs(Nothing(), state.data)
        .onFirstCall().returns(stub$denormalizeCurried);

    const errors = uniqueId('errors');
    stub$launchCampaignRequest
        .withArgs(campaignId)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(launchCampaign())
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    batchActions([
                        launchCampaignStart(),
                        update({
                            state: CAMPAIGN_STATE_STARTED
                        }, campaignEntity.bunch)
                    ]),
                    batchActions([
                        launchCampaignFailure(errors),
                        update({
                            state: campaignEntity.state
                        }, campaignEntity.bunch)
                    ])
                ]
            );
        });
});
