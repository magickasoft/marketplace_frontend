import {
    constant,
    property,
    compose,
    reduce,
    toPairs,
    curry,
    keys,
    pick
} from 'lodash/fp';
import {
    batchActions
} from 'redux-batched-actions';
import {
    Nothing
} from 'data.maybe';

import {
    get,
    denormalize
} from 'utils';
import {
    getBunchID
} from 'utils/bunch';
import {
    sign as s3SignRequest
} from 'services/s3';
import {
    receiveChannelsPage as receiveChannelsPageRequest
} from 'services/campaign-manager';
import {
    createStory as createStoryRequest,
    getStory as getStoryRequest,
    updateStory as updateStoryRequest
} from 'services/campaign-manager/story';
import {
    update,
    merge
} from 'actions/data';


export const EMPTY = 'UI/STORY/EMPTY';

export function empty(fields) {
    return {
        type: EMPTY,
        payload: { fields }
    };
}

export const RECEIVE_STORY_START = 'UI/STORY/RECEIVE_STORY_START';

export function receiveStoryStart(bunch) {
    return {
        type: RECEIVE_STORY_START,
        payload: bunch
    };
}

export const RECEIVE_STORY_FAILURE = 'UI/STORY/RECEIVE_STORY_FAILURE';

export function receiveStoryFailure(errors) {
    return {
        type: RECEIVE_STORY_FAILURE,
        payload: errors
    };
}

export const RECEIVE_STORY_SUCCESS = 'UI/STORY/RECEIVE_STORY_SUCCESS';

export function receiveStorySuccess(entity) {
    return {
        type: RECEIVE_STORY_SUCCESS,
        payload: entity
    };
}

export const receiveStory = bunch => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.story.busy) {
        return Promise.resolve();
    }

    dispatch(
        receiveStoryStart(bunch)
    );

    return getStoryRequest(getBunchID(bunch))
        .then(({ entities }) => {
            dispatch(
                batchActions([
                    receiveStorySuccess(
                        denormalize(Nothing(), entities, bunch)
                    ),
                    merge(entities)
                ])
            );
        })
        .catch(errors => {
            dispatch(
                receiveStoryFailure(errors)
            );
        });
};

export const CHANGE_TITLE = 'UI/STORY/CHANGE_TITLE';

export function changeTitle(value) {
    return {
        type: CHANGE_TITLE,
        payload: value
    };
}

export const CHANGE_DESCRIPTION = 'UI/STORY/CHANGE_DESCRIPTION';

export function changeDescription(value) {
    return {
        type: CHANGE_DESCRIPTION,
        payload: value
    };
}

export const CHANGE_TEXT = 'UI/STORY/CHANGE_TEXT';

export function changeText(value) {
    return {
        type: CHANGE_TEXT,
        payload: value
    };
}

export const CHANGE_AUDIO_URL = 'UI/STORY/CHANGE_AUDIO_URL';

export function changeAudioUrl(value) {
    return {
        type: CHANGE_AUDIO_URL,
        payload: value
    };
}

export const CHANGE_VIDEO_URL = 'UI/STORY/CHANGE_VIDEO_URL';

export function changeVideoUrl(value) {
    return {
        type: CHANGE_VIDEO_URL,
        payload: value
    };
}

export const RECEIVE_CHANNELS_START = 'UI/STORY/RECEIVE_CHANNELS_START';

export function receiveChannelsStart() {
    return {
        type: RECEIVE_CHANNELS_START
    };
}

export const RECEIVE_CHANNELS_FAILURE = 'UI/STORY/RECEIVE_CHANNELS_FAILURE';

export function receiveChannelsFailure(errors) {
    return {
        type: RECEIVE_CHANNELS_FAILURE,
        payload: errors
    };
}

export const RECEIVE_CHANNELS_SUCCESS = 'UI/STORY/RECEIVE_CHANNELS_SUCCESS';

export function receiveChannelsSuccess(results) {
    return {
        type: RECEIVE_CHANNELS_SUCCESS,
        payload: results
    };
}

export const receiveChannels = () => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.story.channels.busy) {
        return Promise.resolve();
    }

    dispatch(
        receiveChannelsStart()
    );

    return receiveChannelsPageRequest(Nothing(), 1)
        .then(({ result, entities }) => {
            dispatch(
                batchActions([
                    receiveChannelsSuccess(result.results),
                    merge(entities)
                ])
            );
        })
        .catch(errors => {
            dispatch(
                receiveChannelsFailure(errors)
            );
        });
};

export const CHANGE_DAILY_DOSE = 'UI/STORY/CHANGE_DAILY_DOSE';

export function changeDailyDose(value) {
    return {
        type: CHANGE_DAILY_DOSE,
        payload: value
    };
}

export const CHANGE_CHANNEL = 'UI/STORY/CHANGE_CHANNEL';

export function changeChannel(value) {
    return {
        type: CHANGE_CHANNEL,
        payload: value
    };
}

export const CHANGE_PUBLISH_DATE = 'UI/STORY/CHANGE_PUBLISH_DATE';

export const changePublishDate = curry(
    (mDate, mTime) => ({
        type: CHANGE_PUBLISH_DATE,
        payload: [ mDate, mTime ]
    })
);

export const MODAL_PREVIEW_IMAGE = 'UI/STORY/MODAL_PREVIEW_IMAGE';

export const modalPreviewImage = curry(
    (size, value) => ({
        type: MODAL_PREVIEW_IMAGE,
        payload: { size, value }
    })
);

export const MODAL_PREVIEW_IMAGE_ADD = 'UI/STORY/MODAL_PREVIEW_IMAGE_ADD';

export const modalPreviewImageAdd = curry(
    (size, imgObj) => ({
        type: MODAL_PREVIEW_IMAGE_ADD,
        payload: { size, imgObj }
    })
);

export const REMOVE_IMAGE = 'UI/STORY/REMOVE_IMAGE';

export function removeImage(size) {
    return {
        type: REMOVE_IMAGE,
        payload: { size }
    };
}

export const UPLOAD_IMAGE_START = 'UI/STORY/UPLOAD_IMAGE_START';

export function uploadImageStart(size) {
    return {
        type: UPLOAD_IMAGE_START,
        payload: { size }
    };
}

export const UPLOAD_IMAGE_FAILURE = 'UI/STORY/UPLOAD_IMAGE_FAILURE';

export function uploadImageFailure(size, errors) {
    return {
        type: UPLOAD_IMAGE_FAILURE,
        payload: { size, errors }
    };
}

export const UPLOAD_IMAGE_SUCCESS = 'UI/STORY/UPLOAD_IMAGE_SUCCESS';

export function uploadImageSuccess(size, url) {
    return {
        type: UPLOAD_IMAGE_SUCCESS,
        payload: { size, url }
    };
}

const pBusy = property('busy');

export const uploadImage = curry(
    (size, image) => (dispatch, getState) => {
        const { ui } = getState();

        return ui.story.fields
            .map(fields => {
                if (get(size, fields.images).map(pBusy).getOrElse(false)) {
                    return Promise.resolve();
                }

                dispatch(
                    uploadImageStart(size)
                );

                return s3SignRequest(image)
                    .then(url => {
                        dispatch(
                            uploadImageSuccess(size, url)
                        );
                    })
                    .catch(errors => {
                        dispatch(
                            uploadImageFailure(size, errors)
                        );
                    });
            })
            .getOrElse(Promise.resolve());
    }
);

export const SUBMIT_STORY_START = 'UI/STORY/SUBMIT_STORY_START';

export function submitStoryStart() {
    return {
        type: SUBMIT_STORY_START
    };
}

export const SUBMIT_STORY_FAILURE = 'UI/STORY/SUBMIT_STORY_FAILURE';

export function submitStoryFailure(errors) {
    return {
        type: SUBMIT_STORY_FAILURE,
        payload: errors
    };
}

export const SUBMIT_STORY_SUCCESS = 'UI/STORY/SUBMIT_STORY_SUCCESS';

export function submitStorySuccess() {
    return {
        type: SUBMIT_STORY_SUCCESS
    };
}

export const createStory = curry(
    (status, fields) => dispatch => {
        dispatch(
            submitStoryStart()
        );

        return createStoryRequest({ ...fields, status })
        .then(({ entities }) => {
            dispatch(
                batchActions([
                    submitStorySuccess(),
                    merge(entities)
                ])
            );
        })
        .catch(errors => {
            dispatch(
                submitStoryFailure(errors)
            );
        });
    }
);

export const updateStory = curry(
    (status, diff, bunch) => (dispatch, getState) => {
        const { data } = getState();

        return denormalize(Nothing(), data, bunch)
            .map(storyEntity => {
                dispatch(
                    batchActions([
                        submitStoryStart(),
                        update(diff, storyEntity.bunch)
                    ])
                );

                return updateStoryRequest({ ...diff, status }, getBunchID(storyEntity.bunch))
                    .then(() => {
                        dispatch(
                            submitStorySuccess()
                        );
                    })
                    .catch(errors => {
                        dispatch(
                            batchActions([
                                submitStoryFailure(errors),
                                update(
                                    pick(keys(diff), storyEntity),
                                    storyEntity.bunch
                                )
                            ])
                        );
                    });
            })
            .getOrElse(Promise.resolve());
    }
);

export const createOrUpdateStory = status => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.story.busy) {
        return Promise.resolve();
    }

    return ui.story.fields.map(
        fields => ({
            ...fields,
            channel: fields.channel.getOrElse({}),
            images: reduce(
                (acc, [ size, image ]) => image.url.map(
                    url => ({
                        ...acc,
                        [ size ]: url
                    })
                ).getOrElse(acc),
                {},
                toPairs(fields.images)
            )
        })
    ).map(
        fields => ui.story.bunch.cata({
            Nothing: compose(dispatch, createStory(status), constant(fields)),
            Just: compose(dispatch, updateStory(status, fields))
        })
    ).getOrElse(Promise.resolve());
};

export const show = (mBunch, fields) => dispatch => Promise.all([
    dispatch(
        receiveChannels()
    ),
    mBunch.cata({
        Nothing: compose(dispatch, empty, constant(fields)),
        Just: compose(dispatch, receiveStory)
    })
]);
