export const ENABLE_PUSH = 'UI/CREATE_CAMPAIGN/SEGMENT/ENABLE_PUSH';

export const enablePush = value => ({
    type: ENABLE_PUSH,
    payload: value
});

export const CHANGE_TITLE = 'UI/CREATE_CAMPAIGN/SEGMENT/CHANGE_TITLE';

export const changeTitle = value => ({
    type: CHANGE_TITLE,
    payload: value
});

export const CHANGE_MESSAGE = 'UI/CREATE_CAMPAIGN/SEGMENT/CHANGE_MESSAGE';

export const changeMessage = value => ({
    type: CHANGE_MESSAGE,
    payload: value
});

export const SELECT_ON_START = 'UI/CREATE_CAMPAIGN/SEGMENT/SELECT_ON_START';

export const selectOnStart = () => ({
    type: SELECT_ON_START
});

export const SELECT_ON_FUTURE = 'UI/CREATE_CAMPAIGN/SEGMENT/SELECT_ON_FUTURE';

export const selectOnFuture = () => ({
    type: SELECT_ON_FUTURE
});

export const CHANGE_SEND_AT_DATE = 'UI/CREATE_CAMPAIGN/SEGMENT/CHANGE_SEND_AT_DATE';

export const changeSendAtDate = value => ({
    type: CHANGE_SEND_AT_DATE,
    payload: value
});

export const CHANGE_SEND_AT_TIME = 'UI/CREATE_CAMPAIGN/SEGMENT/CHANGE_SEND_AT_TIME';

export const changeSendAtTime = value => ({
    type: CHANGE_SEND_AT_TIME,
    payload: value
});

export const CHANGE_PREVIEW_TYPE = 'UI/CREATE_CAMPAIGN/SEGMENT/CHANGE_PREVIEW_TYPE';

export const changePreviewType = value => ({
    type: CHANGE_PREVIEW_TYPE,
    payload: value
});

