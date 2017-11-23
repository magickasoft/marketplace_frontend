import React, { PropTypes } from 'react';
import {
    HelpBlock
} from 'react-bootstrap';
import {
    map
} from 'lodash/fp';


export default function ErrorsList(props) {
    return (
        <div style={{ marginTop: 10 }}>
            {map(error => (
                <HelpBlock key={error}>{error}</HelpBlock>
            ), props.children)}
        </div>
    );
}

ErrorsList.propTypes = {
    children: PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
};
