import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import styles from './styles.css';
import PropTypes_ from 'utils/prop-types';

function Dropdown(props) {
    return (
        <div styleName="root">
            {props.children}

            {props.menu.map(element => (
                <div styleName="menu">
                    {element}
                </div>
            )).getOrElse(null)}
        </div>
    );
}

Dropdown.propTypes = {
    children: PropTypes.node.isRequired,
    menu: PropTypes_.Maybe(
        PropTypes.node.isRequired
    ).isRequired
};

export default CSSModules(Dropdown, styles);
