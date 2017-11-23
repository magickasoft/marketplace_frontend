import React, { PropTypes } from 'react';
import PropTypes_ from 'utils/prop-types';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

function AndroidPreview(props) {
    return (
        <div styleName="screenshot-wrapper">
            <div styleName="screenshot-image android-image">
                <div styleName="android-push">
                    <div styleName="android-icon"></div>
                    <div>
                        <div styleName="android-title">
                            {props.title.getOrElse(
                                <i>You can write a title</i>
                            )}
                        </div>
                        <div styleName="android-message">
                            {props.message.getOrElse(
                                <i>You can write a message</i>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

AndroidPreview.propTypes = {
    title: mString.isRequired,
    message: mString.isRequired
};

export default CSSModules(AndroidPreview, styles, { allowMultiple: true });
