import React, { PropTypes } from 'react';
import {
    Panel
} from 'react-bootstrap';
import {
    compose,
    property
} from 'lodash/fp';
import {
    Just
} from 'data.maybe';
import {
    ASSET_STORY_SMALL,
    ASSET_STORY_LARGE
} from 'models/images';
import {
    toImageAsset
} from 'utils';

import PropTypes_ from 'utils/prop-types';
import GroupDropzone from 'components/GroupDropzone';


const pImages = property('images');
const pImagesSmall = compose(
    property('small'),
    pImages
);
const pImagesLarge = compose(
    property('large'),
    pImages
);

export default function PanelDropzones(props) {
    const [ , mSubmitErrors ] = props.errors;

    return (
        <Panel>
            <GroupDropzone
                label={Just('Preview story image')}
                subLabel={Just('Recommended size 720x308')}
                asset={toImageAsset(ASSET_STORY_SMALL)}
                image={props.fields.images.small}
                modal={props.modals.images.small}
                errors={mSubmitErrors.chain(pImagesSmall)}
                placeholder="Drop small image here"
                size={[ '100%', '80px' ]}
                onUpload={props.uploadSmallImageHandler}
                onRemove={props.removeSmallImageHandler}
                onModalImageAdd={props.modalPreviewSmallImageAddHandler}
                onShowModal={() => props.modalPreviewSmallImageHandler(true)}
                onCloseModal={() => props.modalPreviewSmallImageHandler(false)}
            />
            <GroupDropzone
                label={Just('Large image')}
                subLabel={Just('Recommended size 720x1136')}
                asset={toImageAsset(ASSET_STORY_LARGE)}
                image={props.fields.images.large}
                modal={props.modals.images.large}
                errors={mSubmitErrors.chain(pImagesLarge)}
                placeholder="Drop medium image here"
                size={[ '100%', '230px' ]}
                onUpload={props.uploadLargeImageHandler}
                onRemove={props.removeLargeImageHandler}
                onModalImageAdd={props.modalPreviewLargeImageAddHandler}
                onShowModal={() => props.modalPreviewLargeImageHandler(true)}
                onCloseModal={() => props.modalPreviewLargeImageHandler(false)}
            />
        </Panel>
    );
}

const mObject = PropTypes_.Maybe(
    PropTypes.object.isRequired
);

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

const mArrayOfString = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

PanelDropzones.propTypes = {
    fields: PropTypes.shape({
        images: PropTypes.shape({
            small: mObject.isRequired,
            // medium: mObject.isRequired,
            large: mObject.isRequired
        }).isRequired
    }).isRequired,
    modals: PropTypes.shape({
        images: PropTypes.shape({
            small: mObject.isRequired,
            large: mObject.isRequired
        }).isRequired
    }).isRequired,
    errors: PropTypes_.Tuple([
        mObject.isRequired,
        mShape({
            images: PropTypes.shape({
                small: mArrayOfString.isRequired,
                large: mArrayOfString.isRequired
            }).isRequired
        }).isRequired
    ]).isRequired,

    uploadSmallImageHandler: PropTypes.func.isRequired,
    uploadLargeImageHandler: PropTypes.func.isRequired,
    removeSmallImageHandler: PropTypes.func.isRequired,
    removeLargeImageHandler: PropTypes.func.isRequired,
    modalPreviewSmallImageHandler: PropTypes.func.isRequired,
    modalPreviewSmallImageAddHandler: PropTypes.func.isRequired,
    modalPreviewLargeImageHandler: PropTypes.func.isRequired,
    modalPreviewLargeImageAddHandler: PropTypes.func.isRequired

};
