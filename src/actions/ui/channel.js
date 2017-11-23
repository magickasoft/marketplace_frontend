import {
    constant,
    property,
    compose,
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
    denormalize
} from 'utils';
import {
    getBunchID
} from 'utils/bunch';
import {
    sign as s3SignRequest
} from 'services/s3';
import {
    receiveChannel as receiveChannelRequest
} from 'services/campaign-manager';
import {
    createChannel as createChannelRequest,
    updateChannel as updateChannelRequest
} from 'services/campaign-manager';
import {
    update,
    merge
} from 'actions/data';


export const EDIT = 'UI/CHANNEL/TAB/EDIT';
export const PREVIEW = 'UI/CHANNEL/TAB/PREVIEW';

export const SWITCH_TAB = 'UI/CHANNEL/SWITCH_TAB';

export function switchTab(tab) {
    return {
        type: SWITCH_TAB,
        payload: tab
    };
}

export const EMPTY = 'UI/CHANNEL/EMPTY';

export function empty() {
    return {
        type: EMPTY
    };
}

export const RECEIVE_CHANNEL_START = 'UI/CHANNEL/RECEIVE_CHANNEL_START';

export function receiveChannelStart(bunch) {
    return {
        type: RECEIVE_CHANNEL_START,
        payload: bunch
    };
}

export const RECEIVE_CHANNEL_FAILURE = 'UI/CHANNEL/RECEIVE_CHANNEL_FAILURE';

export function receiveChannelFailure(errors) {
    return {
        type: RECEIVE_CHANNEL_FAILURE,
        payload: errors
    };
}

export const RECEIVE_CHANNEL_SUCCESS = 'UI/CHANNEL/RECEIVE_CHANNEL_SUCCESS';

export function receiveChannelSuccess(entity) {
    return {
        type: RECEIVE_CHANNEL_SUCCESS,
        payload: entity
    };
}

export const receiveChannel = bunch => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.channel.busy) {
        return Promise.resolve();
    }

    dispatch(
        receiveChannelStart(bunch)
    );

    return receiveChannelRequest(getBunchID(bunch))
        .then(({ entities }) => {
            dispatch(
                batchActions([
                    receiveChannelSuccess(
                        denormalize(Nothing(), entities, bunch)
                    ),
                    merge(entities)
                ])
            );
        })
        .catch(errors => {
            dispatch(
                receiveChannelFailure(errors)
            );
        });
};

export const show = mBunch => dispatch => mBunch.cata({
    Nothing: compose(dispatch, empty),
    Just: compose(dispatch, receiveChannel)
});


export const CHANGE_TITLE = 'UI/CHANNEL/CHANGE_TITLE';

export function changeTitle(value) {
    return {
        type: CHANGE_TITLE,
        payload: value
    };
}

export const CHANGE_DESCRIPTION = 'UI/CHANNEL/CHANGE_DESCRIPTION';

export function changeDescription(value) {
    return {
        type: CHANGE_DESCRIPTION,
        payload: value
    };
}

export const CHANGE_COUNTRY = 'UI/CHANNEL/CHANGE_COUNTRY';

export function changeCountry(bunch) {
    return {
        type: CHANGE_COUNTRY,
        payload: bunch
    };
}

export const CHANGE_HEADER_COLOR = 'UI/CHANNEL/CHANGE_HEADER_COLOR';

export function changeHeaderColor(value) {
    return {
        type: CHANGE_HEADER_COLOR,
        payload: value
    };
}

export const CHANGE_HEADER_COLOR_SPECIAL = 'UI/CHANNEL/CHANGE_HEADER_COLOR_SPECIAL';

export function changeHeaderColorSpecial(value) {
    return {
        type: CHANGE_HEADER_COLOR_SPECIAL,
        payload: value
    };
}

export const CHANGE_HEADER_BACKGROUND = 'UI/CHANNEL/CHANGE_HEADER_BACKGROUND';

export function changeHeaderBackground(value) {
    return {
        type: CHANGE_HEADER_BACKGROUND,
        payload: value
    };
}

export const CHANGE_HEADER_BACKGROUND_EXTRA = 'UI/CHANNEL/CHANGE_HEADER_BACKGROUND_EXTRA';

export function changeHeaderBackgroundExtra(value) {
    return {
        type: CHANGE_HEADER_BACKGROUND_EXTRA,
        payload: value
    };
}
export const MODAL_PREVIEW_IMAGE = 'UI/CHANNEL/MODAL_PREVIEW_IMAGE';

export const modalPreviewImage = curry(
    (type, value) => ({
        type: MODAL_PREVIEW_IMAGE,
        payload: { type, value }
    })
);

export const MODAL_PREVIEW_IMAGE_ADD = 'UI/CHANNEL/MODAL_PREVIEW_IMAGE_ADD';

export const modalPreviewImageAdd = curry(
    (type, imgObj) => ({
        type: MODAL_PREVIEW_IMAGE_ADD,
        payload: { type, imgObj }
    })
);
export const UPLOAD_HEADER_ICON_START = 'UI/CHANNEL/UPLOAD_HEADER_ICON_START';

export function uploadHeaderIconStart() {
    return {
        type: UPLOAD_HEADER_ICON_START
    };
}

export const UPLOAD_HEADER_ICON_FAILURE = 'UI/CHANNEL/UPLOAD_HEADER_ICON_FAILURE';

export function uploadHeaderIconFailure(errors) {
    return {
        type: UPLOAD_HEADER_ICON_FAILURE,
        payload: errors
    };
}

export const UPLOAD_HEADER_ICON_SUCCESS = 'UI/CHANNEL/UPLOAD_HEADER_ICON_SUCCESS';

export function uploadHeaderIconSuccess(url) {
    return {
        type: UPLOAD_HEADER_ICON_SUCCESS,
        payload: url
    };
}

export const uploadHeaderIcon = image => (dispatch, getState) => {
    const { ui } = getState();

    return ui.channel.fields
        .map(fields => {
            if (fields.header.icon.map(property('busy')).getOrElse(false)) {
                return Promise.resolve();
            }

            dispatch(
                uploadHeaderIconStart()
            );

            return s3SignRequest(image)
                .then(url => {
                    dispatch(
                        uploadHeaderIconSuccess(url)
                    );
                })
                .catch(errors => {
                    dispatch(
                        uploadHeaderIconFailure(errors)
                    );
                });
        })
        .getOrElse(Promise.resolve());
};

export const REMOVE_HEADER_ICON = 'UI/CHANNEL/REMOVE_HEADER_ICON';

export function removeHeaderIcon() {
    return {
        type: REMOVE_HEADER_ICON
    };
}

export const UPLOAD_HEADER_LOGO_START = 'UI/CHANNEL/UPLOAD_HEADER_LOGO_START';

export function uploadHeaderLogoStart() {
    return {
        type: UPLOAD_HEADER_LOGO_START
    };
}

export const UPLOAD_HEADER_LOGO_FAILURE = 'UI/CHANNEL/UPLOAD_HEADER_LOGO_FAILURE';

export function uploadHeaderLogoFailure(errors) {
    return {
        type: UPLOAD_HEADER_LOGO_FAILURE,
        payload: errors
    };
}

export const UPLOAD_HEADER_LOGO_SUCCESS = 'UI/CHANNEL/UPLOAD_HEADER_LOGO_SUCCESS';

export function uploadHeaderLogoSuccess(url) {
    return {
        type: UPLOAD_HEADER_LOGO_SUCCESS,
        payload: url
    };
}

export const uploadHeaderLogo = image => (dispatch, getState) => {
    const { ui } = getState();

    return ui.channel.fields
        .map(fields => {
            if (fields.header.logo.map(property('busy')).getOrElse(false)) {
                return Promise.resolve();
            }

            dispatch(
                uploadHeaderLogoStart()
            );

            return s3SignRequest(image)
                .then(url => {
                    dispatch(
                        uploadHeaderLogoSuccess(url)
                    );
                })
                .catch(errors => {
                    dispatch(
                        uploadHeaderLogoFailure(errors)
                    );
                });
        })
        .getOrElse(Promise.resolve());
};

export const REMOVE_HEADER_LOGO = 'UI/CHANNEL/REMOVE_HEADER_LOGO';

export function removeHeaderLogo() {
    return {
        type: REMOVE_HEADER_LOGO
    };
}

export const CHANGE_PAGE_BACKGROUND = 'UI/CHANNEL/CHANGE_PAGE_BACKGROUND';

export function changePageBackground(value) {
    return {
        type: CHANGE_PAGE_BACKGROUND,
        payload: value
    };
}

export const UPLOAD_PAGE_WALLPAPER_START = 'UI/CHANNEL/UPLOAD_PAGE_WALLPAPER_START';

export function uploadPageWallpaperStart() {
    return {
        type: UPLOAD_PAGE_WALLPAPER_START
    };
}

export const UPLOAD_PAGE_WALLPAPER_FAILURE = 'UI/CHANNEL/UPLOAD_PAGE_WALLPAPER_FAILURE';

export function uploadPageWallpaperFailure(errors) {
    return {
        type: UPLOAD_PAGE_WALLPAPER_FAILURE,
        payload: errors
    };
}

export const UPLOAD_PAGE_WALLPAPER_SUCCESS = 'UI/CHANNEL/UPLOAD_PAGE_WALLPAPER_SUCCESS';

export function uploadPageWallpaperSuccess(url) {
    return {
        type: UPLOAD_PAGE_WALLPAPER_SUCCESS,
        payload: url
    };
}

export const uploadPageWallpaper = image => (dispatch, getState) => {
    const { ui } = getState();

    return ui.channel.fields
        .map(fields => {
            if (fields.page.wallpaper.map(property('busy')).getOrElse(false)) {
                return Promise.resolve();
            }

            dispatch(
                uploadPageWallpaperStart()
            );

            return s3SignRequest(image)
                .then(url => {
                    dispatch(
                        uploadPageWallpaperSuccess(url)
                    );
                })
                .catch(errors => {
                    dispatch(
                        uploadPageWallpaperFailure(errors)
                    );
                });
        })
        .getOrElse(Promise.resolve());
};

export const REMOVE_PAGE_WALLPAPER = 'UI/CHANNEL/REMOVE_PAGE_WALLPAPER';

export function removePageWallpaper() {
    return {
        type: REMOVE_PAGE_WALLPAPER
    };
}

export const SUBMIT_CHANNEL_START = 'UI/CHANNEL/SUBMIT_CHANNEL_START';

export function submitChannelStart() {
    return {
        type: SUBMIT_CHANNEL_START
    };
}

export const SUBMIT_CHANNEL_FAILURE = 'UI/CHANNEL/SUBMIT_CHANNEL_FAILURE';

export function submitChannelFailure(errors) {
    return {
        type: SUBMIT_CHANNEL_FAILURE,
        payload: errors
    };
}

export const SUBMIT_CHANNEL_SUCCESS = 'UI/CHANNEL/SUBMIT_CHANNEL_SUCCESS';

export function submitChannelSuccess() {
    return {
        type: SUBMIT_CHANNEL_SUCCESS
    };
}

export const createChannel = fields => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.channel.busy) {
        return Promise.resolve();
    }

    dispatch(
        submitChannelStart()
    );

    return createChannelRequest(fields)
        .then(({ entities }) => {
            dispatch(
                batchActions([
                    merge(entities),
                    submitChannelSuccess()
                ])
            );
        })
        .catch(errors => {
            dispatch(
                submitChannelFailure(errors)
            );
        });
};

export const updateChannel = curry(
    (diff, bunch) => (dispatch, getState) => {
        const { ui, data } = getState();

        if (ui.channel.busy) {
            return Promise.resolve();
        }

        return denormalize(Nothing(), data, bunch)
            .map(channelEntity => {
                dispatch(
                    batchActions([
                        submitChannelStart(),
                        update(diff, channelEntity.bunch)
                    ])
                );

                return updateChannelRequest(diff, getBunchID(channelEntity.bunch))
                    .then(() => {
                        dispatch(
                            submitChannelSuccess()
                        );
                    })
                    .catch(errors => {
                        dispatch(
                            batchActions([
                                submitChannelFailure(errors),
                                update(
                                    pick(keys(diff), channelEntity),
                                    channelEntity.bunch
                                )
                            ])
                        );
                    });
            })
            .getOrElse(Promise.resolve());

    }
);

const pUrl = property('url');

export const createOrUpdateChannel = () => (dispatch, getState) => {
    const { ui } = getState();

    return ui.channel.fields
        .map(fields => {
            const model = {
                ...fields,
                header: {
                    ...fields.header,
                    icon: fields.header.icon.chain(pUrl),
                    logo: fields.header.logo.chain(pUrl)
                },
                page: {
                    ...fields.page,
                    wallpaper: fields.page.wallpaper.chain(pUrl)
                }
            };

            return ui.channel.bunch.cata({
                Nothing: compose(dispatch, createChannel, constant(model)),
                Just: compose(dispatch, updateChannel(model))
            });
        })
        .getOrElse(Promise.resolve());
};
