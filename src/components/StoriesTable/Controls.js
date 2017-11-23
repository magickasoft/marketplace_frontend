import React, { PropTypes } from 'react';
// import {
//     LinkContainer
// } from 'react-router-bootstrap';
import {
    FormControl,
    ButtonGroup,
    Button
} from 'react-bootstrap';
import FIcon from 'react-fontawesome';
import {
    compose,
    property
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import AsyncIcon from 'components/AsyncIcon';
import Dropdown from 'components/Dropdown';


const dateTimeTuple = PropTypes_.Tuple([
    PropTypes.string.isRequired,
    PropTypes.string.isRequired
]);

const pTargetValue = compose(
    property('value'),
    property('target')
);

export function ButtonEdit({ storyId, ...props }) {
    // return (
    //     <LinkContainer to={`/story/${storyId}`}>
    //         <Button title="Edit story" {...props} >
    //             <FIcon name="edit" />
    //         </Button>
    //     </LinkContainer>
    // );
    return (
        <a href={`/story/${storyId}`} title="Edit story" {...props}>Edit</a>
    );
}

ButtonEdit.propTypes = {
    storyId: PropTypes.string.isRequired
};

export function ButtonDelete(props) {
    // return (
    //     <Button
    //         bsStyle="danger"
    //         title="Delete story"
    //         {...props}
    //     >
    //         <AsyncIcon name="trash" busy={props.disabled} />
    //     </Button>
    // );
    return (
        <a href={'#'} title="Delete story" {...props}>Delete</a>
    );
}

ButtonDelete.propTypes = {
    disabled: PropTypes.bool.isRequired
};

export function CheckboxDailyDose(props) {
    const iconName = props.checked ? 'check-square-o' : 'square-o';

    return props.changeable ? (
        (
            <div
                disabled={props.disabled}
                onClick={() => props.onChange(!props.checked)}
                title="Switch editor pick"
            >
                <AsyncIcon
                    name={iconName}
                    busy={props.busy}
                />
            </div>
        )
    ) : (
        <FIcon name={iconName} fixedWidth />
    );
}

CheckboxDailyDose.propTypes = {
    changeable: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    busy: PropTypes.bool.isRequired,

    onChange: PropTypes.func.isRequired
};


function ButtonCalendar({ busy, ...props}) {
    return (
        <Button title="Change Publish Date" {...props}>
            <AsyncIcon
                name="calendar"
                busy={busy}
            />
        </Button>
    );
}

ButtonCalendar.propTypes = {
    busy: PropTypes.bool.isRequired
};


function PublishDatePicker(props) {
    const [ date, time ] = props.dateTime;

    return (
        <div>
            <FormControl
                type="date"
                value={date}
                placeholder="YYYY-MM-DD"
                disabled={props.disabled}
                onChange={compose(props.onDateChange, pTargetValue)}
            />

            <FormControl
                type="time"
                value={time}
                placeholder="HH:mm"
                disabled={props.disabled}
                onChange={compose(props.onTimeChange, pTargetValue)}
            />

            <ButtonGroup>
                <Button
                    title="Save the Publish Date"
                    disabled={props.disabled}
                    onClick={props.onSave}
                >
                    Save
                </Button>

                <Button onClick={props.onCancel}>
                    Cancel
                </Button>
            </ButtonGroup>
        </div>
    );
}

PublishDatePicker.propTypes = {
    dateTime: dateTimeTuple.isRequired,
    disabled: PropTypes.bool.isRequired,

    onDateChange: PropTypes.func.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export function PublishDateDropdown(props) {
    return (
        <Dropdown
            menu={props.dateTime.map(dateTime => (
                <PublishDatePicker
                    dateTime={dateTime}
                    disabled={props.disabled}
                    deleted={props.deleted}
                    onDateChange={props.onDateChange}
                    onTimeChange={props.onTimeChange}
                    onSave={props.onSave}
                    onCancel={props.onHide}
                />
            ))}
        >
            <ButtonCalendar
                onClick={() => props.dateTime.cata({
                    Nothing: props.onShow,
                    Just: props.onHide
                })}
                disabled={props.disabled}
                busy={props.busy}
            />
        </Dropdown>
    );
}

PublishDateDropdown.propTypes = {
    dateTime: PropTypes_.Maybe(
        dateTimeTuple.isRequired
    ).isRequired,
    disabled: PropTypes.bool.isRequired,
    busy: PropTypes.bool.isRequired,

    onDateChange: PropTypes.func.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onShow: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired
};
