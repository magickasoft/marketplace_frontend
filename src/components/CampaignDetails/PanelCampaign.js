import React, { PropTypes } from 'react';
import {
    Row,
    Col,
    Panel
} from 'react-bootstrap';
import {
    property,
    constant
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import Offer from 'components/Offer';
import Placeholder from 'components/Placeholder';
import AlertErrors from 'components/AlertErrors';


const cDanger = constant('danger');
const pOffer = property('offer');

function Labeled(props) {
    return (
        <Col xs={12} componentClass="p">
            <strong>{props.label}:</strong> {props.children}
        </Col>
    );
}

Labeled.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired
};

export default function PanelCampaign(props) {
    return (
        <Panel bsStyle={props.errors.map(cDanger).getOrElse()} header={
            <h3>Campaign</h3>
        }>
            <Placeholder size={[ '100%', '300px' ]} busy={props.busy}>
                {props.result.map(result => (
                    <Row>
                        <Col xs={12} sm={6} md={8}>
                            <Row>
                                <Labeled label="Name">{result.name}</Labeled>
                                <Labeled label="Description">{result.description}</Labeled>
                                <Labeled label="State">{result.state}</Labeled>
                                <Labeled label="Start Date">{result.startDate}</Labeled>
                                {result.endDate.map(endDate => (
                                    <Labeled label="End Date">{endDate}</Labeled>
                                )).getOrElse(null)}
                            </Row>
                        </Col>

                        {result.offerInfo.chain(pOffer).map(
                            offer => (
                                <Col xs={12} sm={6} md={4}>
                                    <h4>Offer</h4>

                                    <Offer compact={false} {...offer} />
                                </Col>
                            )
                        ).getOrElse(null)}
                    </Row>
                )).getOrElse()}
            </Placeholder>

            {props.errors.map(errors => (
                <AlertErrors
                    title="Something went wrong:"
                    errors={errors.common}
                    tryAgain={props.tryAgainReceiveHandler.map(handler => ({
                        busy: props.busy,
                        handler
                    }))}
                />
            )).getOrElse(null)}
        </Panel>
    );
}

PanelCampaign.propTypes = {
    result: PropTypes_.Maybe(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired,
            startDate: PropTypes.string.isRequired,
            endDate: PropTypes_.Maybe(
                PropTypes.string.isRequired
            ).isRequired,
            offerInfo: PropTypes_.Maybe(
                PropTypes.shape({
                    offer: PropTypes_.Maybe(
                        PropTypes.object.isRequired
                    ).isRequired
                }).isRequired
            ).isRequired
        }).isRequired
    ).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            common: PropTypes_.Maybe(
                PropTypes.array.isRequired
            ).isRequired
        }).isRequired
    ).isRequired,

    tryAgainReceiveHandler: PropTypes_.Maybe(
        PropTypes.func.isRequired
    ).isRequired
};
