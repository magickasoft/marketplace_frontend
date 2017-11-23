import React, { PropTypes } from 'react';
import ReactMapboxGl, { Layer, Feature, ZoomControl } from 'react-mapbox-gl';
import appConfig from 'config/app';
import PropTypes_ from 'utils/prop-types';
import {
    map
} from 'lodash/fp';
import {
    PointPropType,
    getLat
} from 'models/point';

import config from 'config';

import CSSModules from 'react-css-modules';
import styles from './__assets__/styles.css';

const MAX_ZOOM = 20;
const METERS_PER_PIXEL_FACTOR = 0.075;

function Marker(props) {

    const metersToPixelsAtMaxZoom = (meters, latitude) =>
        meters / METERS_PER_PIXEL_FACTOR / Math.cos(latitude * Math.PI / 180);

    const { point } = props.location.place;

    return (
        <div>
            <Layer
                type='circle'
                paint={{ 'circle-radius': {
                    stops: [
                        [0, 0],
                        [
                            MAX_ZOOM,
                            metersToPixelsAtMaxZoom(props.location.radius * 1000, getLat(point))
                        ]
                    ],
                    base: 2
                }, 'circle-color': '#000000', 'circle-opacity': 0.1 }}
            >
                <Feature coordinates={point} />
            </Layer>
            <Layer
                type='symbol'
                layout={{ 'icon-image': 'marker-15' }}
            >
                <Feature coordinates={point}/>
            </Layer>
        </div>
    );
}

const placeShape = PropTypes.shape({
    bunch: PropTypes_.bunch.isRequired,
    name: PropTypes.string.isRequired,
    point: PointPropType
});

Marker.propTypes = {
    location: PropTypes.shape({
        place: placeShape,
        radius: PropTypes.number.isRequired
    })
};


function SegmentMap(props) {

    return (
        <div>
            <button
                styleName='button-show-all'
                onClick={() => props.showAllLocationsHandler(props.locations)}
            >
            </button>
            <ReactMapboxGl
                style='mapbox://styles/mapbox/streets-v8'
                movingMethod='jumpTo'
                dragRotate={false}
                accessToken={config.mapbox.key}
                containerStyle={{
                    height: '380px',
                    width: '100%'
                }}
                onZoomEnd={m => {
                    props.changeZoomHandler(m.getZoom());
                }}
                onMoveEnd={m => {
                    props.changeMapCenterHandler(m.getCenter());
                }}
                center={props.mapCenter}
                zoom={[ props.zoom ]}
                fitBoundsOptions={{
                    padding: appConfig.segments.defaultPadding,
                    linear: true
                }}
                fitBounds={props.bounds.getOrElse(null)}
            >
                <ZoomControl
                    zoomDiff={1}
                />

                {map(location => (
                    <Marker key={JSON.stringify(location.place.point)} location={location} />
                ), props.locations)}
            </ReactMapboxGl>
        </div>
    );
}

const locationShape = PropTypes.shape({
    place: placeShape,
    radius: PropTypes.number.isRequired
});

SegmentMap.propTypes = {
    locations: PropTypes.arrayOf(
        locationShape.isRequired
    ).isRequired,
    bounds: PropTypes_.Maybe(
        PropTypes_.Tuple([
            PointPropType,
            PointPropType
        ]).isRequired
    ).isRequired,
    activeLocation: PropTypes_.Maybe(
        locationShape.isRequired
    ),
    showAllLocationsHandler: PropTypes.func.isRequired,
    changeZoomHandler: PropTypes.func.isRequired,
    changeMapCenterHandler: PropTypes.func.isRequired,
    zoom: PropTypes.number.isRequired,
    mapCenter: PointPropType
};

export default CSSModules(SegmentMap, styles);
