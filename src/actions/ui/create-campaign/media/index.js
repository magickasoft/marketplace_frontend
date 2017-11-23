import {
    batchActions
} from 'redux-batched-actions';

import {
    receiveOffersPage as receiveOffersPageRequest
} from 'services/campaign-manager';
import {
    merge
} from 'actions/data';


export const SELECT = 'UI/CREATE_CAMPAIGN/OFFER/SELECT';

export function select(bunch) {
    return {
        type: SELECT,
        payload: bunch
    };
}

export const RECEIVE_MEDIA_PAGE_START = 'UI/CREATE_CAMPAIGN/OFFER/RECEIVE_MEDIA_PAGE_START';

export function receiveMediaPageStart(number) {
    return {
        type: RECEIVE_MEDIA_PAGE_START,
        payload: number
    };
}

export const RECEIVE_MEDIA_PAGE_SUCCESS = 'UI/CREATE_CAMPAIGN/OFFER/RECEIVE_MEDIA_PAGE_SUCCESS';

export function receiveMediaPageSuccess(page) {
    return {
        type: RECEIVE_MEDIA_PAGE_SUCCESS,
        payload: page
    };
}

export const RECEIVE_MEDIA_PAGE_FAILURE = 'UI/CREATE_CAMPAIGN/OFFER/RECEIVE_MEDIA_PAGE_FAILURE';

export function receiveMediaPageFailure(errors) {
    return {
        type: RECEIVE_MEDIA_PAGE_FAILURE,
        payload: errors
    };
}


export function receiveMediaPage(page) {
    return (dispatch, getState) => {
        const { ui } = getState();
        const [ , , media ] = ui.createCampaign.tabs;

        if (media.busy) {
            return Promise.resolve();
        }

        dispatch(
            receiveMediaPageStart(page)
        );

        return receiveOffersPageRequest(page)
            .then(({ result, entities }) => {
                dispatch(
                    batchActions([
                        receiveMediaPageSuccess(result),
                        merge(entities)
                    ])
                );
            })
            .catch(errors => {
                dispatch(
                    receiveMediaPageFailure(errors)
                );
            });
    };
}
