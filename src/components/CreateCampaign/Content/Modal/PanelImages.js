import React, { PropTypes } from 'react';
import {
    Panel
} from 'react-bootstrap';
import {
    property
} from 'lodash/fp';
import {
    Just
} from 'data.maybe';
import {
    ASSET_OFFER_SMALL,
    ASSET_OFFER_MEDIUM,
    ASSET_OFFER_LARGE_HALF,
    ASSET_OFFER_LARGE
} from 'models/images';
import {
    toImageAsset
} from 'utils';

import PropTypes_ from 'utils/prop-types';
import GroupDropzone from 'components/GroupDropzone';


const pSmall = property('small');
const pMedium = property('medium');
const pLargeHalf = property('largeHalf');
const pLarge = property('large');

export default function PanelImages(props) {
    return (
        <Panel header={
            <h1>Images</h1>
            }>
            <GroupDropzone
                label={Just('Preview offer image')}
                subLabel={Just('Recommended size 656x280')}
                asset={toImageAsset(ASSET_OFFER_SMALL)}
                image={props.fields.small}
                modal={props.modals.images.small}
                errors={props.errors.chain(pSmall)}
                placeholder="Drop small image here"
                size={[ '100%', '80px' ]}
                onUpload={props.onUploadSmallImage}
                onRemove={props.onRemoveSmallImage}
                onModalImageAdd={props.onModalPreviewSmallImageAdd}
                onShowModal={() => props.onModalPreviewSmallImage(true)}
                onCloseModal={() => props.onModalPreviewSmallImage(false)}
            />

            <GroupDropzone
                label={Just('Saved offer image')}
                subLabel={Just('Recommended size 240x280')}
                asset={toImageAsset(ASSET_OFFER_MEDIUM)}
                image={props.fields.medium}
                modal={props.modals.images.medium}
                errors={props.errors.chain(pMedium)}
                placeholder="Drop medium image here"
                size={[ '100%', '150px' ]}
                onUpload={props.onUploadMediumImage}
                onRemove={props.onRemoveMediumImage}
                onModalImageAdd={props.onModalPreviewMediumImageAdd}
                onShowModal={() => props.onModalPreviewMediumImage(true)}
                onCloseModal={() => props.onModalPreviewMediumImage(false)}
            />

            <GroupDropzone
                label={Just('Half-size image')}
                subLabel={Just('Recommended half-size 720x688')}
                asset={toImageAsset(ASSET_OFFER_LARGE_HALF)}
                image={props.fields.largeHalf}
                modal={props.modals.images.largeHalf}
                errors={props.errors.chain(pLargeHalf)}
                placeholder="Drop half-size image here"
                size={[ '100%', '230px' ]}
                onUpload={props.onUploadLargeHalfImage}
                onRemove={props.onRemoveLargeHalfImage}
                onModalImageAdd={props.onModalPreviewLargeHalfImageAdd}
                onShowModal={() => props.onModalPreviewLargeHalfImage(true)}
                onCloseModal={() => props.onModalPreviewLargeHalfImage(false)}
            />

            <GroupDropzone
                label={Just('Large image')}
                subLabel={Just('Full-size 720x1136')}
                asset={toImageAsset(ASSET_OFFER_LARGE)}
                image={props.fields.large}
                modal={props.modals.images.large}
                errors={props.errors.chain(pLarge)}
                placeholder="Drop large size image here"
                size={[ '100%', '230px' ]}
                onUpload={props.onUploadLargeImage}
                onRemove={props.onRemoveLargeImage}
                onModalImageAdd={props.onModalPreviewLargeImageAdd}
                onShowModal={() => props.onModalPreviewLargeImage(true)}
                onCloseModal={() => props.onModalPreviewLargeImage(false)}
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

PanelImages.propTypes = {
    fields: PropTypes.shape({
        small: mObject.isRequired,
        medium: mObject.isRequired,
        largeHalf: mObject.isRequired,
        large: mObject.isRequired
    }).isRequired,
    modals: PropTypes.shape({
        images: PropTypes.shape({
            small: mObject.isRequired,
            medium: mObject.isRequired,
            largeHalf: mObject.isRequired,
            large: mObject.isRequired
        }).isRequired
    }).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: mShape({
        small: mArrayOfString.isRequired,
        medium: mArrayOfString.isRequired,
        largeHalf: mObject.isRequired,
        large: mArrayOfString.isRequired
    }).isRequired,

    onUploadSmallImage: PropTypes.func.isRequired,
    onUploadMediumImage: PropTypes.func.isRequired,
    onUploadLargeImage: PropTypes.func.isRequired,
    onUploadLargeHalfImage: PropTypes.func.isRequired,
    onRemoveSmallImage: PropTypes.func.isRequired,
    onRemoveMediumImage: PropTypes.func.isRequired,
    onRemoveLargeImage: PropTypes.func.isRequired,
    onRemoveLargeHalfImage: PropTypes.func.isRequired,
    onModalPreviewSmallImageAdd: PropTypes.func.isRequired,
    onModalPreviewSmallImage: PropTypes.func.isRequired,
    onModalPreviewMediumImageAdd: PropTypes.func.isRequired,
    onModalPreviewMediumImage: PropTypes.func.isRequired,
    onModalPreviewLargeImageAdd: PropTypes.func.isRequired,
    onModalPreviewLargeImage: PropTypes.func.isRequired,
    onModalPreviewLargeHalfImageAdd: PropTypes.func.isRequired,
    onModalPreviewLargeHalfImage: PropTypes.func.isRequired
};
