import React, { PropTypes } from 'react';
import {
    Row,
    Col,
    Modal,
    Form,
    FormGroup,
    Alert,
    Button,
    HelpBlock
} from 'react-bootstrap';
import {
    constant,
    property,
    map
} from 'lodash/fp';
import {
    getBunchID
} from 'utils/bunch';

import PropTypes_ from 'utils/prop-types';
import Offer from 'components/Offer';


const cError = constant('error');
const c8 = constant(8);
const pCommon = property('common');
const pOffer = property('offer');
const pSegment = property('segment');
const pPush = property('push');

const mapErrors = map(error => (
    <HelpBlock key={error}>{error}</HelpBlock>
));

function Summary(props) {
    const mCommonErrors = props.errors.chain(pCommon);

    return (
        <Form
            horizontal
            noValidate
            onSubmit={event => {
                props.launchCampaignHandler();
                event.preventDefault();
            }}
        >
            <Modal show={props.done} onHide={props.agreeWithLaunchHandler}>
                <Modal.Header>
                    <Modal.Title>
                        Congratulations!
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Your Campaign was successfully created.
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={props.agreeWithLaunchHandler}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>

            <FormGroup>
                <Col xs={12} componentClass="h3">
                    Campaign Summary
                </Col>
            </FormGroup>

            {props.campaign.cata({
                Nothing: () => (
                    <Row>
                        <Col xs={12}>
                            You should
                            <Button
                                bsStyle="link"
                                onClick={props.goCampaignTabHandler}
                            >
                                create a campaign
                            </Button>
                        </Col>
                    </Row>
                ),

                Just: campaignEntity => (
                    <Row>
                        <Col
                            xs={12}
                            sm={campaignEntity.offerInfo.chain(pOffer).map(c8).getOrElse(12)}
                        >
                            <FormGroup>
                                <Col xs={12}>
                                    <strong>Name:</strong> {campaignEntity.name}
                                </Col>
                                <Col xs={12}>
                                    <strong>Description:</strong> {campaignEntity.description}
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col xs={12}>
                                    <strong>Start Date:</strong> {campaignEntity.startDate}
                                </Col>
                                {campaignEntity.endDate.map(endDate => (
                                    <Col xs={12}>
                                        <strong>End Date:</strong> {endDate}
                                    </Col>
                                )).getOrElse(null)}
                            </FormGroup>

                            {campaignEntity.offerInfo.chain(pSegment).map(
                                segmentEntity => (
                                    <FormGroup>
                                        <Col xs={12}>
                                            <strong>Audience:</strong>
                                            <ul style={{listStyleType: 'none'}}>
                                                {map(
                                                    location => (
                                                        <li key={getBunchID(location.bunch)}>{location.name}</li>
                                                    ),
                                                    segmentEntity.locations
                                                )}
                                            </ul>
                                        </Col>
                                    </FormGroup>
                                )
                            ).getOrElse(null)}

                            {campaignEntity.offerInfo.chain(pPush).map(
                                push => (
                                    <Alert>
                                        <h4>Push Notification</h4>

                                        <FormGroup>
                                            <Col xs={12}>
                                                <strong>Title:</strong> {push.title.getOrElse('Default Title')}
                                            </Col>
                                            <Col xs={12}>
                                                <strong>Message:</strong> {push.message.getOrElse('Default Message')}
                                            </Col>
                                        </FormGroup>
                                        <strong>Send at:</strong> {push.sendAt.getOrElse('On campaign start')}
                                    </Alert>
                                )
                            ).getOrElse(null)}
                        </Col>

                        {campaignEntity.offerInfo.chain(pOffer).map(
                            offerEntity => (
                                <Col xs={12} sm={4}>
                                    <Offer {...offerEntity} compact={false} />
                                </Col>
                            )
                        ).getOrElse(null)}

                        <Col xs={12}>
                            <FormGroup validationState={mCommonErrors.map(cError).getOrElse(null)}>
                                <Col xs={12} sm={6}>
                                    {mCommonErrors.map(mapErrors).getOrElse(null)}
                                </Col>

                                <Col xs={12} sm={3} smOffset={3}>
                                    <Button type="submit" disabled={props.busy} block>
                                        Submit
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                )
            })}
        </Form>
    );
}

const errorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

Summary.propTypes = {
    busy: PropTypes.bool.isRequired,
    done: PropTypes.bool.isRequired,
    campaign: PropTypes_.Maybe(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            startDate: PropTypes.string.isRequired,
            endDate: PropTypes_.Maybe(
                PropTypes.string.isRequired
            ).isRequired,
            offerInfo: PropTypes_.Maybe(
                PropTypes.shape({
                    segment: PropTypes_.Maybe(
                        PropTypes.shape({
                            locations: PropTypes.arrayOf(
                                PropTypes.shape({
                                    name: PropTypes.string.isRequired
                                }).isRequired
                            ).isRequired
                        }).isRequired
                    ).isRequired,
                    offer: PropTypes_.Maybe(
                        PropTypes.object.isRequired
                    ).isRequired,
                    push: PropTypes_.Maybe(
                        PropTypes.shape({
                            title: PropTypes_.Maybe(
                                PropTypes.string.isRequired
                            ).isRequired,
                            message: PropTypes_.Maybe(
                                PropTypes.string.isRequired
                            ).isRequired,
                            sendAt: PropTypes_.Maybe(
                                PropTypes.string.isRequired
                            ).isRequired
                        }).isRequired
                    ).isRequired
                }).isRequired
            ).isRequired
        }).isRequired
    ).isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            common: errorsList.isRequired
        }).isRequired
    ).isRequired,

    launchCampaignHandler: PropTypes.func.isRequired,
    goCampaignTabHandler: PropTypes.func.isRequired,
    goSegmentTabHandler: PropTypes.func.isRequired,
    goOfferTabHandler: PropTypes.func.isRequired,
    agreeWithLaunchHandler: PropTypes.func.isRequired
};

export default Summary;
