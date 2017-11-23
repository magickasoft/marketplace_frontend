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
const pCommon = property('common');
const pTargetValue = compose(
    property('value'),
    property('target')
);

function RecoveryPassword(props) {
    const mEmailError = props.errors.chain(pEmail);
    const mCommonError = props.errors.chain(pCommon);

    return (
        <Grid>
            <Row>
                <Col sm={10} md={8} lg={6} smOffset={1} mdOffset={2} lgOffset={3}>
                    <h1>Forgot Your Password?</h1>

                    <Panel>
                        <Form
                            horizontal
                            noValidate
                            onSubmit={event => {
                                props.recoveryPasswordHandler();
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

                            <FormGroup validationState={mCommonError.map(cError).getOrElse(null)}>
                                <Col sm={10} smOffset={2}>
                                    {mCommonError.map(mapErrors).getOrElse(null)}
                                </Col>

                                <Col sm={10} smOffset={2}>
                                    <Button type="submit" disabled={props.busy}>
                                        Send
                                    </Button>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={10} smOffset={2}>
                                    Return to
                                    <LinkContainer to="/login">
                                        <Button bsStyle="link">
                                            Login page
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

RecoveryPassword.propTypes = {
    fields: PropTypes.shape({
        email: PropTypes.string.isRequired
    }).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            email: fieldErrorPropTypes.isRequired,
            common: fieldErrorPropTypes.isRequired
        }).isRequired
    ).isRequired,

    changeEmailHandler: PropTypes.func.isRequired,
    recoveryPasswordHandler: PropTypes.func.isRequired
};

export default RecoveryPassword;
