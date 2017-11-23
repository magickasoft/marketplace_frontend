import React, { PropTypes } from 'react';
import {
    Modal as Modal_,
    Row,
    Col,
    FormGroup,
    Form,
    Button
} from 'react-bootstrap';
import {
    constant,
    property
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import ErrorsList from 'components/ErrorsList';
import PanelInputs from './PanelInputs';
import PanelRedemption from './PanelRedemption';
import PanelImages from './PanelImages';
import PanelPreviews from './Preview/index';


const pImages = property('images');
const pCommon = property('common');

function Modal(props) {
    return (
        <Modal_ show onHide={props.onClose} bsSize="large">
            <Form noValidate onSubmit={event => {
                props.onSave();
                event.preventDefault();
            }}>

                <Modal_.Header closeButton>
                    <Modal_.Title>
                        {props.fields.bunch.cata({
                            Nothing: constant('Create a new offer'),
                            Just: constant('Edit the offer')
                        })}
                    </Modal_.Title>
                </Modal_.Header>

                <Modal_.Body>
                    <Row>
                        <Col xs={12} md={8}>
                            <PanelInputs {...props} />
                            <PanelImages
                                {...props}
                                fields={props.fields.images}
                                errors={props.errors.map(pImages)}
                            />
                            <PanelRedemption {...props} />
                        </Col>

                        <Col xs={12} md={4}>
                            <PanelPreviews fields={props.fields} channels={props.channels} />
                        </Col>

                        <Col xs={12}>
                            {props.errors.chain(pCommon).map(commonErrors => (
                                <FormGroup validationState="error">
                                    <ErrorsList>{commonErrors}</ErrorsList>
                                </FormGroup>
                            )).getOrElse(null)}
                        </Col>
                    </Row>
                </Modal_.Body>

                <Modal_.Footer>
                    <Button bsStyle="primary" type="submit" disabled={props.busy}>
                        Save
                    </Button>
                </Modal_.Footer>
            </Form>
        </Modal_>
    );
}

const mBunch = PropTypes_.Maybe(
    PropTypes_.bunch.isRequired
);

const mArrayOfString = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

Modal.propTypes = {
    fields: PropTypes.shape({
        bunch: mBunch.isRequired,
        images: PropTypes.object.isRequired
    }).isRequired,
    modals: PropTypes.object.isRequired,
    busy: PropTypes.bool.isRequired,
    errors: mShape({
        images: PropTypes.object.isRequired,
        common: mArrayOfString.isRequired
    }).isRequired,
    channels: PropTypes.object.isRequired,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default Modal;
