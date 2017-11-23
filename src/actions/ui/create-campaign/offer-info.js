import {
    batchActions
} from 'redux-batched-actions';
import {
    constant,
    compose,
    curry
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    denormalize,
    filterMap
} from 'utils';
import {
    getBunchID
} from 'utils/bunch';
import {
    createOfferInfo as createOfferInfoRequest,
    updateOfferInfo as updateOfferInfoRequest
} from 'services/campaign-manager';
import {
    update,
    merge
} from 'actions/data';


export const PROCESSING_INFO_START = 'UI/CREATE_CAMPAIGN/PROCESSING_INFO_START';

export function processingOfferInfoStart() {
    return {
        type: PROCESSING_INFO_START
    };
}

export const PROCESSING_INFO_SUCCESS = 'UI/CREATE_CAMPAIGN/PROCESSING_INFO_SUCCESS';

export function processingOfferInfoSuccess() {
    return {
        type: PROCESSING_INFO_SUCCESS
    };
}

export const PROCESSING_INFO_FAILURE = 'UI/CREATE_CAMPAIGN/PROCESSING_INFO_FAILURE';

export function processingOfferInfoFailure(errors) {
    return {
        type: PROCESSING_INFO_FAILURE,
        payload: errors
    };
}

export const createOfferInfo = offerInfoParams => dispatch => {
    dispatch(
        processingOfferInfoStart(),
    );

    return createOfferInfoRequest(offerInfoParams)
        .then(({ result, entities }) => {
            dispatch(
                batchActions([
                    processingOfferInfoSuccess(),
                    merge(entities),
                    update({
                        offerInfo: Just(result)
                    }, offerInfoParams.campaign)
                ])
            );
        })
        .catch(errors => {
            dispatch(
                processingOfferInfoFailure(errors),
            );
        });
};

export const updateOfferInfo = curry((offerInfoParams, offerInfoEntity) => dispatch => {

    dispatch(
        processingOfferInfoStart()
    );

    return updateOfferInfoRequest(offerInfoParams, getBunchID(offerInfoEntity.bunch))
        .then(({ entities }) => {
            dispatch(
                batchActions([
                    processingOfferInfoSuccess(),
                    merge(entities)
                ])
            );
        })
        .catch(errors => {
            dispatch(
                batchActions([
                    processingOfferInfoFailure(errors)
                ])
            );
        });
});

export const createOrUpdateOfferInfo = () => (dispatch, getState) => {
    const { ui, data } = getState();
    const { offerInfo, tabs } = ui.createCampaign;
    const [ campaign, segment, offer, push ] = tabs;

    if (offerInfo.busy) {
        return Promise.resolve();
    }

    return campaign.bunch.chain(
        denormalize(Just({
            offerInfo: Just({
                segment: Nothing()
            })
        }), data)
    ).map(
        campaignEntity => {

            const locations = filterMap(
                location => denormalize(Nothing(), data, location.place).map(
                    place => ({
                        radius: location.radius,
                        placeId: getBunchID(place.bunch),
                        name: place.name,
                        point: place.point
                    })
                ),
                segment.selectedLocations
            );

            const OfferInfoParams = {
                campaign: campaignEntity.bunch,
                offer: offer.selected,
                segment: campaignEntity.offerInfo.cata({
                    Nothing: () => Just({ locations }),
                    Just: offerInfoEntity => offerInfoEntity.segment.map(
                        segmentEntity => ({
                            id: getBunchID(segmentEntity.bunch),
                            locations
                        })
                    )
                }),
                push: push.enabled ? push.fields : {
                    title: Nothing(),
                    message: Nothing(),
                    sendAt: Nothing()
                }
            };

            return campaignEntity.offerInfo.cata({
                Nothing: compose(dispatch, createOfferInfo, constant(OfferInfoParams)),
                Just: compose(dispatch, updateOfferInfo(OfferInfoParams))
            });
        }
    ).getOrElse(Promise.resolve());
};
