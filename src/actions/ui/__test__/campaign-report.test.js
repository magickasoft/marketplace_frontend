import test from 'ava';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import {
    uniqueId,
    random
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';
import {
    batchActions
} from 'redux-batched-actions';

import {
    getMiddlewares
} from 'store';
import {
    makeBunch
} from 'utils/bunch';
import {
    merge
} from 'actions/data';
import {
    receiveCampaignSuccess,
    receiveCampaignFailure,
    receiveCampaignStart,
    receiveCampaign,
    __RewireAPI__
} from '../campaign-report';


const stub$denormalize = sinon.stub();
const stub$receiveCampaignRequest = sinon.stub();
const stub$receiveOfferRequest = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        denormalize: stub$denormalize,
        receiveCampaignRequest: stub$receiveCampaignRequest,
        receiveOfferRequest: stub$receiveOfferRequest
    });
});

test.beforeEach(() => {
    stub$denormalize.reset();
    stub$denormalize.resetBehavior();
    stub$receiveCampaignRequest.reset();
    stub$receiveCampaignRequest.resetBehavior();
    stub$receiveOfferRequest.reset();
    stub$receiveOfferRequest.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('campaign ui is busy', t => {
    t.plan(2);

    const current = random(1, 100);
    const state = {
        ui: {
            campaignReport: {
                campaign: {
                    busy: true
                }
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(receiveCampaign(current))
        .then(() => {
            t.false(stub$receiveCampaignRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('campaign without offerInfo success', t => {
    t.plan(1);

    const campaignId = uniqueId('id');
    const bunch = makeBunch(uniqueId('namespace'), campaignId);
    const state = {
        ui: {
            campaignReport: {
                campaign: {
                    busy: false
                }
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const response = {
        entities: uniqueId('entities')
    };
    stub$receiveCampaignRequest
        .withArgs(campaignId)
        .onFirstCall().returns(Promise.resolve(response));

    stub$denormalize
        .withArgs(
            Just({
                offerInfo: Nothing()
            }),
            response.entities,
            bunch
        ).onFirstCall().returns(Nothing());

    return store.dispatch(receiveCampaign(bunch))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receiveCampaignStart(bunch),
                    batchActions([
                        receiveCampaignSuccess(),
                        merge(response.entities)
                    ])
                ]
            );
        });
});

test.serial('campaign without offerInfo failure', t => {
    t.plan(1);

    const campaignId = uniqueId('id');
    const bunch = makeBunch(uniqueId('namespace'), campaignId);
    const state = {
        ui: {
            campaignReport: {
                campaign: {
                    busy: false
                }
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const errors = uniqueId('errors');
    stub$receiveCampaignRequest
        .withArgs(campaignId)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(receiveCampaign(bunch))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receiveCampaignStart(bunch),
                    receiveCampaignFailure(errors)
                ]
            );
        });
});

test.serial('campaign with offerInfo success', t => {
    t.plan(1);

    const campaignId = uniqueId('id');
    const bunch = makeBunch(uniqueId('namespace'), campaignId);
    const state = {
        ui: {
            campaignReport: {
                campaign: {
                    busy: false
                }
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const campaignResponse = {
        entities: uniqueId('entities')
    };
    stub$receiveCampaignRequest
        .withArgs(campaignId)
        .onFirstCall().returns(Promise.resolve(campaignResponse));

    const offerId = uniqueId('offerId');
    const campaign = {
        offerInfo: Just({
            offer: Just(makeBunch(uniqueId('namespace'), offerId))
        })
    };
    stub$denormalize
        .withArgs(
            Just({
                offerInfo: Nothing()
            }),
            campaignResponse.entities,
            bunch
        ).onFirstCall().returns(Just(campaign));

    const offerResponse = {
        entities: uniqueId('entities')
    };
    stub$receiveOfferRequest
        .withArgs(offerId)
        .onFirstCall().returns(Promise.resolve(offerResponse));

    return store.dispatch(receiveCampaign(bunch))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receiveCampaignStart(bunch),
                    batchActions([
                        receiveCampaignSuccess(campaignResponse.result),
                        merge(campaignResponse.entities)
                    ]),
                    merge(offerResponse.entities)
                ]
            );
        });
});

test.serial('campaign with offerInfo failure', t => {
    t.plan(1);

    const campaignId = uniqueId('id');
    const bunch = makeBunch(uniqueId('namespace'), campaignId);
    const state = {
        ui: {
            campaignReport: {
                campaign: {
                    busy: false
                }
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const campaignResponse = {
        entities: uniqueId('entities')
    };
    stub$receiveCampaignRequest
        .withArgs(campaignId)
        .onFirstCall().returns(Promise.resolve(campaignResponse));

    const offerId = uniqueId('offerId');
    const campaign = {
        offerInfo: Just({
            offer: Just(makeBunch(uniqueId('namespace'), offerId))
        })
    };
    stub$denormalize
        .withArgs(
            Just({
                offerInfo: Nothing()
            }),
            campaignResponse.entities,
            bunch
        ).onFirstCall().returns(Just(campaign));

    const offerErrors = uniqueId('errors');
    stub$receiveOfferRequest
        .withArgs(offerId)
        .onFirstCall().returns(Promise.reject(offerErrors));

    return store.dispatch(receiveCampaign(bunch))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    receiveCampaignStart(bunch),
                    batchActions([
                        receiveCampaignSuccess(campaignResponse.result),
                        merge(campaignResponse.entities)
                    ]),
                    receiveCampaignFailure(offerErrors)
                ]
            );
        });
});
