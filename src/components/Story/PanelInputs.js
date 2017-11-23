import React, { PropTypes } from 'react';
import {
    Row,
    Col,
    Panel,
    FormControl,
    FormGroup,
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
import ErrorsList from 'components/ErrorsList';
import TextEditor from 'components/TextEditor';


const pTitle = property('title');
const pDescription = property('description');
const pText = property('text');
const pPublishDate = property('publishDate');
const pIsDailyDose = property('isDailyDose');
const pChannel = property('channel');
const pTarget = property('target');
const pCommon = property('common');
const pTargetValue = compose(
    property('value'),
    pTarget
);
const pTargetChecked = compose(
    property('checked'),
    pTarget
);

export default function PanelInputs(props) {
    const [ , mSubmitErrors ] = props.errors;
    const [ publishDate, publishTime ] = props.fields.publishDate;

    return (
        <Panel>
            <GroupSelectAsync
                label={Just('Channel')}
                errors={mSubmitErrors.chain(pChannel)}
                options={props.channels}
                value={props.fields.channel}
                placeholder="Choose A Channel"
                disabled={props.busy}
                onChange={props.changeChannelHandler}
                onReceiveAgain={props.receiveChannelsHandler}
            />

            <GroupInput
                label={Just('Headline Text *')}
                errors={mSubmitErrors.chain(pTitle)}
            >
                <FormControl
                    type="text"
                    value={props.fields.title}
                    placeholder="Write a title"
                    autoFocus
                    disabled={props.busy}
                    onChange={compose(
                        props.changeTitleHandler,
                        pTargetValue
                    )}
                />
            </GroupInput>

            <GroupInput
                label={Just('Tagline')}
                errors={mSubmitErrors.chain(pDescription)}
            >
                <FormControl
                    style={{ resize: 'none' }}
                    rows={3}
                    componentClass="textarea"
                    placeholder="Write a tagline"
                    disabled={props.busy}
                    value={props.fields.description.getOrElse('')}
                    onChange={compose(
                        props.changeDescriptionHandler,
                        pTargetValue
                    )}
                />
            </GroupInput>

            <GroupInput
                label={Just('Story Text *')}
                errors={mSubmitErrors.chain(pText)}
            >
                <TextEditor
                    readOnly={props.busy}
                    placeholder="Write a story text"
                    value={props.fields.text}
                    onChange={props.changeTextHandler}
                />
            </GroupInput>

            <GroupInput
                label={Just('Publish At *')}
                errors={mSubmitErrors.chain(pPublishDate)}
            >
                <Row>
                    <Col xs={6}>
                        <FormControl
                            type="date"
                            value={publishDate}
                            placeholder="YYYY-MM-DD"
                            disabled={props.busy}
                            onChange={compose(
                                mDate => props.changePublishDateHandler(
                                    mDate,
                                    Just(publishTime)
                                ),
                                maybeFromString,
                                pTargetValue
                            )}
                        />
                    </Col>

                    <Col xs={6}>
                        <FormControl
                            type="time"
                            value={publishTime}
                            placeholder="HH:mm"
                            disabled={props.busy}
                            onChange={compose(
                                mTime => props.changePublishDateHandler(
                                    Just(publishDate),
                                    mTime
                                ),
                                maybeFromString,
                                pTargetValue
                            )}
                        />
                    </Col>
                </Row>
            </GroupInput>

            <GroupInput
                label={Nothing()}
                errors={mSubmitErrors.chain(pIsDailyDose)}
            >
                <Checkbox
                    checked={props.fields.isDailyDose}
                    onChange={compose(
                        props.changeDailyDoseHandler,
                        pTargetChecked
                    )}
                    disabled={props.busy}
                >
                    Editor Picks
                </Checkbox>
            </GroupInput>

            {mSubmitErrors.chain(pCommon).map(submitCommonErrors => (
                <FormGroup validationState="error">
                    <ErrorsList>{submitCommonErrors}</ErrorsList>
                </FormGroup>
            )).getOrElse(null)}
        </Panel>
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
    bunch: mBunch.isRequired,
    fields: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: mString.isRequired,
        text: PropTypes.string.isRequired,
        audioUrl: mString.isRequired,
        videoUrl: mString.isRequired,
        isDailyDose: PropTypes.bool.isRequired,
        channel: mBunch.isRequired,
        publishDate: PropTypes_.Tuple([
            PropTypes.string.isRequired,
            PropTypes.string.isRequired
        ]).isRequired
    }).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Tuple([
        PropTypes_.Maybe(
            PropTypes.object.isRequired
        ).isRequired,
        mShape({
            title: mArrayOfString.isRequired,
            description: mArrayOfString.isRequired,
            text: mArrayOfString.isRequired,
            audioUrl: mArrayOfString.isRequired,
            videoUrl: mArrayOfString.isRequired,
            isDailyDose: mArrayOfString.isRequired,
            channel: mArrayOfString.isRequired,
            publishDate: mArrayOfString.isRequired,
            common: mArrayOfString.isRequired
        }).isRequired
    ]).isRequired,
    channels: PropTypes.object.isRequired,

    receiveChannelsHandler: PropTypes.func.isRequired,
    changeTitleHandler: PropTypes.func.isRequired,
    changeDescriptionHandler: PropTypes.func.isRequired,
    changeTextHandler: PropTypes.func.isRequired,
    changeAudioUrlHandler: PropTypes.func.isRequired,
    changeVideoUrlHandler: PropTypes.func.isRequired,
    changeDailyDoseHandler: PropTypes.func.isRequired,
    changeChannelHandler: PropTypes.func.isRequired,
    changePublishDateHandler: PropTypes.func.isRequired
};
