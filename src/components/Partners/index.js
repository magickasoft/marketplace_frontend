import React, { PropTypes } from 'react';
import {
    Grid,
    Row,
    Col,
    Panel,
    Table,
    ProgressBar,
    Pagination,
    HelpBlock,
    ButtonGroup,
    Button
} from 'react-bootstrap';
import FIcon from 'react-fontawesome';
import {
    map,
    property
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import {
    getBunchID
} from 'utils/bunch';
import DeleteDialog from 'components/DeleteDialog';


const pCommon = property('common');

const mapErrors = map(error => (
    <HelpBlock key={error}>{error}</HelpBlock>
));

const cellStyles = {
    verticalAlign: 'middle'
};

function Partners(props) {
    const mCommonError = props.errors.chain(pCommon);

    return (
        <Grid fluid>
            {props.deleting.map(deleting => (
                <DeleteDialog
                    busy={deleting.busy}
                    errors={deleting.errors.chain(pCommon)}
                    onCancel={props.abordDeleteHandler}
                    onDelete={props.confirmDeleteHandler}
                >
                    Do you really want to delete this channel?
                </DeleteDialog>
            )).getOrElse(null)}

            <Row>
                <Col xs={12} sm={10} componentClass="h1">
                    Channels
                </Col>

                {props.visibility.createButton && (
                    <Col xs={12} sm={2} style={{ marginTop: 25 }}>
                        <Button block onClick={props.openCreateHandler}>
                            Create New
                        </Button>
                    </Col>
                )}
            </Row>

            <Panel style={{ marginTop: 10 }}>
                {props.channels.cata({
                    Nothing: () => props.busy ? (
                        <ProgressBar active now={100}/>
                    ) : (
                        <div>
                            <Button onClick={props.tryReceivePageAgainHandler}>
                                Try to get channels again
                                <FIcon name="refresh" fixedWidth />
                            </Button>
                        </div>
                    ),

                    Just: channels => (
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {map(channel => (
                                    <tr key={getBunchID(channel.bunch)}>
                                        <td style={cellStyles}>{channel.title}</td>
                                        <td style={cellStyles}>
                                            <ButtonGroup>
                                                {channel.visibility.editButton && (
                                                    <Button
                                                        onClick={() => props.openUpdateHandler(channel.bunch)}
                                                    >
                                                        <FIcon name="edit" fixedWidth />
                                                    </Button>
                                                )}
                                                {channel.visibility.deleteButton && channel.deletable && <Button
                                                    onClick={() => props.openDeleteHandler(channel.bunch)}
                                                >
                                                    <FIcon name="trash" fixedWidth />
                                                </Button>}
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ), channels)}
                            </tbody>
                        </Table>
                    )
                })}

                {mCommonError.map(mapErrors).getOrElse(null)}

                {props.pageCount.map(pageCount => (
                    <Pagination
                        prev
                        next
                        first
                        last
                        ellipsis
                        items={pageCount}
                        maxButtons={5}
                        activePage={props.current}
                        onSelect={props.changePageHandler}
                    />
                )).getOrElse(null)}
            </Panel>
        </Grid>
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

Partners.propTypes = {
    visibility: PropTypes.shape({
        createButton: PropTypes.bool.isRequired
    }).isRequired,
    current: PropTypes.number.isRequired,
    deleting: mShape({
        busy: PropTypes.bool.isRequired,
        errors: mShape({
            common: mErrorsList.isRequired
        }).isRequired
    }).isRequired,
    busy: PropTypes.bool.isRequired,
    channels: PropTypes_.Maybe(
        PropTypes.arrayOf(
            PropTypes.shape({
                visibility: PropTypes.shape({
                    editButton: PropTypes.bool.isRequired,
                    deleteButton: PropTypes.bool.isRequired
                }).isRequired,
                bunch: PropTypes_.bunch.isRequired,
                title: PropTypes.string.isRequired,
                deletable: PropTypes.bool.isRequired
            }).isRequired
        ).isRequired
    ).isRequired,
    pageCount: PropTypes_.Maybe(
        PropTypes.number.isRequired
    ).isRequired,
    errors: mShape({
        common: mErrorsList.isRequired
    }).isRequired,

    changePageHandler: PropTypes.func.isRequired,
    tryReceivePageAgainHandler: PropTypes.func.isRequired,
    openCreateHandler: PropTypes.func.isRequired,
    openUpdateHandler: PropTypes.func.isRequired,
    openDeleteHandler: PropTypes.func.isRequired,
    confirmDeleteHandler: PropTypes.func.isRequired,
    abordDeleteHandler: PropTypes.func.isRequired
};

export default Partners;
