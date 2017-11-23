import test from 'ava';
import {
    uniqueId
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';


import {
    NAMESPACE as NAMESPACE_CAMPAIGNS,
    merge as mergeCampaign
} from 'models/campaign';
import {
    NAMESPACE as NAMESPACE_OFFERS,
    merge as mergeOffer
} from 'models/offer';
import {
    NAMESPACE as NAMESPACE_OFFERS_INFO,
    merge as mergeOfferInfo
} from 'models/offer-info';
import {
    NAMESPACE as NAMESPACE_SEGMENTS,
    merge as mergeSegment
} from 'models/segment';
import {
    NAMESPACE as NAMESPACE_USERS,
    merge as mergeUser
} from 'models/user';
import {
    NAMESPACE as NAMESPACE_STORIES,
    merge as mergeStory
} from 'models/story';

import {
    getEntityMerger
} from '../entity-merger';


test('existing mergers', t => {
    t.deepEqual(
        getEntityMerger(NAMESPACE_CAMPAIGNS),
        Just(mergeCampaign)
    );
    t.deepEqual(
        getEntityMerger(NAMESPACE_OFFERS),
        Just(mergeOffer)
    );
    t.deepEqual(
        getEntityMerger(NAMESPACE_OFFERS_INFO),
        Just(mergeOfferInfo)
    );
    t.deepEqual(
        getEntityMerger(NAMESPACE_SEGMENTS),
        Just(mergeSegment)
    );
    t.deepEqual(
        getEntityMerger(NAMESPACE_USERS),
        Just(mergeUser)
    );
    t.deepEqual(
        getEntityMerger(NAMESPACE_STORIES),
        Just(mergeStory)
    );
});

test('not existing merger', t => {
    t.deepEqual(
        getEntityMerger(uniqueId('namespace')),
        Nothing()
    );
});
