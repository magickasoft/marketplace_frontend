import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.css';


function Disabler(props) {
    return (
        <div styleName={props.active ? 'root_active' : 'root'}>
            {props.active && (
                <span styleName="glass" />
            )}
            {props.children}
        </div>
    );
}

Disabler.propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
};

export default CSSModules(Disabler, styles);
