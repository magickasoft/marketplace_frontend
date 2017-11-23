import {
    curry,
    property
} from 'lodash/fp';


/**
 * @typedef Bunch
 * @type Object
 * @prop [BunchId] id
 * @prop [BunchNamespace] schema
 */

/**
 * @typedef BunchId
 * @type [Int|String]
 */

/**
 * @typedef BunchNamespace
 * @type String
 */

/**
 * Extract id from Bunch.
 *
 * @type Bunch -> BunchID
 */
export const getBunchID = property('id');

/**
 * Extract schema from Bunch.
 *
 * @type Bunch -> BunchNamespace
 */
export const getBunchNamespace = property('schema');

/**
 * Make a Bunch
 *
 * @type BunchNamespace -> BunchID -> Bunch
 */
export const makeBunch = curry(
    (schema, id) => ({ schema, id })
);
