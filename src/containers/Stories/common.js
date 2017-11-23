import {
    eq,
    mapValues,
    ceil,
    divide,
    compose,
    __
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import appConfig from 'config/app';
import {
    denormalize,
    filterMap
} from 'utils';
import {
    STATUS_DRAFT as STORY_STATUS_DRAFT,
    STATUS_REVIEWED as STORY_STATUS_REVIEWED,
    STATUS_APPROVED as STORY_STATUS_APPROVED,
    STATUS_PUBLISHED as STORY_STATUS_PUBLISHED
} from 'models/story';
import {
    SUPER_EDITOR,
    ADMIN,
    somePermission
} from 'models/user';
import {
    formatDateTime
} from 'utils/format-date';
import {
    BUTTON_PUBLISH_DATE,
    BUTTON_IS_DAILY_DOSE
} from 'actions/ui/stories-list';

export const calcPageCount = compose(ceil, divide(__, appConfig.pageSize));

const statusToString = status => {
    switch (status) {
        case STORY_STATUS_DRAFT: {
            return 'Draft';
        }

        case STORY_STATUS_REVIEWED: {
            return 'Reviewed';
        }

        case STORY_STATUS_APPROVED: {
            return 'Approved';
        }

        case STORY_STATUS_PUBLISHED: {
            return 'Published';
        }

        default: {
            return 'Deleted';
        }
    }
};

const mapPushedButton = mapValues(__, {
    publishDate: eq(BUTTON_PUBLISH_DATE),
    isDailyDose: eq(BUTTON_IS_DAILY_DOSE)
});

const selectStory = story => ({
    ...story,
    statusText: statusToString(story.status),
    publishDateText: formatDateTime(story.publishDate)
});

const isChangeable = eq(STORY_STATUS_DRAFT);
const isAdminOrSuperEditor = somePermission([ ADMIN, SUPER_EDITOR ]);

export const selectResults = ({ data, session }) => filterMap(
    item => denormalize(Just({
        channel: Nothing()
    }), data, item.bunch)
        .map(storyEntity => {
            const adminOrSuperEditor = isAdminOrSuperEditor(session.role);
            const changeable = adminOrSuperEditor || isChangeable(storyEntity.status);

            return {
                ...item,
                pushedButtons: mapPushedButton(isEqType => item.pushedButton.map(isEqType).getOrElse(false)),
                story: selectStory(storyEntity),
                visibility: {
                    timePickButton: changeable,
                    isDailyDoseButton: changeable,
                    editButton: changeable,
                    deleteButton: changeable
                }
            };
        })
);
