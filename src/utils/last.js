import {
    get
} from 'utils';

/**
 * Extract last of list that may success.
 *
 * @type List a -> Maybe a
 */
export function last(arr) {
    return get(arr.length - 1, arr);
}
