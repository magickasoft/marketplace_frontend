import React, { PropTypes } from 'react';
import PropTypes_ from 'utils/prop-types';

import CSSModules from 'react-css-modules';
import styles from './styles.css';


function IOSPreview(props) {
    return (
        <div styleName="screenshot-wrapper">
            <div styleName="screenshot-image ios-image">
                <div styleName="ios-header">
                    <div styleName="ios-header-icon"></div>
                    <div styleName="ios-header-name">Messenger</div>
                    <div styleName="ios-header-date">Now</div>
                </div>
                <div styleName="ios-body">
                    <div styleName="ios-title">
                        {props.title.getOrElse(
                            <i>You can write a title</i>
                        )}
                    </div>
                    <div styleName="ios-message">
                        {props.message.getOrElse(
                            <i>You can write a message</i>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

IOSPreview.propTypes = {
    title: mString.isRequired,
    message: mString.isRequired
};

export default CSSModules(IOSPreview, styles, { allowMultiple: true });
