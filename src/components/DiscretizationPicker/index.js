import React, { PropTypes } from 'react';
import {
    FormGroup,
    ControlLabel,
    ButtonToolbar,
    ButtonGroup,
    Button
} from 'react-bootstrap';
import {
    constant,
    compose,
    map
} from 'lodash/fp';


export default function DiscretizationPicker(props) {
    return (
        <FormGroup>
            <ControlLabel style={{ textAlign: 'right', display: 'block' }}>
                {props.children}
            </ControlLabel>

            <ButtonToolbar>
                <ButtonGroup justified>
                    {map(option => (
                        <Button
                            href="#"
                            key={option.value}
                            active={option.active}
                            onClick={compose(props.onChange, constant(option.value))}
                            disabled={props.disabled}
                        >
                            {option.title}
                        </Button>
                    ), props.options)}
                </ButtonGroup>
            </ButtonToolbar>
        </FormGroup>
    );
}

DiscretizationPicker.propTypes = {
    disabled: PropTypes.bool.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            active: PropTypes.bool.isRequired
        }).isRequired
    ).isRequired,
    children: PropTypes.string.isRequired,

    onChange: PropTypes.func.isRequired
};
