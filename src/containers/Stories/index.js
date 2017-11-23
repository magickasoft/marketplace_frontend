import React, { Component, PropTypes } from 'react';
import {
    connect
} from 'react-redux';
import {
    routerShape
} from 'react-router/lib/PropTypes';
import {
    SUPER_EDITOR,
    ADMIN,
    somePermission
} from 'models/user';
import Stories from 'components/Stories';

class StoriesContainer extends Component {
    render() {
        return (
            <Stories {...this.props.stories} {...this.props.storiesList}>
                {this.props.children}
            </Stories>
        );
    }
}

const isAdminOrSuperEditor = somePermission([
    SUPER_EDITOR,
    ADMIN
]);

const select = state => {
    const { session, ui } = state;

    return {
        storiesList: {
            additionalField: {
                countForReview: ui.storiesList.additionalField.countForReview
            }
        },
        stories: {
            visibility: {
                reviewTab: isAdminOrSuperEditor(session.role)
            }
        }
    };
};

StoriesContainer.propTypes = {
    router: routerShape.isRequired,
    stories: PropTypes.object.isRequired,
    storiesList: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
};

const bindActions = {};

export default connect(select, bindActions)(StoriesContainer);
