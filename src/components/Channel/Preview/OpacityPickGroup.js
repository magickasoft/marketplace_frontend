import React, { PropTypes } from 'react';
import {
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock
} from 'react-bootstrap';
import {
    map,
    compose,
    property,
    constant
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';


const mapErrors = map(error => (
    <HelpBlock key={error}>{error}</HelpBlock>
));
const cError = constant('error');
const pTargetValue = compose(
    property('value'),
    property('target')
);

export default function OpacityPickGroup(props) {
    return (
        <FormGroup validationState={props.errors.map(cError).getOrElse(null)}>
            <ControlLabel>
                {props.children}
            </ControlLabel>

            <FormControl
                type="number"
                min="0"
                max="100"
                placeholder="0"
                disabled={props.busy}
                value={props.value.getOrElse('')}
                onChange={compose(
                    props.onChange,
                    pTargetValue
                )}
            />

            {props.errors.map(mapErrors).getOrElse(null)}
        </FormGroup>
    );
}

OpacityPickGroup.propTypes = {
    children: PropTypes.string.isRequired,
    value: PropTypes_.Maybe(
        PropTypes.string.isRequired
    ).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.arrayOf(
            PropTypes.string.isRequired
        ).isRequired
    ).isRequired,

    onChange: PropTypes.func.isRequired
};
