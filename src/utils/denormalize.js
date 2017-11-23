import {
    isArray,
    curry,
    compose,
    reduce,
    toPairs,
    omit
} from 'lodash/fp';
import Maybe, {
    Just
} from 'data.maybe';

import {
    filterMap,
    get
} from 'utils';
import {
    getBunchID,
    getBunchNamespace
} from 'utils/bunch';


/**
 * @typedef Relations
 * @type Maybe (Dict String Relations)
 */

/**
 * @typedef Data
 * @type Dict BunchSchema (Dict BunchID Entity)
 */

/**
 * @typedef Entity
 * @type Object
 * @prop [Bunch] bunch
 */

const omitId = omit([ 'id' ]);

/**
 * Extract and denormalize data entity by banch or list of banch and relations.
 *
 * @type Relations -> Data -> [Bunch|List Bunch] -> [Maybe Entity|List Entity]
 */
export const denormalize = curry(
    (mRelations, data, bunch) => isArray(bunch) ?

        filterMap(
            denormalize(mRelations, data),
            bunch
        ) :

        get(getBunchNamespace(bunch), data)
            .chain(get(getBunchID(bunch)))
            .map(
                compose(
                    entity => ({ ...entity, bunch }),
                    omitId,
                    entity => mRelations.map(
                        compose(
                            reduce(
                                (acc, [ fieldName, mFieldRelations ]) => ({
                                    ...acc,
                                    [ fieldName ]: get(fieldName, acc).chain(
                                        fieldBunch => fieldBunch instanceof Maybe ?
                                            fieldBunch :
                                            Just(fieldBunch)
                                    ).chain(denormalize(mFieldRelations, data))
                                }),
                                entity
                            ),
                            toPairs
                        )
                    ).getOrElse(entity)
                )
            )
);
