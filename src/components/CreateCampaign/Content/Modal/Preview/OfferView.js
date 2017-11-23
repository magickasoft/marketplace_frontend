import React, { PropTypes } from 'react';
import PropTypes_ from 'utils/prop-types';

import PreviewPanelWrapper from './Wrapper';
import ScaledImage from 'components/ScaledImage';

export default function OfferView(props) {
    return (
        <PreviewPanelWrapper title="Offer View">
            {props.image.cata({
                Just: img => (
                    <ScaledImage imageUrl={img} percentHeight={157}>
                        <div styleName="offer-view-image-channel">
                            {props.channel.cata({
                                Just: foundChannel => (
                                    foundChannel.title
                                ),
                                Nothing: () => <span>Select channel</span>
                            })}
                        </div>
                        <div styleName="offer-view-image-text">
                            <div styleName="preview-title">
                                {props.title}
                            </div>
                            <div styleName="preview-subtitle">
                                {props.subtitle.getOrElse(null)}
                            </div>
                            <div styleName="preview-button">
                                <div>{props.buttonText.getOrElse(null)}</div>
                            </div>
                            <div styleName="preview-text">
                                🕔 Valid until {props.validDate}
                            </div>
                        </div>
                    </ScaledImage>
                ),
                Nothing: () => <div>Select image</div>
            })}
            <div styleName="preview-content">
                <div styleName="preview-title">
                    How it works
                </div>
                <div styleName="preview-text"
                     dangerouslySetInnerHTML={{__html: props.howItWorks.getOrElse(null)}}
                />
                <hr styleName="offer-hr" />
                <div styleName="preview-title">
                    Terms &amp; Conditions
                </div>
                <div styleName="preview-text"
                     dangerouslySetInnerHTML={{__html: props.termsAndConditions.getOrElse(null)}}
                />
            </div>
        </PreviewPanelWrapper>
    );
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

OfferView.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: mString.isRequired,
    buttonText: mString.isRequired,
    howItWorks: mString.isRequired,
    termsAndConditions: mString.isRequired,
    validDate: PropTypes.string.isRequired,
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
