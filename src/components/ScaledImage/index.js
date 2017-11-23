import React, { PropTypes } from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

function ScaledImage({ imageUrl, percentHeight, children }) {
    return (
        <div styleName="scaled-image-wrapper" style={{ paddingTop: `${percentHeight}%` }}>
            <div styleName="scaled-image" style={{ backgroundImage: `url(${imageUrl})` }}>
                {children}
            </div>
        </div>
    );
}

ScaledImage.propTypes = {
    imageUrl: PropTypes.string,
    percentHeight: PropTypes.number.isRequired,
    children: PropTypes.any
};

export default CSSModules(ScaledImage, styles);
