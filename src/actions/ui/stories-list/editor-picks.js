import {
    compose,
    property,
    curry,
    reduce,
    map,
    isEqual,
    pick,
    keys,
    defaultsDeep
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
    updateStory as updateStoryRequest,
    deleteStory as deleteStoryRequest
} from 'services/campaign-manager/story';
import {
    getStoriesQueuePage as getStoriesQueuePageRequest
} from 'services/campaign-manager/story-queue';
import {
    update,
    merge
} from 'actions/data';
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


export const LIST_ACTION = 'UI/STORIES_LIST/EDITOR_PICKS/LIST_ACTION';

export const listAction = action => ({
    type: LIST_ACTION,
    payload: action
});


export const SHOW_DELETE_DIALOG = 'UI/STORIES_LIST/EDITOR_PICKS/SHOW_DELETE_DIALOG';

export const showDeleteDialog = bunch => ({
    type: SHOW_DELETE_DIALOG,
    payload: bunch
});

export const HIDE_DELETE_DIALOG = 'UI/STORIES_LIST/EDITOR_PICKS/HIDE_DELETE_DIALOG';

export const hideDeleteDialog = () => ({
    type: HIDE_DELETE_DIALOG
});

export const RECEIVE_PAGE_START = 'UI/STORIES_LIST/EDITOR_PICKS/RECEIVE_PAGE_START';

export const receivePageStart = () => ({
    type: RECEIVE_PAGE_START
});

export const RECEIVE_PAGE_FAILURE = 'UI/STORIES_LIST/EDITOR_PICKS/RECEIVE_PAGE_FAILURE';

export const receivePageFailure = errors => ({
    type: RECEIVE_PAGE_FAILURE,
    payload: errors
});

export const RECEIVE_PAGE_SUCCESS = 'UI/STORIES_LIST/EDITOR_PICKS/RECEIVE_PAGE_SUCCESS';

export const receivePageSuccess = list => ({
    type: RECEIVE_PAGE_SUCCESS,
    payload: list
});

const flattenResults = reduce(
    (acc, [ , list ]) => ([ ...acc, ...list ]),
    []
);

export const receivePage = () => (dispatch, getState) => {
    const { ui } = getState();

    if (ui.storiesList.editorPicks.busy) {
        return Promise.resolve();
    }

    dispatch(
        receivePageStart()
    );

    return getStoriesQueuePageRequest(true)
        .then(groupedStories => {

            const entities = reduce(
                (acc, { entities: groupedEntities }) => defaultsDeep(acc, groupedEntities),
                {},
                groupedStories
            );

            dispatch(
                batchActions([
                    receivePageSuccess(
                        map(
                            ({ date, result }) => ([ date, initList(result) ]),
                            groupedStories.items
                        )
                    ),
                    merge(entities)
                ])
            );
        })
        .catch(errors => {
            dispatch(
                receivePageFailure(errors)
            );
        });
};

export const deleteStory = () => (dispatch, getState) => {
    const { ui, data } = getState();

    return ui.storiesList.editorPicks.deleteDialog
        .map(
            bunch => results => ([ bunch, results ])
        ).ap(
            ui.storiesList.editorPicks.results.map(flattenResults)
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
                        receivePage()
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

        return ui.storiesList.editorPicks.results.map(flattenResults).chain(
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
                            const fallback = pick(keys(diff), story);

                            dispatch(
                                batchActions([
                                    listAction(updateStoryFailure(story.bunch, errors)),
                                    update(fallback, story.bunch)
                                ])
                            );
                        });
                }
            });
    }
);

export const updatePublishDate = bunch => (dispatch, getState) => {
    const { ui } = getState();

    return ui.storiesList.editorPicks.results
        .map(flattenResults)
        .chain(
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
                        receivePage()
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
                receivePage()
            ))
            .then(() => {
                dispatch(
                    listAction(updateStorySuccess(bunch))
                );
            });
    }
);
