import test from 'ava';
import sinon from 'sinon';
import {
    uniqueId,
    reduce
} from 'lodash/fp';

import {
    SET_MODAL_SHOW,
    RESET,
    SET_CURRENT_TAB
} from 'actions/ui/create-campaign';
import {
    initialState,
    reducer,
    __RewireAPI__
} from '..';


const stub$reducerCampaign = sinon.stub();
const stub$reducerSegment = sinon.stub();
const stub$reducerMedia = sinon.stub();
const stub$reducerPush = sinon.stub();
const stub$reducerSummary = sinon.stub();
const stub$reducerOfferInfo = sinon.stub();

test.before(() => {
    __RewireAPI__.__set__({
        reducerCampaign: stub$reducerCampaign,
        reducerSegment: stub$reducerSegment,
        reducerMedia: stub$reducerMedia,
        reducerPush: stub$reducerPush,
        reducerSummary: stub$reducerSummary,
        reducerOfferInfo: stub$reducerOfferInfo
    });
});

test.beforeEach(() => {
    stub$reducerCampaign.reset();
    stub$reducerCampaign.resetBehavior();
    stub$reducerSegment.reset();
    stub$reducerSegment.resetBehavior();
    stub$reducerMedia.reset();
    stub$reducerMedia.resetBehavior();
    stub$reducerPush.reset();
    stub$reducerPush.resetBehavior();
    stub$reducerSummary.reset();
    stub$reducerSummary.resetBehavior();
    stub$reducerOfferInfo.reset();
    stub$reducerOfferInfo.resetBehavior();
});

test('not changed branches', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;
    const [ campaign, segment, media, push, summary ] = state0.tabs;

    stub$reducerCampaign
        .withArgs(campaign, action1)
        .onFirstCall().returns(campaign);

    stub$reducerSegment
        .withArgs(segment, action1)
        .onFirstCall().returns(segment);

    stub$reducerMedia
        .withArgs(media, action1)
        .onFirstCall().returns(media);

    stub$reducerPush
        .withArgs(push, action1)
        .onFirstCall().returns(push);

    stub$reducerSummary
        .withArgs(summary, action1)
        .onFirstCall().returns(summary);

    stub$reducerOfferInfo
        .withArgs(state0.offerInfo, action1)
        .onFirstCall().returns(state0.offerInfo);

    const state1 = reduce(reducer, state0, [ action1 ]);

    t.is(state1, state0);
});

test('changed branches', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const campaign = uniqueId('campaign');
    const segment = uniqueId('segment');
    const media = uniqueId('media');
    const push = uniqueId('push');
    const summary = uniqueId('summary');
    const state0 = {
        current: uniqueId('tab'),
        tabs: [ campaign, segment, media, push, summary ]
    };

    const nextCampaign = uniqueId('campaign');
    stub$reducerCampaign
        .withArgs(campaign, action1)
        .onFirstCall().returns(nextCampaign);

    const nextSegment = uniqueId('segment');
    stub$reducerSegment
        .withArgs(segment, action1)
        .onFirstCall().returns(nextSegment);

    const nextMedia = uniqueId('media');
    stub$reducerMedia
        .withArgs(media, action1)
        .onFirstCall().returns(nextMedia);

    const nextPush = uniqueId('media');
    stub$reducerPush
        .withArgs(push, action1)
        .onFirstCall().returns(nextPush);

    const nextSummary = uniqueId('summary');
    stub$reducerSummary
        .withArgs(summary, action1)
        .onFirstCall().returns(nextSummary);

    const nextOfferInfo = uniqueId('offerInfo');
    stub$reducerOfferInfo
        .withArgs(state0.offerInfo, action1)
        .onFirstCall().returns(nextOfferInfo);

    const state1 = reduce(reducer, state0, [ action1 ]);

    t.not(state1, state0);
    t.deepEqual(state1, {
        current: state0.current,
        offerInfo: nextOfferInfo,
        tabs: [ nextCampaign, nextSegment, nextMedia, nextPush, nextSummary ]
    });
});

test('SET_CURRENT_TAB', t => {
    const action1 = {
        type: SET_CURRENT_TAB,
        payload: uniqueId('tab')
    };
    const state0 = {
        current: uniqueId('tab'),
        tabs: uniqueId('tabs')
    };
    const state1 = reduce(reducer, state0, [ action1 ]);

    t.not(state1, state0);
    t.deepEqual(state1, {
        current: action1.payload,
        tabs: state0.tabs
    });
});

test('SET_MODAL_SHOW true', t => {
    const action1 = {
        type: SET_MODAL_SHOW,
        payload: 1
    };
    const state0 = {
        modalShow: null
    };
    const state1 = reduce(reducer, state0, [ action1 ]);

    t.not(state1, state0);
    t.deepEqual(state1, {
        modalShow: true
    });
});

test('SET_MODAL_SHOW false', t => {
    const action1 = {
        type: SET_MODAL_SHOW,
        payload: 0
    };
    const state0 = {
        modalShow: null
    };
    const state1 = reduce(reducer, state0, [ action1 ]);

    t.not(state1, state0);
    t.deepEqual(state1, {
        modalShow: false
    });
});

test('RESET', t => {
    const action1 = {
        type: RESET
    };
    const state0 = uniqueId('state');
    const state1 = reduce(reducer, state0, [ action1 ]);

    t.not(state1, state0);
    t.is(state1, initialState);
});
