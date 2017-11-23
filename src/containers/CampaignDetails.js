import React, { Component, PropTypes } from 'react';
import {
    connect
} from 'react-redux';
import {
    withRouter
} from 'react-router';
import {
    routerShape,
    locationShape
} from 'react-router/lib/PropTypes';
import {
    compose,
    split,
    join,
    eq,
    curry,
    reduce,
    toPairs,
    map,
    floor
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import PropTypes_ from 'utils/prop-types';
import {
    receiveCampaign,
    receiveSummary,
    receiveChart
} from 'actions/ui/campaign-report';
import {
    get,
    denormalize,
    formatDate,
    filterMap,
    maybeFromString
} from 'utils';
import {
    SIZE_SMALL as IMAGE_SIZE_SMALL
} from 'models/images';
import {
    STATE_ACTIVE as CAMPAIGN_STATE_ACTIVE,
    STATE_COMPLETED as CAMPAIGN_STATE_COMPLETED,
    STATE_STARTED as CAMPAIGN_STATE_STARTED
} from 'models/campaign';
import {
    METRIC_PUSH_SENT as ANALYTIC_METRIC_PUSH_SENT,
    METRIC_PUSH_OPENED as ANALYTIC_METRIC_PUSH_OPENED,
    METRIC_OFFER_VIEW as ANALYTIC_METRIC_OFFER_VIEW,
    METRIC_OFFER_URL_CLICK as ANALYTIC_METRIC_OFFER_URL_CLICK,
    METRIC_UNIQUE_OFFER_VIEW as ANALYTIC_METRIC_UNIQUE_OFFER_VIEW,
    METRIC_UNIQUE_OFFER_URL_CLICK as ANALYTIC_METRIC_UNIQUE_OFFER_URL_CLICK,
    METRIC_OFFER_ACTIVATE as ANALYTIC_METRIC_OFFER_ACTIVATE,
    METRIC_PUSH_DELIVERED as ANALYTIC_METRIC_PUSH_DELIVERED,
    DISCRETIZATION_HOUR as ANALYTIC_DISCRETIZATION_HOUR,
    DISCRETIZATION_DAY as ANALYTIC_DISCRETIZATION_DAY,
    DISCRETIZATION_WEEK as ANALYTIC_DISCRETIZATION_WEEK,
    DISCRETIZATION_MONTH as ANALYTIC_DISCRETIZATION_MONTH,
    RATE_PUSH_DELIVERY,
    RATE_PUSH_OPEN,
    RATE_OFFER_ACTIVATE,
    RATE_OFFER_URL_CLICK
} from 'models/analytic';
import CampaignDetails from 'components/CampaignDetails';


class CampaignDetailsContainer extends Component {
    changeQuery(mDiscretization, [ mStart, mEnd ]) {
        const { router, location } = this.props;
        const [ start, end ] = split('|', location.query.i);

        router.push({
            pathname: this.props.location.pathname,
            query: {
                i: join('|', [ mStart.getOrElse(start), mEnd.getOrElse(end) ]),
                d: mDiscretization.getOrElse(location.query.d)
            }
        });
    }

    changeDiscretization(discretization) {
        this.changeQuery(Just(discretization), this.props.campaignReport.interval);
    }

    changeIntervalStart(start) {
        const [ , mEnd ] = this.props.campaignReport.interval;

        this.changeQuery(Nothing(), [ maybeFromString(start), mEnd ]);
    }

    changeIntervalEnd(end) {
        const [ mStart ] = this.props.campaignReport.interval;

        this.changeQuery(Nothing(), [ mStart, maybeFromString(end) ]);
    }

    render() {
        return (
            <CampaignDetails
                {...this.props.campaignReport}
                changeDiscretizationHandler={this.changeDiscretization.bind(this)}
                changeIntervalStartHandler={this.changeIntervalStart.bind(this)}
                changeIntervalEndHandler={this.changeIntervalEnd.bind(this)}
            />
        );
    }
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

CampaignDetailsContainer.propTypes = {
    campaignReport: PropTypes.shape({
        interval: PropTypes_.Tuple([
            mString.isRequired,
            mString.isRequired
        ]).isRequired,
        discretization: mString.isRequired
    }).isRequired,
    router: routerShape.isRequired,
    location: locationShape.isRequired
};

function stateToString(state) {
    switch (state) {
        case CAMPAIGN_STATE_ACTIVE: {
            return 'Active';
        }

        case CAMPAIGN_STATE_COMPLETED: {
            return 'Completed';
        }

        case CAMPAIGN_STATE_STARTED: {
            return 'Starting';
        }

        default: {
            return 'Draft';
        }
    }
}

function metrickToMString(metric) {
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

        case ANALYTIC_METRIC_UNIQUE_OFFER_VIEW: {
            return Just('Unique Offer Views');
        }

        case ANALYTIC_METRIC_UNIQUE_OFFER_URL_CLICK: {
            return Just('Unique Offer URL Clicks');
        }

        case ANALYTIC_METRIC_OFFER_ACTIVATE: {
            return Just('Offer Activates');
        }

        case ANALYTIC_METRIC_PUSH_DELIVERED: {
            return Just('Push Deliveries');
        }

        default: {
            return Nothing();
        }
    }
}

function discretizationToString(discretization) {
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
}

function rateToString(rate) {
    switch (rate) {
        case RATE_PUSH_DELIVERY: {
            return 'Push delivery rate';
        }

        case RATE_PUSH_OPEN: {
            return 'Push open rate';
        }

        case RATE_OFFER_ACTIVATE: {
            return 'Offer activate rate';
        }

        case RATE_OFFER_URL_CLICK: {
            return 'Offer URL click rate';
        }

        default: {
            return '';
        }
    }
}

function selectDiscretizations(current) {
    return filterMap(
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
}

const selectSummary = filterMap(
    ([ type, value ]) => metrickToMString(type).map(title => ({ title, type, value }))
);

const transformSummary = reduce(
    (acc, { type, ...props }) => ({ ...acc, [ type ]: props }),
    {}
);

const calculateRate = curry(
    (totals, metric1, metric2) => {
        const divisor = totals[metric2].value;
        return divisor ? `${floor(totals[metric1].value / divisor * 100)}%` : '-';
    }
);

const getRateString = (totals, rate) => {
    const calculateRate_ = calculateRate(totals);
    switch (rate) {
        case RATE_PUSH_DELIVERY: {
            return calculateRate_(
                ANALYTIC_METRIC_PUSH_DELIVERED,
                ANALYTIC_METRIC_PUSH_SENT
            );
        }

        case RATE_PUSH_OPEN: {
            return calculateRate_(
                ANALYTIC_METRIC_PUSH_OPENED,
                ANALYTIC_METRIC_PUSH_SENT
            );
        }

        case RATE_OFFER_ACTIVATE: {
            return calculateRate_(
                ANALYTIC_METRIC_OFFER_ACTIVATE,
                ANALYTIC_METRIC_UNIQUE_OFFER_VIEW
            );
        }

        case RATE_OFFER_URL_CLICK: {
            return calculateRate_(
                ANALYTIC_METRIC_OFFER_URL_CLICK,
                ANALYTIC_METRIC_UNIQUE_OFFER_VIEW
            );
        }

        default: {
            return '-';
        }
    }
};

const createRateTuple = curry(
    (totals, rate) => ([
        rate,
        {
            title: rateToString(rate),
            value: getRateString(totals, rate)
        }
    ])
);

const calculateRates = totals => map(
    createRateTuple(totals),
    [
        RATE_PUSH_DELIVERY,
        RATE_PUSH_OPEN,
        RATE_OFFER_ACTIVATE,
        RATE_OFFER_URL_CLICK
    ]
);

const createSummaryResults = totals => ({
    totals: toPairs(totals),
    rates: calculateRates(totals)
});

function select({ ui, data }) {
    return {
        campaignReport: {
            ...ui.campaignReport,
            campaign: {
                ...ui.campaignReport.campaign,
                result: ui.campaignReport.bunch.chain(
                    denormalize(Just({
                        offerInfo: Just({
                            offer: Nothing()
                        })
                    }), data)
                ).map(result => ({
                    ...result,
                    startDate: formatDate(result.startDate),
                    endDate: result.endDate.map(formatDate),
                    state: stateToString(result.state),
                    offerInfo: result.offerInfo.map(offerInfo => ({
                        ...offerInfo,
                        offer: offerInfo.offer.map(offer => ({
                            ...offer,
                            image: get(IMAGE_SIZE_SMALL, offer.images)
                        }))
                    }))
                }))
            },
            summary: {
                ...ui.campaignReport.summary,
                results: ui.campaignReport.summary.results.map(
                    compose(
                        createSummaryResults,
                        transformSummary,
                        selectSummary
                    )
                )
            },
            chart: {
                ...ui.campaignReport.chart,
                discretizations: selectDiscretizations(ui.campaignReport.discretization),
                results: ui.campaignReport.chart.results.map(results => ({
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
                        ([ metric, series ]) => metrickToMString(metric)
                            .map(name => ({ name, data: series })),
                        results
                    )
                }))
            }
        }
    };
}

const bindActions = {
    receiveCampaign,
    receiveSummary,
    receiveChart
};

function mergeProps({ campaignReport }, actions, props) {
    const [ mStart, mEnd ] = campaignReport.interval;

    return {
        ...props,
        campaignReport: {
            ...campaignReport,
            campaign: {
                ...campaignReport.campaign,
                tryAgainReceiveHandler: campaignReport.bunch.map(
                    bunch => () => actions.receiveCampaign(bunch),
                )
            },
            summary: {
                ...campaignReport.summary,
                tryAgainReceiveHandler: campaignReport.bunch.map(
                    bunch => () => actions.receiveSummary(bunch)
                )
            },
            chart: {
                ...campaignReport.chart,
                interval: campaignReport.interval,
                discretization: campaignReport.discretization,
                tryAgainReceiveHandler: campaignReport.discretization.map(
                    discretization => start => end => bunch => () => actions.receiveChart(
                        discretization,
                        [ start, end ],
                        bunch
                    )
                ).ap(mStart).ap(mEnd).ap(campaignReport.bunch)
            }
        }
    };
}

export default compose(
    connect(select, bindActions, mergeProps),
    withRouter
)(CampaignDetailsContainer);
