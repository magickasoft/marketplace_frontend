import {
    batchActions
} from 'redux-batched-actions';
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
    STATE_STARTED as CAMPAIGN_STATE_STARTED
} from 'models/campaign';
import {
    launchCampaign as launchCampaignRequest
} from 'services/campaign-manager';
import {
    update
} from 'actions/data';


export const LAUNCH_CAMPAIGN_START = 'UI/CREATE_CAMPAIGN/SUMMARY/LAUNCH_CAMPAIGN_START';

export function launchCampaignStart() {
    return {
        type: LAUNCH_CAMPAIGN_START
    };
}

export const LAUNCH_CAMPAIGN_SUCCESS = 'UI/CREATE_CAMPAIGN/SUMMARY/LAUNCH_CAMPAIGN_SUCCESS';

export function launchCampaignSuccess() {
    return {
        type: LAUNCH_CAMPAIGN_SUCCESS
    };
}

export const LAUNCH_CAMPAIGN_FAILURE = 'UI/CREATE_CAMPAIGN/SUMMARY/LAUNCH_CAMPAIGN_FAILURE';

export function launchCampaignFailure(errors) {
    return {
        type: LAUNCH_CAMPAIGN_FAILURE,
        payload: errors
    };
}

export function launchCampaign() {
    return (dispatch, getState) => {
        const { ui, data } = getState();
        const [ campaign, , , , summary ] = ui.createCampaign.tabs;

        if (summary.busy) {
            return Promise.resolve();
        }

        return campaign.bunch.chain(
            denormalize(Nothing(), data)
        ).cata({
            Nothing: () => Promise.resolve(),

            Just: campaignEntity => {
                dispatch(
                    batchActions([
                        launchCampaignStart(),
                        update({
                            state: CAMPAIGN_STATE_STARTED
                        }, campaignEntity.bunch)
                    ])
                );

                return launchCampaignRequest(getBunchID(campaignEntity.bunch))
                    .then(() => {
                        dispatch(
                            launchCampaignSuccess()
                        );
                    })
                    .catch(errors => {
                        dispatch(
                            batchActions([
                                launchCampaignFailure(errors),
                                update({
                                    state: campaignEntity.state
                                }, campaignEntity.bunch)
                            ])
                        );
                    });
            }
        });
    };
}
