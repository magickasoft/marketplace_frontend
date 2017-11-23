import test from 'ava';
import sinon from 'sinon';
import {
    uniqueId,
    reduce
} from 'lodash/fp';

import {
    initialState,
    reducer,
    __RewireAPI__
} from '..';

const stub$reducerNotification = sinon.stub();
const stub$reducerLogin = sinon.stub();
const stub$reducerLogout = sinon.stub();
const stub$reducerAuth = sinon.stub();
const stub$reducerRecoveryPassword = sinon.stub();
const stub$reducerChangePassword = sinon.stub();
const stub$reducerCampaignsList = sinon.stub();
const stub$reducerCreateCampaign = sinon.stub();
const stub$reducerReport = sinon.stub();
const stub$reducerCampaignReport = sinon.stub();
const stub$reducerPartners = sinon.stub();
const stub$reducerChannel = sinon.stub();
const stub$reducerStory = sinon.stub();
const stub$reducerStoriesListAll = sinon.stub();
const stub$reducerStoriesListReview = sinon.stub();
const stub$reducerStoriesListQueue = sinon.stub();
const stub$reducerStoriesListEditorPicks = sinon.stub();
const stub$reducerStoriesListAdditionalField = sinon.stub();

test.before(() => {
    __RewireAPI__.__set__({
        reducerNotification: stub$reducerNotification,
        reducerLogin: stub$reducerLogin,
        reducerLogout: stub$reducerLogout,
        reducerAuth: stub$reducerAuth,
        reducerRecoveryPassword: stub$reducerRecoveryPassword,
        reducerChangePassword: stub$reducerChangePassword,
        reducerCampaignsList: stub$reducerCampaignsList,
        reducerCreateCampaign: stub$reducerCreateCampaign,
        reducerReport: stub$reducerReport,
        reducerCampaignReport: stub$reducerCampaignReport,
        reducerPartners: stub$reducerPartners,
        reducerChannel: stub$reducerChannel,
        reducerStory: stub$reducerStory,
        reducerStoriesListAll: stub$reducerStoriesListAll,
        reducerStoriesListReview: stub$reducerStoriesListReview,
        reducerStoriesListQueue: stub$reducerStoriesListQueue,
        reducerStoriesListEditorPicks: stub$reducerStoriesListEditorPicks,
        reducerStoriesListAdditionalField: stub$reducerStoriesListAdditionalField
    });
});

test.beforeEach(() => {
    stub$reducerNotification.reset();
    stub$reducerNotification.resetBehavior();
    stub$reducerLogin.reset();
    stub$reducerLogin.resetBehavior();
    stub$reducerLogout.reset();
    stub$reducerLogout.resetBehavior();
    stub$reducerAuth.reset();
    stub$reducerAuth.resetBehavior();
    stub$reducerRecoveryPassword.reset();
    stub$reducerRecoveryPassword.resetBehavior();
    stub$reducerChangePassword.reset();
    stub$reducerChangePassword.resetBehavior();
    stub$reducerCampaignsList.reset();
    stub$reducerCampaignsList.resetBehavior();
    stub$reducerCreateCampaign.reset();
    stub$reducerCreateCampaign.resetBehavior();
    stub$reducerReport.reset();
    stub$reducerReport.resetBehavior();
    stub$reducerCampaignReport.reset();
    stub$reducerCampaignReport.resetBehavior();
    stub$reducerPartners.reset();
    stub$reducerPartners.resetBehavior();
    stub$reducerChannel.reset();
    stub$reducerChannel.resetBehavior();
    stub$reducerStory.reset();
    stub$reducerStory.resetBehavior();
    stub$reducerStoriesListAll.reset();
    stub$reducerStoriesListAll.resetBehavior();
    stub$reducerStoriesListReview.reset();
    stub$reducerStoriesListReview.resetBehavior();
    stub$reducerStoriesListQueue.reset();
    stub$reducerStoriesListQueue.resetBehavior();
    stub$reducerStoriesListEditorPicks.reset();
    stub$reducerStoriesListEditorPicks.resetBehavior();
    stub$reducerStoriesListAdditionalField.reset();
    stub$reducerStoriesListAdditionalField.resetBehavior();
});

test('not changed branches', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    stub$reducerNotification
        .withArgs(state0.notifications, action1)
        .onFirstCall().returns(state0.notifications);

    stub$reducerLogin
        .withArgs(state0.login, action1)
        .onFirstCall().returns(state0.login);

    stub$reducerLogout
        .withArgs(state0.logout, action1)
        .onFirstCall().returns(state0.logout);

    stub$reducerAuth
        .withArgs(state0.auth, action1)
        .onFirstCall().returns(state0.auth);

    stub$reducerRecoveryPassword
        .withArgs(state0.recoveryPassword, action1)
        .onFirstCall().returns(state0.recoveryPassword);

    stub$reducerChangePassword
        .withArgs(state0.changePassword, action1)
        .onFirstCall().returns(state0.changePassword);

    stub$reducerCampaignsList
        .withArgs(state0.campaignsList, action1)
        .onFirstCall().returns(state0.campaignsList);

    stub$reducerCreateCampaign
        .withArgs(state0.createCampaign, action1)
        .onFirstCall().returns(state0.createCampaign);

    stub$reducerReport
        .withArgs(state0.report, action1)
        .onFirstCall().returns(state0.report);

    stub$reducerCampaignReport
        .withArgs(state0.campaignReport, action1)
        .onFirstCall().returns(state0.campaignReport);

    stub$reducerPartners
        .withArgs(state0.partners, action1)
        .onFirstCall().returns(state0.partners);

    stub$reducerChannel
        .withArgs(state0.channel, action1)
        .onFirstCall().returns(state0.channel);

    stub$reducerStory
        .withArgs(state0.story, action1)
        .onFirstCall().returns(state0.story);

    stub$reducerStoriesListAll
        .withArgs(state0.storiesList.all, action1)
        .onFirstCall().returns(state0.storiesList.all);

    stub$reducerStoriesListReview
        .withArgs(state0.storiesList.review, action1)
        .onFirstCall().returns(state0.storiesList.review);

    stub$reducerStoriesListQueue
        .withArgs(state0.storiesList.queue, action1)
        .onFirstCall().returns(state0.storiesList.queue);

    stub$reducerStoriesListEditorPicks
        .withArgs(state0.storiesList.editorPicks, action1)
        .onFirstCall().returns(state0.storiesList.editorPicks);

    stub$reducerStoriesListAdditionalField
        .withArgs(state0.storiesList.additionalField, action1)
        .onFirstCall().returns(state0.storiesList.additionalField);

    const state1 = reduce(reducer, state0, [ action1 ]);

    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('changed branches', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = {
        notifications: uniqueId('notifications'),
        login: uniqueId('login'),
        logout: uniqueId('logout'),
        auth: uniqueId('auth'),
        recoveryPassword: uniqueId('recoveryPassword'),
        changePassword: uniqueId('changePassword'),
        campaignsList: uniqueId('campaignsList'),
        createCampaign: uniqueId('createCampaign'),
        report: uniqueId('report'),
        campaignReport: uniqueId('campaignReport'),
        partners: uniqueId('partners'),
        storiesList: {
            all: uniqueId('all'),
            queue: uniqueId('queue'),
            editorPicks: uniqueId('editorPicks'),
            additionalField: uniqueId('additionalField')
        }
    };
    const nextNotifications = uniqueId('notifications');
    stub$reducerNotification
        .withArgs(state0.notifications, action1)
        .onFirstCall().returns(nextNotifications);

    const nextLogin = uniqueId('login');
    stub$reducerLogin
        .withArgs(state0.login, action1)
        .onFirstCall().returns(nextLogin);

    const nextLogout = uniqueId('logout');
    stub$reducerLogout
        .withArgs(state0.logout, action1)
        .onFirstCall().returns(nextLogout);

    const nextAuth = uniqueId('auth');
    stub$reducerAuth
        .withArgs(state0.auth, action1)
        .onFirstCall().returns(nextAuth);

    const nextRecoveryPassword = uniqueId('recoveryPassword');
    stub$reducerRecoveryPassword
        .withArgs(state0.recoveryPassword, action1)
        .onFirstCall().returns(nextRecoveryPassword);

    const nextChangePassword = uniqueId('changePassword');
    stub$reducerChangePassword
        .withArgs(state0.changePassword, action1)
        .onFirstCall().returns(nextChangePassword);

    const nextCampaignsList = uniqueId('campaignsList');
    stub$reducerCampaignsList
        .withArgs(state0.campaignsList, action1)
        .onFirstCall().returns(nextCampaignsList);

    const nextCreateCampaign = uniqueId('createCampaign');
    stub$reducerCreateCampaign
        .withArgs(state0.createCampaign, action1)
        .onFirstCall().returns(nextCreateCampaign);

    const nextReport = uniqueId('report');
    stub$reducerReport
        .withArgs(state0.report, action1)
        .onFirstCall().returns(nextReport);

    const nextCampaignReport = uniqueId('campaignReport');
    stub$reducerCampaignReport
        .withArgs(state0.campaignReport, action1)
        .onFirstCall().returns(nextCampaignReport);

    const nextPartners = uniqueId('partners');
    stub$reducerPartners
        .withArgs(state0.partners, action1)
        .onFirstCall().returns(nextPartners);

    const nextChannel = uniqueId('partners');
    stub$reducerChannel
        .withArgs(state0.channel, action1)
        .onFirstCall().returns(nextChannel);

    const nextStory = uniqueId('story');
    stub$reducerStory
        .withArgs(state0.story, action1)
        .onFirstCall().returns(nextStory);

    const nextStoriesListAll = uniqueId('all');
    stub$reducerStoriesListAll
        .withArgs(state0.storiesList.all, action1)
        .onFirstCall().returns(nextStoriesListAll);

    const nextStoriesListReview = uniqueId('review');
    stub$reducerStoriesListReview
        .withArgs(state0.storiesList.review, action1)
        .onFirstCall().returns(nextStoriesListReview);

    const nextStoriesListQueue = uniqueId('queue');
    stub$reducerStoriesListQueue
        .withArgs(state0.storiesList.queue, action1)
        .onFirstCall().returns(nextStoriesListQueue);

    const nextStoriesListEditorPicks = uniqueId('editorPicks');
    stub$reducerStoriesListEditorPicks
        .withArgs(state0.storiesList.editorPicks, action1)
        .onFirstCall().returns(nextStoriesListEditorPicks);

    const nextStoriesListAdditionalField = uniqueId('additionalField');
    stub$reducerStoriesListAdditionalField
        .withArgs(state0.storiesList.additionalField, action1)
        .onFirstCall().returns(nextStoriesListAdditionalField);

    const state1 = reduce(reducer, state0, [ action1 ]);

    t.not(state1, state0);
    t.deepEqual(state1, {
        notifications: nextNotifications,
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
    });
});
