import React, { Component, PropTypes } from 'react';
import {
    withRouter
} from 'react-router';
import {
    routerShape
} from 'react-router/lib/PropTypes';
import {
    connect
} from 'react-redux';
import {
    Nothing,
    Just
} from 'data.maybe';
import {
    ceil,
    divide,
    compose,
    map,
    __
} from 'lodash/fp';

import appConfig from 'config/app';
import {
    denormalize,
    formatDate
} from 'utils';
import {
    STATE_ACTIVE as CAMPAIGN_STATE_ACTIVE,
    STATE_COMPLETED as CAMPAIGN_STATE_COMPLETED,
    STATE_STARTED as CAMPAIGN_STATE_STARTED
} from 'models/campaign';
import CampaignsList from 'components/CampaignsList';


class CampaignsListContainer extends Component {
    changePageHandler(page) {
        const baseUrl = '/campaigns-list';
        const url = page > 1 ? `${baseUrl}/${page}` : baseUrl;

        this.props.router.push(url);
    }

    render() {
        return (
            <CampaignsList
                {...this.props.campaignsList}
                changePageHandler={this.changePageHandler.bind(this)}
            />
        );
    }
}

CampaignsListContainer.propTypes = {
    router: routerShape.isRequired,

    campaignsList: PropTypes.object.isRequired
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

function select({ ui, data }) {
    return {
        campaignsList: {
            current: ui.campaignsList.current,
            campaigns: ui.campaignsList.results.map(
                compose(
                    map(campaignEntity => ({
                        ...campaignEntity,
                        startDate: formatDate(campaignEntity.startDate),
                        endDate: campaignEntity.endDate.map(formatDate),
                        state: stateToString(campaignEntity.state)
                    })),
                    denormalize(Nothing(), data)
                )
            ),
            pageCount: ui.campaignsList.total.map(
                compose(
                    ceil,
                    divide(__, appConfig.pageSize)
                )
            ).chain(total => total < 2 ? Nothing() : Just(total))
        }
    };
}

const bindActions = {};


export default compose(
    connect(select, bindActions),
    withRouter
)(CampaignsListContainer);
