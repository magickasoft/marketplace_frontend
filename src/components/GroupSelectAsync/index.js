import React, { PropTypes } from 'react';
import {
    ProgressBar,
    FormControl
} from 'react-bootstrap';
import {
    compose,
    property,
    map,
    keys,
    sortBy,
    identity
} from 'lodash/fp';
import {
    Just
} from 'data.maybe';

import {
    getBunchID
} from 'utils/bunch';

import PropTypes_ from 'utils/prop-types';
import AlertErrors from 'components/AlertErrors';
import GroupInput from 'components/GroupInput';

const pTargetValue = compose(
    property('value'),
    property('target')
);

const createBunchString = bunch => JSON.stringify(bunch, sortBy(identity, keys(bunch)));

export default function GroupSelectAsync(props) {
    return (
        <GroupInput {...props}>
            <div>
                {props.options.results.map(results => (
                    <FormControl
                        componentClass="select"
                        value={props.value.map(createBunchString).getOrElse()}
                        disabled={props.disabled}
                        onChange={compose(props.onChange, JSON.parse, pTargetValue)}
                    >
                        {props.value.cata({
                            Nothing: () => (
                                <option value="default">
                                    {props.placeholder}
                                </option>
                            ),

                            Just: () => null
                        })}

                        {map(channel => (
                            <option
                                value={createBunchString(channel.bunch)}
                                key={getBunchID(channel.bunch)}
                            >
                                {channel.title}
                            </option>
                        ), results)}
                    </FormControl>
                )).getOrElse(null)}

                {props.options.errors.cata({
                    Nothing: () => props.options.busy && (
                        <ProgressBar active now={100} />
                    ),

                    Just: errors => (
                        <AlertErrors
                            title="Something went wrong:"
                            errors={errors.common}
                            tryAgain={Just({
                                busy: props.options.busy,
                                handler: props.onReceiveAgain
                            })}
                        />
                    )
                })}
            </div>
        </GroupInput>
    );
}

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

const mErrorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

GroupSelectAsync.propTypes = {
    options: PropTypes.shape({
        results: PropTypes_.Maybe(
            PropTypes.arrayOf(
                PropTypes.shape({
                    bunch: PropTypes_.bunch.isRequired,
                    title: PropTypes.string.isRequired
                }).isRequired
            ).isRequired
        ).isRequired,
        busy: PropTypes.bool.isRequired,
        errors: mShape({
            common: mErrorsList.isRequired
        }).isRequired
    }).isRequired,
    value: PropTypes_.Maybe(
        PropTypes_.bunch.isRequired
    ).isRequired,
    disabled: PropTypes.bool.isRequired,
    errors: mErrorsList.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onReceiveAgain: PropTypes.func.isRequired
};
