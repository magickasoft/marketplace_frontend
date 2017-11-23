import {
    omit,
    mapValues
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';
import moment from 'moment';

import {
    get,
    maybeFromString
} from 'utils';
import {
    EMPTY,
    RECEIVE_STORY_START,
    RECEIVE_STORY_FAILURE,
    RECEIVE_STORY_SUCCESS,
    CHANGE_TITLE,
    CHANGE_DESCRIPTION,
    CHANGE_TEXT,
    CHANGE_AUDIO_URL,
    CHANGE_VIDEO_URL,
    CHANGE_CHANNEL,
    RECEIVE_CHANNELS_START,
    RECEIVE_CHANNELS_FAILURE,
    RECEIVE_CHANNELS_SUCCESS,
    CHANGE_DAILY_DOSE,
    CHANGE_PUBLISH_DATE,
    REMOVE_IMAGE,
    UPLOAD_IMAGE_START,
    UPLOAD_IMAGE_FAILURE,
    UPLOAD_IMAGE_SUCCESS,
    SUBMIT_STORY_START,
    SUBMIT_STORY_FAILURE,
    SUBMIT_STORY_SUCCESS,
    MODAL_PREVIEW_IMAGE,
    MODAL_PREVIEW_IMAGE_ADD
} from 'actions/ui/story';


export const initialState = {
    bunch: Nothing(),
    fields: Nothing(),
    busy: false,
    done: false,
    errors: [ Nothing(), Nothing() ],
    channels: {
        results: Nothing(),
        busy: false,
        errors: Nothing()
    },
    modals: Nothing()
};

export function defaultsPublishDate([ mDate, mTime ]) {
    return [
        mDate.getOrElse(
            moment().add(1, 'day').format('YYYY-MM-DD')
        ),
        mTime.getOrElse('00:00')
    ];
}

export function reducer(state, action) {
    const [ mReceiveErrors, mSubmitErrors ] = state.errors;

    switch (action.type) {
        case EMPTY: {
            const { fields } = action.payload;
            const publishDate = (fields && fields.publishDate) || [ Nothing(), Nothing() ];
            return {
                ...state,
                bunch: Nothing(),
                done: false,
                fields: Just({
                    title: '',
                    description: Nothing(),
                    text: '',
                    audioUrl: Nothing(),
                    videoUrl: Nothing(),
                    isDailyDose: false,
                    channel: Nothing(),
                    publishDate: defaultsPublishDate(publishDate),
                    images: {}
                }),
                errors: [ Nothing(), Nothing() ],
                modals: Just({
                    images: {}
                })
            };
        }

        case RECEIVE_STORY_START: {
            return {
                ...state,
                bunch: Just(action.payload),
                fields: Nothing(),
                busy: true,
                done: false
            };
        }

        case RECEIVE_STORY_FAILURE: {
            return {
                ...state,
                busy: false,
                errors: [ Just(action.payload), mSubmitErrors ]
            };
        }

        case RECEIVE_STORY_SUCCESS: {
            return {
                ...state,
                fields: action.payload.map(entity => ({
                    title: entity.title,
                    description: entity.description,
                    text: entity.text,
                    audioUrl: entity.audioUrl,
                    videoUrl: entity.videoUrl,
                    isDailyDose: entity.isDailyDose,
                    publishDate: entity.publishDate,
                    channel: Just(entity.channel),
                    images: mapValues(
                        url => ({
                            url: Just(url),
                            busy: false,
                            errors: Nothing()
                        }),
                        entity.images
                    )
                })),
                modals: Just({
                    images: {}
                }),
                busy: false,
                errors: [ Nothing(), mSubmitErrors ]
            };
        }

        case CHANGE_TITLE: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    title: action.payload
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        title: Nothing(),
                        common: Nothing()
                    }))
                ]
            };
        }

        case CHANGE_DESCRIPTION: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    description: maybeFromString(action.payload)
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        description: Nothing(),
                        common: Nothing()
                    }))
                ]
            };
        }

        case CHANGE_TEXT: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    text: action.payload
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        text: Nothing(),
                        common: Nothing()
                    }))
                ]
            };
        }

        case CHANGE_AUDIO_URL: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    audioUrl: maybeFromString(action.payload)
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        audioUrl: Nothing(),
                        common: Nothing()
                    }))
                ]
            };
        }

        case CHANGE_VIDEO_URL: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    videoUrl: maybeFromString(action.payload)
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        videoUrl: Nothing(),
                        common: Nothing()
                    }))
                ]
            };
        }

        case RECEIVE_CHANNELS_START: {
            return {
                ...state,
                channels: {
                    ...state.channels,
                    busy: true
                }
            };
        }

        case RECEIVE_CHANNELS_FAILURE: {
            return {
                ...state,
                channels: {
                    ...state.channels,
                    busy: false,
                    errors: Just(action.payload)
                }
            };
        }

        case RECEIVE_CHANNELS_SUCCESS: {
            return {
                ...state,
                channels: {
                    ...state.channels,
                    results: Just(action.payload),
                    busy: false,
                    errors: Nothing()
                }
            };
        }

        case CHANGE_CHANNEL: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    channel: Just(action.payload)
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        channel: Nothing(),
                        common: Nothing()
                    }))
                ]
            };
        }

        case CHANGE_DAILY_DOSE: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    isDailyDose: action.payload
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        isDailyDose: Nothing(),
                        common: Nothing()
                    }))
                ]
            };
        }

        case CHANGE_PUBLISH_DATE: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    publishDate: defaultsPublishDate(action.payload)
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        publishDate: Nothing(),
                        common: Nothing()
                    }))
                ]
            };
        }

        case REMOVE_IMAGE: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    images: omit([ action.payload.size ], entity.images)
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        images: omit([ action.payload.size ], submitErrors.images),
                        common: Nothing()
                    }))
                ]
            };
        }

        case UPLOAD_IMAGE_START: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    images: {
                        ...entity.images,
                        [ action.payload.size ]: get(action.payload.size, entity.images).cata({
                            Just: image => ({
                                ...image,
                                busy: true,
                                errors: Nothing()
                            }),

                            Nothing: () => ({
                                url: Nothing(),
                                busy: true,
                                errors: Nothing()
                            })
                        })
                    }
                }))
            };
        }

        case UPLOAD_IMAGE_FAILURE: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    images: {
                        ...entity.images,
                        [ action.payload.size ]: get(action.payload.size, entity.images).cata({
                            Just: image => ({
                                ...image,
                                busy: false,
                                errors: Just(action.payload.errors)
                            }),

                            Nothing: () => ({
                                url: Nothing(),
                                busy: false,
                                errors: Just(action.payload.errors)
                            })
                        })
                    }
                }))
            };
        }

        case UPLOAD_IMAGE_SUCCESS: {
            return {
                ...state,
                fields: state.fields.map(entity => ({
                    ...entity,
                    images: {
                        ...entity.images,
                        [ action.payload.size ]: get(action.payload.size, entity.images).cata({
                            Just: image => ({
                                ...image,
                                url: Just(action.payload.url),
                                busy: false
                            }),

                            Nothing: () => ({
                                url: Just(action.payload.url),
                                busy: false,
                                errors: Nothing()
                            })
                        })
                    }
                })),
                errors: [
                    mReceiveErrors,
                    mSubmitErrors.map(submitErrors => ({
                        ...submitErrors,
                        images: omit([ action.payload.size ], submitErrors.images),
                        common: Nothing()
                    }))
                ]
            };
        }

        case SUBMIT_STORY_START: {
            return {
                ...state,
                busy: true
            };
        }

        case SUBMIT_STORY_FAILURE: {
            return {
                ...state,
                busy: false,
                errors: [ mReceiveErrors, Just(action.payload) ]
            };
        }

        case SUBMIT_STORY_SUCCESS: {
            return {
                ...state,
                busy: false,
                done: true,
                errors: [ mReceiveErrors, Nothing() ]
            };
        }

        case MODAL_PREVIEW_IMAGE: {
            return {
                ...state,
                modals: state.modals.map(entity => ({
                    ...entity,
                    images: {
                        ...entity.images,
                        [ action.payload.size ]: get(action.payload.size, entity.images).cata({
                            Just: image => ({
                                ...image,
                                status: action.payload.value
                            }),
                            Nothing: () => ({
                                status: action.payload.value
                            })
                        })
                    }
                }))
            };
        }

        case MODAL_PREVIEW_IMAGE_ADD: {
            return {
                ...state,
                modals: state.modals.map(entity => ({
                    ...entity,
                    images: {
                        ...entity.images,
                        [ action.payload.size ]: get(action.payload.size, entity.images).cata({
                            Just: image => ({
                                ...image,
                                file: action.payload.imgObj
                            }),
                            Nothing: () => ({
                                file: action.payload.imgObj
                            })
                        })
                    }
                }))
            };
        }

        default: {
            return state;
        }
    }
}
