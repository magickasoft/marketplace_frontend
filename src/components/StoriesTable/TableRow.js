import React, { PropTypes } from 'react';
// import {
//     ButtonGroup
// } from 'react-bootstrap';
import {
    compose,
    constant,
    property
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import {
    maybeFromString
} from 'utils';
import {
    getBunchID
} from 'utils/bunch';
import ErrorsList from './ErrorsList';
import {
    ButtonEdit,
    ButtonDelete,
    CheckboxDailyDose,
    PublishDateDropdown
} from './Controls';


const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

const mArrayOf = itemType => PropTypes_.Maybe(
    PropTypes.arrayOf(itemType).isRequired
);

const mArrayOfString = mArrayOf(
    PropTypes.string.isRequired
);

const dateTimeTuple = PropTypes_.Tuple([
    PropTypes.string.isRequired,
    PropTypes.string.isRequired
]);

const storyBusyTuple = PropTypes_.Tuple([
    PropTypes.bool.isRequired,
    PropTypes.bool.isRequired
]);

const pTitle = property('title');
const pPublishDate = property('publishDate');
const pIsDailyDose = property('isDailyDose');
const pCommon = property('common');


function TableMainCell(props) {
    return (
        <td
            style={{
                verticalAlign: 'middle',
                width: '30%',
                minWidth: '120px'
            }}
            {...props}
        />
    );
}

function TableCell(props) {
    return (
        <td
            style={{
                verticalAlign: 'middle',
                width: '10%',
                minWidth: '140px'
            }}
            {...props}
        />
    );
}

function TableSingleLineCell(props) {
    return (
        <td
            style={{
                verticalAlign: 'middle',
                width: '10%',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                minWidth: '170px'
            }}
            {...props}
        />
    );
}

function TableOnlyControlsCell(props) {
    return (
        <td
            style={{
                width: '10%',
                textAlign: 'center',
                minWidth: '170px',
                verticalAlign: 'middle'
            }}
            {...props}
        />
    );
}

function TableOnlyControlsNoWrapCell(props) {
    return (
        <td
            style={{
                width: '10%',
                whiteSpace: 'nowrap',
                textAlign: 'center'
            }}
            {...props}
        />
    );
}

export function TableRow(props) {
    const {
        story,
        pushedButtons,
        dateTimePicker,
        busy: [ editBusy, deleteBusy ],
        errors: [ mEditErrors, mDeleteErrors ]
    } = props;
    const [ currentDate, currentTime ] = story.publishDate;
    const storyId = getBunchID(story.bunch);

    return (
        <tr key={storyId}>
            <TableMainCell>{story.title}</TableMainCell>

            <TableCell>
                {story.channel.map(pTitle).getOrElse('-')}
            </TableCell>

            <TableSingleLineCell>{story.statusText}</TableSingleLineCell>

            <TableSingleLineCell>
                {`${story.publishDateText} `}
                {props.visibility.timePickButton && (
                    <PublishDateDropdown
                        dateTime={dateTimePicker}
                        disabled={editBusy}
                        busy={pushedButtons.publishDate}
                        onDateChange={date => props.changePublishDateHandler(
                            story.bunch,
                            maybeFromString(date).getOrElse(currentDate)
                        )}
                        onTimeChange={time => props.changePublishTimeHandler(
                            story.bunch,
                            maybeFromString(time).getOrElse(currentTime)
                        )}
                        onSave={compose(
                            props.updatePublishDateHandler,
                            constant(story.bunch)
                        )}
                        onShow={() => props.showDatetimePickerHandler(
                            story.bunch,
                            story.publishDate
                        )}
                        onHide={props.hideDatetimePickerHandler}
                    />
                )}

                {mEditErrors.chain(pPublishDate).map(errors => (
                    <ErrorsList>{errors}</ErrorsList>
                )).getOrElse(null)}
            </TableSingleLineCell>

            <TableOnlyControlsCell>
                <CheckboxDailyDose
                    changeable={props.visibility.isDailyDoseButton}
                    disabled={editBusy}
                    checked={story.isDailyDose}
                    busy={pushedButtons.isDailyDose}
                    onChange={checked => props.updateIsDailyDoseHandler(
                        story.bunch,
                        checked
                    )}
                />

                {mEditErrors.chain(pIsDailyDose).map(errors => (
                    <ErrorsList>{errors}</ErrorsList>
                )).getOrElse(null)}
            </TableOnlyControlsCell>

            <TableOnlyControlsNoWrapCell>
                {/* <ButtonGroup> */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap'
                }}>
                    {props.visibility.editButton && (
                        <ButtonEdit
                            storyId={storyId}
                            disabled={editBusy}
                        />
                    )}
                    {props.visibility.deleteButton && (
                        <ButtonDelete
                            disabled={deleteBusy}
                            onClick={compose(
                                props.showDeleteDialogHandler,
                                constant(story.bunch)
                            )}
                        />
                    )}
                </div>
                {/* </ButtonGroup> */}

                {mEditErrors
                    .chain(pCommon)
                    .orElse(() => mDeleteErrors.chain(pCommon))
                    .map(errors => (
                        <ErrorsList>{errors}</ErrorsList>
                    )).getOrElse(null)
                }
            </TableOnlyControlsNoWrapCell>
        </tr>
    );
}

TableRow.propTypes = {
    visibility: PropTypes.shape({
        timePickButton: PropTypes.bool.isRequired,
        isDailyDoseButton: PropTypes.bool.isRequired,
        editButton: PropTypes.bool.isRequired,
        deleteButton: PropTypes.bool.isRequired
    }).isRequired,
    story: PropTypes.shape({
        bunch: PropTypes_.bunch.isRequired,
        statusText: PropTypes.string.isRequired,
        publishDateText: PropTypes.string.isRequired,
        publishDate: dateTimeTuple.isRequired,
        isDailyDose: PropTypes.bool.isRequired,
        channel: PropTypes_.Maybe(
            PropTypes.shape({
                title: PropTypes.string.isRequired
            }).isRequired
        ).isRequired
    }).isRequired,
    dateTimePicker: PropTypes_.Maybe(
        dateTimeTuple.isRequired
    ).isRequired,
    pushedButtons: PropTypes.shape({
        publishDate: PropTypes.bool.isRequired,
        isDailyDose: PropTypes.bool.isRequired
    }).isRequired,
    busy: storyBusyTuple.isRequired,
    errors: PropTypes_.Tuple([
        mShape({
            publishDate: mArrayOfString.isRequired,
            isDailyDose: mArrayOfString.isRequired,
            common: mArrayOfString.isRequired
        }).isRequired,
        mShape({
            common: mArrayOfString.isRequired
        }).isRequired
    ]).isRequired,

    showDeleteDialogHandler: PropTypes.func.isRequired,
    hideDeleteDialogHandler: PropTypes.func.isRequired,
    deleteStoryHandler: PropTypes.func.isRequired,
    showDatetimePickerHandler: PropTypes.func.isRequired,
    hideDatetimePickerHandler: PropTypes.func.isRequired,
    changePublishDateHandler: PropTypes.func.isRequired,
    changePublishTimeHandler: PropTypes.func.isRequired,
    updatePublishDateHandler: PropTypes.func.isRequired,
    updateIsDailyDoseHandler: PropTypes.func.isRequired
};
