import {
    curry,
    compose,
    property,
    constant,
    reduce,
    toPairs,
    pick,
    keys
} from 'lodash/fp';
import {
    Nothing
} from 'data.maybe';
import {
    batchActions
} from 'redux-batched-actions';

import {
    get,
    denormalize
} from 'utils';
import {
    getBunchID
} from 'utils/bunch';
import {
    createOffer as createOfferRequest,
    updateOffer as updateOfferRequest,
    receiveChannelsPage as receiveChannelsPageRequest
} from 'services/campaign-manager';
import {
    sign as s3SignRequest
} from 'services/s3';
import {
    update,
    merge
} from 'actions/data';
import {
    select as selectOffer,
    receiveMediaPage
} from './';

export const MODAL_PREVIEW_IMAGE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL_PREVIEW_IMAGE';

export const modalPreviewImage = curry(
    (size, value) => ({
        type: MODAL_PREVIEW_IMAGE,
        payload: { size, value }
    })
);

export const MODAL_PREVIEW_IMAGE_ADD = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL_PREVIEW_IMAGE_ADD';

export const modalPreviewImageAdd = curry(
    (size, imgObj) => ({
        type: MODAL_PREVIEW_IMAGE_ADD,
        payload: { size, imgObj }
    })
);

export const OPEN = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/OPEN';

export function open(mOffer) {
    return {
        type: OPEN,
        payload: mOffer
    };
}

export const CLOSE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CLOSE';

export function close() {
    return {
        type: CLOSE
    };
}

export const CHANGE_TITLE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_TITLE';

export function changeTitle(title) {
    return {
        type: CHANGE_TITLE,
        payload: title
    };
}

export const CHANGE_DESCRIPTION = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_DESCRIPTION';

export function changeDescription(message) {
    return {
        type: CHANGE_DESCRIPTION,
        payload: message
    };
}

export const UPLOAD_IMAGE_START = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/UPLOAD_IMAGE_START';

export function uploadImageStart(size) {
    return {
        type: UPLOAD_IMAGE_START,
        payload: { size }
    };
}

export const UPLOAD_IMAGE_SUCCESS = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/UPLOAD_IMAGE_SUCCESS';

export const uploadImageSuccess = curry(
    (size, url) => ({
        type: UPLOAD_IMAGE_SUCCESS,
        payload: ({ size, url })
    })
);

export const UPLOAD_IMAGE_FAILURE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/UPLOAD_IMAGE_FAILURE';

export const uploadImageFailure = curry(
    (size, errors) => ({
        type: UPLOAD_IMAGE_FAILURE,
        payload: { size, errors }
    })
);

const pBusy = property('busy');

export const uploadImage = curry(
    (size, image) => (dispatch, getState) => {
        const { ui } = getState();
        const [ , , offer ] = ui.createCampaign.tabs;

        return offer.modal.cata({
            Nothing: () => Promise.resolve(),

            Just: modal => {
                if (get(size, modal.fields.images).map(pBusy).getOrElse(false)) {
                    return Promise.resolve();
                }

                dispatch(
                    uploadImageStart(size)
                );

                return s3SignRequest(image)
                    .then(url => {
                        dispatch(
                            uploadImageSuccess(size, url)
                        );
                    })
                    .catch(errors => {
                        dispatch(
                            uploadImageFailure(size, errors)
                        );
                    });
            }
        });
    }
);

export const REMOVE_IMAGE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/REMOVE_IMAGE';

export function removeImage(size) {
    return {
        type: REMOVE_IMAGE,
        payload: { size }
    };
}

export const CHANGE_SUBTITLE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_SUBTITLE';

export function changeSubtitle(value) {
    return {
        type: CHANGE_SUBTITLE,
        payload: value
    };
}

export const CHANGE_TERMS_AND_CONDITIONS = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_TERMS_AND_CONDITIONS';

export function changeTermsAndConditions(value) {
    return {
        type: CHANGE_TERMS_AND_CONDITIONS,
        payload: value
    };
}

export const CHANGE_VALID_DATE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_VALID_DATE';

export const changeValidDate = curry(
    (date, time) => ({
        type: CHANGE_VALID_DATE,
        payload: [ date, time ]
    })
);

export const CHANGE_SHARABLE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_SHARABLE';

export function changeSharable(value) {
    return {
        type: CHANGE_SHARABLE,
        payload: value
    };
}

export const CHANTE_BUTTON_TEXT = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANTE_BUTTON_TEXT';

export function chanteButtonText(value) {
    return {
        type: CHANTE_BUTTON_TEXT,
        payload: value
    };
}

export const REDEEM_CODE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/REDEEM/CODE';
export const REDEEM_URL = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/REDEEM/URL';

export const CHOISE_REDEEM_TYPE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHOISE_REDEEM_TYPE';

export const choiseRedeemType = redeemType => ({
    type: CHOISE_REDEEM_TYPE,
    payload: redeemType
});

export const CHANGE_REDEEM_TITLE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_REDEEM_TITLE';

export function changeRedeemTitle(value) {
    return {
        type: CHANGE_REDEEM_TITLE,
        payload: value
    };
}

export const CHANGE_REDEEM_CODE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_REDEEM_CODE';

export function changeRedeemCode(value) {
    return {
        type: CHANGE_REDEEM_CODE,
        payload: value
    };
}

export const CHANGE_REDEEM_URL = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_REDEEM_URL';

export function changeRedeemUrl(value) {
    return {
        type: CHANGE_REDEEM_URL,
        payload: value
    };
}

export const CHANGE_WEBSITE_TITLE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_WEBSITE_TITLE';

export function changeWebsiteTitle(value) {
    return {
        type: CHANGE_WEBSITE_TITLE,
        payload: value
    };
}

export const CHANGE_WEBSITE_URL = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_WEBSITE_URL';

export function changeWebsiteUrl(value) {
    return {
        type: CHANGE_WEBSITE_URL,
        payload: value
    };
}

export const RECEIVE_CHANNELS_START = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/RECEIVE_CHANNELS_START';

export function receiveChannelsStart() {
    return {
        type: RECEIVE_CHANNELS_START
    };
}

export const RECEIVE_CHANNELS_FAILURE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/RECEIVE_CHANNELS_FAILURE';

export function receiveChannelsFailure(errors) {
    return {
        type: RECEIVE_CHANNELS_FAILURE,
        payload: errors
    };
}

export const RECEIVE_CHANNELS_SUCCESS = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/RECEIVE_CHANNELS_SUCCESS';

export function receiveChannelsSuccess(results) {
    return {
        type: RECEIVE_CHANNELS_SUCCESS,
        payload: results
    };
}

export const receiveChannels = () => (dispatch, getState) => {
    const { ui } = getState();
    const [ , , offer ] = ui.createCampaign.tabs;

    return offer.modal.cata({
        Nothing: () => Promise.resolve(),

        Just: modal => {
            if (modal.channels.busy) {
                return Promise.resolve();
            }

            dispatch(
                receiveChannelsStart()
            );

            return receiveChannelsPageRequest(Nothing(), 1)
                .then(({ result, entities }) => {
                    dispatch(
                        batchActions([
                            receiveChannelsSuccess(result.results),
                            merge(entities)
                        ])
                    );
                })
                .catch(errors => {
                    dispatch(
                        receiveChannelsFailure(errors)
                    );
                });
        }
    });
};

export const CHANGE_CHANNEL = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/CHANGE_CHANNEL';

export function changeChannel(bunch) {
    return {
        type: CHANGE_CHANNEL,
        payload: bunch
    };
}

export const SUBMIT_OFFER_START = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/SUBMIT_OFFER_START';

export function submitOfferStart() {
    return {
        type: SUBMIT_OFFER_START
    };
}

export const SUBMIT_OFFER_FAILURE = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/SUBMIT_OFFER_FAILURE';

export function submitOfferFailure(errors) {
    return {
        type: SUBMIT_OFFER_FAILURE,
        payload: errors
    };
}

export const SUBMIT_OFFER_SUCCESS = 'UI/CREATE_CAMPAIGN/MEDIA/MODAL/SUBMIT_OFFER_SUCCESS';

export function submitOfferSuccess() {
    return {
        type: SUBMIT_OFFER_SUCCESS
    };
}

export function createOffer(fields) {
    return dispatch => {
        dispatch(
            submitOfferStart()
        );

        return createOfferRequest(fields)
            .then(({ result, entities }) => {
                dispatch(
                    batchActions([
                        submitOfferSuccess(),
                        merge(entities),
                        selectOffer(result)
                    ])
                );

                dispatch(
                    receiveMediaPage(1)
                );
            })
            .catch(errors => {
                dispatch(
                    submitOfferFailure(errors)
                );
            });
    };
}

export const updateOffer = curry(
    (diff, bunch) => (dispatch, getState) => {
        const { data } = getState();

        return denormalize(Nothing(), data, bunch).cata({
            Nothing: () => Promise.resolve(),

            Just: offerEntity => {
                dispatch(
                    batchActions([
                        submitOfferStart(),
                        update(diff, bunch),
                        selectOffer(bunch)
                    ])
                );

                return updateOfferRequest(diff, getBunchID(bunch))
                    .then(() => {
                        dispatch(
                            submitOfferSuccess()
                        );
                    })
                    .catch(errors => {
                        dispatch(
                            batchActions([
                                submitOfferFailure(errors),
                                update(pick(keys(diff), offerEntity), bunch)
                            ])
                        );
                    });
            }
        });
    }
);

export function createOrUpdateOffer() {
    return (dispatch, getState) => {
        const { ui } = getState();
        const [ , , offer ] = ui.createCampaign.tabs;

        return offer.modal
            .cata({
                Nothing: () => Promise.resolve(),

                Just: modal => {
                    if (modal.busy) {
                        return Promise.resolve();
                    }

                    const fields = {
                        ...modal.fields,
                        channel: modal.fields.channel.getOrElse({}),
                        images: reduce(
                            (acc, [ size, image ]) => image.url.map(
                                url => ({
                                    ...acc,
                                    [ size ]: url
                                })
                            ).getOrElse(acc),
                            {},
                            toPairs(modal.fields.images)
                        ),
                        redeem: {
                            ...modal.fields.redeem,
                            code: modal.fields.redeem.code.selected ?
                                modal.fields.redeem.code.value :
                                Nothing(),
                            url: modal.fields.redeem.url.selected ?
                                modal.fields.redeem.url.value :
                                Nothing()
                        }
                    };

                    return modal.fields.bunch.cata({
                        Nothing: compose(dispatch, createOffer, constant(fields)),
                        Just: compose(dispatch, updateOffer(fields))
                    });
                }
            });
    };
}
