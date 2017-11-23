import React, { PropTypes } from 'react';
import { Nothing } from 'data.maybe';
import {
    FormGroup,
    ControlLabel
} from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import {
    T
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';


export default function IntervalPicker(props) {
    return (
        <FormGroup>
            <ControlLabel>
                {props.children}
            </ControlLabel>

            <DatePicker
                value={props.value.getOrElse('')}
                maxDate={props.maxDate.getOrElse()}
                showClearButton={props.value.map(T).getOrElse(false)}
                disabled={props.disabled}
                onChange={props.onChange}
            />
        </FormGroup>
    );
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

IntervalPicker.propTypes = {
    value: mString.isRequired,
    maxDate: mString,
    disabled: PropTypes.bool.isRequired,
    children: PropTypes.string.isRequired,

    onChange: PropTypes.func.isRequired
};

IntervalPicker.defaultProps = {
    maxDate: Nothing()
};
