import React, { PropTypes } from 'react';
import PropTypes_ from 'utils/prop-types';

import PreviewPanelWrapper from './Wrapper';
import ScaledImage from 'components/ScaledImage';

export default function ChannelView({ title, validDate, image, channel }) {
    return (
        <PreviewPanelWrapper title="Channel View">
            <div styleName="preview-content">
                {channel.cata({
                    Just: foundChannel => (
                        <div styleName="preview-channel-wrapper">
                            <div styleName="preview-channel-icon"
                                 style={{
                                     backgroundImage: `url(${foundChannel.header.icon.getOrElse(null)})`
                                 }}/>
                            <div styleName="preview-channel-content">
                                <div styleName="preview-title">{foundChannel.title}</div>
                                <div styleName="preview-text">June 16 at 9:00 pm</div>
                            </div>
                        </div>
                    ),
                    Nothing: () => <div style={{textAlign: 'center'}}>Select channel</div>
                })}
            </div>
            {image.cata({
                Just: img => <ScaledImage imageUrl={img} percentHeight={68}/>,
                Nothing: () => <div>Select image</div>
            })}
            <div styleName="channel-view-under-image">
                <div styleName="preview-title">{title}</div>
                <div styleName="preview-text">🕔 Valid until {validDate}</div>
            </div>
        </PreviewPanelWrapper>
    );
}

ChannelView.propTypes = {
    title: PropTypes.string.isRequired,
    validDate: PropTypes.string.isRequired,
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
