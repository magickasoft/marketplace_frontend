import {
    Just,
    Nothing
} from 'data.maybe';

import {
    NAMESPACE as NAMESPACE_CAMPAIGNS,
    merge as mergeCampaign
} from 'models/campaign';
import {
    NAMESPACE as NAMESPACE_CHANNELS,
    merge as mergeChannel
} from 'models/channel';
import {
    NAMESPACE as NAMESPACE_COUNTRIES,
    merge as mergeCountry
} from 'models/country';
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
    NAMESPACE as NAMESPACE_PLACES,
    merge as mergePlace
} from 'models/place';
import {
    NAMESPACE as NAMESPACE_LOCATIONS,
    merge as mergeLocation
} from 'models/location';


/**
 * May get merge function for entity by namespace.
 * @type BunchNamespace -> Maybe (Object -> Entity -> Entity)
 */
export function getEntityMerger(namespace) {
    switch (namespace) {
        case NAMESPACE_CAMPAIGNS: {
            return Just(mergeCampaign);
        }

        case NAMESPACE_CHANNELS: {
            return Just(mergeChannel);
        }

        case NAMESPACE_COUNTRIES: {
            return Just(mergeCountry);
        }

        case NAMESPACE_OFFERS: {
            return Just(mergeOffer);
        }

        case NAMESPACE_OFFERS_INFO: {
            return Just(mergeOfferInfo);
        }

        case NAMESPACE_SEGMENTS: {
            return Just(mergeSegment);
        }

        case NAMESPACE_USERS: {
            return Just(mergeUser);
        }

        case NAMESPACE_STORIES: {
            return Just(mergeStory);
        }

        case NAMESPACE_PLACES: {
            return Just(mergePlace);
        }

        case NAMESPACE_LOCATIONS: {
            return Just(mergeLocation);
        }

        default: {
            // Would be better to log something or raise an exception here, at least in development mode.
            // Actually, IMO, it would be better to use a dict rather than a switch statement with a default clause.
            // console.error(`getEntityMerger: unhandled namespace "${namespace}"`);
            return Nothing();
        }
    }
}
