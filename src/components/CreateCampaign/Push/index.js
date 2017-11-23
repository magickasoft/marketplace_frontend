import React, { PropTypes } from 'react';
import {
    Row,
    Col,
    Form,
    FormGroup,
    FormControl,
    HelpBlock,
    ControlLabel,
    Checkbox,
    Radio,
    Button,
    ButtonGroup
} from 'react-bootstrap';
import {
    compose,
    constant,
    property,
    map,
    F
} from 'lodash/fp';

import {
    PREVIEW_TYPE_IOS,
    PREVIEW_TYPE_ANDROID
} from 'models/push';

import PropTypes_ from 'utils/prop-types';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

import IOSPreview from './IOSPreview';
import AndroidPreview from './AndroidPreview';

const cIOS = constant(PREVIEW_TYPE_IOS);
const cAndroid = constant(PREVIEW_TYPE_ANDROID);
const cError = constant('error');
const pTitle = property('title');
const pMessage = property('message');
const pSendAt = property('sendAt');
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

const mapErrors = map(error => (
    <HelpBlock key={error}>{error}</HelpBlock>
));

function Push(props) {
    const mTitleErrors = props.errors.chain(pTitle);
    const mMessageErrors = props.errors.chain(pMessage);
    const mSendAtErrors = props.errors.chain(pSendAt);
    const mCommonErrors = props.errors.chain(pCommon);
    const whenStart = props.fields.sendAt.map(F).getOrElse(true);
    const [ sendAtDate, sendAtTime ] = props.fields.sendAt.getOrElse([ '', '' ]);

    const strTitle = props.fields.title.getOrElse('');
    const strMessage = props.fields.message.getOrElse('');

    return (
        <Form
            noValidate
            onSubmit={event => {
                props.goNextTabHandler();
                event.preventDefault();
            }}
        >
            <FormGroup>
                <h3>
                    Compose push notification
                </h3>
            </FormGroup>

            <Row>
                <Col xs={12} sm={7}>
                    <FormGroup>
                        <Checkbox
                            checked={props.enabled}
                            onChange={compose(
                                props.enablePushHandler,
                                pTargetChecked
                            )}
                        >
                            Use Push Notification to notify users
                        </Checkbox>
                    </FormGroup>

                    <FormGroup validationState={mTitleErrors.map(cError).getOrElse(null)}>
                        <div styleName="length-info">
                            Used {strTitle.length} of maximum {props.maxTitleLength} characters
                        </div>
                        <ControlLabel>
                            Title
                        </ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            placeholder="Title"
                            disabled={!props.enabled}
                            value={strTitle}
                            onChange={compose(
                                props.changeTitleHandler,
                                pTargetValue
                            )}
                        />

                        {mTitleErrors.map(mapErrors).getOrElse(null)}
                    </FormGroup>

                    <FormGroup validationState={mMessageErrors.map(cError).getOrElse(null)}>
                        <div styleName="length-info">
                            Used {strMessage.length} of maximum {props.maxMessageLength} characters
                        </div>
                        <ControlLabel>
                            Message
                        </ControlLabel>
                        <FormControl
                            style={{
                                resize: 'none'
                            }}
                            rows={7}
                            componentClass="textarea"
                            placeholder="Message"
                            disabled={!props.enabled}
                            value={strMessage}
                            onChange={compose(
                                props.changeMessageHandler,
                                pTargetValue
                            )}
                        />

                        {mMessageErrors.map(mapErrors).getOrElse(null)}
                    </FormGroup>

                    <FormGroup validationState={mSendAtErrors.map(cError).getOrElse(null)}>
                        <ControlLabel>
                            Choose When To Send Push
                        </ControlLabel>

                        <Radio
                            checked={whenStart}
                            disabled={!props.enabled}
                            onChange={props.selectOnStartHandler}
                        >
                            On campaign start
                        </Radio>

                        <Radio
                            checked={!whenStart}
                            disabled={!props.enabled}
                            onChange={props.selectOnFutureHandler}
                        >
                            Schedule for later
                        </Radio>

                        <Row>
                            <Col xs={6}>
                                <FormControl
                                    type="date"
                                    value={sendAtDate}
                                    placeholder="YYYY-MM-DD"
                                    disabled={!props.enabled || whenStart}
                                    onChange={compose(
                                        props.changeSendAtDateHandler,
                                        pTargetValue
                                    )}
                                />
                            </Col>

                            <Col xs={6}>
                                <FormControl
                                    type="time"
                                    value={sendAtTime}
                                    placeholder="HH:mm"
                                    disabled={!props.enabled || whenStart}
                                    onChange={compose(
                                        props.changeSendAtTimeHandler,
                                        pTargetValue
                                    )}
                                />
                            </Col>
                        </Row>

                        {mSendAtErrors.map(mapErrors).getOrElse(null)}
                    </FormGroup>
                </Col>

                {props.enabled && (
                    <Col xs={12} sm={5}>
                        <h4>Notification Preview</h4>
                        <ButtonGroup justified>
                            <Button href="#"
                                    onClick={compose(
                                        props.changePreviewTypeHandler,
                                        cAndroid
                                    )}
                                    active={props.previewType === PREVIEW_TYPE_ANDROID}>
                                Android
                            </Button>
                            <Button href="#"
                                    onClick={compose(
                                        props.changePreviewTypeHandler,
                                        cIOS
                                    )}
                                    active={props.previewType === PREVIEW_TYPE_IOS}>
                                iOS
                            </Button>
                        </ButtonGroup>
                        <div styleName="wrapper">
                            {props.previewType === PREVIEW_TYPE_IOS ? (
                                <IOSPreview title={props.fields.title} message={props.fields.message} />
                            ) : (
                                <AndroidPreview title={props.fields.title} message={props.fields.message} />
                            )}
                        </div>
                    </Col>
                )}
            </Row>

            <FormGroup validationState={mCommonErrors.map(cError).getOrElse(null)}>
                <Row>
                    <Col xs={12} sm={5} smOffset={4}>
                        {mCommonErrors.map(mapErrors).getOrElse(null)}
                    </Col>

                    <Col xs={12} sm={3}>
                        <Button type="submit" block>
                            Next
                        </Button>
                    </Col>
                </Row>
            </FormGroup>
        </Form>
    );
}

const errorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

Push.propTypes = {
    enabled: PropTypes.bool.isRequired,
    previewType: PropTypes.string.isRequired,
    fields: PropTypes.shape({
        title: mString.isRequired,
        message: mString.isRequired,
        sendAt: PropTypes_.Maybe(
            PropTypes_.Tuple([
                PropTypes.string.isRequired,
                PropTypes.string.isRequired
            ]).isRequired
        ).isRequired
    }).isRequired,
    maxTitleLength: PropTypes.number.isRequired,
    maxMessageLength: PropTypes.number.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            title: errorsList.isRequired,
            message: errorsList.isRequired,
            sendAt: errorsList.isRequired,
            common: errorsList.isRequired
        }).isRequired
    ).isRequired,

    goNextTabHandler: PropTypes.func.isRequired,
    enablePushHandler: PropTypes.func.isRequired,
    changePreviewTypeHandler: PropTypes.func.isRequired,
    changeTitleHandler: PropTypes.func.isRequired,
    changeMessageHandler: PropTypes.func.isRequired,
    selectOnStartHandler: PropTypes.func.isRequired,
    selectOnFutureHandler: PropTypes.func.isRequired,
    changeSendAtDateHandler: PropTypes.func.isRequired,
    changeSendAtTimeHandler: PropTypes.func.isRequired
};

export default CSSModules(Push, styles);
