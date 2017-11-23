import React, { PropTypes } from 'react';
import {
    Panel,
    Table,
    Button
} from 'react-bootstrap';
import {
    map
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    dateToHumanReadable
} from 'utils';
import PropTypes_ from 'utils/prop-types';
import {
    getBunchID
} from 'utils/bunch';
import Placeholder from 'components/Placeholder';
import AlertErrors from 'components/AlertErrors';
import DeleteDialog from 'components/DeleteDialog';
import {
    StoriesTableRow
} from 'components/StoriesTable';
import {
    LinkContainer
} from 'react-router-bootstrap';


const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

const mArrayOf = itemType => PropTypes_.Maybe(
    PropTypes.arrayOf(itemType).isRequired
);

const mArrayOfString = mArrayOf(
    PropTypes.string.isRequired
);

function ListOfDay({ date, children, showCreateButtons, ...props }) {

    const emptyRow = showCreateButtons ? (
        <tr>
            <td>
                <LinkContainer to={`/story?publishDate=${date}`}>
                    <Button>Create Story</Button>
                </LinkContainer>
            </td>
        </tr>
    ) : (
        <tr>
            <td>&nbsp;</td>
        </tr>
    );

    return (
        <div>
            <h4>{dateToHumanReadable(date)}</h4>

            <Table striped bordered>
                <tbody>
                    {children.length ? map(item => (
                        <StoriesTableRow
                            {...props}
                            {...item}
                            key={getBunchID(item.bunch)}
                        />
                    ), children) : emptyRow}
                </tbody>
            </Table>
        </div>
    );
}

ListOfDay.propTypes = {
    date: PropTypes.string.isRequired,
    showCreateButtons: PropTypes.bool.isRequired,
    children: PropTypes.arrayOf(
        PropTypes.shape({
            bunch: PropTypes_.bunch.isRequired
        }).isRequired
    ).isRequired
};

export default function StoriesQueue(props) {

    return (
        <Panel>
            {props.deleteDialog.map(() => (
                <DeleteDialog
                    busy={false}
                    errors={Nothing()}
                    onCancel={props.hideDeleteDialogHandler}
                    onDelete={props.deleteStoryHandler}
                >
                    Do you realy want to delete this story?
                </DeleteDialog>
            )).getOrElse(null)}

            {props.errors.cata({
                Nothing: () => props.results.cata({
                    Nothing: () => (
                        <Placeholder busy={props.busy} size={[ '100%', '600px' ]} />
                    ),

                    Just: map(
                        ([ date, rows ]) => (
                            <ListOfDay {...props} date={date} key={date}>
                                {rows}
                            </ListOfDay>
                        )
                    )
                }),

                Just: errors => (
                    <AlertErrors
                        title="Something went wrong:"
                        errors={errors.common}
                        tryAgain={Just({
                            busy: props.busy,
                            handler: props.receivePageAgainHandler
                        })}
                    />
                )
            })}
        </Panel>
    );
}

StoriesQueue.propTypes = {
    results: mArrayOf(
        PropTypes_.Tuple([
            PropTypes.string.isRequired,
            PropTypes.array.isRequired
        ]).isRequired
    ).isRequired,
    deleteDialog: PropTypes_.Maybe(
        PropTypes_.bunch.isRequired
    ).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: mShape({
        common: mArrayOfString.isRequired
    }).isRequired,

    deleteStoryHandler: PropTypes.func.isRequired,
    receivePageAgainHandler: PropTypes.func.isRequired
};
