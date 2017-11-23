import React, { PropTypes } from 'react';
import {
    LinkContainer
} from 'react-router-bootstrap';
import {
    Grid,
    Row,
    Col,
    Panel,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Checkbox,
    Button,
    HelpBlock
} from 'react-bootstrap';
import {
    compose,
    property,
    constant,
    map
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';

const mapErrors = map(error => (
    <HelpBlock key={error}>{error}</HelpBlock>
));

const cError = constant('error');
const pEmail = property('email');
const pPassword = property('password');
const pCommon = property('common');
const pTarget = property('target');
const pTargetValue = compose(
    property('value'),
    pTarget
);
const pTargetChecked = compose(
    property('checked'),
    pTarget
);

function Login(props) {
    const mEmailError = props.errors.chain(pEmail);
    const mPasswordError = props.errors.chain(pPassword);
    const mCommonError = props.errors.chain(pCommon);

    return (
        <Grid>
            <Row>
                <Col sm={10} md={8} lg={6} smOffset={1} mdOffset={2} lgOffset={3}>
                    <h1>Login</h1>

                    <Panel>
                        <Form
                            horizontal
                            noValidate
                            onSubmit={event => {
                                props.loginHandler();
                                event.preventDefault();
                            }}
                        >
                            <FormGroup validationState={mEmailError.map(cError).getOrElse(null)}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Email
                                </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="email"
                                        placeholder="Email"
                                        autoFocus
                                        disabled={props.busy}
                                        value={props.fields.email}
                                        onChange={compose(
                                            props.changeEmailHandler,
                                            pTargetValue
                                        )}
                                    />

                                    {mEmailError.map(mapErrors).getOrElse(null)}
                                </Col>
                            </FormGroup>

                            <FormGroup validationState={mPasswordError.map(cError).getOrElse(null)}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Password
                                </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="password"
                                        placeholder="Password"
                                        disabled={props.busy}
                                        value={props.fields.password}
                                        onChange={compose(
                                            props.changePasswordHandler,
                                            pTargetValue
                                        )}
                                    />

                                    {mPasswordError.map(mapErrors).getOrElse(null)}
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={10} smOffset={2}>
                                    <Checkbox
                                        checked={props.fields.remembereMe}
                                        onChange={compose(
                                            props.setRememberMeHandler,
                                            pTargetChecked
                                        )}
                                        disabled={props.busy}
                                    >
                                        Remember me
                                    </Checkbox>
                                </Col>
                            </FormGroup>

                            <FormGroup validationState={mCommonError.map(cError).getOrElse(null)}>
                                <Col sm={10} smOffset={2}>
                                    {mCommonError.map(mapErrors).getOrElse(null)}
                                </Col>

                                <Col sm={10} smOffset={2}>
                                    <Button type="submit" disabled={props.busy}>
                                        Login
                                    </Button>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={10} smOffset={2}>
                                    <LinkContainer to="/restore-password">
                                        <Button bsStyle="link">
                                            Lost your Password?
                                        </Button>
                                    </LinkContainer>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Panel>
                </Col>
            </Row>
        </Grid>
    );
}

const fieldErrorPropTypes = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

Login.propTypes = {
    fields: PropTypes.shape({
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        remembereMe: PropTypes.bool.isRequired
    }).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            email: fieldErrorPropTypes.isRequired,
            password: fieldErrorPropTypes.isRequired,
            common: fieldErrorPropTypes.isRequired
        }).isRequired
    ).isRequired,

    changeEmailHandler: PropTypes.func.isRequired,
    changePasswordHandler: PropTypes.func.isRequired,
    setRememberMeHandler: PropTypes.func.isRequired,
    loginHandler: PropTypes.func.isRequired
};

export default Login;
