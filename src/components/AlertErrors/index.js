import React, { PropTypes } from 'react';
import {
    Button,
    Alert
} from 'react-bootstrap';
import FIcon from 'react-fontawesome';
import {
    map
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';


export default function AlertErrors(props) {
    return (
        <Alert bsStyle="danger" style={{ marginBottom: 0 }}>
            <h4>{props.title}</h4>

            {props.errors.map(
                map(error => (
                    <p key={error}>{error}</p>
                ))
            ).getOrElse(null)}

            {props.tryAgain.map(tryAgain => (
                <p>
                    <Button
                        bsStyle="danger"
                        disabled={tryAgain.busy}
                        onClick={tryAgain.handler}
                    >
                        <FIcon name="refresh" fixedWidth spin={tryAgain.busy} />
                        &nbsp;Try again
                    </Button>
                </p>
            )).getOrElse(null)}
        </Alert>
    );
}

AlertErrors.propTypes = {
    title: PropTypes.string.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.arrayOf(
            PropTypes.string.isRequired
        ).isRequired
    ).isRequired,
    tryAgain: PropTypes_.Maybe(
        PropTypes.shape({
            busy: PropTypes.bool.isRequired,
            handler: PropTypes.func.isRequired
        }).isRequired
    ).isRequired
};
