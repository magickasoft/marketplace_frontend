import {
    batchActions
} from 'redux-batched-actions';

import {
    receiveCampaignsPage as receiveCampaignsPageRequest
} from 'services/campaign-manager';
import {
    merge
} from 'actions/data';


export const RECEIVE_PAGE_START = 'UI/CAMPAIGN_LIST/RECEIVE_PAGE_START';

export function receivePageStart(current) {
    return {
        type: RECEIVE_PAGE_START,
        payload: current
    };
}

export const RECEIVE_PAGE_SUCCESS = 'UI/CAMPAIGN_LIST/RECEIVE_PAGE_SUCCESS';

export function receivePageSuccess(page) {
    return {
        type: RECEIVE_PAGE_SUCCESS,
        payload: page
    };
}

export const RECEIVE_PAGE_FAILURE = 'UI/CAMPAIGN_LIST/RECEIVE_PAGE_FAILURE';

export function receivePageFailure(errors) {
    return {
        type: RECEIVE_PAGE_FAILURE,
        payload: errors
    };
}

export function receivePage(current) {
    return (dispatch, getState) => {
        const { ui } = getState();

        if (ui.campaignsList.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart(current)
        );

        return receiveCampaignsPageRequest(current)
            .then(({ result, entities }) => {
                dispatch(
                    batchActions([
                        receivePageSuccess(result),
                        merge(entities)
                    ])
                );
            })
            .catch(errors => {
                dispatch(
                    receivePageFailure(errors)
                );
            });
    };
}
