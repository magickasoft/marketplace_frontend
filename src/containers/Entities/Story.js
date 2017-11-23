import React, { Component, PropTypes } from 'react';
import {
    withRouter
} from 'react-router';
import {
    routerShape
} from 'react-router/lib/PropTypes';
import {
    connect
} from 'react-redux';
import {
    compose,
    constant
} from 'lodash/fp';
import {
    Nothing
} from 'data.maybe';

import PropTypes_ from 'utils/prop-types';
import {
    get,
    denormalize
} from 'utils';
import {
    STATUS_DRAFT as STORY_STATUS_DRAFT,
    STATUS_REVIEWED as STORY_STATUS_REVIEWED,
    STATUS_APPROVED as STORY_STATUS_APPROVED
} from 'models/story';
import {
    SIZE_SMALL as IMAGE_SIZE_SMALL,
    SIZE_LARGE as IMAGE_SIZE_LARGE
} from 'models/images';
import {
    SUPER_EDITOR,
    COUNTRY_EDITOR,
    ADMIN,
    somePermission
} from 'models/user';
import {
    receiveStory,
    receiveChannels,
    uploadImage,
    removeImage,
    changeTitle,
    changeDescription,
    changeText,
    changeAudioUrl,
    changeVideoUrl,
    changeDailyDose,
    changeChannel,
    changePublishDate,
    createOrUpdateStory,
    modalPreviewImage,
    modalPreviewImageAdd
} from 'actions/ui/story';
import Story from 'components/Story';


class StoryContainer extends Component {
    agreeWithCreation() {
        this.props.router.push('/content/stories/all');
    }

    render() {
        return (
            <Story
                {...this.props.story}
                receiveStoryHandler={this.props.receiveStory}
                receiveChannelsHandler={this.props.receiveChannels}

                modalPreviewSmallImageAddHandler={f => this.props.modalPreviewImageAdd(IMAGE_SIZE_SMALL, f)}
                modalPreviewLargeImageAddHandler={f => this.props.modalPreviewImageAdd(IMAGE_SIZE_LARGE, f)}

                modalPreviewSmallImageHandler={f => this.props.modalPreviewImage(IMAGE_SIZE_SMALL, f)}
                modalPreviewLargeImageHandler={f => this.props.modalPreviewImage(IMAGE_SIZE_LARGE, f)}

                uploadSmallImageHandler={f => this.props.uploadImage(IMAGE_SIZE_SMALL, f)}
                uploadLargeImageHandler={f => this.props.uploadImage(IMAGE_SIZE_LARGE, f)}
                removeSmallImageHandler={() => this.props.removeImage(IMAGE_SIZE_SMALL)}
                removeLargeImageHandler={() => this.props.removeImage(IMAGE_SIZE_LARGE)}
                changeTitleHandler={this.props.changeTitle}
                changeDescriptionHandler={this.props.changeDescription}
                changeTextHandler={this.props.changeText}
                changeAudioUrlHandler={this.props.changeAudioUrl}
                changeVideoUrlHandler={this.props.changeVideoUrl}
                changeDailyDoseHandler={this.props.changeDailyDose}
                changeChannelHandler={this.props.changeChannel}
                changePublishDateHandler={this.props.changePublishDate}
                saveAsDraftStoryHandler={compose(
                    this.props.createOrUpdateStory,
                    constant(STORY_STATUS_DRAFT)
                )}
                submitForReviewStoryHandler={compose(
                    this.props.createOrUpdateStory,
                    constant(STORY_STATUS_REVIEWED)
                )}
                approveStoryHandler={compose(
                    this.props.createOrUpdateStory,
                    constant(STORY_STATUS_APPROVED)
                )}
                agreeWithCreationHandler={this.agreeWithCreation.bind(this)}
            />
        );
    }
}

const mObject = PropTypes_.Maybe(
    PropTypes.object.isRequired
);

StoryContainer.propTypes = {
    router: routerShape.isRequired,

    story: PropTypes.shape({
        errors: PropTypes_.Tuple([
            mObject.isRequired,
            mObject.isRequired
        ]).isRequired
    }).isRequired,

    receiveStory: PropTypes.func.isRequired,
    receiveChannels: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    removeImage: PropTypes.func.isRequired,
    changeTitle: PropTypes.func.isRequired,
    changeDescription: PropTypes.func.isRequired,
    changeText: PropTypes.func.isRequired,
    changeAudioUrl: PropTypes.func.isRequired,
    changeVideoUrl: PropTypes.func.isRequired,
    changeDailyDose: PropTypes.func.isRequired,
    changeChannel: PropTypes.func.isRequired,
    changePublishDate: PropTypes.func.isRequired,
    createOrUpdateStory: PropTypes.func.isRequired,
    modalPreviewImage: PropTypes.func.isRequired,
    modalPreviewImageAdd: PropTypes.func.isRequired
};

const isEditable = ({ status }) => {
    switch (status) {
        case STORY_STATUS_DRAFT: {
            return true;
        }

        default: {
            return false;
        }
    }
};

function select({ ui, data, session }) {
    const [ mReceiveErrors, mSubmitErrors ] = ui.story.errors;
    const editable = denormalize(Nothing(), data, ui.story.bunch).map(isEditable).getOrElse(true);

    return {
        story: {
            ...ui.story,
            fields: ui.story.fields.map(fields => ({
                ...fields,
                images: {
                    small: get(IMAGE_SIZE_SMALL, fields.images),
                    large: get(IMAGE_SIZE_LARGE, fields.images)
                }
            })),
            modals: ui.story.modals.map(fields => ({
                ...fields,
                images: {
                    small: get(IMAGE_SIZE_SMALL, fields.images),
                    large: get(IMAGE_SIZE_LARGE, fields.images)
                }
            })),
            errors: [
                mReceiveErrors,
                mSubmitErrors.map(submitErrors => ({
                    ...submitErrors,
                    images: {
                        small: get(IMAGE_SIZE_SMALL, submitErrors.images),
                        large: get(IMAGE_SIZE_LARGE, submitErrors.images)
                    }
                }))
            ],
            channels: {
                ...ui.story.channels,
                results: ui.story.channels.results.map(
                    denormalize(Nothing(), data)
                )
            },
            visibility: {
                saveAsDraftButton: editable && somePermission([ ADMIN, SUPER_EDITOR, COUNTRY_EDITOR ], session.role),
                submitForReviewButton: editable && somePermission([ COUNTRY_EDITOR ], session.role),
                approveButton: somePermission([ ADMIN, SUPER_EDITOR ], session.role)
            }
        }
    };
}

const bindActions = {
    receiveStory,
    receiveChannels,
    uploadImage,
    removeImage,
    changeTitle,
    changeDescription,
    changeText,
    changeAudioUrl,
    changeVideoUrl,
    changeDailyDose,
    changeChannel,
    changePublishDate,
    createOrUpdateStory,
    modalPreviewImage,
    modalPreviewImageAdd
};


export default compose(
    connect(select, bindActions),
    withRouter
)(StoryContainer);
