import React, { PropTypes } from 'react';
import {
    Row,
    Col,
    Form,
    FormGroup,
    FormControl,
    HelpBlock,
    ControlLabel,
    Button
} from 'react-bootstrap';
import {
    compose,
    constant,
    property,
    map
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';


const cError = constant('error');
const pName = property('name');
const pDescription = property('description');
const pStartDate = property('startDate');
const pEndDate = property('endDate');
const pCommon = property('common');
const pTargetValue = compose(
    property('value'),
    property('target')
);

const mapErrors = map(error => (
    <HelpBlock key={error}>{error}</HelpBlock>
));

function Campaign(props) {
    const mNameErrors = props.errors.chain(pName);
    const mDescriptionErrors = props.errors.chain(pDescription);
    const mStartDateErrors = props.errors.chain(pStartDate);
    const mEndDateErrors = props.errors.chain(pEndDate);
    const mCommonErrors = props.errors.chain(pCommon);

    return (
        <Form
            horizontal
            noValidate
            onSubmit={event => {
                props.goNextTabHandler();
                event.preventDefault();
            }}
        >
            <FormGroup validationState={mNameErrors.map(cError).getOrElse(null)}>
                <Col componentClass={ControlLabel} sm={4} md={2}>
                    Name
                </Col>
                <Col sm={8} md={10}>
                    <FormControl
                        autoFocus
                        type="text"
                        placeholder="Name"
                        value={props.fields.name}
                        onChange={compose(
                            props.changeNameHandler,
                            pTargetValue
                        )}
                    />

                    {mNameErrors.map(mapErrors).getOrElse(null)}
                </Col>
            </FormGroup>

            <FormGroup validationState={mDescriptionErrors.map(cError).getOrElse(null)}>
                <Col componentClass={ControlLabel} sm={4} md={2}>
                    Description
                </Col>
                <Col sm={8} md={10}>
                    <FormControl
                        type="text"
                        placeholder="Description"
                        value={props.fields.description}
                        onChange={compose(
                            props.changeDescriptionHandler,
                            pTargetValue
                        )}
                    />

                    {mDescriptionErrors.map(mapErrors).getOrElse(null)}
                </Col>
            </FormGroup>

            <Row>
                <Col xs={12} sm={10} smOffset={2} componentClass={HelpBlock}>
                    Specify dates, when campaign offer will appear in the app.
                </Col>

                <Col md={6}>
                    <FormGroup validationState={mStartDateErrors.map(cError).getOrElse(null)}>
                        <Col componentClass={ControlLabel} sm={4}>
                            Start Date
                        </Col>
                        <Col sm={8}>
                            <FormControl
                                type="date"
                                placeholder="Start Date"
                                value={props.fields.startDate}
                                onChange={compose(
                                    props.changeStartDateHandler,
                                    pTargetValue
                                )}
                            />

                            {mStartDateErrors.map(mapErrors).getOrElse(null)}
                        </Col>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup validationState={mEndDateErrors.map(cError).getOrElse(null)}>
                        <Col componentClass={ControlLabel} sm={4}>
                            End Date
                        </Col>
                        <Col sm={8}>
                            <FormControl
                                type="date"
                                placeholder="End Date"
                                value={props.fields.endDate.getOrElse('')}
                                onChange={compose(
                                    props.changeEndDateHandler,
                                    pTargetValue
                                )}
                            />

                            {mEndDateErrors.map(mapErrors).getOrElse(null)}
                        </Col>
                    </FormGroup>
                </Col>
            </Row>

            <FormGroup validationState={mCommonErrors.map(cError).getOrElse(null)}>
                <Col xs={12} sm={6} smOffset={3}>
                    {mCommonErrors.map(mapErrors).getOrElse(null)}
                </Col>

                <Col xs={12} sm={3}>
                    <Button type="submit" disabled={props.busy} block>
                        Next
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
}

const errorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

Campaign.propTypes = {
    fields: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes_.Maybe(
            PropTypes.string.isRequired
        ).isRequired
    }).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            name: errorsList.isRequired,
            description: errorsList.isRequired,
            startDate: errorsList.isRequired,
            endDate: errorsList.isRequired,
            common: errorsList.isRequired
        }).isRequired
    ).isRequired,

    goNextTabHandler: PropTypes.func.isRequired,
    changeNameHandler: PropTypes.func.isRequired,
    changeDescriptionHandler: PropTypes.func.isRequired,
    changeStartDateHandler: PropTypes.func.isRequired,
    changeEndDateHandler: PropTypes.func.isRequired
};

export default Campaign;
