import {
    get
} from 'utils';
import {
    getBunchID,
    getBunchNamespace
} from 'utils/bunch';
import {
    getEntityMerger
} from './entity-merger';


/**
 * Try to update existion entity.
 *
 * @type Data -> Bunch -> Object
 */
export function entityUpdate(state, bunch, diff) {
    const namespace = getBunchNamespace(bunch);
    const id = getBunchID(bunch);
    const mDict = get(namespace, state);
    const mEntity = mDict.chain(get(id));

    return getEntityMerger(namespace).map(
        merger => dict => entity => ({
            ...state,
            [ namespace ]: {
                ...dict,
                [ id ]: merger(diff, entity)
            }
        })
    ).ap(mDict).ap(mEntity).getOrElse(state);
}
