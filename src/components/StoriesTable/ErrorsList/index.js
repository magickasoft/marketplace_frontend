import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import {
    HelpBlock
} from 'react-bootstrap';
import {
    map
} from 'lodash/fp';

import styles from './styles.css';


function ErrorsList(props) {
    return (
        <div styleName="root">
            {map(error => (
                <HelpBlock key={error} styleName="error">
                    {error}
                </HelpBlock>
            ), props.children)}
        </div>
    );
}

ErrorsList.propTypes = {
    children: PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
};

export default CSSModules(ErrorsList, styles);
