import React from 'react';
import {
    render
} from 'react-dom';
import {
    Provider
} from 'react-redux';
import moment from 'moment';
import {
    Router,
    applyRouterMiddleware,
    browserHistory
} from 'react-router';
import {
    syncHistoryWithStore
} from 'react-router-redux';
import {
    useScroll
} from 'react-router-scroll';
import {
    curry,
    compose,
    split
} from 'lodash/fp';
import Maybe, {
    Nothing
} from 'data.maybe';

import './base.css';
import 'react-select/dist/react-select.css';
import {
    toInt,
    maybeFromString
} from 'utils';
import {
    makeBunch as makeCampaignBunch
} from 'models/campaign';
import Root from 'containers/Root';
import Page403 from 'containers/Page403';
import App from 'containers/App';
import Login from 'containers/Login';
import RecoveryPassword from 'containers/RecoveryPassword';
import CampaignsList from 'containers/CampaignsList';
import CreateCampaign from 'containers/CreateCampaign';
import Reports from 'containers/Reports';
import CampaignDetails from 'containers/CampaignDetails';
import Partners from 'containers/Partners';
import Channel from 'containers/Entities/Channel';
import Story from 'containers/Entities/Story';
import Stories from 'containers/Stories';
import StoriesAll from 'containers/Stories/All';
import StoriesReview from 'containers/Stories/Review';
import StoriesQueue from 'containers/Stories/Queue';
import StoriesEditorPicks from 'containers/Stories/EditorPicks';
import NotificationContainer from 'containers/Notification';
import {
    createStore
} from 'store';
import {
    receiveCountries
} from 'actions/session';
import {
    auth
} from 'actions/ui/auth';
import {
    logout
} from 'actions/ui/logout';
import {
    receivePage as receiveCampaignsPage
} from './actions/ui/campaigns-list';
import {
    reset as resetCreateCampaign
} from 'actions/ui/create-campaign';
import {
    receiveTableAndChart
} from 'actions/ui/report';
import {
    passDefaultsToIntervals,
    receiveCampaignWithChartAndSummary,
    reset as resetCampaignReset
} from 'actions/ui/campaign-report';
import {
    show as showChannel
} from 'actions/ui/channel';
import {
    show as showStory
} from 'actions/ui/story';
import {
    receivePage as receiveAllStoriesPage
} from 'actions/ui/stories-list/all';
import {
    receivePage as receiveReviewStoriesPage
} from 'actions/ui/stories-list/review';
import {
    receivePage as receiveQueueStoriesPage
} from 'actions/ui/stories-list/queue';
import {
    receivePage as receiveEditorPicksStoriesPage
} from 'actions/ui/stories-list/editor-picks';
import {
    receiveChannelsPage
} from 'actions/ui/partners';
import {
    makeBunch as makeChannelBunch
} from 'models/channel';
import {
    makeBunch as makeStoryBunch
} from 'models/story';
import {
    COUNTRY_MANAGER,
    SUPER_MANAGER,
    COUNTRY_EDITOR,
    SUPER_EDITOR,
    ADMIN
} from 'models/user';
import {
    DISCRETIZATION_DAY as ANALYTIC_DISCRETIZATION_DAY
} from 'models/analytic';
import {
    ORDER_ASC as QUERY_ORDER_ASC,
    ORDER_DESC as QUERY_ORDER_DESC,
    FIELD_NAME as QUERY_FIELD_NAME,
    FIELD_PUBLISH_DATE as QUERY_FIELD_PUBLISH_DATE
} from 'services/queries';


const store = createStore();

function requireAuth(nextState, replace) {
    if (store.getState().session.user.isNothing) {
        replace({
            pathname: '/login',
            state: {
                nextPathname: nextState.location.pathname
            }
        });
    }
}

function requireUnauth(nextState, replace) {
    if (store.getState().session.user.isJust) {
        replace({
            pathname: '/'
        });
    }
}

function logoutHook(nextState, replace, next) {
    store.dispatch(
        logout()
    ).then(() => {
        if (store.getState().session.user.isNothing) {
            replace({
                pathname: '/login'
            });
        }
    })
    .then(next);
}

const parseStringToTuple2 = str => {
    const [ strStart, strEnd ] = split('|', str);

    return [ maybeFromString(strStart), maybeFromString(strEnd) ];
};

const parseSortWithDefaults = str => {
    const [ mOrdering, mField ] = parseStringToTuple2(str);

    return [
        mOrdering.getOrElse(QUERY_ORDER_DESC),
        mField.getOrElse(QUERY_FIELD_NAME)
    ];
};

function reportHook(nextState) {
    const { query } = nextState.location;
    const interval = parseStringToTuple2(query.i);
    const page = toInt(query.p).getOrElse(1);
    const sort = parseSortWithDefaults(query.s);
    const discretization = Maybe.fromNullable(query.d).getOrElse(ANALYTIC_DISCRETIZATION_DAY);

    store.dispatch(
        receiveTableAndChart(
            passDefaultsToIntervals(discretization, interval),
            page,
            sort,
            discretization
        )
    );
}

function campaignDetailsHook(nextState) {
    const { query } = nextState.location;
    const discretization = Maybe.fromNullable(query.d).getOrElse(ANALYTIC_DISCRETIZATION_DAY);
    const interval = parseStringToTuple2(query.i);
    const bunch = makeCampaignBunch(nextState.params.id);

    store.dispatch(
        receiveCampaignWithChartAndSummary(
            discretization,
            passDefaultsToIntervals(discretization, interval),
            bunch
        )
    );
}

const changeStoriesListUrlHook = curry(
    (action, nextState) => {
        const { query } = nextState.location;
        const page = toInt(query.page).getOrElse(1);
        const sort = Maybe.fromNullable(query.sort).getOrElse(QUERY_FIELD_PUBLISH_DATE);
        const order = Maybe.fromNullable(query.order).getOrElse(QUERY_ORDER_ASC);

        store.dispatch(
            action(page, sort, order)
        );
    }
);

const routes = {
    path: '/',
    component: Root,
    childRoutes: [
        {
            onEnter: requireUnauth,
            childRoutes: [
                {
                    path: 'login',
                    component: Login
                },
                {
                    path: 'restore-password(/:code)',
                    component: RecoveryPassword
                }
            ]
        },
        {
            onEnter: requireAuth,
            component: App,
            indexRoute: {
                onEnter(nextState, replace) {
                    replace('/reports');
                }
            },
            childRoutes: [
                {
                    path: 'content/stories',
                    component: props => (
                        <Page403 permissions={[ ADMIN, COUNTRY_EDITOR, SUPER_EDITOR ]}>
                            <Stories {...props} />
                        </Page403>
                    ),
                    indexRoute: {
                        onEnter(_, replace) {
                            replace({
                                pathname: '/content/stories/all'
                            });
                        }
                    },
                    childRoutes: [
                        {
                            path: 'all',
                            component: StoriesAll,
                            onEnter: changeStoriesListUrlHook(receiveAllStoriesPage),
                            onChange(_, nextState) {
                                changeStoriesListUrlHook(receiveAllStoriesPage, nextState);
                            }
                        },
                        {
                            path: 'review',
                            component: StoriesReview,
                            onEnter: changeStoriesListUrlHook(receiveReviewStoriesPage),
                            onChange(_, nextState) {
                                changeStoriesListUrlHook(receiveReviewStoriesPage, nextState);
                            }
                        },
                        {
                            path: 'queue',
                            component: StoriesQueue,
                            onEnter: compose(store.dispatch, receiveQueueStoriesPage)
                        }
                    ]
                },
                {
                    path: 'content/editor-picks',
                    component: StoriesEditorPicks,
                    onEnter: compose(store.dispatch, receiveEditorPicksStoriesPage)
                },
                {
                    path: 'logout',
                    onEnter: logoutHook
                },
                {
                    path: 'create-campaign',
                    component: props => (
                        <Page403 permissions={[ ADMIN, COUNTRY_MANAGER, SUPER_MANAGER ]}>
                            <CreateCampaign {...props} />
                        </Page403>
                    ),
                    onLeave: compose(store.dispatch, resetCreateCampaign)
                },
                {
                    path: 'campaigns-list(/:page)',
                    component: props => (
                        <Page403 permissions={[ ADMIN, COUNTRY_MANAGER, SUPER_MANAGER ]}>
                            <CampaignsList {...props} />
                        </Page403>
                    ),
                    onEnter(nextState) {
                        store.dispatch(
                            receiveCampaignsPage(
                                toInt(nextState.params.page).getOrElse(1)
                            )
                        );
                    }
                },
                {
                    path: 'reports',
                    component: Reports,
                    onEnter: reportHook,
                    onChange(prevState, nextState) {
                        reportHook(nextState);
                    }
                },
                {
                    path: 'channels(/:page)',
                    component: Partners,
                    onEnter(nextState) {
                        store.dispatch(
                            receiveChannelsPage(
                                toInt(nextState.params.page).getOrElse(1)
                            )
                        );
                    }
                },
                {
                    path: 'reports(/:page)',
                    component: Reports
                },
                {
                    path: 'reports/campaign/:id',
                    component: CampaignDetails,
                    onEnter: campaignDetailsHook,
                    onChange(_, nextState) {
                        campaignDetailsHook(nextState);
                    },
                    onLeave: compose(store.dispatch, resetCampaignReset)
                },
                {
                    path: 'channel(/:id)',
                    component: props => (
                        <Page403 permissions={[ ADMIN, COUNTRY_EDITOR, SUPER_EDITOR ]}>
                            <Channel {...props} />
                        </Page403>
                    ),
                    onEnter(nextState) {
                        store.dispatch(
                            showChannel(
                                Maybe.fromNullable(nextState.params.id).map(makeChannelBunch)
                            )
                        );
                    }
                },
                {
                    path: 'story(/:id)',
                    component: props => (
                        <Page403 permissions={[ ADMIN, COUNTRY_EDITOR, SUPER_EDITOR ]}>
                            <Story {...props} />
                        </Page403>
                    ),
                    onEnter({ location, params }) {
                        let { publishDate } = location.query;
                        if (!moment(publishDate, 'YYYY-MM-DD').isValid()) {
                            publishDate = null;
                        }
                        store.dispatch(
                            showStory(
                                Maybe.fromNullable(params.id).map(makeStoryBunch),
                                {
                                    publishDate: [
                                        Maybe.fromNullable(location.query.publishDate),
                                        Nothing()
                                    ]
                                }
                            )
                        );
                    }
                },
                {
                    path: 'content',
                    component: ''
                },
                {
                    path: 'settings',
                    component: ''
                }
            ]
        }
    ]
};

const DevTools = __PRODUCTION__ ? () => null : require('containers/DevTools').default;
const history = syncHistoryWithStore(browserHistory, store, {
    // selectLocationState: () => state => (state.routing)

});
store.dispatch(
    receiveCountries()
);

store.dispatch(auth())
    .then(() => {
        render(
            (
                <Provider store={store}>
                    <div>
                        <Router
                            render={
                                applyRouterMiddleware(useScroll())
                            }
                            history={history}
                            routes={routes} />
                        <NotificationContainer />
                        <DevTools />
                    </div>
                </Provider>
            ),
            document.getElementById('mount')
        );
    });
