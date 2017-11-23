import {
    isEmpty
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

export function maybeFromString(str) {
    return isEmpty(str) ? Nothing() : Just(str);
}
