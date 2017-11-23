import {
    Left,
    Right
} from 'data.either';


/**
 * Try to convert a string into a float,
 * failing on improperly formatted strings.
 *
 * @type String -> Either String Float
 */
export function toFloat(string) {
    const result = Number(string);

    return isNaN(result) ?
        Left(`Could not convert string '${string}' to an Float`) :
        Right(result);
}
