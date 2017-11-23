import {
    floor
} from 'lodash/fp';

import {
    toFloat
} from 'utils';


/**
 * Try to convert a string into a int,
 * failing on improperly formatted strings.
 *
 * @type String -> Either String Int
 */
export function toInt(string) {
    return toFloat(string)
        .bimap(
            () => `Could not convert string '${string}' to an Int`,
            floor
        );
}
