import React, { Component, PropTypes } from 'react';
import {
    withRouter
} from 'react-router';
import {
    routerShape,
    locationShape
} from 'react-router/lib/PropTypes';
import {
    connect
} from 'react-redux';
import {
    isMatch,
    map,
    compose,
    property
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import PropTypes_ from 'utils/prop-types';
import {
    ORDER_ASC as QUERY_ORDER_ASC,
    ORDER_DESC as QUERY_ORDER_DESC,

    FIELD_TITLE as QUERY_FIELD_TITLE,
    FIELD_CHANNEL as QUERY_FIELD_CHANNEL,
    FIELD_STATUS as QUERY_FIELD_STATUS,
    FIELD_PUBLISH_DATE as QUERY_FIELD_PUBLISH_DATE,
    FIELD_IS_DAILY_DOSE as QUERY_FIELD_IS_DAILY_DOSE
} from 'services/queries';
import StoriesAll from 'components/Stories/All';
import {
    showDatetimePicker,
    hideDatetimePicker,
    changePublishDate,
    changePublishTime
} from 'actions/ui/stories-list';
import {
    listAction,
    showDeleteDialog,
    hideDeleteDialog,
    receivePageAgain,
    deleteStory,
    updatePublishDate,
    updateIsDailyDose
} from 'actions/ui/stories-list/all';
import {
    calcPageCount,
    selectResults
} from './common';


const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

function makeColumns(handler) {
    return map(
        ([ label, field ]) => ({
            label,
            sortDescHandler: handler(field, QUERY_ORDER_DESC),
            sortAscHandler: handler(field, QUERY_ORDER_ASC)
        }),
        [
            [ 'Story', QUERY_FIELD_TITLE ],
            [ 'Channel', QUERY_FIELD_CHANNEL ],
            [ 'Status', QUERY_FIELD_STATUS ],
            [ 'Publish Date', QUERY_FIELD_PUBLISH_DATE ],
            [ 'Editor Picks', QUERY_FIELD_IS_DAILY_DOSE ]
        ]
    );
}

class StoriesAllContainer extends Component {
    changeQuery(mPage, mSort, mOrder) {
        const { router, location } = this.props;

        router.push({
            pathname: '/content/stories/all',
            query: {
                page: mPage.getOrElse(location.query.page),
                sort: mSort.getOrElse(location.query.sort),
                order: mOrder.getOrElse(location.query.order)
            }
        });
    }

    changePage(page) {
        this.changeQuery(Just(page), Nothing(), Nothing());
    }

    changeSortAndOrder(mQuery) {
        return (sort, order) => mQuery
            .map(isMatch({ sort, order }))
            .chain(active => active ?
                Nothing() :
                Just(() => this.changeQuery(Nothing(), Just(sort), Just(order)))
            );
    }

    render() {
        const { storiesList } = this.props;
        const bindChangeSortAndOrder = this.changeSortAndOrder(storiesList.query);

        return (
            <StoriesAll
                {...storiesList}
                changePageHandler={this.changePage.bind(this)}
                receivePageAgainHandler={this.props.receivePageAgain}
                showDeleteDialogHandler={this.props.showDeleteDialog}
                hideDeleteDialogHandler={this.props.hideDeleteDialog}
                deleteStoryHandler={this.props.deleteStory}
                showDatetimePickerHandler={this.props.showDatetimePicker}
                hideDatetimePickerHandler={this.props.hideDatetimePicker}
                changePublishDateHandler={this.props.changePublishDate}
                changePublishTimeHandler={this.props.changePublishTime}
                updatePublishDateHandler={this.props.updatePublishDate}
                updateIsDailyDoseHandler={this.props.updateIsDailyDose}
                columns={makeColumns(this.changeSortAndOrder(storiesList.query))}
                sortByTitleDescHandler={bindChangeSortAndOrder(QUERY_FIELD_TITLE, QUERY_ORDER_DESC)}
                sortByTitleAscHandler={bindChangeSortAndOrder(QUERY_FIELD_TITLE, QUERY_ORDER_ASC)}
                sortByStatusDescHandler={bindChangeSortAndOrder(QUERY_FIELD_STATUS, QUERY_ORDER_DESC)}
                sortByStatusAscHandler={bindChangeSortAndOrder(QUERY_FIELD_STATUS, QUERY_ORDER_ASC)}
                sortByPublishDateDescHandler={bindChangeSortAndOrder(QUERY_FIELD_PUBLISH_DATE, QUERY_ORDER_DESC)}
                sortByPublishDateAscHandler={bindChangeSortAndOrder(QUERY_FIELD_PUBLISH_DATE, QUERY_ORDER_ASC)}
                sortByIsDailyDoseDescHandler={bindChangeSortAndOrder(QUERY_FIELD_IS_DAILY_DOSE, QUERY_ORDER_DESC)}
                sortByIsDailyDoseAscHandler={bindChangeSortAndOrder(QUERY_FIELD_IS_DAILY_DOSE, QUERY_ORDER_ASC)}
            />
        );
    }
}

StoriesAllContainer.propTypes = {
    storiesList: PropTypes.shape({
        query: mShape({
            sort: PropTypes.string.isRequired,
            order: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    location: locationShape.isRequired,
    router: routerShape.isRequired,

    receivePageAgain: PropTypes.func.isRequired,
    showDeleteDialog: PropTypes.func.isRequired,
    hideDeleteDialog: PropTypes.func.isRequired,
    deleteStory: PropTypes.func.isRequired,
    showDatetimePicker: PropTypes.func.isRequired,
    hideDatetimePicker: PropTypes.func.isRequired,
    changePublishDate: PropTypes.func.isRequired,
    changePublishTime: PropTypes.func.isRequired,
    updatePublishDate: PropTypes.func.isRequired,
    updateIsDailyDose: PropTypes.func.isRequired
};

function select(state) {
    const { ui } = state;

    return {
        storiesList: {
            ...ui.storiesList.all,
            results: ui.storiesList.all.results.map(
                selectResults(state)
            ),
            currentPage: ui.storiesList.all.query.map(property('page')),
            pageCount: ui.storiesList.all.total
                .map(calcPageCount)
                .chain(total => total < 2 ? Nothing() : Just(total))
        }
    };
}

const bindActions = {
    showDatetimePicker: compose(listAction, showDatetimePicker),
    hideDatetimePicker: compose(listAction, hideDatetimePicker),
    changePublishDate: compose(listAction, changePublishDate),
    changePublishTime: compose(listAction, changePublishTime),

    receivePageAgain,
    showDeleteDialog,
    hideDeleteDialog,
    deleteStory,
    updatePublishDate,
    updateIsDailyDose
};

export default compose(
    connect(select, bindActions),
    withRouter
)(StoriesAllContainer);
