import React, { Component, PropTypes } from 'react';
import {
    connect
} from 'react-redux';
import {
    routerShape,
    locationShape
} from 'react-router/lib/PropTypes';
import {
    compose,
    eq,
    method,
    join,
    map,
    reduce,
    divide,
    ceil,
    __
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import PropTypes_ from 'utils/prop-types';
import appConfig from 'config/app';
import {
    filterMap,
    maybeFromString
} from 'utils';
import {
    METRIC_PUSH_SENT as ANALYTIC_METRIC_PUSH_SENT,
    METRIC_PUSH_OPENED as ANALYTIC_METRIC_PUSH_OPENED,
    METRIC_OFFER_VIEW as ANALYTIC_METRIC_OFFER_VIEW,
    METRIC_OFFER_URL_CLICK as ANALYTIC_METRIC_OFFER_URL_CLICK,
    METRIC_OFFER_ACTIVATE as ANALYTIC_METRIC_OFFER_ACTIVATE,
    DISCRETIZATION_HOUR as ANALYTIC_DISCRETIZATION_HOUR,
    DISCRETIZATION_DAY as ANALYTIC_DISCRETIZATION_DAY,
    DISCRETIZATION_WEEK as ANALYTIC_DISCRETIZATION_WEEK,
    DISCRETIZATION_MONTH as ANALYTIC_DISCRETIZATION_MONTH
} from 'models/analytic';
import {
    ORDER_ASC as QUERY_ORDER_ASC,
    ORDER_DESC as QUERY_ORDER_DESC,

    FIELD_NAME as QUERY_FIELD_NAME
} from 'services/queries';
import {
    receiveChart,
    receiveTable
} from 'actions/ui/report';
import Reports from 'components/Reports';

const methodGet = method('get');

class ReportsContainer extends Component {
    changeQuery(mStart, mEnd, mPage, mSort, mDiscretization) {
        const { router, location, report } = this.props;
        const [ start, end ] = report.interval.map(methodGet);

        router.push({
            pathname: this.props.location.pathname,
            query: {
                i: join('|', [ mStart.getOrElse(start), mEnd.getOrElse(end) ]),
                p: mPage.getOrElse(location.query.p),
                s: mSort.map(([ ordering, field ]) => `${ordering}|${field}`).getOrElse(location.query.s),
                d: mDiscretization.getOrElse(location.query.d)
            }
        });
    }

    changeIntervalStart(start) {
        this.changeQuery(maybeFromString(start), Nothing(), Nothing(), Nothing(), Nothing());
    }

    changeIntervalEnd(end) {
        this.changeQuery(Nothing(), maybeFromString(end), Nothing(), Nothing(), Nothing());
    }

    changePage(page) {
        this.changeQuery(Nothing(), Nothing(), Just(page), Nothing(), Nothing());
    }

    changeDiscretization(discretization) {
        this.changeQuery(Nothing(), Nothing(), Nothing(), Nothing(), Just(discretization));
    }

    makeReceiveChartAgain() {
        const [ mStart, mEnd ] = this.props.report.interval;

        return mStart.map(
            start => end => discretization =>
                () => this.props.receiveChart([ start, end ], discretization)
        ).ap(mEnd).ap(this.props.report.discretization);
    }

    makeReceiveTableAgain() {
        const [ mStart, mEnd ] = this.props.report.interval;
        const [ mOrdering, mField ] = this.props.report.sort;

        return mStart.map(
            start => end => page => order => field =>
                () => this.props.receiveTable([ start, end ], page, [ order, field ])
        ).ap(mEnd).ap(this.props.report.page).ap(mOrdering).ap(mField);
    }

    changeSort([ mOrdering, mField ]) {
        return (ordering, field) =>
            mOrdering.map(eq(ordering)).getOrElse(false) &&
            mField.map(eq(field)).getOrElse(false) ?
                Nothing() :
                Just(
                    () => this.changeQuery(Nothing(), Nothing(), Nothing(), Just([ ordering, field ]), Nothing())
                );
    }

    render() {
        const bindChangeSort = this.changeSort(this.props.report.sort);

        return (
            <Reports
                {...this.props.report}
                changeIntervalStartHandler={this.changeIntervalStart.bind(this)}
                changeIntervalEndHandler={this.changeIntervalEnd.bind(this)}
                changePageHandler={this.changePage.bind(this)}
                changeSortHandler={this.changeSort.bind(this)}
                changeDiscretizationHandler={this.changeDiscretization.bind(this)}
                receiveChartAgainHandler={this.makeReceiveChartAgain()}
                receiveTableAgainHandler={this.makeReceiveTableAgain()}
                sortByNameDescHandler={bindChangeSort(QUERY_ORDER_DESC, QUERY_FIELD_NAME)}
                sortByNameAscHandler={bindChangeSort(QUERY_ORDER_ASC, QUERY_FIELD_NAME)}
            />
        );
    }
}

const mNumber = PropTypes_.Maybe(
    PropTypes.number.isRequired
);

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

ReportsContainer.propTypes = {
    router: routerShape.isRequired,
    location: locationShape.isRequired,
    report: PropTypes.shape({
        interval: PropTypes_.Tuple([
            mString.isRequired,
            mString.isRequired
        ]).isRequired,
        discretization: mString.isRequired,
        sort: PropTypes_.Tuple([
            mString.isRequired,
            mString.isRequired
        ]).isRequired,
        page: mNumber
    }).isRequired,

    receiveChart: PropTypes.func.isRequired,
    receiveTable: PropTypes.func.isRequired
};

const metrickToMString = metric => {
    switch (metric) {
        case ANALYTIC_METRIC_PUSH_SENT: {
            return Just('Push Sent');
        }

        case ANALYTIC_METRIC_PUSH_OPENED: {
            return Just('Push Opens');
        }

        case ANALYTIC_METRIC_OFFER_VIEW: {
            return Just('Offer Views');
        }

        case ANALYTIC_METRIC_OFFER_URL_CLICK: {
            return Just('Offer URL Clicks');
        }

        case ANALYTIC_METRIC_OFFER_ACTIVATE: {
            return Just('Offer Activates');
        }

        default: {
            return Nothing();
        }
    }
};

const metrickToMKey = metric => {
    switch (metric) {
        case ANALYTIC_METRIC_PUSH_SENT: {
            return Just('pushSent');
        }

        case ANALYTIC_METRIC_PUSH_OPENED: {
            return Just('pushOpened');
        }

        case ANALYTIC_METRIC_OFFER_VIEW: {
            return Just('offerView');
        }

        case ANALYTIC_METRIC_OFFER_URL_CLICK: {
            return Just('offerUrlClick');
        }

        case ANALYTIC_METRIC_OFFER_ACTIVATE: {
            return Just('offerActivate');
        }

        default: {
            return Nothing();
        }
    }
};

const discretizationToString = discretization => {
    switch (discretization) {
        case ANALYTIC_DISCRETIZATION_HOUR: {
            return Just('Hour');
        }

        case ANALYTIC_DISCRETIZATION_DAY: {
            return Just('Day');
        }

        case ANALYTIC_DISCRETIZATION_WEEK: {
            return Just('Week');
        }

        case ANALYTIC_DISCRETIZATION_MONTH: {
            return Just('Month');
        }

        default: {
            return Nothing();
        }
    }
};

const selectDiscretizations = current => filterMap(
    value => discretizationToString(value).map(title => ({
        value,
        title,
        active: current.map(eq(value)).getOrElse(false)
    })),
    [
        ANALYTIC_DISCRETIZATION_HOUR,
        ANALYTIC_DISCRETIZATION_DAY,
        ANALYTIC_DISCRETIZATION_WEEK,
        ANALYTIC_DISCRETIZATION_MONTH
    ]
);

const selectTable = map(({ campaign, metrics }) => ({
    campaign,
    metrics: reduce(
        (acc, [ metric, value ]) => metrickToMKey(metric).map(
            key => ({
                ...acc,
                [ key ]: value
            })
        ).getOrElse(acc),
        {},
        metrics
    )
}));

function select({ ui }) {
    return {
        report: {
            ...ui.report,
            discretizations: selectDiscretizations(ui.report.discretization),
            chart: {
                ...ui.report.chart,
                results: ui.report.chart.results.map(results => ({
                    title: {
                        text: ''
                    },
                    plotOptions: {
                        series: {
                            animation: false
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            day: '%b %e',
                            week: '%b %e',
                            millisecond: '%H:%M:%S',
                            month: '%b %e',
                            year: '%b'
                        },
                        title: 'Date'
                    },
                    yAxis: {
                        title: null
                    },
                    legend: {
                        enabled: true,
                        align: 'right',
                        layout: 'vertical',
                        verticalAlign: 'top',
                        y: 100
                    },
                    series: filterMap(
                        ([ metric, data ]) => metrickToMString(metric)
                            .map(name => ({ name, data })),
                        results
                    )
                }))
            },

            table: {
                ...ui.report.table,
                results: ui.report.table.results.map(selectTable)
            },

            pageCount: ui.report.table.total.map(
                compose(
                    ceil,
                    divide(__, appConfig.pageSize)
                )
            ).chain(total => total < 2 ? Nothing() : Just(total))
        }
    };
}

const bindActions = {
    receiveChart,
    receiveTable
};

export default connect(select, bindActions)(ReportsContainer);
