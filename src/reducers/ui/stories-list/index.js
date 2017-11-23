import {
    curry,
    constant,
    map,
    isEqual
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    INIT_LIST,
    PUSH_BUTTON,
    DELETE_STORY_START,
    DELETE_STORY_FAILURE,
    DELETE_STORY_SUCCESS,
    SHOW_DATETIME_PICKER,
    HIDE_DATETIME_PICKER,
    CHANGE_PUBLISH_DATE,
    CHANGE_PUBLISH_TIME,
    UPDATE_STORY_START,
    UPDATE_STORY_FAILURE,
    UPDATE_STORY_SUCCESS
} from 'actions/ui/stories-list';

export const initialModel = [];

export const update = curry(
    (msg, model) => {
        switch (msg.type) {
            case INIT_LIST: {
                return map(
                    bunch => ({
                        bunch,
                        pushedButton: Nothing(),
                        dateTimePicker: Nothing(),
                        busy: [ false, false ],
                        errors: [ Nothing(), Nothing() ]
                    }),
                    msg.payload
                );
            }

            case PUSH_BUTTON: {
                return map(
                    item => {
                        if (!isEqual(msg.payload.bunch, item.bunch)) {
                            return item;
                        }

                        return {
                            ...item,
                            pushedButton: Just(msg.payload.button)
                        };
                    },
                    model
                );
            }

            case DELETE_STORY_START: {
                return map(item => {
                    if (!isEqual(msg.payload.bunch, item.bunch)) {
                        return item;
                    }

                    const [ editBusy ] = item.busy;
                    const [ mEditErrors ] = item.errors;

                    return {
                        ...item,
                        busy: [ editBusy, true ],
                        errors: [ mEditErrors, Nothing() ]
                    };
                }, model);
            }

            case DELETE_STORY_FAILURE: {
                return map(item => {
                    if (!isEqual(msg.payload.bunch, item.bunch)) {
                        return item;
                    }

                    const [ editBusy ] = item.busy;
                    const [ mEditErrors ] = item.errors;

                    return {
                        ...item,
                        busy: [ editBusy, false ],
                        errors: [ mEditErrors, Just(msg.payload.errors) ]
                    };
                }, model);
            }

            case DELETE_STORY_SUCCESS: {
                return map(item => {
                    if (!isEqual(msg.payload.bunch, item.bunch)) {
                        return item;
                    }

                    const [ editBusy ] = item.busy;

                    return {
                        ...item,
                        busy: [ editBusy, false ]
                    };
                }, model);
            }

            case SHOW_DATETIME_PICKER: {
                return map(item => {
                    if (!isEqual(msg.payload.bunch, item.bunch)) {
                        return item.dateTimePicker.cata({
                            Nothing: constant(item),

                            Just: constant({
                                ...item,
                                dateTimePicker: Nothing()
                            })
                        });
                    }

                    return {
                        ...item,
                        dateTimePicker: Just(msg.payload.publishDate)
                    };
                }, model);
            }

            case HIDE_DATETIME_PICKER: {
                return map(item => item.dateTimePicker.cata({
                    Nothing: constant(item),

                    Just: constant({
                        ...item,
                        dateTimePicker: Nothing()
                    })
                }), model);
            }

            case CHANGE_PUBLISH_DATE: {
                return map(item => {
                    if (!isEqual(msg.payload.bunch, item.bunch)) {
                        return item;
                    }

                    return {
                        ...item,
                        dateTimePicker: item.dateTimePicker.map(
                            ([ , time ]) => ([ msg.payload.date, time ])
                        )
                    };
                }, model);
            }

            case CHANGE_PUBLISH_TIME: {
                return map(item => {
                    if (!isEqual(msg.payload.bunch, item.bunch)) {
                        return item;
                    }

                    return {
                        ...item,
                        dateTimePicker: item.dateTimePicker.map(
                            ([ date ]) => ([ date, msg.payload.time ])
                        )
                    };
                }, model);
            }

            case UPDATE_STORY_START: {
                return map(item => {
                    if (!isEqual(msg.payload.bunch, item.bunch)) {
                        return item;
                    }

                    const [ , deleteBusy ] = item.busy;
                    const [ , mDeleteErrors ] = item.errors;

                    return {
                        ...item,
                        busy: [ true, deleteBusy ],
                        errors: [ Nothing(), mDeleteErrors ]
                    };
                }, model);
            }

            case UPDATE_STORY_FAILURE: {
                return map(item => {
                    if (!isEqual(msg.payload.bunch, item.bunch)) {
                        return item;
                    }

                    const [ , deleteBusy ] = item.busy;
                    const [ , mDeleteErrors ] = item.errors;

                    return {
                        ...item,
                        pushedButton: Nothing(),
                        busy: [ false, deleteBusy ],
                        errors: [ Just(msg.payload.errors), mDeleteErrors ]
                    };
                }, model);
            }

            case UPDATE_STORY_SUCCESS: {
                return map(item => {
                    if (!isEqual(msg.payload.bunch, item.bunch)) {
                        return item;
                    }

                    const [ , deleteBusy ] = item.busy;

                    return {
                        ...item,
                        pushedButton: Nothing(),
                        busy: [ false, deleteBusy ]
                    };
                }, model);
            }

            default: {
                throw new Error('Not handled stories-list message');
            }
        }
    }
);
