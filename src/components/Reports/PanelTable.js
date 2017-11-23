import React, { PropTypes } from 'react';
import {
    Pagination,
    Table,
    Button
} from 'react-bootstrap';
import {
    LinkContainer
} from 'react-router-bootstrap';
import {
    map
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import Placeholder from 'components/Placeholder';
import AlertErrors from 'components/AlertErrors';
import {
    Sorter
} from 'components/Sorter';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

const mNumber = PropTypes_.Maybe(
    PropTypes.number.isRequired
);

const mFunc = PropTypes_.Maybe(
    PropTypes.func.isRequired
);

const mArray = PropTypes_.Maybe(
    PropTypes.array.isRequired
);

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

function Cell(props) {
    return (
        <td style={{ verticalAlign: 'middle' }} {...props} />
    );
}

function Summary(props) {
    return (
        <Table striped condensed styleName='summary-table'>
            <thead>
                <tr>
                    <th>
                        Campaign&nbsp;
                        <Sorter
                            disabled={props.busy}
                            onDescClick={props.sortByNameDescHandler}
                            onAscClick={props.sortByNameAscHandler}
                        />
                    </th>
                    <th>Push Sent</th>
                    <th>Push Opens</th>
                    <th>Offer Views</th>
                    <th>Offer URL Clicks</th>
                    <th>Offer Activates</th>
                </tr>
            </thead>

            <tbody>
                {map(({ campaign, metrics }) => (
                    <tr key={campaign.id}>
                        <Cell>
                            <LinkContainer to={`/reports/campaign/${campaign.id}`}>
                                <Button bsStyle="link">
                                    {campaign.name}
                                </Button>
                            </LinkContainer>
                        </Cell>
                        <Cell>{metrics.pushSent}</Cell>
                        <Cell>{metrics.pushOpened}</Cell>
                        <Cell>{metrics.offerView}</Cell>
                        <Cell>{metrics.offerUrlClick}</Cell>
                        <Cell>{metrics.offerActivate}</Cell>
                    </tr>
                ), props.rows)}
            </tbody>
        </Table>
    );
}

Summary.propTypes = {
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            campaign: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            }).isRequired,
            metrics: PropTypes.shape({
                pushSent: PropTypes.number.isRequired,
                pushOpened: PropTypes.number.isRequired,
                offerView: PropTypes.number.isRequired,
                offerUrlClick: PropTypes.number.isRequired,
                offerActivate: PropTypes.number.isRequired
            }).isRequired
        }).isRequired
    ),
    busy: PropTypes.bool.isRequired,

    sortByNameDescHandler: mFunc.isRequired,
    sortByNameAscHandler: mFunc.isRequired
};
const SummaryTable = CSSModules(Summary, styles);

export default function PanelTable(props) {
    return (
        <div>
            {props.table.results.cata({
                Nothing: () => (
                    <Placeholder busy={props.table.busy} size={[ '100%', '400px' ]} />
                ),

                Just: rows => (
                    <SummaryTable
                        rows={rows}
                        busy={props.table.busy}
                        sortByNameDescHandler={props.sortByNameDescHandler}
                        sortByNameAscHandler={props.sortByNameAscHandler}
                    />
                )
            })}

            {props.table.errors.map(errors => (
                <AlertErrors
                    title="Something went wrong:"
                    errors={errors.common}
                    tryAgain={props.receiveTableAgainHandler.map(handler => ({
                        busy: props.table.busy,
                        handler
                    }))}
                />
            )).getOrElse(null)}

            {props.pageCount.map(pageCount => current => (
                <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    items={pageCount}
                    maxButtons={5}
                    activePage={current}
                    onSelect={props.changePageHandler}
                />
            )).ap(props.page).getOrElse(null)}
        </div>
    );
}

PanelTable.propTypes = {
    page: mNumber.isRequired,
    pageCount: mNumber.isRequired,
    table: PropTypes.shape({
        results: PropTypes_.Maybe(
            PropTypes.array.isRequired
        ).isRequired,
        busy: PropTypes.bool.isRequired,
        errors: mShape({
            common: mArray.isRequired
        }).isRequired
    }).isRequired,

    changePageHandler: PropTypes.func.isRequired,
    sortByNameDescHandler: mFunc.isRequired,
    sortByNameAscHandler: mFunc.isRequired,
    receiveTableAgainHandler: mFunc.isRequired
};
