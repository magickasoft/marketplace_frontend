import React, { PropTypes } from 'react';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

function PreviewPanelWrapper({ title, children }) {
    return (
        <div styleName="preview-panel">
            <div styleName="preview-panel-title">
                {title}
            </div>
            {children}
        </div>
    );
}

PreviewPanelWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
};

export default CSSModules(PreviewPanelWrapper, styles);
