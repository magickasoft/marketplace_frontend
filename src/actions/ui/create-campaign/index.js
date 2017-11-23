import {
    createOrUpdateCampaign
} from './campaign';
import {
    receiveMediaPage
} from './media';
import {
    createOrUpdateOfferInfo
} from './offer-info';


export const CAMPAIGN = 'UI/CREATE_CAMPAIGN/TAB/CAMPAIGN';
export const SEGMENT = 'UI/CREATE_CAMPAIGN/TAB/SEGMENT';
export const MEDIA = 'UI/CREATE_CAMPAIGN/TAB/MEDIA';
export const PUSH = 'UI/CREATE_CAMPAIGN/TAB/PUSH';
export const SUMMARY = 'UI/CREATE_CAMPAIGN/TAB/SUMMARY';

export const SET_CURRENT_TAB = 'UI/CREATE_CAMPAIGN/SET_CURRENT_TAB';

export const SET_MODAL_SHOW = 'UI/CREATE_CAMPAIGN/SET_MODAL_SHOW';

export function setCurrentTab(tab) {
    return {
        type: SET_CURRENT_TAB,
        payload: tab
    };
}

export function setModalShow(show) {
    return {
        type: SET_MODAL_SHOW,
        payload: show
    };
}

export function changeTab(next) {
    return (dispatch, getState) => {
        const { ui } = getState();

        dispatch(
            setCurrentTab(next)
        );

        return Promise.all([
            dispatch(
                goFromTab(ui.createCampaign.current)
            ),
            dispatch(
                goToTab(next)
            )
        ]);
    };
}

export function goFromTab(tab) {
    return dispatch => {
        switch (tab) {
            case CAMPAIGN: {
                return dispatch(
                    createOrUpdateCampaign()
                );
            }

            case SEGMENT:
            case MEDIA:
            case PUSH: {
                return dispatch(
                    createOrUpdateOfferInfo()
                );
            }

            default: {
                return Promise.resolve();
            }
        }
    };
}

export function goToTab(tab) {
    return (dispatch, getState) => {
        const { ui } = getState();
        const [ , , offer ] = ui.createCampaign.tabs;

        switch (tab) {

            case MEDIA: {
                return dispatch(
                    receiveMediaPage(offer.current)
                );
            }

            default: {
                return Promise.resolve();
            }
        }
    };
}

export const RESET = 'UI/CREATE_CAMPAIGN/RESET';
export function reset() {
    return {
        type: RESET
    };
}
