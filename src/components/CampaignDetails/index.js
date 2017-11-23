import React, { PropTypes } from 'react';
import {
    Grid,
    PageHeader
} from 'react-bootstrap';

import PropTypes_ from 'utils/prop-types';
import PanelCampaign from './PanelCampaign';
import PanelSummary from './PanelSummary';
import PanelChart from './PanelChart';


function CampaignDetails(props) {
    return (
        <Grid fluid>
            <PageHeader>
                Campaign&nbsp;Report&nbsp;
                {props.campaign.result.map(result => (
                    <small>{result.name}</small>
                )).getOrElse(null)}
            </PageHeader>

            <PanelCampaign {...props.campaign} />

            <PanelSummary {...props.summary} />

            <PanelChart
                {...props.chart}
                onChangeDiscretization={props.changeDiscretizationHandler}
                onChangeIntervalStart={props.changeIntervalStartHandler}
                onChangeIntervalEnd={props.changeIntervalEndHandler}
            />
        </Grid>
    );
}

CampaignDetails.propTypes = {
    bunch: PropTypes_.Maybe(
        PropTypes_.bunch.isRequired
    ).isRequired,
    campaign: PropTypes.object.isRequired,
    summary: PropTypes.object.isRequired,
    chart: PropTypes.object.isRequired,

    changeDiscretizationHandler: PropTypes.func.isRequired,
    changeIntervalStartHandler: PropTypes.func.isRequired,
    changeIntervalEndHandler: PropTypes.func.isRequired
};

export default CampaignDetails;
