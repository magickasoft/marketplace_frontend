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
const pNewPassword = property('newPassword');
const pRepetitionPassword = property('repetitionPassword');
const pCommon = property('common');
const pTargetValue = compose(
    property('value'),
    property('target')
);

function ChangePassword(props) {
    const mNewPasswordError = props.errors.chain(pNewPassword);
    const mRepetitionPasswordError = props.errors.chain(pRepetitionPassword);
    const mCommonError = props.errors.chain(pCommon);

    return (
        <Grid>
            <Row>
                <Col sm={10} md={8} lg={6} smOffset={1} mdOffset={2} lgOffset={3}>
                    <h1>Change Your Password</h1>

                    <Panel>
                        <Form
                            horizontal
                            noValidate
                            onSubmit={event => {
                                props.changePasswordHandler();
                                event.preventDefault();
                            }}
                        >
                            <FormGroup validationState={mNewPasswordError.map(cError).getOrElse(null)}>
                                <Col componentClass={ControlLabel} sm={4}>
                                    New Password
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="password"
                                        placeholder="New Password"
                                        autoFocus
                                        disabled={props.busy}
                                        value={props.fields.newPassword}
                                        onChange={compose(
                                            props.changeNewPasswordHandler,
                                            pTargetValue
                                        )}
                                    />

                                    {mNewPasswordError.map(mapErrors).getOrElse(null)}
                                </Col>
                            </FormGroup>

                            <FormGroup validationState={mRepetitionPasswordError.map(cError).getOrElse(null)}>
                                <Col componentClass={ControlLabel} sm={4}>
                                    New Password Again
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="password"
                                        placeholder="Repetition New Password"
                                        disabled={props.busy}
                                        value={props.fields.repetitionPassword}
                                        onChange={compose(
                                            props.changeRepetitionPasswordHandler,
                                            pTargetValue
                                        )}
                                    />

                                    {mRepetitionPasswordError.map(mapErrors).getOrElse(null)}
                                </Col>
                            </FormGroup>

                            <FormGroup validationState={mCommonError.map(cError).getOrElse(null)}>
                                <Col sm={8} smOffset={4}>
                                    {mCommonError.map(mapErrors).getOrElse(null)}
                                </Col>

                                <Col sm={8} smOffset={4}>
                                    <Button type="submit" disabled={props.busy}>
                                        Change Password
                                    </Button>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col sm={8} smOffset={4}>
                                    <LinkContainer to="/login">
                                        <Button bsStyle="link">
                                            Remember your Password?
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

ChangePassword.propTypes = {
    fields: PropTypes.shape({
        newPassword: PropTypes.string.isRequired,
        repetitionPassword: PropTypes.string.isRequired
    }).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            newPassword: fieldErrorPropTypes.isRequired,
            repetitionPassword: fieldErrorPropTypes.isRequired,
            common: fieldErrorPropTypes.isRequired
        }).isRequired
    ).isRequired,

    changeNewPasswordHandler: PropTypes.func.isRequired,
    changeRepetitionPasswordHandler: PropTypes.func.isRequired,
    changePasswordHandler: PropTypes.func.isRequired
};

export default ChangePassword;
