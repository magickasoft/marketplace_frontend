import {
    T
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';
import {
    get
} from 'utils';
import {
    EDIT as TAB_EDIT,
    PREVIEW as TAB_PREVIEW,

    SWITCH_TAB,
    EMPTY,
    RECEIVE_CHANNEL_START,
    RECEIVE_CHANNEL_FAILURE,
    RECEIVE_CHANNEL_SUCCESS,
    CHANGE_TITLE,
    CHANGE_DESCRIPTION,
    CHANGE_COUNTRY,
    CHANGE_HEADER_COLOR,
    CHANGE_HEADER_COLOR_SPECIAL,
    CHANGE_HEADER_BACKGROUND,
    CHANGE_HEADER_BACKGROUND_EXTRA,
    UPLOAD_HEADER_ICON_START,
    UPLOAD_HEADER_ICON_FAILURE,
    UPLOAD_HEADER_ICON_SUCCESS,
    REMOVE_HEADER_ICON,
    UPLOAD_HEADER_LOGO_START,
    UPLOAD_HEADER_LOGO_FAILURE,
    UPLOAD_HEADER_LOGO_SUCCESS,
    REMOVE_HEADER_LOGO,
    CHANGE_PAGE_BACKGROUND,
    UPLOAD_PAGE_WALLPAPER_START,
    UPLOAD_PAGE_WALLPAPER_FAILURE,
    UPLOAD_PAGE_WALLPAPER_SUCCESS,
    REMOVE_PAGE_WALLPAPER,
    SUBMIT_CHANNEL_START,
    SUBMIT_CHANNEL_FAILURE,
    SUBMIT_CHANNEL_SUCCESS,
    MODAL_PREVIEW_IMAGE,
    MODAL_PREVIEW_IMAGE_ADD
} from 'actions/ui/channel';

import {
    maybeFromString
} from 'utils';


export const initialState = {
    tab: TAB_EDIT,
    bunch: Nothing(),
    fields: Nothing(),
    busy: false,
    done: false,
    errors: Nothing(),
    modals: Nothing()
};

export function makeImageState(url) {
    return {
        url,
        busy: false,
        errors: Nothing()
    };
}

export function getTabByErrors(errors) {
    if (
        errors.title.map(T)
            .orElse(() => errors.description.map(T))
            .orElse(() => errors.country.map(T))
            .orElse(() => errors.header.icon.map(T))
            .getOrElse(false)
    ) {
        return Just(TAB_EDIT);
    }

    if (
        errors.header.color.map(T)
            .orElse(() => errors.header.colorSpecial.map(T))
            .orElse(() => errors.header.background.map(T))
            .orElse(() => errors.header.backgroundExtra.map(T))
            .orElse(() => errors.header.logo.map(T))
            .orElse(() => errors.page.background.map(T))
            .orElse(() => errors.page.wallpaper.map(T))
            .getOrElse(false)
    ) {
        return Just(TAB_PREVIEW);
    }

    return Nothing();
}

export function reducer(state, action) {
    switch (action.type) {
        case SWITCH_TAB: {
            return {
                ...state,
                tab: action.payload
            };
        }

        case EMPTY: {
            return {
                ...initialState,
                fields: Just({
                    title: '',
                    description: Nothing(),
                    country: Nothing(),
                    header: {
                        color: Nothing(),
                        colorSpecial: Nothing(),
                        background: [ Nothing(), Nothing() ],
                        backgroundExtra: [ Nothing(), Nothing() ],
                        icon: Nothing(),
                        logo: Nothing()
                    },
                    page: {
                        background: Nothing(),
                        wallpaper: Nothing()
                    }
                }),
                modals: Just({
                    images: {}
                })
            };
        }

        case RECEIVE_CHANNEL_START: {
            return {
                ...state,
                bunch: Just(action.payload),
                fields: Nothing(),
                busy: true,
                done: false
            };
        }

        case RECEIVE_CHANNEL_FAILURE: {
            return {
                ...state,
                busy: false,
                errors: Just(action.payload)
            };
        }

        case RECEIVE_CHANNEL_SUCCESS: {
            return {
                ...state,
                fields: action.payload.map(entity => ({
                    title: entity.title,
                    description: entity.description,
                    country: Just(entity.country),
                    header: {
                        ...entity.header,
                        icon: entity.header.icon.map(
                            () => makeImageState(entity.header.icon)
                        ),
                        logo: entity.header.logo.map(
                            () => makeImageState(entity.header.logo)
                        )
                    },
                    page: {
                        ...entity.page,
                        wallpaper: entity.page.wallpaper.map(
                            () => makeImageState(entity.page.wallpaper)
                        )
                    }
                })),
                modals: Just({
                    images: {}
                }),
                busy: false,
                errors: Nothing()
            };
        }

        case CHANGE_TITLE: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    title: action.payload
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    title: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CHANGE_DESCRIPTION: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    description: maybeFromString(action.payload)
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    description: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CHANGE_COUNTRY: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    country: Just(action.payload)
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    country: Nothing(),
                    common: Nothing()
                }))
            };
        }

        case CHANGE_HEADER_COLOR: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        color: maybeFromString(action.payload)
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        color: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case CHANGE_HEADER_COLOR_SPECIAL: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        colorSpecial: maybeFromString(action.payload)
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        colorSpecial: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case CHANGE_HEADER_BACKGROUND: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        background: action.payload
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        background: [ Nothing(), Nothing() ]
                    },
                    common: Nothing()
                }))
            };
        }

        case CHANGE_HEADER_BACKGROUND_EXTRA: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        backgroundExtra: action.payload
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        backgroundExtra: [ Nothing(), Nothing() ]
                    },
                    common: Nothing()
                }))
            };
        }

        case UPLOAD_HEADER_ICON_START: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        icon: Just({
                            url: Nothing(),
                            busy: true,
                            errors: Nothing()
                        })
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        icon: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case UPLOAD_HEADER_ICON_FAILURE: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        icon: fields.header.icon.map(icon => ({
                            ...icon,
                            busy: false,
                            errors: Just(action.payload)
                        }))
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        icon: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case UPLOAD_HEADER_ICON_SUCCESS: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        icon: fields.header.icon.map(icon => ({
                            ...icon,
                            url: Just(action.payload),
                            busy: false
                        }))
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        icon: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case REMOVE_HEADER_ICON: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        icon: Nothing()
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        icon: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case UPLOAD_HEADER_LOGO_START: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        logo: Just({
                            url: Nothing(),
                            busy: true,
                            errors: Nothing()
                        })
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        logo: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case UPLOAD_HEADER_LOGO_FAILURE: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        logo: fields.header.logo.map(logo => ({
                            ...logo,
                            busy: false,
                            errors: Just(action.payload)
                        }))
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        logo: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case UPLOAD_HEADER_LOGO_SUCCESS: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        logo: fields.header.logo.map(logo => ({
                            ...logo,
                            url: Just(action.payload),
                            busy: false
                        }))
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        logo: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case REMOVE_HEADER_LOGO: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    header: {
                        ...fields.header,
                        logo: Nothing()
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    header: {
                        ...errors.header,
                        logo: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case CHANGE_PAGE_BACKGROUND: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    page: {
                        ...fields.page,
                        background: maybeFromString(action.payload)
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    page: {
                        ...errors.page,
                        background: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case UPLOAD_PAGE_WALLPAPER_START: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    page: {
                        ...fields.page,
                        wallpaper: Just({
                            url: Nothing(),
                            busy: true,
                            errors: Nothing()
                        })
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    page: {
                        ...errors.page,
                        wallpaper: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case UPLOAD_PAGE_WALLPAPER_FAILURE: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    page: {
                        ...fields.page,
                        wallpaper: fields.page.wallpaper.map(wallpaper => ({
                            ...wallpaper,
                            busy: false,
                            errors: Just(action.payload)
                        }))
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    page: {
                        ...errors.page,
                        wallpaper: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case UPLOAD_PAGE_WALLPAPER_SUCCESS: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    page: {
                        ...fields.page,
                        wallpaper: fields.page.wallpaper.map(wallpaper => ({
                            ...wallpaper,
                            url: Just(action.payload),
                            busy: false
                        }))
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    page: {
                        ...errors.page,
                        wallpaper: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case REMOVE_PAGE_WALLPAPER: {
            return {
                ...state,
                fields: state.fields.map(fields => ({
                    ...fields,
                    page: {
                        ...fields.page,
                        wallpaper: Nothing()
                    }
                })),
                errors: state.errors.map(errors => ({
                    ...errors,
                    page: {
                        ...errors.page,
                        wallpaper: Nothing()
                    },
                    common: Nothing()
                }))
            };
        }

        case SUBMIT_CHANNEL_START: {
            return {
                ...state,
                busy: true
            };
        }

        case SUBMIT_CHANNEL_FAILURE: {
            return {
                ...state,
                tab: getTabByErrors(action.payload).getOrElse(state.tab),
                busy: false,
                errors: Just(action.payload)
            };
        }

        case SUBMIT_CHANNEL_SUCCESS: {
            return {
                ...state,
                busy: false,
                done: true,
                errors: Nothing()
            };
        }

        case MODAL_PREVIEW_IMAGE: {
            return {
                ...state,
                modals: state.modals.map(entity => ({
                    ...entity,
                    images: {
                        ...entity.images,
                        [ action.payload.type ]: get(action.payload.type, entity.images).cata({
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
                        [ action.payload.type ]: get(action.payload.type, entity.images).cata({
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
