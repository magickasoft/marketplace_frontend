import {
    identity,
    curry,
    eq,
    isEqual,
    property
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';
import moment from 'moment';
import {
    batchActions
} from 'redux-batched-actions';

import {
    denormalize
} from 'utils';
import {
    getBunchID
} from 'utils/bunch';
import {
    merge
} from 'actions/data';
import {
    METRIC_PUSH_SENT as ANALYTIC_METRIC_PUSH_SENT,
    METRIC_PUSH_OPENED as ANALYTIC_METRIC_PUSH_OPENED,
    METRIC_OFFER_VIEW as ANALYTIC_METRIC_OFFER_VIEW,
    METRIC_OFFER_URL_CLICK as ANALYTIC_METRIC_OFFER_URL_CLICK,
    METRIC_UNIQUE_OFFER_VIEW as ANALYTIC_METRIC_UNIQUE_OFFER_VIEW,
    METRIC_UNIQUE_OFFER_URL_CLICK as ANALYTIC_METRIC_UNIQUE_OFFER_URL_CLICK,
    METRIC_OFFER_ACTIVATE as ANALYTIC_METRIC_OFFER_ACTIVATE,
    METRIC_PUSH_DELIVERED as ANALYTIC_METRIC_PUSH_DELIVERED
} from 'models/analytic';
import {
    receiveCampaign as receiveCampaignRequest,
    receiveOffer as receiveOfferRequest
} from 'services/campaign-manager';
import {
    getById as getAnalyticSummaryById
} from 'services/analytics/summary';
import {
    getById as getAnalyticChartById
} from 'services/analytics/chart';


export const RESET = 'UI/CAMPAIGN_REPORT/RESET';

export function reset() {
    return {
        type: RESET
    };
}

export const RECEIVE_CAMPAIGN_START = 'UI/CAMPAIGN_REPORT/RECEIVE_CAMPAIGN_START';

export function receiveCampaignStart(bunch) {
    return {
        type: RECEIVE_CAMPAIGN_START,
        payload: bunch
    };
}

export const RECEIVE_CAMPAIGN_FAILURE = 'UI/CAMPAIGN_REPORT/RECEIVE_CAMPAIGN_FAILURE';

export function receiveCampaignFailure(errors) {
    return {
        type: RECEIVE_CAMPAIGN_FAILURE,
        payload: errors
    };
}

export const RECEIVE_CAMPAIGN_SUCCESS = 'UI/CAMPAIGN_REPORT/RECEIVE_CAMPAIGN_SUCCESS';

export function receiveCampaignSuccess() {
    return {
        type: RECEIVE_CAMPAIGN_SUCCESS
    };
}

export function receiveCampaign(bunch) {
    return (dispatch, getState) => {
        const { ui } = getState();

        if (ui.campaignReport.campaign.busy) {
            return Promise.resolve();
        }

        dispatch(
            receiveCampaignStart(bunch)
        );

        return receiveCampaignRequest(getBunchID(bunch))
            .then(
                ({ entities }) => {
                    dispatch(
                        batchActions([
                            receiveCampaignSuccess(),
                            merge(entities)
                        ])
                    );

                    return denormalize(
                        Just({ offerInfo: Nothing() }),
                        entities,
                        bunch
                    )
                    .chain(property('offerInfo'))
                    .chain(property('offer'))
                    .map(
                        offerBunch => receiveOfferRequest(getBunchID(offerBunch))
                            .then(({ entities: nestedEntities }) => {
                                dispatch(
                                    merge(nestedEntities)
                                );
                            })
                    )
                    .getOrElse(Promise.resolve());
                }
            )
            .catch(errors => {
                dispatch(
                    receiveCampaignFailure(errors)
                );
            });
    };
}

export const RECEIVE_SUMMARY_START = 'UI/CAMPAIGN_REPORT/RECEIVE_SUMMARY_START';

export function receiveSummaryStart(bunch) {
    return {
        type: RECEIVE_SUMMARY_START,
        payload: bunch
    };
}

export const RECEIVE_SUMMARY_FAILURE = 'UI/CAMPAIGN_REPORT/RECEIVE_SUMMARY_FAILURE';

export function receiveSummaryFailure(errors) {
    return {
        type: RECEIVE_SUMMARY_FAILURE,
        payload: errors
    };
}

export const RECEIVE_SUMMARY_SUCCESS = 'UI/CAMPAIGN_REPORT/RECEIVE_SUMMARY_SUCCESS';

export function receiveSummarySuccess(results) {
    return {
        type: RECEIVE_SUMMARY_SUCCESS,
        payload: results
    };
}

export const receiveSummary = bunch => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.campaignReport.summary.busy) {
        return Promise.resolve();
    }

    dispatch(
        receiveSummaryStart(bunch)
    );

    return getAnalyticSummaryById([
        ANALYTIC_METRIC_PUSH_SENT,
        ANALYTIC_METRIC_PUSH_OPENED,
        ANALYTIC_METRIC_OFFER_VIEW,
        ANALYTIC_METRIC_OFFER_URL_CLICK,
        ANALYTIC_METRIC_UNIQUE_OFFER_VIEW,
        ANALYTIC_METRIC_UNIQUE_OFFER_URL_CLICK,
        ANALYTIC_METRIC_OFFER_ACTIVATE,
        ANALYTIC_METRIC_PUSH_DELIVERED
    ], getBunchID(bunch))
        .then(results => {
            dispatch(
                receiveSummarySuccess(results)
            );
        })
        .catch(errors => {
            dispatch(
                receiveSummaryFailure(errors)
            );
        });
};

export const RECEIVE_CHART_START = 'UI/CAMPAIGN_REPORT/RECEIVE_CHART_START';

export function receiveChartStart(discretization, interval, bunch) {
    return {
        type: RECEIVE_CHART_START,
        payload: { discretization, interval, bunch }
    };
}

export const RECEIVE_CHART_FAILURE = 'UI/CAMPAIGN_REPORT/RECEIVE_CHART_FAILURE';

export function receiveChartFailure(errors) {
    return {
        type: RECEIVE_CHART_FAILURE,
        payload: errors
    };
}

export const RECEIVE_CHART_SUCCESS = 'UI/CAMPAIGN_REPORT/RECEIVE_CHART_SUCCESS';

export function receiveChartSuccess(results) {
    return {
        type: RECEIVE_CHART_SUCCESS,
        payload: results
    };
}

export const passDefaultsToIntervals = curry(
    (discretization, [ mStart, mEnd ]) => {
        const monentNow = moment();
        const mMomentStart = mStart.map(moment);

        const momentEnd = mEnd.map(moment).orElse(
            () => mMomentStart.map(momentStart => moment.max([
                monentNow,
                momentStart.clone().add(1, 'month')
            ]))
        ).getOrElse(monentNow);

        return [
            mMomentStart.cata({
                Nothing: () => momentEnd.clone().subtract(1, 'month'),
                Just: identity
            }).toISOString(),
            momentEnd.toISOString()
        ];
    }
);

export const receiveChart = curry(
    (discretization, interval, bunch) => (dispatch, getState) => {
        const { ui } = getState();

        if (ui.campaignReport.chart.busy) {
            return Promise.resolve();
        }

        dispatch(
            receiveChartStart(discretization, interval, bunch)
        );

        return getAnalyticChartById(
            [
                ANALYTIC_METRIC_PUSH_SENT,
                ANALYTIC_METRIC_PUSH_OPENED,
                ANALYTIC_METRIC_OFFER_VIEW,
                ANALYTIC_METRIC_OFFER_URL_CLICK,
                ANALYTIC_METRIC_OFFER_ACTIVATE
            ],
            discretization,
            interval,
            getBunchID(bunch)
        )
            .then(results => {
                dispatch(
                    receiveChartSuccess(results)
                );
            })
            .catch(errors => {
                dispatch(
                    receiveChartFailure(errors)
                );
            });
    }
);

export function isDifferentIntervals([ mPrevStart, mPrevEnd ], [ nextStart, nextEnd ]) {
    return !mPrevStart.map(eq(nextStart)).getOrElse(false) ||
        !mPrevEnd.map(eq(nextEnd)).getOrElse(false);
}

export const receiveCampaignWithChartAndSummary = curry(
    (discretization, interval, bunch) => (dispatch, getState) => {
        const { ui } = getState();

        const discretizationWasChanged = !ui.campaignReport.discretization.map(
            isEqual(discretization)
        ).getOrElse(false);
        const intervalWasChanged = isDifferentIntervals(ui.campaignReport.interval, interval);
        const bunchWasChanged = !ui.campaignReport.bunch.map(
            isEqual(bunch)
        ).getOrElse(false);

        const needToCampaignReceive = bunchWasChanged;
        const needToSummaryReceive = bunchWasChanged;
        const needToChartReceive = intervalWasChanged || discretizationWasChanged || bunchWasChanged;

        return Promise.all([
            needToCampaignReceive ? dispatch(receiveCampaign(bunch)) : Promise.resolve(),
            needToSummaryReceive ? dispatch(receiveSummary(bunch)) : Promise.resolve(),
            needToChartReceive ? dispatch(receiveChart(discretization, interval, bunch)) : Promise.resolve()
        ]);
    }
);
