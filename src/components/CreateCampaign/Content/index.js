import React, { PropTypes } from 'react';
import {
    Col,
    Row,
    FormGroup,
    ProgressBar,
    Pagination,
    Form,
    HelpBlock,
    ButtonToolbar,
    ButtonGroup,
    Button
} from 'react-bootstrap';
import {
    compose,
    property,
    constant,
    map
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import {
    getBunchID
} from 'utils/bunch';
import Offer from 'components/Offer';
import Modal from './Modal';


const cError = constant('error');
const pCommon = property('common');
const mapErrors = map(error => (
    <HelpBlock key={error}>{error}</HelpBlock>
));

function OfferControls(props) {
    return (
        <ButtonToolbar>
            <ButtonGroup>
                {props.selected ? (
                    <Button disabled>
                        Selected
                    </Button>
                ) : (
                    <Button onClick={props.onSelectHandler}>
                        Select
                    </Button>
                )}

                <Button onClick={props.onUpdateHandler}>
                    Update
                </Button>
            </ButtonGroup>
        </ButtonToolbar>
    );
}

OfferControls.propTypes = {
    selected: PropTypes.bool.isRequired,
    onSelectHandler: PropTypes.func.isRequired,
    onUpdateHandler: PropTypes.func.isRequired
};

function Content(props) {
    const mCommonErrors = props.errors.chain(pCommon);

    return (
        <Form
            noValidate
            onSubmit={event => {
                props.goNextTabHandler();
                event.preventDefault();
            }}
        >
            {props.modal.map(modal => (
                <Modal {...modal} {...props.modalHandlers}
                       modals={modal.modals.getOrElse({})}
                />

            )).getOrElse(null)}

            <Row>
                <Col xs={12} sm={8} md={9} lg={10} componentClass="h3">
                    Choose Offer
                </Col>

                <Col xs={12} sm={4} md={3} lg={2} style={{ marginTop: 12 }}>
                    <Button block onClick={props.onOpenCreationModal}>
                        Create New
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
                {props.offers.cata({
                    Nothing: () => (
                        <Col xs={12}>
                            <ProgressBar active now={100}/>
                        </Col>
                    ),

                    Just: map(offer => (
                        <Col sm={4} md={4} key={getBunchID(offer.bunch)}>
                            <Offer {...offer} compact>
                                <OfferControls
                                    selected={offer.selected}
                                    onSelectHandler={
                                        compose(
                                            props.selectContentHandler,
                                            constant(offer.bunch)
                                        )
                                    }
                                    onUpdateHandler={
                                        compose(
                                            props.onOpenUpdatingModal,
                                            constant(offer)
                                        )
                                    }
                                />
                            </Offer>
                        </Col>
                    ))
                })}
            </Row>

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
                    onSelect={props.receiveMediaPageHandler}
                />
            )).getOrElse(null)}

            <FormGroup validationState={mCommonErrors.map(cError).getOrElse(null)}>
                <Row>
                    <Col xs={12} sm={6} smOffset={3}>
                        {mCommonErrors.map(mapErrors).getOrElse(null)}
                    </Col>

                    <Col xs={12} sm={3}>
                        <Button type="submit" disabled={props.busy} block>
                            Next
                        </Button>
                    </Col>
                </Row>
            </FormGroup>
        </Form>
    );
}

const offerShape = PropTypes.shape({
    bunch: PropTypes_.bunch.isRequired,
    selected: PropTypes.bool.isRequired
});

const errorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

Content.propTypes = {
    modal: PropTypes_.Maybe(
        PropTypes.object.isRequired
    ).isRequired,
    modalHandlers: PropTypes.object.isRequired,
    offers: PropTypes_.Maybe(
        PropTypes.arrayOf(
            offerShape.isRequired
        ).isRequired
    ).isRequired,
    pageCount: PropTypes_.Maybe(
        PropTypes.number.isRequired
    ).isRequired,
    current: PropTypes.number.isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            common: errorsList.isRequired
        }).isRequired
    ).isRequired,

    goNextTabHandler: PropTypes.func.isRequired,
    selectContentHandler: PropTypes.func.isRequired,
    receiveMediaPageHandler: PropTypes.func.isRequired,
    onOpenCreationModal: PropTypes.func.isRequired,
    onOpenUpdatingModal: PropTypes.func.isRequired
};

export default Content;
