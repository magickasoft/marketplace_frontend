import React, { Component, PropTypes } from 'react';
import {
    withRouter
} from 'react-router';
import {
    connect
} from 'react-redux';
import {
    compose,
    constant
} from 'lodash/fp';

import {
    changeEmail,
    recoveryPassword as recoveryPasswordAction
} from 'actions/ui/recovery-password';
import {
    changeNewPassword,
    changeRepetitionPassword,
    changePassword as changePasswordAction
} from 'actions/ui/change-password';
import RecoveryPassword from 'components/RecoveryPassword';
import ChangePassword from 'components/ChangePassword';


class RecoveryPasswordContainer extends Component {
    render() {
        return this.props.params.code ? (
            <ChangePassword
                {...this.props.changePassword}
                changeNewPasswordHandler={this.props.changeNewPassword}
                changeRepetitionPasswordHandler={this.props.changeRepetitionPassword}
                changePasswordHandler={compose(
                    this.props.changePasswordAction,
                    constant(this.props.params.code)
                )}
            />
        ) : (
            <RecoveryPassword
                {...this.props.recoveryPassword}
                changeEmailHandler={this.props.changeEmail}
                recoveryPasswordHandler={this.props.recoveryPasswordAction}
            />
        );
    }
}

RecoveryPasswordContainer.propTypes = {
    params: PropTypes.shape({
        code: PropTypes.string
    }).isRequired,

    changePassword: PropTypes.object.isRequired,
    recoveryPassword: PropTypes.object.isRequired,

    changeNewPassword: PropTypes.func.isRequired,
    changeRepetitionPassword: PropTypes.func.isRequired,
    changePasswordAction: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    recoveryPasswordAction: PropTypes.func.isRequired
};

function select({ ui }) {
    return {
        changePassword: ui.changePassword,
        recoveryPassword: ui.recoveryPassword
    };
}

const bindActions = {
    changeEmail,
    recoveryPasswordAction,
    changeNewPassword,
    changeRepetitionPassword,
    changePasswordAction
};


export default compose(
    connect(select, bindActions),
    withRouter
)(RecoveryPasswordContainer);
