import {
    curry,
    has
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';


/**
 * Extract the value of key that may success.
 *
 * @type String -> Dict String b -> Maybe b
 */
export const get = curry(
    (key, dict) => !has(key, dict) ?
        Nothing() :
        Just(dict[ key ])
);
