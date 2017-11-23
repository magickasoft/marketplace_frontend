import React, { PropTypes } from 'react';
import Maybe from 'data.maybe';
import {
    ProgressBar
} from 'react-bootstrap';
import PropTypes_ from 'utils/prop-types';
import AlertErrors from 'components/AlertErrors';

const nothing = new Maybe.Nothing();

export default function Waiter({ errors, busy }) {
    return errors.cata({
        Nothing: () => busy && (
            <ProgressBar active now={100} />
        ),

        Just: errList => (
            <AlertErrors
                title="Something went wrong:"
                errors={errList}
                tryAgain={nothing}
            />
        )
    });
}
const mErrorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

Waiter.propTypes = {
    errors: mErrorsList.isRequired,
    busy: PropTypes.bool.isRequired
};
