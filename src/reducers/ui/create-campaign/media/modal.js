import {
    curry,
    omit,
    mapValues,
    F,
    T
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
    REDEEM_CODE,
    REDEEM_URL,

    OPEN,
    CLOSE,
    CHANGE_TITLE,
    CHANGE_DESCRIPTION,
    UPLOAD_IMAGE_START,
    UPLOAD_IMAGE_FAILURE,
    UPLOAD_IMAGE_SUCCESS,
    REMOVE_IMAGE,
    CHANGE_SUBTITLE,
    CHANGE_TERMS_AND_CONDITIONS,
    CHANGE_VALID_DATE,
    CHANGE_SHARABLE,
    CHANTE_BUTTON_TEXT,
    CHOISE_REDEEM_TYPE,
    CHANGE_REDEEM_TITLE,
    CHANGE_REDEEM_CODE,
    CHANGE_REDEEM_URL,
    CHANGE_WEBSITE_TITLE,
    CHANGE_WEBSITE_URL,
    RECEIVE_CHANNELS_START,
    RECEIVE_CHANNELS_SUCCESS,
    RECEIVE_CHANNELS_FAILURE,
    CHANGE_CHANNEL,
    SUBMIT_OFFER_START,
    SUBMIT_OFFER_FAILURE,
    SUBMIT_OFFER_SUCCESS,
    MODAL_PREVIEW_IMAGE,
    MODAL_PREVIEW_IMAGE_ADD
} from 'actions/ui/create-campaign/media/modal';


export const initialState = Nothing();

const makeSelectable = curry(
    (selected, value) => ({ selected, value })
);

const isSelectedRedeem = curry(
    (type, redeem) => {
        switch (type) {
            case REDEEM_CODE: {
                return redeem.code.cata({
                    Nothing: () => !isSelectedRedeem(REDEEM_URL, redeem),
                    Just: T
                });
            }

            case REDEEM_URL: {
                return redeem.url.cata({
                    Nothing: F,
                    Just: T
                });
            }

            default: {
                return false;
            }
        }
    }
);

export function defaultsPublishDate([ mDate, mTime ]) {
    return [
        mDate.getOrElse(
            moment().add(1, 'day').format('YYYY-MM-DD')
        ),
        mTime.getOrElse('00:00')
    ];
}

export function reducer(mState, action) {
    switch (action.type) {
        case OPEN: {
            return Just({
                fields: action.payload.map(entity => ({
                    bunch: Just(entity.bunch),
                    title: entity.title,
                    description: entity.description,
                    subtitle: entity.subtitle,
                    termsAndConditions: entity.termsAndConditions,
                    validDate: entity.validDate,
                    shareable: entity.shareable,
                    button: entity.button,
                    redeem: {
                        ...entity.redeem,
                        code: makeSelectable(
                            isSelectedRedeem(REDEEM_CODE, entity.redeem),
                            entity.redeem.code
                        ),
                        url: makeSelectable(
                            isSelectedRedeem(REDEEM_URL, entity.redeem),
                            entity.redeem.url
                        )
                    },
                    website: entity.website,
                    images: mapValues(
                        url => ({
                            url: Just(url),
                            busy: false,
                            errors: Nothing()
                        }),
                        entity.images
                    ),
                    channel: Just(entity.channel)
                })).getOrElse({
                    bunch: Nothing(),
                    title: '',
                    description: Nothing(),
                    images: {},
                    subtitle: Nothing(),
                    termsAndConditions: Nothing(),
                    validDate: defaultsPublishDate([ Nothing(), Nothing() ]),
                    shareable: false,
                    button: {
                        text: Nothing()
                    },
                    redeem: {
                        title: Nothing(),
                        code: makeSelectable(true, Nothing()),
                        url: makeSelectable(false, Nothing())
                    },
                    website: {
                        title: Nothing(),
                        url: Nothing()
                    },
                    channel: Nothing()
                }),
                busy: false,
                errors: Nothing(),
                channels: {
                    results: Nothing(),
                    busy: false,
                    errors: Nothing()
                },
                modals: Just({
                    images: {}
                })
            });
        }

        case CHANGE_TITLE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    title: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    title: Nothing(),
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_DESCRIPTION: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    description: maybeFromString(action.payload)
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    description: Nothing(),
                    common: Nothing()
                }))
            }));
        }

        case UPLOAD_IMAGE_START: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    images: {
                        ...state.fields.images,
                        [ action.payload.size ]: get(action.payload.size, state.fields.images).cata({
                            Nothing: () => ({
                                url: Nothing(),
                                busy: true,
                                errors: Nothing()
                            }),

                            Just: image => ({
                                ...image,
                                busy: true,
                                errors: Nothing()
                            })
                        })
                    }
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    images: omit(action.payload.size, errors.images),
                    common: Nothing()
                }))
            }));
        }

        case UPLOAD_IMAGE_FAILURE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    images: {
                        ...state.fields.images,
                        [ action.payload.size ]: get(action.payload.size, state.fields.images).cata({
                            Nothing: () => ({
                                url: Nothing(),
                                busy: false,
                                errors: Just(action.payload.errors)
                            }),

                            Just: image => ({
                                ...image,
                                busy: false,
                                errors: Just(action.payload.errors)
                            })
                        })
                    }
                }
            }));
        }

        case UPLOAD_IMAGE_SUCCESS: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    images: {
                        ...state.fields.images,
                        [ action.payload.size ]: get(action.payload.size, state.fields.images).cata({
                            Nothing: () => ({
                                url: Just(action.payload.url),
                                busy: false,
                                errors: Nothing()
                            }),

                            Just: image => ({
                                ...image,
                                url: Just(action.payload.url),
                                busy: false
                            })
                        })
                    }
                }
            }));
        }

        case REMOVE_IMAGE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    images: omit(action.payload.size, state.fields.images)
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    images: omit(action.payload.size, errors.images),
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_SUBTITLE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    subtitle: maybeFromString(action.payload)
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    subtitle: Nothing(),
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_TERMS_AND_CONDITIONS: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    termsAndConditions: maybeFromString(action.payload)
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    termsAndConditions: Nothing(),
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_VALID_DATE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    validDate: defaultsPublishDate(action.payload)
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    validDate: Nothing(),
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_SHARABLE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    shareable: action.payload
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    shareable: Nothing(),
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_CHANNEL: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    channel: Just(action.payload)
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    channel: Nothing(),
                    common: Nothing()
                }))
            }));
        }

        case CHANTE_BUTTON_TEXT: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    button: {
                        ...state.fields.button,
                        text: maybeFromString(action.payload)
                    }
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    button: {
                        ...errors.button,
                        text: Nothing()
                    },
                    common: Nothing()
                }))
            }));
        }

        case CHOISE_REDEEM_TYPE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    redeem: {
                        ...state.fields.redeem,
                        code: makeSelectable(
                            action.payload === REDEEM_CODE,
                            state.fields.redeem.code.value
                        ),
                        url: makeSelectable(
                            action.payload === REDEEM_URL,
                            state.fields.redeem.url.value
                        )
                    }
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    redeem: {
                        ...errors.redeem,
                        code: Nothing(),
                        url: Nothing()
                    },
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_REDEEM_TITLE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    redeem: {
                        ...state.fields.redeem,
                        title: maybeFromString(action.payload)
                    }
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    redeem: {
                        ...errors.redeem,
                        title: Nothing()
                    },
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_REDEEM_CODE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    redeem: {
                        ...state.fields.redeem,
                        code: makeSelectable(
                            state.fields.redeem.code.selected,
                            maybeFromString(action.payload)
                        )
                    }
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    redeem: {
                        ...errors.redeem,
                        code: Nothing()
                    },
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_REDEEM_URL: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    redeem: {
                        ...state.fields.redeem,
                        url: makeSelectable(
                            state.fields.redeem.url.selected,
                            maybeFromString(action.payload)
                        )
                    }
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    redeem: {
                        ...errors.redeem,
                        url: Nothing()
                    },
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_WEBSITE_TITLE: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    website: {
                        ...state.fields.website,
                        title: maybeFromString(action.payload)
                    }
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    website: {
                        ...errors.website,
                        title: Nothing()
                    },
                    common: Nothing()
                }))
            }));
        }

        case CHANGE_WEBSITE_URL: {
            return mState.map(state => ({
                ...state,
                fields: {
                    ...state.fields,
                    website: {
                        ...state.fields.website,
                        url: maybeFromString(action.payload)
                    }
                },
                errors: state.errors.map(errors => ({
                    ...errors,
                    website: {
                        ...errors.website,
                        url: Nothing()
                    },
                    common: Nothing()
                }))
            }));
        }

        case SUBMIT_OFFER_START: {
            return mState.map(state => ({
                ...state,
                busy: true,
                errors: Nothing()
            }));
        }

        case SUBMIT_OFFER_FAILURE: {
            return mState.map(state => ({
                ...state,
                busy: false,
                errors: Just(action.payload)
            }));
        }

        case CLOSE:
        case SUBMIT_OFFER_SUCCESS: {
            return initialState;
        }

        case RECEIVE_CHANNELS_START: {
            return mState.map(state => ({
                ...state,
                channels: {
                    ...state.channels,
                    busy: true
                }
            }));
        }

        case RECEIVE_CHANNELS_FAILURE: {
            return mState.map(state => ({
                ...state,
                channels: {
                    ...state.channels,
                    busy: false,
                    errors: Just(action.payload)
                }
            }));
        }

        case RECEIVE_CHANNELS_SUCCESS: {
            return mState.map(state => ({
                ...state,
                channels: {
                    ...state.channels,
                    results: Just(action.payload),
                    busy: false,
                    errors: Nothing()
                }
            }));
        }

        case MODAL_PREVIEW_IMAGE: {
            return mState.map(state => ({
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

            }));
        }

        case MODAL_PREVIEW_IMAGE_ADD: {

            return mState.map(state => ({
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

            }));
        }

        default: {
            return mState;
        }
    }
}
