import React, { PropTypes } from 'react';
import {
    LinkContainer
} from 'react-router-bootstrap';
import {
    Grid,
    Row,
    Col,
    Panel,
    Table,
    ProgressBar,
    Pagination,
    Button
} from 'react-bootstrap';
import {
    map
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import {
    getBunchID
} from 'utils/bunch';


const cellStyles = {
    verticalAlign: 'middle'
};

export default function CampaignsList(props) {
    return (
        <Grid fluid>
            <Row>
                <Col xs={12} sm={10}>
                    <h1>Campaigns</h1>
                </Col>
                <Col xs={12} sm={2} style={{ marginTop: 25 }}>
                    <LinkContainer to="/create-campaign">
                        <Button block>
                            New Campaign
                        </Button>
                    </LinkContainer>
                </Col>
            </Row>

            <Panel style={{ marginTop: 10 }}>
                {props.campaigns.cata({
                    Nothing: () => (
                        <ProgressBar active now={100}/>
                    ),

                    Just: campaigns => (
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>Campaign Name</th>
                                    <th>Description</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody>
                                {map(campaign => (
                                    <tr key={getBunchID(campaign.bunch)}>
                                        <td style={cellStyles}>{campaign.name}</td>
                                        <td style={cellStyles}>{campaign.description}</td>
                                        <td style={cellStyles}>{campaign.startDate}</td>
                                        <td style={cellStyles}>
                                            {campaign.endDate.getOrElse('-')}
                                        </td>
                                        <td style={cellStyles}>{campaign.state}</td>
                                        <td style={cellStyles}>
                                            <LinkContainer to={`/reports/campaign/${getBunchID(campaign.bunch)}`}>
                                                <Button bsStyle="link">
                                                    Reports
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ), campaigns)}
                            </tbody>
                        </Table>
                    )
                })}

                {props.pageCount.map(pageCount => (
                    <Pagination
                        prev
                        next
                        first
                        last
                        ellipsis
                        items={pageCount}
                        maxButtons={5}
                        activePage={props.current}
                        onSelect={props.changePageHandler}
                    />
                )).getOrElse(null)}
            </Panel>
        </Grid>
    );
}

CampaignsList.propTypes = {
    current: PropTypes.number.isRequired,
    campaigns: PropTypes_.Maybe(
        PropTypes.arrayOf(
            PropTypes.shape({
                bunch: PropTypes_.bunch.isRequired,
                name: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                startDate: PropTypes.string.isRequired,
                endDate: PropTypes_.Maybe(
                    PropTypes.string.isRequired
                ).isRequired,
                state: PropTypes.string.isRequired
            }).isRequired
        ).isRequired
    ).isRequired,
    pageCount: PropTypes_.Maybe(
        PropTypes.number.isRequired
    ).isRequired,

    changePageHandler: PropTypes.func.isRequired
};
