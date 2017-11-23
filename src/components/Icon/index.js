import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.css';

/**
 * Font build with http://fontello.com/
 */

const Icon = ({ name, ...props }) => (
    <i styleName={name} {...props} />
);

Icon.propTypes = {
    name: PropTypes.oneOf([
        'ticket',
        'clock'
    ]).isRequired
};

export default CSSModules(Icon, styles);
