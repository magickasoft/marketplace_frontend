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
    compose
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import {
    changeEmail,
    changePassword,
    setRememberMe,
    login as submitLogin
} from 'actions/ui/login';
import Login from 'components/Login';


class LoginContainer extends Component {
    componentDidUpdate() {
        const { user, location, router } = this.props;

        if (user.isJust) {
            if (location.state && location.state.nextPathname) {
                router.replace(location.state.nextPathname);
            } else {
                router.replace('/');
            }
        }
    }

    render() {
        return (
            <Login
                {...this.props.login}
                changeEmailHandler={this.props.changeEmail}
                changePasswordHandler={this.props.changePassword}
                setRememberMeHandler={this.props.setRememberMe}
                loginHandler={this.props.submitLogin}
            />
        );
    }
}

LoginContainer.propTypes = {
    router: routerShape.isRequired,
    location: locationShape.isRequired,

    login: PropTypes.object.isRequired,
    user: PropTypes_.Maybe(
        PropTypes.any.isRequired
    ).isRequired,

    changeEmail: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    setRememberMe: PropTypes.func.isRequired,
    submitLogin: PropTypes.func.isRequired
};

function select({ ui, session }) {
    return {
        login: ui.login,
        user: session.user
    };
}

const bindActions = {
    changeEmail,
    changePassword,
    setRememberMe,
    submitLogin
};

export default compose(
    connect(select, bindActions),
    withRouter
)(LoginContainer);
