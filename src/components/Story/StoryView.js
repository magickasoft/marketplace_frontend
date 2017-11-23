import React, { PropTypes } from 'react';
import PropTypes_ from 'utils/prop-types';

import ScaledImage from 'components/ScaledImage';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

function StoryView(props) {
    return (
        <div styleName="preview-panel">
            {props.image.cata({
                Just: img => (
                    <ScaledImage imageUrl={img} percentHeight={157}>
                        <div styleName="story-view-image-channel">
                            {props.channel.cata({
                                Just: foundChannel => (
                                    foundChannel.title
                                ),
                                Nothing: () => <div styleName="should-select">Select channel</div>
                            })}
                        </div>
                        <div styleName="story-view-image-text">
                            {props.title}
                        </div>
                    </ScaledImage>
                ),
                Nothing: () => <div styleName="should-select">Select image</div>
            })}
            <div styleName="preview-content">
                <div styleName="preview-title">
                    {props.description.getOrElse(<div styleName="should-select">You can write tagline</div>)}
                </div>
                <div styleName="preview-text"
                     dangerouslySetInnerHTML={{__html: props.text}}
                />
            </div>
        </div>
    );
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

StoryView.propTypes = {
    title: PropTypes.string.isRequired,
    description: mString.isRequired,
    text: PropTypes.string.isRequired,
    image: mString.isRequired,
    channel: PropTypes_.Maybe(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            header: PropTypes.shape({
                icon: mString.isRequired
            }).isRequired
        }).isRequired
    ).isRequired
};

export default CSSModules(StoryView, styles);
