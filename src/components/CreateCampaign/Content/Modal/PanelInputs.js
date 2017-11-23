import React, { PropTypes } from 'react';
import {
    Row,
    Col,
    FormControl,
    Checkbox
} from 'react-bootstrap';
import {
    compose,
    property
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    maybeFromString
} from 'utils';
import PropTypes_ from 'utils/prop-types';
import GroupSelectAsync from 'components/GroupSelectAsync';
import GroupInput from 'components/GroupInput';
import TextEditor from 'components/TextEditor';


const pTitle = property('title');
const pSubtitle = property('subtitle');
const pChannel = property('channel');
const pDescription = property('description');
const pTermsAndConditions = property('termsAndConditions');
const pValidDate = property('validDate');
const pButtonText = compose(
    property('text'),
    property('button')
);
const pShareable = property('shareable');
const pTarget = property('target');
const pTargetValue = compose(
    property('value'),
    pTarget
);
const pTargetChecked = compose(
    property('checked'),
    pTarget
);

export default function PanelInputs(props) {
    const [ validDate, validTime ] = props.fields.validDate;

    return (
        <div>
            <GroupSelectAsync
                label={Just('Channel *')}
                errors={props.errors.chain(pChannel)}
                options={props.channels}
                value={props.fields.channel}
                placeholder="Choose A Channel"
                disabled={props.busy}
                onChange={props.onChangeChannel}
                onReceiveAgain={props.onReceiveChannels}
            />

            <GroupInput
                label={Just('Headline *')}
                errors={props.errors.chain(pTitle)}
            >
                <FormControl
                    type="text"
                    value={props.fields.title}
                    placeholder="Write a headline"
                    autoFocus
                    disabled={props.busy}
                    onChange={compose(
                        props.onChangeTitle,
                        pTargetValue
                    )}
                />
            </GroupInput>

            <GroupInput
                label={Just('Valid Date *')}
                errors={props.errors.chain(pValidDate)}
            >
                <Row>
                    <Col xs={6}>
                        <FormControl
                            type="date"
                            value={validDate}
                            placeholder="YYYY-MM-DD"
                            disabled={props.busy}
                            onChange={compose(
                                mDate => props.onChangeValidDate(mDate, Just(validTime)),
                                maybeFromString,
                                pTargetValue
                            )}
                        />
                    </Col>

                    <Col xs={6}>
                        <FormControl
                            type="time"
                            value={validTime}
                            placeholder="HH:mm"
                            disabled={props.busy}
                            onChange={compose(
                                mTime => props.onChangeValidDate(Just(validDate), mTime),
                                maybeFromString,
                                pTargetValue
                            )}
                        />
                    </Col>
                </Row>
            </GroupInput>

            <GroupInput
                label={Just('Sub headline')}
                errors={props.errors.chain(pSubtitle)}
            >
                <FormControl
                    style={{ resize: 'none' }}
                    rows={3}
                    componentClass="textarea"
                    placeholder="Write a sub headline"
                    disabled={props.busy}
                    value={props.fields.subtitle.getOrElse('')}
                    onChange={compose(
                        props.onChangeSubtitle,
                        pTargetValue
                    )}
                />
            </GroupInput>

            <GroupInput
                label={Just('How it works')}
                errors={props.errors.chain(pDescription)}
            >
                <TextEditor
                    readOnly={props.busy}
                    placeholder="Write a description"
                    value={props.fields.description.getOrElse('')}
                    onChange={props.onChangeDescription}
                />
            </GroupInput>

            <GroupInput
                label={Just('Terms and conditions')}
                errors={props.errors.chain(pTermsAndConditions)}
            >
                <TextEditor
                    readOnly={props.busy}
                    placeholder="Write terms and conditions"
                    value={props.fields.termsAndConditions.getOrElse('')}
                    onChange={props.onChangeTermsAndConditions}
                />
            </GroupInput>

            <GroupInput
                label={Just('Activate button text')}
                errors={props.errors.chain(pButtonText)}
            >
                <FormControl
                    type="text"
                    value={props.fields.button.text.getOrElse('')}
                    placeholder="Write a button text"
                    disabled={props.busy}
                    onChange={compose(
                        props.onChanteButtonText,
                        pTargetValue
                    )}
                />
            </GroupInput>

            <GroupInput
                label={Nothing()}
                errors={props.errors.chain(pShareable)}
            >
                <Checkbox
                    checked={props.fields.shareable}
                    onChange={compose(
                        props.onChangeSharable,
                        pTargetChecked
                    )}
                    disabled={props.busy}
                >
                    Shareable
                </Checkbox>
            </GroupInput>
        </div>
    );
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

const mBunch = PropTypes_.Maybe(
    PropTypes_.bunch.isRequired
);

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

const mArrayOfString = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

PanelInputs.propTypes = {
    fields: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: mString.isRequired,
        subtitle: mString.isRequired,
        termsAndConditions: mString.isRequired,
        validDate: PropTypes_.Tuple([
            PropTypes.string.isRequired,
            PropTypes.string.isRequired
        ]).isRequired,
        shareable: PropTypes.bool.isRequired,
        button: PropTypes.shape({
            text: mString.isRequired
        }).isRequired,
        channel: mBunch.isRequired
    }).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: mShape({
        title: mArrayOfString.isRequired,
        description: mString.isRequired,
        subtitle: mArrayOfString.isRequired,
        termsAndConditions: mArrayOfString.isRequired,
        validDate: mArrayOfString.isRequired,
        shareable: mArrayOfString.isRequired,
        button: PropTypes.shape({
            text: mArrayOfString.isRequired
        }).isRequired,
        channel: mArrayOfString.isRequired
    }).isRequired,
    channels: PropTypes.object.isRequired,

    onChangeTitle: PropTypes.func.isRequired,
    onChangeDescription: PropTypes.func.isRequired,
    onChangeSubtitle: PropTypes.func.isRequired,
    onChangeTermsAndConditions: PropTypes.func.isRequired,
    onChangeValidDate: PropTypes.func.isRequired,
    onChangeSharable: PropTypes.func.isRequired,
    onChanteButtonText: PropTypes.func.isRequired,
    onChangeChannel: PropTypes.func.isRequired,
    onReceiveChannels: PropTypes.func.isRequired
};
