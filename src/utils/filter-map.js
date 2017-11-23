import {
    reduce,
    curry
} from 'lodash/fp';


/**
 * Apply a function that may succeed to all values in the list,
 * but only keep the successes.
 *
 * @type (a -> Maybe b) -> List a -> List b
 */
export const filterMap = curry(
    (predicate, arr) => reduce(
        (acc, el) => predicate(el)
            .map(filtredEl => ([ ...acc, filtredEl ]))
            .getOrElse(acc),
        [],
        arr
    )
);
