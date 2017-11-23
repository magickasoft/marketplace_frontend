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
    compose,
    map
} from 'lodash/fp';

import StoriesQueue from 'components/Stories/Queue';

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
    receivePage,
    deleteStory,
    updatePublishDate,
    updateIsDailyDose
} from 'actions/ui/stories-list/queue';
import {
    selectResults
} from './common';


class StoriesQueueContainer extends Component {
    render() {
        return (
            <StoriesQueue
                {...this.props.storiesList}
                receivePageAgainHandler={this.props.receivePage}
                showDeleteDialogHandler={this.props.showDeleteDialog}
                hideDeleteDialogHandler={this.props.hideDeleteDialog}
                deleteStoryHandler={this.props.deleteStory}
                showDatetimePickerHandler={this.props.showDatetimePicker}
                hideDatetimePickerHandler={this.props.hideDatetimePicker}
                changePublishDateHandler={this.props.changePublishDate}
                changePublishTimeHandler={this.props.changePublishTime}
                updatePublishDateHandler={this.props.updatePublishDate}
                updateIsDailyDoseHandler={this.props.updateIsDailyDose}
            />
        );
    }
}

StoriesQueueContainer.propTypes = {
    storiesList: PropTypes.object.isRequired,
    location: locationShape.isRequired,
    router: routerShape.isRequired,

    receivePage: PropTypes.func.isRequired,
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
            ...ui.storiesList.queue,
            showCreateButtons: true,
            results: ui.storiesList.queue.results
                .map(
                    map(
                        ([ date, list ]) => ([
                            date,
                            selectResults(state)(list)
                        ])
                    )
                )
        }
    };
}

const bindActions = {
    showDatetimePicker: compose(listAction, showDatetimePicker),
    hideDatetimePicker: compose(listAction, hideDatetimePicker),
    changePublishDate: compose(listAction, changePublishDate),
    changePublishTime: compose(listAction, changePublishTime),

    showDeleteDialog,
    hideDeleteDialog,
    receivePage,
    deleteStory,
    updatePublishDate,
    updateIsDailyDose
};

export default compose(
    connect(select, bindActions),
    withRouter
)(StoriesQueueContainer);
