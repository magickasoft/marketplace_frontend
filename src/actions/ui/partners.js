import {
    Nothing
} from 'data.maybe';
import {
    batchActions
} from 'redux-batched-actions';

import {
    getBunchID
} from 'utils/bunch';
import {
    deleteChannel as deleteChannelRequest
} from 'services/campaign-manager';
import {
    receiveChannelsPage as receiveChannelsPageRequest
} from 'services/campaign-manager';
import {
    merge
} from 'actions/data';


export const RECEIVE_CHANNELS_PAGE_START = 'UI/PARTNERS/RECEIVE_CHANNELS_PAGE_START';

export function receiveChannelsPageStart(current) {
    return {
        type: RECEIVE_CHANNELS_PAGE_START,
        payload: current
    };
}

export const RECEIVE_CHANNELS_PAGE_FAILURE = 'UI/PARTNERS/RECEIVE_CHANNELS_PAGE_FAILURE';

export function receiveChannelsPageFailure(errors) {
    return {
        type: RECEIVE_CHANNELS_PAGE_FAILURE,
        payload: errors
    };
}

export const RECEIVE_CHANNELS_PAGE_SUCCESS = 'UI/PARTNERS/RECEIVE_CHANNELS_PAGE_SUCCESS';

export function receiveChannelsPageSuccess(results) {
    return {
        type: RECEIVE_CHANNELS_PAGE_SUCCESS,
        payload: results
    };
}

export const receiveChannelsPage = current => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.partners.busy) {
        return Promise.resolve();
    }

    dispatch(
        receiveChannelsPageStart(current)
    );

    return receiveChannelsPageRequest(Nothing(), current)
        .then(({ result, entities }) => {
            dispatch(
                batchActions([
                    receiveChannelsPageSuccess(result),
                    merge(entities)
                ])
            );
        })
        .catch(errors => {
            dispatch(
                receiveChannelsPageFailure(errors)
            );
        });
};

export const ENABLE_DELETING = 'UI/PARTNERS/ENABLE_DELETING';

export function enableDeleting(bunch) {
    return {
        type: ENABLE_DELETING,
        payload: bunch
    };
}

export const DISABLE_DELETING = 'UI/PARTNERS/DISABLE_DELETING';

export function disableDeleting() {
    return {
        type: DISABLE_DELETING
    };
}

export const DELETE_CHANNEL_START = 'UI/PARTNERS/DELETE_CHANNEL_START';

export function deleteChannelStart() {
    return {
        type: DELETE_CHANNEL_START
    };
}

export const DELETE_CHANNEL_FAILURE = 'UI/PARTNERS/DELETE_CHANNEL_FAILURE';

export function deleteChannelFailure(errors) {
    return {
        type: DELETE_CHANNEL_FAILURE,
        payload: errors
    };
}

export const deleteChannel = () => (dispatch, getState) => {
    const { ui } = getState();

    return ui.partners.deleting.map(
        deleting => {
            if (deleting.busy) {
                return Promise.resolve();
            }

            dispatch(
                deleteChannelStart()
            );

            return deleteChannelRequest(getBunchID(deleting.bunch))
                .then(() => {
                    dispatch(
                        disableDeleting()
                    );

                    return dispatch(
                        receiveChannelsPage(ui.partners.current)
                    );
                })
                .catch(errors => {
                    dispatch(
                        deleteChannelFailure(errors)
                    );
                });
        }
    ).getOrElse(Promise.resolve());
};
