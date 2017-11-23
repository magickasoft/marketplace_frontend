import {
    curry,
    eq
} from 'lodash/fp';

import {
    METRIC_PUSH_SENT as ANALYTIC_METRIC_PUSH_SENT,
    METRIC_PUSH_OPENED as ANALYTIC_METRIC_PUSH_OPENED,
    METRIC_OFFER_VIEW as ANALYTIC_METRIC_OFFER_VIEW,
    METRIC_OFFER_URL_CLICK as ANALYTIC_METRIC_OFFER_URL_CLICK,
    METRIC_OFFER_ACTIVATE as ANALYTIC_METRIC_OFFER_ACTIVATE
} from 'models/analytic';
import {
    getGeneral as getChartRequest
} from 'services/analytics/chart';
import {
    getGeneral as getSummaryRequest
} from 'services/analytics/summary';

export const RECEIVE_CHART_START = 'UI/REPORT/RECEIVE_CHART_START';

export function receiveChartStart(interval, discretization) {
    return {
        type: RECEIVE_CHART_START,
        payload: { interval, discretization }
    };
}

export const RECEIVE_CHART_SUCCESS = 'UI/REPORT/RECEIVE_CHART_SUCCESS';

export function receiveChartSuccess(results) {
    return {
        type: RECEIVE_CHART_SUCCESS,
        payload: results
    };
}

export const RECEIVE_CHART_FAILURE = 'UI/REPORT/RECEIVE_CHART_FAILURE';

export function receiveChartFailure(errors) {
    return {
        type: RECEIVE_CHART_FAILURE,
        payload: errors
    };
}

export const RECEIVE_TABLE_START = 'UI/REPORT/RECEIVE_TABLE_START';

export function receiveTableStart(interval, page, sort) {
    return {
        type: RECEIVE_TABLE_START,
        payload: { interval, page, sort }
    };
}

export const RECEIVE_TABLE_SUCCESS = 'UI/REPORT/RECEIVE_TABLE_SUCCESS';

export function receiveTableSuccess(results) {
    return {
        type: RECEIVE_TABLE_SUCCESS,
        payload: results
    };
}

export const RECEIVE_TABLE_FAILURE = 'UI/REPORT/RECEIVE_TABLE_FAILURE';

export function receiveTableFailure(errors) {
    return {
        type: RECEIVE_TABLE_FAILURE,
        payload: errors
    };
}

export const receiveChart = (interval, discretization) => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.report.chart.busy) {
        return Promise.resolve();
    }

    dispatch(
        receiveChartStart(interval, discretization)
    );

    return getChartRequest(
        [
            ANALYTIC_METRIC_PUSH_SENT,
            ANALYTIC_METRIC_PUSH_OPENED,
            ANALYTIC_METRIC_OFFER_VIEW,
            ANALYTIC_METRIC_OFFER_URL_CLICK,
            ANALYTIC_METRIC_OFFER_ACTIVATE
        ],
        interval,
        discretization
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
};

export const receiveTable = (interval, page, sort) => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.report.table.busy) {
        return Promise.resolve();
    }

    dispatch(
        receiveTableStart(interval, page, sort)
    );

    return getSummaryRequest(
        [
            ANALYTIC_METRIC_PUSH_SENT,
            ANALYTIC_METRIC_PUSH_OPENED,
            ANALYTIC_METRIC_OFFER_VIEW,
            ANALYTIC_METRIC_OFFER_URL_CLICK,
            ANALYTIC_METRIC_OFFER_ACTIVATE
        ],
        interval,
        page,
        sort
    )
        .then(results => {
            dispatch(
                receiveTableSuccess(results)
            );
        })
        .catch(errors => {
            dispatch(
                receiveTableFailure(errors)
            );
        });
};

export const isDifferentTuples2 = curry(
    ([ mPrevFirst, mPrevSecond ], [ nextFirst, nextSecond ]) =>
        !mPrevFirst.map(eq(nextFirst)).getOrElse(false) ||
            !mPrevSecond.map(eq(nextSecond)).getOrElse(false)
);

export const receiveTableAndChart = curry(
    (interval, page, sort, discretization) => (dispatch, getState) => {
        const { ui } = getState();

        const intervalWasChanged = isDifferentTuples2(ui.report.interval, interval);
        const pageWasChanged = !ui.report.page.map(eq(page)).getOrElse(false);
        const orderingWasChanged = isDifferentTuples2(ui.report.sort, sort);
        const discretizationWasChanged = !ui.report.discretization.map(eq(discretization)).getOrElse(false);

        const needToChartUpdate = intervalWasChanged || discretizationWasChanged;
        const needToTableUpdate = intervalWasChanged || pageWasChanged || orderingWasChanged;

        return Promise.all([
            needToChartUpdate ? dispatch(receiveChart(interval, discretization)) : Promise.resolve(),
            needToTableUpdate ? dispatch(receiveTable(interval, page, sort)) : Promise.resolve()
        ]);
    }
);
