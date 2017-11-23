/**
* @param {Schema} definition a singular schema that this Maybe contains.
*
* @return {Schema}
*/
export class Maybe {
    constructor(definition) {
        this.schema = definition;
    }

    normalize(mInput, parent, key, visit, addEntity) {
        return mInput.map(
            input => visit(input, parent, key, this.schema, addEntity)
        );
    }
}
