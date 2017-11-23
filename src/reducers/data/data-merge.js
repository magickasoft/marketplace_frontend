import {
    reduce,
    toPairs,
    __
} from 'lodash/fp';

import {
    get
} from 'utils';
import {
    getEntityMerger
} from './entity-merger';


/**
 * Merge a data to state.
 *
 * @type Data -> Data -> Data
 */
export function dataMerge(state, data) {
    return reduce(
        (accState, [ namespace, dict ]) => getEntityMerger(namespace).map(
            merger => ({
                ...accState,
                [ namespace ]: get(namespace, accState).map(
                    reduce(
                        (accDict, [ id, entity ]) => ({
                            ...accDict,
                            [ id ]: get(id, accDict)
                                .map(merger(entity))
                                .getOrElse(entity)
                        }),
                        __,
                        toPairs(dict)
                    )
                ).getOrElse(dict)
            })
        ).getOrElse(accState),
        state,
        toPairs(data)
    );
}
