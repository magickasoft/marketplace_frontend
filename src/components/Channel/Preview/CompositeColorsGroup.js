import React, { PropTypes } from 'react';
import {
    Row,
    Col
} from 'react-bootstrap';
import {
    toString
} from 'lodash/fp';
import Maybe from 'data.maybe';

import PropTypes_ from 'utils/prop-types';
import {
    toInt
} from 'utils';
import ColorPickGroup from './ColorPickGroup';
import OpacityPickGroup from './OpacityPickGroup';


export default function CompositeColorsGroup(props) {
    const [ color, opacity ] = props.value;

    return (
        <Row>
            <Col xs={12} md={4}>
                <h5>{props.children}</h5>
            </Col>
            <Col xs={6} md={4}>
                <ColorPickGroup
                    value={color}
                    busy={props.busy}
                    errors={props.errors}
                    onChange={
                        value => props.onChange([ Maybe.fromNullable(value), opacity ])
                    }
                >Color</ColorPickGroup>
            </Col>

            <Col xs={6} md={4}>
                <OpacityPickGroup
                    value={opacity.map(toString)}
                    busy={props.busy}
                    errors={props.errors}
                    onChange={
                        value => props.onChange([ color, Maybe.fromEither(toInt(value)) ])
                    }
                >Transparency</OpacityPickGroup>
            </Col>
        </Row>
    );
}

CompositeColorsGroup.propTypes = {
    children: PropTypes.string.isRequired,
    value: PropTypes_.Tuple([
        PropTypes_.Maybe(
            PropTypes.string.isRequired
        ).isRequired,
        PropTypes_.Maybe(
            PropTypes.number.isRequired
        ).isRequired
    ]).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.arrayOf(
            PropTypes.string.isRequired
        ).isRequired
    ).isRequired,

    onChange: PropTypes.func.isRequired
};
