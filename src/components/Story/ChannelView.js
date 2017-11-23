import React, { PropTypes } from 'react';
import PropTypes_ from 'utils/prop-types';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

import ScaledImage from 'components/ScaledImage';

function StoryChannelView({ channel, title, image }) {
    return (
        <div styleName="preview-panel">
            {channel.cata({
                Just: foundChannel => (
                    <div styleName="channel-view-channel-wrapper">
                        <div styleName="channel-view-channel-icon"
                             style={{
                                 backgroundImage: `url(${foundChannel.header.icon.getOrElse(null)})`
                             }}/>
                        <div styleName="channel-view-channel-name">
                            {foundChannel.title}
                        </div>
                    </div>
                ),
                Nothing: () => <div styleName="should-select">Select channel</div>
            })}
            {image.cata({
                Just: img => <ScaledImage imageUrl={img} percentHeight={45}/>,
                Nothing: () => <div styleName="should-select">Select image</div>
            })}
            <div styleName="channel-view-title">{title || <i>You can write headline here</i>}</div>
        </div>
    );
}

StoryChannelView.propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes_.Maybe(
        PropTypes.string.isRequired
    ).isRequired,
    channel: PropTypes_.Maybe(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            header: PropTypes.shape({
                icon: PropTypes_.Maybe(
                    PropTypes.string.isRequired
                ).isRequired
            }).isRequired
        }).isRequired
    ).isRequired
};

export default CSSModules(StoryChannelView, styles);
