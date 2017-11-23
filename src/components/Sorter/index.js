import React, { PropTypes } from 'react';
import {
    ButtonGroup,
    Button
} from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import {
    F,
    noop
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import AsyncIcon from 'components/AsyncIcon';


const mFunc = PropTypes_.Maybe(
    PropTypes.func.isRequired
);

bootstrapUtils.addStyle(Button, 'custom');

export function Order(props) {
    const active = props.onClick.map(F).getOrElse(true);

    return (
        <Button
            disabled={active || props.disabled}
            onClick={props.onClick.getOrElse(noop)}
            bsStyle={active ? 'custom' : 'default'}
            bsSize="xsmall"
            >
            <AsyncIcon name={props.icon} busy={active && props.disabled} />
        </Button>
    );
}

Order.propTypes = {
    icon: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    onClick: mFunc.isRequired
};

export function Sorter({ disabled, onDescClick, onAscClick, ...props }) {
    return (
        <ButtonGroup {...props}>
            <Order
                icon="sort-amount-desc"
                disabled={disabled}
                onClick={onDescClick}
            />
            <Order
                icon="sort-amount-asc"
                disabled={disabled}
                onClick={onAscClick}
            />
        </ButtonGroup>
    );
}

Sorter.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onDescClick: mFunc.isRequired,
    onAscClick: mFunc.isRequired
};
