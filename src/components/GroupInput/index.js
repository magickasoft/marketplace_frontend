import React, { PropTypes } from 'react';
import {
    FormGroup,
    ControlLabel
} from 'react-bootstrap';
import {
    constant
} from 'lodash/fp';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

import PropTypes_ from 'utils/prop-types';
import ErrorsList from 'components/ErrorsList';


const cError = constant('error');

function GroupInput(props) {
    return (
        <FormGroup validationState={props.errors.map(cError).getOrElse(null)}>
            {props.label.map(label => (
                <ControlLabel>
                    {label}
                </ControlLabel>
            )).getOrElse(null)}

            {
                props.subLabel ? props.subLabel.map(subLabel => (
                    <div styleName="subLabel">
                        {subLabel}
                    </div>
                )).getOrElse(null) : null
            }

            {props.children}

            {props.errors.map(errors => (
                <ErrorsList>{errors}</ErrorsList>
            )).getOrElse(null)}
        </FormGroup>
    );
}

GroupInput.propTypes = {
    label: PropTypes_.Maybe(
        PropTypes.node.isRequired
    ).isRequired,
    subLabel: PropTypes_.Maybe(
        PropTypes.node.isRequired
    ),
    errors: PropTypes_.Maybe(
        PropTypes.array.isRequired
    ).isRequired,
    children: PropTypes.element.isRequired
};
export default CSSModules(GroupInput, styles);
