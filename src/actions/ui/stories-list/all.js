import {
    compose,
    property,
    curry,
    isEqual,
    pick,
    keys
} from 'lodash/fp';
import {
    Nothing
} from 'data.maybe';
import {
    batchActions
} from 'redux-batched-actions';

import {
    find,
    denormalize
} from 'utils';
import {
    getBunchID
} from 'utils/bunch';
import {
    getStoriesPage as getStoriesPageRequest,
    updateStory as updateStoryRequest,
    deleteStory as deleteStoryRequest
} from 'services/campaign-manager/story';
import {
    update,
    merge
} from 'actions/data';
import {
    FIELD_STATUS as QUERY_FIELD_STATUS,
    FIELD_PUBLISH_DATE as QUERY_FIELD_PUBLISH_DATE,
    FIELD_IS_DAILY_DOSE as QUERY_FIELD_IS_DAILY_DOSE
} from 'services/queries';
import {
    STATUS_DELETED as STORY_STATUS_DELETED
} from 'models/story';
import {
    BUTTON_PUBLISH_DATE,
    BUTTON_IS_DAILY_DOSE,

    initList,
    deleteStoryStart,
    deleteStoryFailure,
    deleteStorySuccess,
    updateStoryStart,
    updateStorySuccess,
    updateStoryFailure,
    hideDatetimePicker,
    pushButton
} from './';
import {
    countReview
} from 'actions/ui/stories-list/additional-field';

export const LIST_ACTION = 'UI/STORIES_LIST/ALL/LIST_ACTION';

export const listAction = action => ({
    type: LIST_ACTION,
    payload: action
});

export const SHOW_DELETE_DIALOG = 'UI/STORIES_LIST/ALL/SHOW_DELETE_DIALOG';

export const showDeleteDialog = bunch => ({
    type: SHOW_DELETE_DIALOG,
    payload: bunch
});

export const HIDE_DELETE_DIALOG = 'UI/STORIES_LIST/ALL/HIDE_DELETE_DIALOG';

export const hideDeleteDialog = () => ({
    type: HIDE_DELETE_DIALOG
});

export const RECEIVE_PAGE_START = 'UI/STORIES_LIST/ALL/RECEIVE_PAGE_START';

export const receivePageStart = curry(
    (page, sort, order) => ({
        type: RECEIVE_PAGE_START,
        payload: { page, sort, order }
    })
);

export const RECEIVE_PAGE_FAILURE = 'UI/STORIES_LIST/ALL/RECEIVE_PAGE_FAILURE';

export const receivePageFailure = errors => ({
    type: RECEIVE_PAGE_FAILURE,
    payload: errors
});

export const RECEIVE_PAGE_SUCCESS = 'UI/STORIES_LIST/ALL/RECEIVE_PAGE_SUCCESS';

export const receivePageSuccess = ({ total, results }) => ({
    type: RECEIVE_PAGE_SUCCESS,
    payload: {
        total,
        listAction: initList(results)
    }
});

export const receivePage = curry(
    (current, sort, order) => (dispatch, getState) => {
        const { ui } = getState();

        if (ui.storiesList.all.busy) {
            return Promise.resolve();
        }

        dispatch(
            receivePageStart(current, sort, order)
        );

        return getStoriesPageRequest(Nothing(), current, sort, order)
            .then(({ result, entities }) => {
                dispatch(
                    batchActions([
                        receivePageSuccess(result),
                        countReview(result.countForReview),
                        merge(entities)
                    ])
                );
            })
            .catch(errors => {
                dispatch(
                    receivePageFailure(errors)
                );
            });
    }
);

export const receivePageAgain = () => (dispatch, getState) => {
    const { ui } = getState();

    return ui.storiesList.all.query.cata({
        Nothing: () => Promise.resolve(),

        Just: ({ page, sort, order }) => dispatch(
            receivePage(page, sort, order)
        )
    });
};

export const receivePageForField = field => (dispatch, getState) => {
    const { ui } = getState();

    return ui.storiesList.all.query.cata({
        Nothing: () => Promise.resolve(),

        Just: ({ sort }) => {
            if (sort !== field) {
                return Promise.resolve();
            }

            return dispatch(
                receivePageAgain()
            );
        }
    });
};

export const deleteStory = () => (dispatch, getState) => {
    const { ui, data } = getState();

    return ui.storiesList.all.deleteDialog
        .map(
            bunch => results => ([ bunch, results ])
        ).ap(
            ui.storiesList.all.results
        ).chain(
            ([ bunch, results ]) => find(
                compose(isEqual(bunch), property('bunch')),
                results
            )
        ).chain(
            ({ bunch, busy: [ , deleteBusy ] }) => deleteBusy ?
                Nothing() :
                denormalize(Nothing(), data, bunch)
        ).cata({
            Nothing: () => Promise.resolve(),

            Just: story => {
                dispatch(
                    batchActions([
                        listAction(deleteStoryStart(story.bunch)),
                        hideDeleteDialog(),
                        update({
                            status: STORY_STATUS_DELETED
                        }, story.bunch)
                    ])
                );

                return deleteStoryRequest(getBunchID(story.bunch))
                    .then(() => dispatch(
                        receivePageForField(QUERY_FIELD_STATUS)
                    ))
                    .then(() => {
                        dispatch(
                            listAction(deleteStorySuccess(story.bunch))
                        );
                    })
                    .catch(errors => {
                        dispatch(
                            batchActions([
                                listAction(deleteStoryFailure(story.bunch, errors)),
                                update({
                                    status: story.status
                                }, story.bunch)
                            ])
                        );
                    });
            }
        });
};

export const updateStory = curry(
    (bunch, diff) => (dispatch, getState) => {
        const { ui, data } = getState();

        return ui.storiesList.all.results.chain(
                find(
                    compose(isEqual(bunch), property('bunch'))
                )
            ).chain(
                ({ busy: [ editBusy ] }) => editBusy ?
                    Nothing() :
                    denormalize(Nothing(), data, bunch)
            ).cata({
                Nothing: () => Promise.resolve(),

                Just: story => {
                    dispatch(
                        batchActions([
                            listAction(updateStoryStart(story.bunch)),
                            update(diff, story.bunch)
                        ])
                    );

                    return updateStoryRequest({ ...story, ...diff }, getBunchID(story.bunch))
                        .catch(errors => {
                            dispatch(
                                batchActions([
                                    listAction(updateStoryFailure(story.bunch, errors)),
                                    update(
                                        pick(keys(diff), story),
                                        story.bunch
                                    )
                                ])
                            );
                        });
                }
            });
    }
);

export const updatePublishDate = bunch => (dispatch, getState) => {
    const { ui } = getState();

    return ui.storiesList.all.results.chain(
            find(
                compose(isEqual(bunch), property('bunch'))
            )
        ).chain(
            property('dateTimePicker')
        ).cata({
            Nothing: () => Promise.resolve(),

            Just: publishDate => {
                dispatch(
                    batchActions([
                        listAction(hideDatetimePicker()),
                        listAction(pushButton(bunch, BUTTON_PUBLISH_DATE))
                    ])
                );

                return dispatch(updateStory(bunch, { publishDate }))
                    .then(() => dispatch(
                        receivePageForField(QUERY_FIELD_PUBLISH_DATE)
                    ))
                    .then(() => {
                        dispatch(
                            listAction(updateStorySuccess(bunch))
                        );
                    });
            }
        });
};

export const updateIsDailyDose = curry(
    (bunch, isDailyDose) => dispatch => {
        dispatch(
            listAction(pushButton(bunch, BUTTON_IS_DAILY_DOSE))
        );

        return dispatch(updateStory(bunch, { isDailyDose }))
            .then(() => dispatch(
                receivePageForField(QUERY_FIELD_IS_DAILY_DOSE)
            ))
            .then(() => {
                dispatch(
                    listAction(updateStorySuccess(bunch))
                );
            });
    }
);
