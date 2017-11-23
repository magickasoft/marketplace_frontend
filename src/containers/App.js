import React, { Component, PropTypes } from 'react';
import {
    connect
} from 'react-redux';
import Page from 'components/Page';
import {
    COUNTRY_MANAGER,
    SUPER_MANAGER,
    COUNTRY_EDITOR,
    SUPER_EDITOR,
    ADMIN,
    somePermission
} from 'models/user';

class AppContainer extends Component {
    render() {
        return (
            <Page {...this.props} />
        );
    }
}


const select = ({ session }) => ({
    nav_menu: {
        visibility: {
            contentTab: somePermission([ADMIN, SUPER_EDITOR, COUNTRY_EDITOR], session.role),
            campaignsTab: somePermission([ADMIN, SUPER_MANAGER, COUNTRY_MANAGER], session.role)
        }
    }
});

AppContainer.propTypes = {
    nav_menu: PropTypes.object.isRequired
};

const bindActions = {};

export default connect(select, bindActions)(AppContainer);
