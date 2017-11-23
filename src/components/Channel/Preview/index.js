import React, { PropTypes } from 'react';
import {
    Row,
    Col,
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
    ASSET_CHANNEL_HEADER_BACKGROUND
} from 'models/images';
import {
    toImageAsset
} from 'utils';
import PropTypes_ from 'utils/prop-types';
import GroupDropzone from 'components/GroupDropzone';
import ColorPickGroup from './ColorPickGroup';
import CompositeColorsGroup from './CompositeColorsGroup';
import Result from './Result';


const pBackground = property('background');
const pHeader = property('header');
const pPage = property('page');
const pHeaderColor = compose(
    property('color'),
    pHeader
);
const pHeaderColorSpecial = compose(
    property('colorSpecial'),
    pHeader
);
const pHeaderBackground = compose(
    pBackground,
    pHeader
);
const pHeaderBackgroundExtra = compose(
    property('backgroundExtra'),
    pHeader
);
const pPageBackground = compose(
    pBackground,
    pPage
);
const pPageWallpaper = compose(
    property('wallpaper'),
    pPage
);

export default function Preview(props) {
    return (
        <Row>
            <Col xs={12} sm={6} md={8}>
                <h3>Configure Look</h3>

                <Panel header="Header">
                    <Row>
                        <Col xs={12} md={6}>
                            <ColorPickGroup
                                value={props.fields.header.color}
                                busy={props.busy}
                                errors={props.errors.chain(pHeaderColor)}
                                onChange={props.changeHeaderColorHandler}
                            >Text Color</ColorPickGroup>

                            <ColorPickGroup
                                value={props.fields.header.colorSpecial}
                                busy={props.busy}
                                errors={props.errors.chain(pHeaderColorSpecial)}
                                onChange={props.changeHeaderColorSpecialHandler}
                            >&#34;Manage&#34; Color</ColorPickGroup>
                        </Col>
                    </Row>
                </Panel>

                <Panel header="Header Background">
                    <CompositeColorsGroup
                        value={props.fields.header.background}
                        busy={props.busy}
                        errors={props.errors.chain(pHeaderBackground)}
                        onChange={props.changeHeaderBackgroundHandler}
                    >Background Colors</CompositeColorsGroup>

                    <CompositeColorsGroup
                        value={props.fields.header.backgroundExtra}
                        busy={props.busy}
                        errors={props.errors.chain(pHeaderBackgroundExtra)}
                        onChange={props.changeHeaderBackgroundExtraHandler}
                    >Background Colors When Scroll Down</CompositeColorsGroup>
                </Panel>

                <Panel header="Page Background">
                    <Row>
                        <Col xs={12} sm={6}>
                            <ColorPickGroup
                                value={props.fields.page.background}
                                busy={props.busy}
                                errors={props.errors.chain(pPageBackground)}
                                onChange={props.changePageBackgroundHandler}
                            >Color</ColorPickGroup>
                        </Col>

                        <Col xs={12} sm={6}>
                            <GroupDropzone
                                label={Just('Header background')}
                                subLabel={Just('Recommended size 720x488')}
                                asset={toImageAsset(ASSET_CHANNEL_HEADER_BACKGROUND)}
                                image={props.fields.page.wallpaper}
                                modal={props.modals.images.wallpaper}
                                errors={props.errors.chain(pPageWallpaper)}
                                placeholder="Drop header background image here"
                                size={[ '100%', '80px' ]}
                                onUpload={props.uploadPageWallpaperHandler}
                                onRemove={props.removePageWallpaperHandler}
                                onModalImageAdd={props.modalPreviewPageWallpaperAddHandler}
                                onShowModal={() => props.modalPreviewPageWallpaperHandler(true)}
                                onCloseModal={() => props.modalPreviewPageWallpaperHandler(false)}
                            />
                        </Col>
                    </Row>
                </Panel>
            </Col>

            <Col xs={12} sm={6} md={4}>
                <Result {...props.fields} />
            </Col>
        </Row>
    );
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

const mErrorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

const compositeColorsTuple = PropTypes_.Tuple([
    mString.isRequired,
    PropTypes_.Maybe(
        PropTypes.number.isRequired
    ).isRequired
]);

const mArrayOfString = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

const mImageShape = mShape({
    url: mString.isRequired,
    busy: PropTypes.bool.isRequired,
    errors: mShape({
        common: mArrayOfString.isRequired
    }).isRequired
});
const mObject = PropTypes_.Maybe(
    PropTypes.object.isRequired
);
Preview.propTypes = {
    busy: PropTypes.bool.isRequired,
    fields: PropTypes.shape({
        header: PropTypes.shape({
            color: mString.isRequired,
            colorSpecial: mString.isRequired,
            background: compositeColorsTuple.isRequired,
            backgroundExtra: compositeColorsTuple.isRequired
        }).isRequired,
        page: PropTypes.shape({
            background: mString.isRequired,
            wallpaper: mImageShape.isRequired
        }).isRequired
    }).isRequired,
    modals: PropTypes.shape({
        images: PropTypes.shape({
            wallpaper: mObject.isRequired
        }).isRequired
    }).isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            header: PropTypes.shape({
                color: mErrorsList.isRequired,
                colorSpecial: mErrorsList.isRequired,
                background: mErrorsList.isRequired,
                backgroundExtra: mErrorsList.isRequired,
                logo: mErrorsList.isRequired
            }).isRequired,
            page: PropTypes.shape({
                background: mErrorsList.isRequired,
                wallpaper: mErrorsList.isRequired
            }).isRequired,
            common: mErrorsList.isRequired
        }).isRequired
    ).isRequired,

    changeHeaderColorHandler: PropTypes.func.isRequired,
    changeHeaderColorSpecialHandler: PropTypes.func.isRequired,
    changeHeaderBackgroundHandler: PropTypes.func.isRequired,
    changeHeaderBackgroundExtraHandler: PropTypes.func.isRequired,
    changePageBackgroundHandler: PropTypes.func.isRequired,
    uploadPageWallpaperHandler: PropTypes.func.isRequired,
    removePageWallpaperHandler: PropTypes.func.isRequired,
    modalPreviewPageWallpaperAddHandler: PropTypes.func.isRequired,
    modalPreviewPageWallpaperHandler: PropTypes.func.isRequired
};
