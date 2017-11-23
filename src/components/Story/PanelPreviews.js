import React, { PropTypes } from 'react';
import {
    property
} from 'lodash/fp';
import {
    findByBunch
} from 'utils';
import PropTypes_ from 'utils/prop-types';

import ChannelView from './ChannelView';
import StoryView from './StoryView';

const pUrl = property('url');

function StoryPanelPreviews({ fields, channels }) {
    const maybeChannel = fields.channel.map(findByBunch(channels));
    return (
        <div>
            <ChannelView channel={maybeChannel}
                         title={fields.title}
                         image={fields.images.small.chain(pUrl)}
            />
            <StoryView channel={maybeChannel}
                       title={fields.title}
                       description={fields.description}
                       text={fields.text}
                       image={fields.images.large.chain(pUrl)}
            />
        </div>
    );
}

const mBunch = PropTypes_.Maybe(
    PropTypes_.bunch.isRequired
);

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

const mObject = PropTypes_.Maybe(
    PropTypes.object.isRequired
);

StoryPanelPreviews.propTypes = {
    fields: PropTypes.shape({
        title: PropTypes.string.isRequired,
        channel: mBunch.isRequired,
        description: mString.isRequired,
        text: PropTypes.string.isRequired,
        images: PropTypes.shape({
            small: mObject.isRequired,
            large: mObject.isRequired
        }).isRequired
    }).isRequired,
    channels: PropTypes.array.isRequired
};

export default StoryPanelPreviews;
