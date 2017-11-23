import {
    isUndefined,
    curry,
    find as find_
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';


/**
 * Find element that satisfy the predicate.
 *
 * @type (a -> Bool) -> List a -> Maybe a
 */
export const find = curry(
    (predicate, arr) => {
        const element = find_(predicate, arr);

        return isUndefined(element) ?
            Nothing() :
            Just(element);
    }
);
