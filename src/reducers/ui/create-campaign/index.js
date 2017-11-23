import {
    SET_MODAL_SHOW,
    CAMPAIGN as TAB_CAMPAIGN,
    SET_CURRENT_TAB,
    RESET
} from 'actions/ui/create-campaign';
import {
    initialState as initialOfferInfoState,
    reducer as reducerOfferInfo
} from './offer-info';
import {
    initialState as initialCampaignState,
    reducer as reducerCampaign
} from './campaign';
import {
    initialState as initialSegmentState,
    reducer as reducerSegment
} from './segment';
import {
    initialState as initialMediaState,
    reducer as reducerMedia
} from './media';
import {
    initialState as initialPushState,
    reducer as reducerPush
} from './push';
import {
    initialState as initialSummaryState,
    reducer as reducerSummary
} from './summary';

export const initialState = {
    current: TAB_CAMPAIGN,
    offerInfo: initialOfferInfoState,
    modalShow: false,
    tabs: [
        initialCampaignState,
        initialSegmentState,
        initialMediaState,
        initialPushState,
        initialSummaryState
    ]
};

export function reducer(state, action) {
    switch (action.type) {
        case SET_MODAL_SHOW: {
            return {
                ...state,
                modalShow: !!action.payload
            };
        }

        case SET_CURRENT_TAB: {
            return {
                ...state,
                current: action.payload
            };
        }

        case RESET: {
            return initialState;
        }

        default: {
            const [ prevCampaign, prevSegment, prevMedia, prevPush, prevSummary ] = state.tabs;

            const nextOfferInfo = reducerOfferInfo(state.offerInfo, action);
            const nextCampaign = reducerCampaign(prevCampaign, action);
            const nextSegment = reducerSegment(prevSegment, action);
            const nextMedia = reducerMedia(prevMedia, action);
            const nextPush = reducerPush(prevPush, action);
            const nextSummary = reducerSummary(prevSummary, action);

            if (
                state.offerInfo === nextOfferInfo &&
                prevCampaign === nextCampaign &&
                prevSegment === nextSegment &&
                prevMedia === nextMedia &&
                prevPush === nextPush &&
                prevSummary === nextSummary
            ) {
                return state;
            }

            return {
                ...state,
                offerInfo: nextOfferInfo,
                tabs: [ nextCampaign, nextSegment, nextMedia, nextPush, nextSummary ]
            };
        }
    }
}
