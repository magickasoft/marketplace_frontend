import React, { PropTypes } from 'react';
import {
    property
} from 'lodash/fp';
import {
    findByBunch,
    formatDate
} from 'utils';
import PropTypes_ from 'utils/prop-types';

import Waiter from './Waiter';

import ChatIndex from './ChatIndex';
import ChannelView from './ChannelView';
import OfferView from './OfferView';

import CSSModules from 'react-css-modules';
import styles from './styles.css';

const pUrl = property('url');

function PanelPreviews({ fields, channels }) {
    const { images, channel } = fields;
    return channels.results.map(channelsList => {
        const maybeChannel = channel.map(findByBunch(channelsList));
        return (
            <div>
                <ChatIndex channel={maybeChannel}
                           image={images.small.chain(pUrl)}
                />
                <ChannelView channel={maybeChannel}
                             title={fields.title}
                             validDate={formatDate(fields.validDate[0])}
                             image={images.largeHalf.chain(pUrl)}
                />
                <OfferView channel={maybeChannel}
                           title={fields.title}
                           subtitle={fields.subtitle}
                           howItWorks={fields.description}
                           termsAndConditions={fields.termsAndConditions}
                           validDate={formatDate(fields.validDate[0])}
                           image={images.large.chain(pUrl)}
                           buttonText={fields.button.text}
                />
            </div>
        );
    }).getOrElse(<Waiter {...channels}/>);
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

const mBunch = PropTypes_.Maybe(
    PropTypes_.bunch.isRequired
);

const mObject = PropTypes_.Maybe(
    PropTypes.object.isRequired
);

PanelPreviews.propTypes = {
    fields: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: mString.isRequired,
        subtitle: mString.isRequired,
        termsAndConditions: mString.isRequired,
        validDate: PropTypes_.Tuple([
            PropTypes.string.isRequired,
            PropTypes.string.isRequired
        ]).isRequired,
        shareable: PropTypes.bool.isRequired,
        button: PropTypes.shape({
            text: mString.isRequired
        }).isRequired,
        channel: mBunch.isRequired,
        images: PropTypes.shape({
            small: mObject.isRequired,
            medium: mObject.isRequired,
            large: mObject.isRequired
        }).isRequired
    }).isRequired,
    channels: PropTypes.object.isRequired
};

export default CSSModules(PanelPreviews, styles);
