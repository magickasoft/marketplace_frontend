import React, { PropTypes } from 'react';
import {
    Panel,
    Table,
    Pagination
} from 'react-bootstrap';
import {
    map
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import PropTypes_ from 'utils/prop-types';
import {
    getBunchID
} from 'utils/bunch';
import Placeholder from 'components/Placeholder';
import Disabler from 'components/Disabler';
import AlertErrors from 'components/AlertErrors';
import DeleteDialog from 'components/DeleteDialog';
import {
    StoriesTableHeader,
    StoriesTableRow
} from 'components/StoriesTable';


const mNumber = PropTypes_.Maybe(
    PropTypes.number.isRequired
);

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

const mArrayOf = itemType => PropTypes_.Maybe(
    PropTypes.arrayOf(itemType).isRequired
);

const mArrayOfString = mArrayOf(
    PropTypes.string.isRequired
);

export default function StoriesReview(props) {
    return (
        <Panel>
            {props.deleteDialog.map(() => (
                <DeleteDialog
                    errors={Nothing()}
                    busy={false}
                    onCancel={props.hideDeleteDialogHandler}
                    onDelete={props.deleteStoryHandler}
                >
                    Do you really want to delete this story?
                </DeleteDialog>
            )).getOrElse(null)}

            {props.errors.cata({
                Nothing: () => props.results.cata({
                    Nothing: () => (
                        <Placeholder busy={props.busy} size={[ '100%', '600px' ]}/>
                    ),

                    Just: results => (
                        <Table striped bordered>
                            <StoriesTableHeader busy={props.busy}>
                                {props.columns}
                            </StoriesTableHeader>
                            <tbody>
                                {map(item => (
                                    <StoriesTableRow
                                        {...props}
                                        {...item}
                                        key={getBunchID(item.bunch)}
                                    />
                                ), results)}
                            </tbody>
                        </Table>
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

            {props.pageCount.map(pageCount => currentPage => (
                <Disabler active={props.busy}>
                    <Pagination
                        prev
                        next
                        first
                        last
                        ellipsis
                        items={pageCount}
                        maxButtons={5}
                        activePage={currentPage}
                        onSelect={props.changePageHandler}
                    />
                </Disabler>
            )).ap(props.currentPage).getOrElse(null)}
        </Panel>
    );
}

StoriesReview.propTypes = {
    columns: PropTypes.array.isRequired,
    results: mArrayOf(
        PropTypes.shape({
            bunch: PropTypes_.bunch.isRequired
        }).isRequired
    ).isRequired,
    deleteDialog: PropTypes_.Maybe(
        PropTypes_.bunch.isRequired
    ).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: mShape({
        common: mArrayOfString.isRequired
    }).isRequired,
    currentPage: mNumber.isRequired,
    pageCount: mNumber.isRequired,

    changePageHandler: PropTypes.func.isRequired,
    deleteStoryHandler: PropTypes.func.isRequired,
    receivePageAgainHandler: PropTypes.func.isRequired
};
