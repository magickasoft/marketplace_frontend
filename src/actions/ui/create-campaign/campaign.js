import {
    batchActions
} from 'redux-batched-actions';
import {
    pick,
    keys,
    curry,
    compose,
    constant
} from 'lodash/fp';
import {
    Nothing
} from 'data.maybe';

import {
    denormalize
} from 'utils';
import {
    getBunchID
} from 'utils/bunch';
import {
    createCampaign as createCampaignRequest,
    updateCampaign as updateCampaignRequest
} from 'services/campaign-manager';
import {
    update,
    merge
} from 'actions/data';


export const CHANGE_NAME = 'UI/CREATE_CAMPAIGN/CAMPAIGN/CHANGE_NAME';

export function changeName(value) {
    return {
        type: CHANGE_NAME,
        payload: value
    };
}

export const CHANGE_DESCRIPTION = 'UI/CREATE_CAMPAIGN/CAMPAIGN/CHANGE_DESCRIPTION';

export function changeDescription(value) {
    return {
        type: CHANGE_DESCRIPTION,
        payload: value
    };
}

export const CHANGE_START_DATE = 'UI/CREATE_CAMPAIGN/CAMPAIGN/CHANGE_START_DATE';

export function changeStartDate(value) {
    return {
        type: CHANGE_START_DATE,
        payload: value
    };
}

export const CHANGE_END_DATE = 'UI/CREATE_CAMPAIGN/CAMPAIGN/CHANGE_END_DATE';

export function changeEndDate(value) {
    return {
        type: CHANGE_END_DATE,
        payload: value
    };
}

export const CREATE_CAMPAIGN_START = 'UI/CREATE_CAMPAIGN/CAMPAIGN/CREATE_CAMPAIGN_START';

export function createCampaignStart() {
    return {
        type: CREATE_CAMPAIGN_START
    };
}

export const CREATE_CAMPAIGN_SUCCESS = 'UI/CREATE_CAMPAIGN/CAMPAIGN/CREATE_CAMPAIGN_SUCCESS';

export function createCampaignSuccess(bunch) {
    return {
        type: CREATE_CAMPAIGN_SUCCESS,
        payload: bunch
    };
}

export const CREATE_CAMPAIGN_FAILURE = 'UI/CREATE_CAMPAIGN/CAMPAIGN/CREATE_CAMPAIGN_FAILURE';

export function createCampaignFailure(errors) {
    return {
        type: CREATE_CAMPAIGN_FAILURE,
        payload: errors
    };
}

export const UPDATE_CAMPAIGN_START = 'UI/UPDATE_CAMPAIGN/CAMPAIGN/UPDATE_CAMPAIGN_START';

export function updateCampaignStart() {
    return {
        type: UPDATE_CAMPAIGN_START
    };
}

export const UPDATE_CAMPAIGN_SUCCESS = 'UI/UPDATE_CAMPAIGN/CAMPAIGN/UPDATE_CAMPAIGN_SUCCESS';

export function updateCampaignSuccess() {
    return {
        type: UPDATE_CAMPAIGN_SUCCESS
    };
}

export const UPDATE_CAMPAIGN_FAILURE = 'UI/UPDATE_CAMPAIGN/CAMPAIGN/UPDATE_CAMPAIGN_FAILURE';

export function updateCampaignFailure(errors) {
    return {
        type: UPDATE_CAMPAIGN_FAILURE,
        payload: errors
    };
}

export function createCampaign(fields) {
    return dispatch => {
        dispatch(
            createCampaignStart()
        );

        return createCampaignRequest(fields)
            .then(({ result, entities }) => {
                dispatch(
                    batchActions([
                        createCampaignSuccess(result),
                        merge(entities)
                    ])
                );
            })
            .catch(errors => {
                dispatch(
                    createCampaignFailure(errors)
                );
            });
    };
}

export const updateCampaign = curry(
    (diff, bunch) => (dispatch, getState) => {
        const { data } = getState();

        return denormalize(Nothing(), data, bunch).cata({
            Nothing: () => Promise.resolve(),

            Just: campaign => {
                dispatch(
                    batchActions([
                        updateCampaignStart(),
                        update(diff, bunch)
                    ])
                );

                return updateCampaignRequest(diff, getBunchID(bunch))
                    .then(() => {
                        dispatch(
                            updateCampaignSuccess()
                        );
                    })
                    .catch(errors => {
                        dispatch(
                            batchActions([
                                updateCampaignFailure(errors),
                                update(
                                    pick(keys(diff), campaign),
                                    bunch
                                )
                            ])
                        );
                    });
            }
        });

    }
);

export function createOrUpdateCampaign() {
    return (dispatch, getState) => {
        const { ui } = getState();
        const [ campaign ] = ui.createCampaign.tabs;

        if (campaign.busy) {
            return Promise.resolve();
        }

        return campaign.bunch.cata({
            Nothing: compose(dispatch, createCampaign, constant(campaign.fields)),
            Just: compose(dispatch, updateCampaign(campaign.fields))
        });
    };
}
