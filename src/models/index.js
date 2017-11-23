import {
    omit,
    constant
} from 'lodash/fp';
import {
    schema
} from 'normalizr';

import {
    Maybe
} from 'utils/schema';
import {
    NAMESPACE as NAMESPACE_CAMPAIGNS
} from 'models/campaign';
import {
    NAMESPACE as NAMESPACE_CHANNELS
} from 'models/channel';
import {
    NAMESPACE as NAMESPACE_COUNTRIES
} from 'models/country';
import {
    NAMESPACE as NAMESPACE_OFFERS
} from 'models/offer';
import {
    NAMESPACE as NAMESPACE_OFFERS_INFO
} from 'models/offer-info';
import {
    NAMESPACE as NAMESPACE_SEGMENTS
} from 'models/segment';
import {
    NAMESPACE as NAMESPACE_USERS
} from 'models/user';
import {
    NAMESPACE as NAMESPACE_STORIES
} from 'models/story';
import {
    NAMESPACE as NAMESPACE_PLACES
} from 'models/place';
import {
    NAMESPACE as NAMESPACE_LOCATIONS
} from 'models/location';

const processStrategy = omit([ 'schema' ]);

const campaign_ = new schema.Entity(NAMESPACE_CAMPAIGNS, {}, { processStrategy });
const channel_ = new schema.Entity(NAMESPACE_CHANNELS, {}, { processStrategy });
const country_ = new schema.Entity(NAMESPACE_COUNTRIES, {}, { processStrategy });
const offer_ = new schema.Entity(NAMESPACE_OFFERS, {}, { processStrategy });
const offerInfo_ = new schema.Entity(NAMESPACE_OFFERS_INFO, {}, { processStrategy });
const segment_ = new schema.Entity(NAMESPACE_SEGMENTS, {}, { processStrategy });
const user_ = new schema.Entity(NAMESPACE_USERS, {}, { processStrategy });
const story_ = new schema.Entity(NAMESPACE_STORIES, {}, { processStrategy });
const place_ = new schema.Entity(NAMESPACE_PLACES, {}, { processStrategy });
const location_ = new schema.Entity(NAMESPACE_LOCATIONS, {}, { processStrategy });

export const campaign = new schema.Union({
    [ NAMESPACE_CAMPAIGNS ]: campaign_
}, constant(NAMESPACE_CAMPAIGNS));

export const channel = new schema.Union({
    [ NAMESPACE_CHANNELS ]: channel_
}, constant(NAMESPACE_CHANNELS));

export const country = new schema.Union({
    [ NAMESPACE_COUNTRIES ]: country_
}, constant(NAMESPACE_COUNTRIES));

export const offer = new schema.Union({
    [ NAMESPACE_OFFERS ]: offer_
}, constant(NAMESPACE_OFFERS));

export const offerInfo = new schema.Union({
    [ NAMESPACE_OFFERS_INFO ]: offerInfo_
}, constant(NAMESPACE_OFFERS_INFO));

export const segment = new schema.Union({
    [ NAMESPACE_SEGMENTS ]: segment_
}, constant(NAMESPACE_SEGMENTS));

export const user = new schema.Union({
    [ NAMESPACE_USERS ]: user_
}, constant(NAMESPACE_USERS));

export const story = new schema.Union({
    [ NAMESPACE_STORIES ]: story_
}, constant(NAMESPACE_STORIES));

export const place = new schema.Union({
    [ NAMESPACE_PLACES ]: place_
}, constant(NAMESPACE_PLACES));

export const location = new schema.Union({
    [ NAMESPACE_LOCATIONS ]: location_
}, constant(NAMESPACE_LOCATIONS));

campaign_.define({
    offerInfo: new Maybe(offerInfo)
});

channel_.define({
    country
});

story_.define({
    channel
});

segment_.define({
    locations: new schema.Array(location)
});

offerInfo_.define({
    segment
});
