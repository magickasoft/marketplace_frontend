import {
    isArray,
    isNull,
    reduce,
    zipAll,
    size,
    range
} from 'lodash/fp';
import {
    PropTypes
} from 'react';
import createChainableTypeChecker from 'react-prop-types/lib/utils/createChainableTypeChecker';
import Maybe from 'data.maybe';

export default {
    Maybe: validate => createChainableTypeChecker(
        (props, propName, componentName, location, propFullName, secret) => {
            const prop = props[ propName ];

            if (!(prop instanceof Maybe)) {
                throw new Error(
                    `Failed prop type: Invalid prop \`${propFullName}\` of type \`${typeof prop}\` ` +
                    `supplied to ${componentName}, expected \`Maybe\`.`
                );
            }

            return prop.cata({
                Nothing: () => null,

                Just: value => validate({
                    ...props,
                    [ propName ]: value
                }, propName, componentName, location, propFullName, secret)
            });
        }
    ),

    Tuple: validations => createChainableTypeChecker(
        (props, propName, componentName, location, propFullName, secret) => {
            const listOfProps = props[ propName ];

            if (!isArray(listOfProps)) {
                throw new Error(
                    `Failed prop type: Invalid prop \`${propFullName}\` of type \`${typeof listOfProps}\` ` +
                    `supplied to ${componentName}, expected \`Tuple\`.`
                );
            }

            const listOfPropsSize = size(listOfProps);
            const validationsSize = size(validations);
            if (listOfPropsSize !== validationsSize) {
                throw new Error(
                    `Failed prop type: Invalid tuple size \`${propFullName}\` is \`${listOfPropsSize}\` ` +
                    `supplied to ${componentName}, expected \`${validationsSize}\`.`
                );
            }

            return reduce(
                (acc, [ validate, position ]) => {
                    const result = validate(
                        listOfProps,
                        position,
                        componentName,
                        location,
                        `${propFullName}[${position}]`,
                        secret
                    );

                    return isNull(result) ? acc : result;
                },
                null,
                zipAll([
                    validations,
                    range(0, validationsSize)
                ])
            );
        }
    ),

    bunch: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.number.isRequired
        ]).isRequired,
        schema: PropTypes.string.isRequired
    })
};
