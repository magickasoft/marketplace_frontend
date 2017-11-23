import React, { PropTypes } from 'react';
import {
    Button,
    Modal
} from 'react-bootstrap';
import FIcon from 'react-fontawesome';
import Dropzone from 'react-dropzone';
import CSSModules from 'react-css-modules';
import {
    noop,
    property,
    constant,
    compose,
    isEqual
} from 'lodash/fp';

import styles from './styles.css';
import 'cropperjs/dist/cropper.css';
import {
    Just
} from 'data.maybe';
import {
    head,
    toBlob
} from 'utils';
import Cropper from 'react-cropper';

import PropTypes_ from 'utils/prop-types';
import Placeholder from 'components/Placeholder';
import GroupInput from 'components/GroupInput';


const pErrors = property('errors');
const pCommon = property('common');

function GroupDropzone(props) {
    const [ maxWidth, minHeight ] = props.size;
    const assetSize = props.asset.getOrElse({});
    const cropSize = assetSize ? { ...assetSize } : {};
    let cropperRef = null;

    function handleModalClickOk() {
        if (isEqual('undefined', cropperRef.getCroppedCanvas())) {
            return;
        }
        const theFile = Just(toBlob(cropperRef.getCroppedCanvas(cropSize).toDataURL('image/png')));
        theFile.cata({
            Nothing: noop,
            Just: props.onUpload
        });
    }

    return (
        <div>
            <Modal show={props.modal.cata({
                Nothing: () => (false),
                Just: modal => (modal.status)
            })}>
                <Modal.Header>
                    <Modal.Title>
                        Crop image
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {props.modal.cata({
                        Nothing: () => noop,
                        Just: modal => (
                                <Cropper
                                    src={modal.file.cata({
                                        Nothing: () => noop,
                                        Just: file => (file.preview)
                                    })}
                                    style={{height: 400, width: '100%'}}
                                    cropBoxResizable={false}
                                    autoCrop={true}
                                    aspectRatio={props.asset ? props.asset.cata({
                                        Nothing: () => (null),
                                        Just: size => (size.width / size.height)
                                    }) : null}
                                    guides={true}
                                    ref={cropper => {
                                        cropperRef = cropper;
                                    }}
                                />
                            )
                    })
                    }
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        bsStyle="primary"
                        onClick={compose(handleModalClickOk, props.onCloseModal)}>
                        Ok
                    </Button>
                    <Button
                        bsStyle="default"
                        onClick={props.onCloseModal}>
                        Сancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <GroupInput
                {...props}
                errors={
                    props.image.chain(pErrors).chain(pCommon)
                        .orElse(constant(props.errors))
                }
            >
                {props.image.cata({
                    Nothing: () => (
                        <Dropzone
                            onDrop={compose(props.onShowModal, props.onModalImageAdd, head)}
                                // head(files).cata({
                                //     Nothing: noop,
                                //     Just: props.onUpload
                                // });
                            multiple={false}
                            style={{
                                minHeight,
                                maxWidth
                            }}
                            styleName="dropzone"
                            activeClassName={styles.dropzone_active}
                        >
                            {props.placeholder}
                        </Dropzone>
                    ),

                    Just: image => (
                        <Placeholder size={props.size} busy={image.busy}>
                            <div
                                styleName="preview"
                                style={{
                                    minHeight,
                                    maxWidth,
                                    backgroundImage: image.url
                                        .map(url => `url("${url}")`)
                                        .getOrElse(null)
                                }}
                            >
                                <Button
                                    styleName="remove"
                                    bsStyle="danger"
                                    onClick={props.onRemove}
                                >
                                    <FIcon name="remove"/>
                                </Button>
                            </div>
                        </Placeholder>
                    )
                })}
            </GroupInput>
        </div>
    );
}

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

const mErrorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

GroupDropzone.propTypes = {
    image: mShape({
        url: PropTypes_.Maybe(
            PropTypes.string.isRequired
        ).isRequired,
        busy: PropTypes.bool.isRequired,
        errors: mShape({
            common: mErrorsList.isRequired
        }).isRequired
    }).isRequired,
    errors: mErrorsList.isRequired,
    placeholder: PropTypes.string.isRequired,
    size: PropTypes_.Tuple([
        PropTypes.string.isRequired,
        PropTypes.string.isRequired
    ]).isRequired,
    onUpload: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onModalImageAdd: PropTypes.func.isRequired,
    onShowModal: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    modal: PropTypes.object.isRequired,
    asset: PropTypes.object
};

export default CSSModules(GroupDropzone, styles);
