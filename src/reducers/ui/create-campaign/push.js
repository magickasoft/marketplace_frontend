import {
    Nothing,
    Just
} from 'data.maybe';
import moment from 'moment';

import {
    curry,
    compose
} from 'lodash/fp';

import {
    maybeFromString
} from 'utils';
import {
    ENABLE_PUSH,
    CHANGE_TITLE,
    CHANGE_MESSAGE,
    SELECT_ON_START,
    SELECT_ON_FUTURE,
    CHANGE_SEND_AT_DATE,
    CHANGE_SEND_AT_TIME,
    CHANGE_PREVIEW_TYPE
} from 'actions/ui/create-campaign/push';

import {
    PREVIEW_TYPE_ANDROID
} from 'models/push';

import {push as pushConfig} from 'config/app';

const substr = curry((length, maybeStr) => (
    maybeStr.map(str => str.substr(0, length))
));

const makeTitle = compose(
    substr(pushConfig.displayedTitleLength),
    maybeFromString
);
const makeMessage = compose(
    substr(pushConfig.displayedMessageLength),
    maybeFromString
);

export const initialState = {
    enabled: false,
    fields: {
        title: Nothing(),
        message: Nothing(),
        sendAt: Nothing()
    },
    previewType: PREVIEW_TYPE_ANDROID
};

export function defaultsSentAt(mDate, mTime) {
    return [
        mDate.getOrElse(
            moment().add(1, 'day').format('YYYY-MM-DD')
        ),
        mTime.getOrElse('00:00')
    ];
}

export function reducer(state, action) {
    switch (action.type) {
        case ENABLE_PUSH: {
            return {
                ...state,
                enabled: action.payload
            };
        }

        case CHANGE_PREVIEW_TYPE: {
            return {
                ...state,
                previewType: action.payload
            };
        }

        case CHANGE_TITLE: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    title: makeTitle(action.payload)
                }
            };
        }

        case CHANGE_MESSAGE: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    message: makeMessage(action.payload)
                }
            };
        }

        case SELECT_ON_START: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    sendAt: Nothing()
                }
            };
        }

        case SELECT_ON_FUTURE: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    sendAt: Just(
                        defaultsSentAt(Nothing(), Nothing())
                    )
                }
            };
        }

        case CHANGE_SEND_AT_DATE: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    sendAt: state.fields.sendAt.map(([ , time ]) => defaultsSentAt(
                        maybeFromString(action.payload),
                        Just(time)
                    ))
                }
            };
        }

        case CHANGE_SEND_AT_TIME: {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    sendAt: state.fields.sendAt.map(([ date ]) => defaultsSentAt(
                        Just(date),
                        maybeFromString(action.payload)
                    ))
                }
            };
        }

        default: {
            return state;
        }
    }
}
