import {
    curry
} from 'lodash/fp';


export const BUTTON_PUBLISH_DATE = 'UI/STORIES_LIST/BUTTON/PUBLISH_DATE';
export const BUTTON_IS_DAILY_DOSE = 'UI/STORIES_LIST/BUTTON/IS_DAILY_DOSE';

export const PUSH_BUTTON = 'UI/STORIES_LIST/PUSH_BUTTON';

export const pushButton = curry(
    (bunch, button) => ({
        type: PUSH_BUTTON,
        payload: { bunch, button }
    })
);

export const INIT_LIST = 'UI/STORIES_LIST/INIT_LIST';

export const initList = results => ({
    type: INIT_LIST,
    payload: results
});


export const DELETE_STORY_START = 'UI/STORIES_LIST/DELETE_STORY_START';

export const deleteStoryStart = bunch => ({
    type: DELETE_STORY_START,
    payload: { bunch }
});

export const DELETE_STORY_FAILURE = 'UI/STORIES_LIST/DELETE_STORY_FAILURE';

export const deleteStoryFailure = curry(
    (bunch, errors) => ({
        type: DELETE_STORY_FAILURE,
        payload: { bunch, errors }
    })
);

export const DELETE_STORY_SUCCESS = 'UI/STORIES_LIST/DELETE_STORY_SUCCESS';

export const deleteStorySuccess = bunch => ({
    type: DELETE_STORY_SUCCESS,
    payload: { bunch }
});


export const SHOW_DATETIME_PICKER = 'UI/STORIES_LIST/SHOW_DATETIME_PICKER';

export const showDatetimePicker = curry(
    (bunch, publishDate) => ({
        type: SHOW_DATETIME_PICKER,
        payload: { bunch, publishDate }
    })
);

export const HIDE_DATETIME_PICKER = 'UI/STORIES_LIST/HIDE_DATETIME_PICKER';

export const hideDatetimePicker = () => ({
    type: HIDE_DATETIME_PICKER
});

export const CHANGE_PUBLISH_DATE = 'UI/STORIES_LIST/CHANGE_PUBLISH_DATE';

export const changePublishDate = curry(
    (bunch, date) => ({
        type: CHANGE_PUBLISH_DATE,
        payload: { bunch, date }
    })
);

export const CHANGE_PUBLISH_TIME = 'UI/STORIES_LIST/CHANGE_PUBLISH_TIME';

export const changePublishTime = curry(
    (bunch, time) => ({
        type: CHANGE_PUBLISH_TIME,
        payload: { bunch, time }
    })
);

export const UPDATE_STORY_START = 'UI/STORIES_LIST/UPDATE_STORY_START';

export const updateStoryStart = bunch => ({
    type: UPDATE_STORY_START,
    payload: { bunch }
});

export const UPDATE_STORY_FAILURE = 'UI/STORIES_LIST/UPDATE_STORY_FAILURE';

export const updateStoryFailure = curry(
    (bunch, errors) => ({
        type: UPDATE_STORY_FAILURE,
        payload: { bunch, errors }
    })
);

export const UPDATE_STORY_SUCCESS = 'UI/STORIES_LIST/UPDATE_STORY_SUCCESS';

export const updateStorySuccess = bunch => ({
    type: UPDATE_STORY_SUCCESS,
    payload: { bunch }
});
