import {
    initialState as initialNotificationState,
    reducer as reducerNotification
} from './notification';
import {
    initialState as initialLoginState,
    reducer as reducerLogin
} from './login';
import {
    initialState as initialLogoutState,
    reducer as reducerLogout
} from './logout';
import {
    initialState as initialAuthState,
    reducer as reducerAuth
} from './auth';
import {
    initialState as initialRecoveryPasswordState,
    reducer as reducerRecoveryPassword
} from './recovery-password';
import {
    initialState as initialChangePasswordState,
    reducer as reducerChangePassword
} from './change-password';
import {
    initialState as initialCampaignsListState,
    reducer as reducerCampaignsList
} from './campaigns-list';
import {
    initialState as initialCreateCampaignState,
    reducer as reducerCreateCampaign
} from './create-campaign';
import {
    initialState as initialReportState,
    reducer as reducerReport
} from './report';
import {
    initialState as initialCampaignReportState,
    reducer as reducerCampaignReport
} from './campaign-report';
import {
    initialState as initialPartnersState,
    reducer as reducerPartners
} from './partners';
import {
    initialState as initialChannelState,
    reducer as reducerChannel
} from './channel';
import {
    initialState as initialStoryState,
    reducer as reducerStory
} from './story';
import {
    initialState as initialStoriesListAllState,
    reducer as reducerStoriesListAll
} from './stories-list/all';
import {
    initialState as initialStoriesListReviewState,
    reducer as reducerStoriesListReview
} from './stories-list/review';
import {
    initialState as initialStoriesListQueueState,
    reducer as reducerStoriesListQueue
} from './stories-list/queue';
import {
    initialState as initialStoriesListEditorPicksState,
    reducer as reducerStoriesListEditorPicks
} from './stories-list/editor-picks';
import {
    initialState as initialStoriesListAdditionalFieldState,
    reducer as reducerStoriesListAdditionalField
} from './stories-list/additional-field';

export const initialState = {
    notifications: initialNotificationState,
    login: initialLoginState,
    logout: initialLogoutState,
    auth: initialAuthState,
    recoveryPassword: initialRecoveryPasswordState,
    changePassword: initialChangePasswordState,
    campaignsList: initialCampaignsListState,
    createCampaign: initialCreateCampaignState,
    report: initialReportState,
    campaignReport: initialCampaignReportState,
    partners: initialPartnersState,
    channel: initialChannelState,
    story: initialStoryState,
    storiesList: {
        all: initialStoriesListAllState,
        review: initialStoriesListReviewState,
        queue: initialStoriesListQueueState,
        editorPicks: initialStoriesListEditorPicksState,
        additionalField: initialStoriesListAdditionalFieldState
    }
};

export function reducer(state, action) {
    const nextNotification = reducerNotification(state.notifications, action);
    const nextLogin = reducerLogin(state.login, action);
    const nextLogout = reducerLogout(state.logout, action);
    const nextAuth = reducerAuth(state.auth, action);
    const nextRecoveryPassword = reducerRecoveryPassword(state.recoveryPassword, action);
    const nextChangePassword = reducerChangePassword(state.changePassword, action);
    const nextCampaignsList = reducerCampaignsList(state.campaignsList, action);
    const nextCreateCampaign = reducerCreateCampaign(state.createCampaign, action);
    const nextReport = reducerReport(state.report, action);
    const nextCampaignReport = reducerCampaignReport(state.campaignReport, action);
    const nextPartners = reducerPartners(state.partners, action);
    const nextChannel = reducerChannel(state.channel, action);
    const nextStory = reducerStory(state.story, action);
    const nextStoriesListAll = reducerStoriesListAll(state.storiesList.all, action);
    const nextStoriesListReview = reducerStoriesListReview(state.storiesList.review, action);
    const nextStoriesListQueue = reducerStoriesListQueue(state.storiesList.queue, action);
    const nextStoriesListEditorPicks = reducerStoriesListEditorPicks(state.storiesList.editorPicks, action);
    const nextStoriesListAdditionalField = reducerStoriesListAdditionalField(state.storiesList.additionalField, action);

    if (
        state.notifications === nextNotification &&
        state.login === nextLogin &&
        state.logout === nextLogout &&
        state.auth === nextAuth &&
        state.recoveryPassword === nextRecoveryPassword &&
        state.changePassword === nextChangePassword &&
        state.campaignsList === nextCampaignsList &&
        state.createCampaign === nextCreateCampaign &&
        state.report === nextReport &&
        state.campaignReport === nextCampaignReport &&
        state.partners === nextPartners &&
        state.channel === nextChannel &&
        state.story === nextStory &&
        state.storiesList.all === nextStoriesListAll &&
        state.storiesList.review === nextStoriesListReview &&
        state.storiesList.queue === nextStoriesListQueue &&
        state.storiesList.editorPicks === nextStoriesListEditorPicks &&
        state.storiesList.additionalField === nextStoriesListAdditionalField
    ) {
        return state;
    }

    return {
        notifications: nextNotification,
        login: nextLogin,
        logout: nextLogout,
        auth: nextAuth,
        recoveryPassword: nextRecoveryPassword,
        changePassword: nextChangePassword,
        campaignsList: nextCampaignsList,
        createCampaign: nextCreateCampaign,
        report: nextReport,
        campaignReport: nextCampaignReport,
        partners: nextPartners,
        channel: nextChannel,
        story: nextStory,
        storiesList: {
            all: nextStoriesListAll,
            review: nextStoriesListReview,
            queue: nextStoriesListQueue,
            editorPicks: nextStoriesListEditorPicks,
            additionalField: nextStoriesListAdditionalField
        }
    };
}
