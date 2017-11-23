import React, { PropTypes } from 'react';
import FIcon from 'react-fontawesome';


export default function AsyncIcon({ name, busy, ...props }) {
    return (
        <FIcon
            {...props}
            name={busy ? 'circle-o-notch' : name}
            spin={busy}
            fixedWidth
        />
    );
}

AsyncIcon.propTypes = {
    name: PropTypes.string.isRequired,
    busy: PropTypes.bool.isRequired
};
