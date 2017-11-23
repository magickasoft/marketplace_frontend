import {
    map,
    castArray
} from 'lodash/fp';
import {
    normalize,
    schema
} from 'normalizr';
import Maybe from 'data.maybe';

import config from 'config';
import {
    place as schemaPlace,
    campaign as schemaCampaign,
    channel as schemaChannel,
    country as schemaCountry,
    offer as schemaOffer,
    offerInfo as schemaOfferInfo
} from 'models';
import {
    decode as decodeCampaign,
    decodeErrors as decodeCampaignErrors,
    encode as encodeCampaign
} from 'models/campaign';
import {
    decode as decodeChannel,
    decodeErrors as decodeChannelErrors,
    encode as encodeChannel
} from 'models/channel';
import {
    decode as decodeCountry
} from 'models/country';
import {
    decode as decodeOffer,
    decodeErrors as decodeOfferErrors,
    encode as encodeOffer
} from 'models/offer';
import {
    decode as decodeOfferInfo,
    decodeErrors as decodeOfferInfoErrors,
    encode as encodeOfferInfo
} from 'models/offer-info';
import {
    decode as decodePlace
} from 'models/place';
import {
    processResponse,
    processErrors
} from 'services/common';


export const METHOD = 'campaign-manager';
export const MESSENGER_USERS_METHOD = 'messenger-users';

export function getPlacesList(inputValue) {

    const urlParts = [
        config.mapbox.url,
        'geocoding/',
        config.mapbox.version,
        'mapbox.places/',
        inputValue,
        `.json?access_token=${config.mapbox.key}&types=place`
    ];

    return fetch(urlParts.join(''), {
        method: 'GET'
    })
        .then(processResponse, processErrors)
        .then(response => normalize(
            map(decodePlace, response.features),
            new schema.Array(schemaPlace)
        ))
        .catch(errors => Promise.reject({
            common: Maybe.fromNullable(errors.non_field_errors)
        }));
}

export function createCampaign(model) {
    return fetch(`${config.url}${config.version}${METHOD}/campaign/`, {
        method: 'POST',
        headers: new Headers(config.headers),
        credentials: config.credentials,
        body: JSON.stringify(encodeCampaign(model))
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decodeCampaign(response), schemaCampaign))
        .catch(errors => Promise.reject(decodeCampaignErrors(errors)));
}

export function receiveCampaignsPage(page) {
    return fetch(`${config.url}${config.version}${METHOD}/campaign/?page=${page}`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(
            {
                total: response.count,
                results: map(decodeCampaign, response.results)
            },
            {
                results: new schema.Array(schemaCampaign)
            }
        ))
        .catch(errors => Promise.reject({
            common: Maybe.fromNullable(errors.non_field_errors)
        }));
}

export function updateCampaign(model, campaignId) {
    return fetch(`${config.url}${config.version}${METHOD}/campaign/${campaignId}`, {
        method: 'PUT',
        headers: new Headers(config.headers),
        credentials: config.credentials,
        body: JSON.stringify(encodeCampaign(model))
    })
        .then(processResponse, processErrors)
        .catch(errors => Promise.reject(decodeCampaignErrors(errors)));
}

export function launchCampaign(campaignId) {
    return fetch(`${config.url}${config.version}${METHOD}/campaign-launch/${campaignId}`, {
        method: 'POST',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .catch(errors => Promise.reject({
            common: Maybe.fromNullable(errors.detail).map(castArray)
        }));
}

export function createOffer(model) {
    return fetch(`${config.url}${config.version}${METHOD}/offer/`, {
        method: 'POST',
        body: JSON.stringify(encodeOffer(model)),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decodeOffer(response), schemaOffer))
        .catch(errors => Promise.reject(decodeOfferErrors(errors)));
}

export function receiveOffer(offerId) {
    return fetch(`${config.url}${config.version}${METHOD}/offer/${offerId}/`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decodeOffer(response), schemaOffer))
        .catch(errors => Promise.reject({
            common: Maybe.fromNullable(errors.non_field_errors)
        }));
}

export function receiveOffersPage(page) {
    return fetch(`${config.url}${config.version}${METHOD}/offer/?page=${page}`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(
            {
                total: response.count,
                results: map(decodeOffer, response.results)
            },
            {
                results: new schema.Array(schemaOffer)
            }
        ))
        .catch(errors => Promise.reject({
            common: Maybe.fromNullable(errors.non_field_errors)
        }));
}

export function updateOffer(model, id) {
    return fetch(`${config.url}${config.version}${METHOD}/offer/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(encodeOffer(model)),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decodeOffer(response), schemaOffer))
        .catch(errors => Promise.reject(decodeOfferErrors(errors)));
}

export function createOfferInfo(params) {
    return fetch(`${config.url}${config.version}${METHOD}/offer-info/`, {
        method: 'POST',
        body: JSON.stringify(encodeOfferInfo({
            push: {},
            segment: {
                locations: []
            }
        }, params)),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decodeOfferInfo(response), schemaOfferInfo))
        .catch(errors => Promise.reject(decodeOfferInfoErrors(errors)));
}

export function updateOfferInfo(params, offerInfoId) {
    return fetch(`${config.url}${config.version}${METHOD}/offer-info/${offerInfoId}`, {
        method: 'PUT',
        body: JSON.stringify(encodeOfferInfo({
            push: {
                title: '',
                message: '',
                sendAt: null
            },
            segment: {
                locations: []
            }
        }, params)),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decodeOfferInfo(response), schemaOfferInfo))
        .catch(errors => Promise.reject(decodeOfferInfoErrors(errors)));
}

export function receiveCampaign(campaignId) {
    return fetch(`${config.url}${config.version}${METHOD}/campaign/${campaignId}`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => normalize(decodeCampaign(response), schemaCampaign))
        .catch(errors => Promise.reject({
            common: Maybe.fromNullable(errors.detail).map(castArray)
        }));
}

export function receiveCountries() {
    return fetch(`${config.url}${config.version}${METHOD}/country/`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .then(response => normalize(
        map(decodeCountry, response),
        new schema.Array(schemaCountry)
    ))
    .catch(errors => Promise.reject({
        common: Maybe.fromNullable(errors.non_field_errors)
    }));
}

export function createChannel(model) {
    return fetch(`${config.url}${config.version}${METHOD}/channel/`, {
        method: 'POST',
        body: JSON.stringify(encodeChannel({
            header: {
                background: [],
                backgroundExtra: []
            }
        }, model)),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .then(response => normalize(decodeChannel(response), schemaChannel))
    .catch(errors => Promise.reject(decodeChannelErrors(errors)));
}

export function receiveChannel(id) {
    return fetch(`${config.url}${config.version}${METHOD}/channel/${id}/`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .then(response => normalize(decodeChannel(response), schemaChannel))
    .catch(errors => Promise.reject(decodeChannelErrors(errors)));
}

export function receiveChannelsPage(mOrdering, page) {
    const ordering = mOrdering.map(field => `&ordering=${field}`).getOrElse('');

    return fetch(`${config.url}${config.version}${METHOD}/channel/?page=${page}${ordering}`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .then(response => normalize(
        {
            total: response.count,
            results: map(decodeChannel, response.results)
        },
        {
            results: new schema.Array(schemaChannel)
        }
    ))
    .catch(errors => Promise.reject({
        common: Maybe.fromNullable(errors.non_field_errors)
    }));
}

export function updateChannel(model, id) {
    return fetch(`${config.url}${config.version}${METHOD}/channel/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(encodeChannel({
            header: {
                background: [ null, null ],
                backgroundExtra: [ null, null ]
            }
        }, model)),
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .catch(errors => Promise.reject(decodeChannelErrors(errors)));
}

export function deleteChannel(id) {
    return fetch(`${config.url}${config.version}${METHOD}/channel/${id}/`, {
        method: 'DELETE',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
    .then(processResponse, processErrors)
    .catch(errors => Promise.reject({
        common: Maybe.fromNullable(errors.detail).map(castArray)
    }));
}

export function getUsersCount(selectedLocations) {

    const params = JSON.stringify(map(location => {
        const [ lng, lat ] = location.place.point;
        return [lng, lat, location.radius];
    }, selectedLocations));

    return fetch(`${config.url}${config.version}${MESSENGER_USERS_METHOD}/count-users-area/?locations=${params}`, {
        method: 'GET',
        headers: new Headers(config.headers),
        credentials: config.credentials
    })
        .then(processResponse, processErrors)
        .then(response => response.count)
        .catch(errors => Promise.reject({
            common: Maybe.fromNullable(errors.non_field_errors)
        }));
}
