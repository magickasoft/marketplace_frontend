import {
    PropTypes
} from 'react';
import {
    reduce
} from 'lodash/fp';
import {
    head
} from 'utils';
import PropTypes_ from 'utils/prop-types';

export const getLat = ([ , lat ]) => lat;
export const getLng = ([ lng ]) => lng;

export const convertPointObjToTuple = ({ lng, lat }) => [ lng, lat ];

export const getMinCoords = ([ lng, lat ], [ minLng, minLat ]) =>
    [
        minLng > lng ? lng : minLng,
        minLat > lat ? lat : minLat
    ];

export const getMaxCoords = ([ lng, lat ], [ maxLng, maxLat ]) =>
    [
        maxLng < lng ? lng : maxLng,
        maxLat < lat ? lat : maxLat
    ];

export const fitBounds = points =>
    head(points).map(
        ([ aLng, aLat ]) => reduce(
            ([ minCoords, maxCoords ], point) => [
                getMinCoords(point, minCoords),
                getMaxCoords(point, maxCoords)
            ],
            [ [ aLng, aLat ], [ aLng, aLat ] ],
            points
        )
    );

export const PointPropType = PropTypes_.Tuple([
    PropTypes.number.isRequired,
    PropTypes.number.isRequired
]).isRequired;
