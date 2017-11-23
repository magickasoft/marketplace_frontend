import React, { PropTypes } from 'react';
import PropTypes_ from 'utils/prop-types';

import PreviewPanelWrapper from './Wrapper';
import ScaledImage from 'components/ScaledImage';

export default function ChatIndex({ image, channel }) {
    return (
        <PreviewPanelWrapper title="Chat Index">
            <div>
                {channel.cata({
                    Just: foundChannel => (
                        <div styleName="preview-channel-wrapper">
                            <div styleName="preview-channel-icon"
                                 style={{
                                     backgroundImage: `url(${foundChannel.header.icon.getOrElse(null)})`
                                 }}/>
                            <div styleName="preview-channel-content">
                                <div styleName="preview-title">{foundChannel.title}</div>
                                <div styleName="preview-text">Best Offers Tailor-Made for You!</div>
                            </div>
                        </div>
                    ),
                    Nothing: () => <div style={{textAlign: 'center'}}>Select channel</div>
                })}
            </div>
            <div styleName="preview-content">
                {image.cata({
                    Just: img => (
                        <ScaledImage imageUrl={img} percentHeight={42.68}>
                            <div styleName="chat-view-image-text">Best Offers Tailor-Made for You!</div>
                        </ScaledImage>
                    ),
                    Nothing: () => <div>Select image</div>
                })}
            </div>
        </PreviewPanelWrapper>
    );
}

ChatIndex.propTypes = {
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
