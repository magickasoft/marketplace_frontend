import React, { PropTypes } from 'react';
import {
    Grid,
    Row,
    Col,
    Panel,
    Nav,
    NavItem
} from 'react-bootstrap';
import FIcon from 'react-fontawesome';
import {
    map
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';


const iconStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    height: '.75em',
    margin: 'auto 15px'
};

const mapNavItems = map(item => (
    <NavItem
        eventKey={item.type}
        key={item.type}
        disabled={item.busy}
        style={{
            position: 'relative'
        }}
    >
        {item.busy && (
            <FIcon
                name="spinner"
                size="lg"
                spin
                style={iconStyle}
            />
        )}
        {item.errors.map(() => (
            <FIcon
                name="warning"
                size="lg"
                style={iconStyle}
            />
        )).getOrElse(null)}

        {item.title}
    </NavItem>
));

function CreateCampaign(props) {
    return (
        <Grid fluid>
            <Row>
                <Col
                    xs={12}
                    componentClass="h1"
                    style={{
                        marginBottom: 32
                    }}
                >
                    New Campaign
                </Col>

                <Col xs={3}>
                    <Nav
                        bsStyle="pills"
                        stacked
                        activeKey={props.currentTab}
                        onSelect={props.changeTabHandler}
                    >
                        {mapNavItems(props.tabs)}
                    </Nav>
                </Col>

                <Col xs={9}>
                    <Panel>
                        {props.children}
                    </Panel>
                </Col>
            </Row>
        </Grid>
    );
}

CreateCampaign.propTypes = {
    currentTab: PropTypes.string.isRequired,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            busy: PropTypes.bool.isRequired,
            errors: PropTypes_.Maybe(
                PropTypes.any.isRequired
            ).isRequired
        }).isRequired
    ).isRequired,
    children: PropTypes.any,

    changeTabHandler: PropTypes.func.isRequired
};

export default CreateCampaign;
