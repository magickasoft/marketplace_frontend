import React, { PropTypes } from 'react';
import {
    Col,
    Row,
    FormGroup,
    HelpBlock,
    Form,
    Button,
    Alert
} from 'react-bootstrap';
import {
    constant,
    property,
    map
} from 'lodash/fp';
import {
    getBunchID
} from 'utils/bunch';

import SegmentMap from './Map';

import PropTypes_ from 'utils/prop-types';
import Select from 'react-select';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

import AsyncIcon from 'components/AsyncIcon';

import {
    PointPropType
} from 'models/point';

const cError = constant('error');
const pCommon = property('common');

const mapErrors = map(error => (
    <HelpBlock key={error}>{error}</HelpBlock>
));

function Segment(props) {
    const mCommonErrors = props.errors.chain(pCommon);

    return (
        <div>
            <Col xs={12} componentClass='h3'>
                Target Users
            </Col>

            <Col xs={12} componentClass='h4'>
                <HelpBlock>
                    Potential reach: {props.total} users {' '}
                    <AsyncIcon name="count" busy={props.countBusy} />
                </HelpBlock>
            </Col>

            <Row>
                <Col xs={12} sm={6}>
                    <SegmentMap
                        locations={props.selectedLocations}
                        activeLocation={props.activeLocation}
                        showAllLocationsHandler={props.showAllLocationsHandler}
                        bounds={props.bounds}
                        changeZoomHandler={props.changeZoomHandler}
                        changeMapCenterHandler={props.changeMapCenterHandler}
                        zoom={props.zoom}
                        mapCenter={props.mapCenter}
                    />
                </Col>
                <Col xs={12} sm={6}>
                    <div styleName='places'>
                        {map(location => (
                            <Alert
                                key={getBunchID(location.place.bunch)}
                                styleName='place'
                                onDismiss={e => {
                                    e.stopPropagation();
                                    props.removeLocation(location.place.bunch);
                                }}
                                onClick={() => props.setActiveLocation(location)}
                            >
                                {location.place.name}
                                <strong className='pull-right'>{`+ ${location.radius} km.`}</strong>
                            </Alert>
                        ), props.selectedLocations)}
                    </div>
                    <Select
                        onChange={props.addLocation}
                        onInputChange={props.receivePlacesHandler}
                        options={props.places.getOrElse([])}
                        backspaceRemoves={true}
                        placeholder='Add Location'
                        labelKey='name'
                    />
                </Col>
            </Row>

            <Form
                horizontal
                noValidate
                onSubmit={event => {
                    props.goNextTabHandler();
                    event.preventDefault();
                }}
            >

                <FormGroup validationState={mCommonErrors.map(cError).getOrElse(null)}>
                    <Col xs={12} sm={6} smOffset={3}>
                        {mCommonErrors.map(mapErrors).getOrElse(null)}
                    </Col>

                    <Col xs={12} sm={3}>
                        <Button styleName='button-next' type='submit' disabled={props.queryBusy} block>
                            Next
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        </div>
    );
}

const placeShape = PropTypes.shape({
    bunch: PropTypes_.bunch.isRequired,
    name: PropTypes.string.isRequired,
    point: PointPropType
});

const locationShape = PropTypes.shape({
    place: placeShape.isRequired,
    radius: PropTypes.number.isRequired
});

const errorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

Segment.propTypes = {
    selectedLocations: PropTypes.arrayOf(
        locationShape.isRequired
    ).isRequired,
    bounds: PropTypes_.Maybe(
        PropTypes_.Tuple([
            PointPropType,
            PointPropType
        ]).isRequired
    ).isRequired,
    queryBusy: PropTypes.bool.isRequired,
    countBusy: PropTypes.bool.isRequired,
    places: PropTypes_.Maybe(
        PropTypes.arrayOf(
            placeShape.isRequired
        ).isRequired
    ).isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            common: errorsList.isRequired
        }).isRequired
    ).isRequired,

    goNextTabHandler: PropTypes.func.isRequired,
    addLocation: PropTypes.func.isRequired,
    removeLocation: PropTypes.func.isRequired,
    setActiveLocation: PropTypes.func.isRequired,
    receivePlacesHandler: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    activeLocation: PropTypes_.Maybe(
        locationShape.isRequired
    ),
    showAllLocationsHandler: PropTypes.func.isRequired,
    changeZoomHandler: PropTypes.func.isRequired,
    changeMapCenterHandler: PropTypes.func.isRequired,
    zoom: PropTypes.number.isRequired,
    mapCenter: PointPropType
};

export default CSSModules(Segment, styles);
