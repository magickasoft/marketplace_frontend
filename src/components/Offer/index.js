import React, { PropTypes } from 'react';
import FIcon from 'react-fontawesome';
import CSSModules from 'react-css-modules';

import PropTypes_ from 'utils/prop-types';
import styles from './styles.css';

function Offer(props) {
    return (
        <div styleName={props.compact ? 'root_compact' : 'root'}>
            {props.image.cata({
                Nothing: () => (
                    <div styleName="placeholder">
                        <FIcon
                            styleName="icon"
                            name="image"
                            size="5x"
                        />
                    </div>
                ),

                Just: url => (
                    <div
                        styleName="image"
                        style={{
                            backgroundImage: `url(${url})`
                        }}
                    />
                )
            })}

            <h4 styleName="title">
                {props.title}
            </h4>

            {props.description.cata({
                Nothing: () => !props.compact ? null : (
                    <p styleName="description">&nbsp;</p>
                ),

                Just: description => !description ? (
                    <p styleName="description">
                        &nbsp;
                    </p>
                ) : (
                    <p styleName="description">
                        {description}
                    </p>
                )
            })}

            {props.children}
        </div>
    );
}

Offer.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes_.Maybe(
        PropTypes.string.isRequired
    ).isRequired,
    image: PropTypes_.Maybe(
        PropTypes.string.isRequired
    ).isRequired,
    compact: PropTypes.bool.isRequired,
    children: PropTypes.element
};

export default CSSModules(Offer, styles);
