import React, { PropTypes } from 'react';
import FIcon from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import styles from './styles.css';
import PropTypes_ from 'utils/prop-types';


function Placeholder(props) {
    const [ maxWidth, minHeight ] = props.size;

    return (
        <div
            styleName="root"
            style={{
                minHeight: props.busy ? minHeight : null,
                maxWidth: props.busy ? maxWidth : null
            }}
        >
            {props.busy && (
                <div styleName="glass">
                    <FIcon
                        styleName="icon"
                        name="circle-o-notch"
                        spin
                    />
                </div>
            )}
            {props.children}
        </div>
    );
}

Placeholder.propTypes = {
    busy: PropTypes.bool.isRequired,
    size: PropTypes_.Tuple([
        PropTypes.string.isRequired,
        PropTypes.string.isRequired
    ]).isRequired,
    children: PropTypes.node
};

export default CSSModules(Placeholder, styles);
