import React, { Component } from 'react';
import {
    withRouter
} from 'react-router';
import {
    connect
} from 'react-redux';
import {
    map,
    constant,
    property,
    compose,
    isEqual,
    ceil,
    divide,
    includes,
    filter,
    isEmpty,
    __
} from 'lodash/fp';
import {
    Modal,
    Button
} from 'react-bootstrap';
import {
    Nothing,
    Just
} from 'data.maybe';

import appConfig from 'config/app';
import {
    get,
    denormalize,
    formatDate,
    filterMap
} from 'utils';
import {
    SIZE_SMALL as IMAGE_SIZE_SMALL,
    SIZE_MEDIUM as IMAGE_SIZE_MEDIUM,
    SIZE_LARGE_HALF as IMAGE_SIZE_LARGE_HALF,
    SIZE_LARGE as IMAGE_SIZE_LARGE
} from 'models/images';
import {
    CAMPAIGN as TAB_CAMPAIGN,
    SEGMENT as TAB_SEGMENT,
    MEDIA as TAB_MEDIA,
    PUSH as TAB_PUSH,
    SUMMARY as TAB_SUMMARY,
    changeTab,
    setModalShow
} from 'actions/ui/create-campaign';
import {
    changeName as changeCampaignName,
    changeDescription as changeCampaignDescription,
    changeStartDate as changeCampaignStartDate,
    changeEndDate as changeCampaignEndDate,
    createOrUpdateCampaign
} from 'actions/ui/create-campaign/campaign';
import {
    selectLocation,
    deleteLocation,
    showAllLocations,
    setZoom,
    setMapCenter,
    setActiveLocation,
    receivePlacesList
} from 'actions/ui/create-campaign/segment';
import {
    select as selectOffer,
    receiveMediaPage
} from 'actions/ui/create-campaign/media';
import {
    REDEEM_CODE as MODAL_REDEEM_CODE,
    REDEEM_URL as MODAL_REDEEM_URL,
    open as openModal,
    close as closeModal,
    changeTitle as changeModalTitle,
    changeDescription as changeModalDescription,
    uploadImage as uploadModalImage,
    removeImage as removeModalImage,
    modalPreviewImage,
    modalPreviewImageAdd,
    changeSubtitle as changeModalSubtitle,
    changeTermsAndConditions as changeModalTermsAndConditions,
    changeValidDate as changeModalValidDate,
    changeSharable as changeModalSharable,
    chanteButtonText as chanteModalButtonText,
    choiseRedeemType as choiseModalRedeemType,
    changeRedeemTitle as changeModalRedeemTitle,
    changeRedeemCode as changeModalRedeemCode,
    changeRedeemUrl as changeModalRedeemUrl,
    changeWebsiteTitle as changeModalWebsiteTitle,
    changeWebsiteUrl as changeModalWebsiteUrl,
    changeChannel as changeModalChannel,
    receiveChannels,
    createOrUpdateOffer
} from 'actions/ui/create-campaign/media/modal';
import {
    enablePush,
    changePreviewType,
    changeTitle,
    changeMessage,
    selectOnStart,
    selectOnFuture,
    changeSendAtDate,
    changeSendAtTime
} from 'actions/ui/create-campaign/push';
import {
    launchCampaign
} from 'actions/ui/create-campaign/summary';
import {
    getBunchID
} from 'utils/bunch';
import CreateCampaign from 'components/CreateCampaign';
import CreateCampaignCampaign from 'components/CreateCampaign/Campaign';
import CreateCampaignSegment from 'components/CreateCampaign/Segment';
import CreateCampaignContent from 'components/CreateCampaign/Content';
import CreateCampaignPush from 'components/CreateCampaign/Push';
import CreateCampaignSummary from 'components/CreateCampaign/Summary';


const pCampaign = property('campaign');
const pSegment = property('segment');
const pOffer = property('offer');

const companyRequiredFields = ['name', 'description', 'startDate'];

class CreateCampaignContainer extends Component {
    agreeWithLaunch() {
        this.props.router.replace('/campaigns-list');
    }

    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, nextLocation => {
            if (!this.props.modalShow && this.props.reqFieldsDone) {
                this.setState({nextLocation});
                this.props.createOrUpdateCampaign();
                this.props.setModalShow(true);
                return false;
            }
            return true;
        });
    }

    onCloseModal() {
        const { nextLocation } = this.state;
        if (nextLocation) {
            if (nextLocation.action === 'PUSH') {
                this.props.router.push(nextLocation.pathname);
            } else {
                this.props.router.replace(nextLocation.pathname);
            }
        }
        this.setState({nextLocation: null});
        this.props.setModalShow(false);
    }

    render() {
        return (
            <CreateCampaign
                isLastTab={this.props.currentTab === TAB_SUMMARY}
                tabs={this.props.tabs}
                currentTab={this.props.currentTab}
                changeTabHandler={this.props.changeTab}
            >
                {this.props.section.chain(section => {
                    const goToSegmentTab = compose(
                        this.props.changeTab,
                        constant(TAB_SEGMENT)
                    );
                    const goToOfferTab = compose(
                        this.props.changeTab,
                        constant(TAB_MEDIA)
                    );


                    switch (this.props.currentTab) {
                        case TAB_CAMPAIGN: {
                            return Just(
                                <CreateCampaignCampaign
                                    {...section}
                                    changeNameHandler={this.props.changeCampaignName}
                                    changeDescriptionHandler={this.props.changeCampaignDescription}
                                    changeStartDateHandler={this.props.changeCampaignStartDate}
                                    changeEndDateHandler={this.props.changeCampaignEndDate}
                                    goNextTabHandler={goToSegmentTab}
                                />
                            );
                        }

                        case TAB_SEGMENT: {
                            return Just(
                                <CreateCampaignSegment
                                    {...section}
                                    addLocation={this.props.selectLocation}
                                    removeLocation={this.props.deleteLocation}
                                    showAllLocationsHandler={this.props.showAllLocations}
                                    setActiveLocation={this.props.setActiveLocation}
                                    changeZoomHandler={this.props.setZoom}
                                    changeMapCenterHandler={this.props.setMapCenter}
                                    receivePlacesHandler={this.props.receivePlacesList}
                                    goNextTabHandler={goToOfferTab}
                                />
                            );
                        }

                        case TAB_MEDIA: {
                            return Just(
                                <CreateCampaignContent
                                    {...section}
                                    selectContentHandler={this.props.selectOffer}
                                    receiveMediaPageHandler={this.props.receiveMediaPage}
                                    goNextTabHandler={compose(this.props.changeTab, constant(TAB_PUSH))}
                                    onOpenCreationModal={() => {
                                        this.props.openModal(Nothing());
                                        this.props.receiveChannels();
                                    }}
                                    onOpenUpdatingModal={offer => {
                                        this.props.openModal(Just(offer));
                                        this.props.receiveChannels();
                                    }}
                                    modalHandlers={{
                                        onClose: this.props.closeModal,
                                        onChangeTitle: this.props.changeModalTitle,
                                        onChangeDescription: this.props.changeModalDescription,
                                        onUploadSmallImage: file =>
                                            this.props.uploadModalImage(IMAGE_SIZE_SMALL, file),
                                        onUploadMediumImage: file =>
                                            this.props.uploadModalImage(IMAGE_SIZE_MEDIUM, file),
                                        onUploadLargeHalfImage: file =>
                                            this.props.uploadModalImage(IMAGE_SIZE_LARGE_HALF, file),
                                        onUploadLargeImage: file =>
                                            this.props.uploadModalImage(IMAGE_SIZE_LARGE, file),
                                        onRemoveSmallImage: compose(
                                            this.props.removeModalImage,
                                            constant(IMAGE_SIZE_SMALL)
                                        ),
                                        onRemoveMediumImage: compose(
                                            this.props.removeModalImage,
                                            constant(IMAGE_SIZE_MEDIUM)
                                        ),
                                        onRemoveLargeHalfImage: compose(
                                            this.props.removeModalImage,
                                            constant(IMAGE_SIZE_LARGE_HALF)
                                        ),
                                        onRemoveLargeImage: compose(
                                            this.props.removeModalImage,
                                            constant(IMAGE_SIZE_LARGE)
                                        ),
                                        onModalPreviewSmallImageAdd: f =>
                                            this.props.modalPreviewImageAdd(IMAGE_SIZE_SMALL, f),
                                        onModalPreviewMediumImageAdd: f =>
                                            this.props.modalPreviewImageAdd(IMAGE_SIZE_MEDIUM, f),
                                        onModalPreviewLargeHalfImageAdd: f =>
                                            this.props.modalPreviewImageAdd(IMAGE_SIZE_LARGE_HALF, f),
                                        onModalPreviewLargeImageAdd: f =>
                                            this.props.modalPreviewImageAdd(IMAGE_SIZE_LARGE, f),
                                        onModalPreviewSmallImage: f =>
                                            this.props.modalPreviewImage(IMAGE_SIZE_SMALL, f),
                                        onModalPreviewMediumImage: f =>
                                            this.props.modalPreviewImage(IMAGE_SIZE_MEDIUM, f),
                                        onModalPreviewLargeHalfImage: f =>
                                            this.props.modalPreviewImage(IMAGE_SIZE_LARGE_HALF, f),
                                        onModalPreviewLargeImage: f =>
                                            this.props.modalPreviewImage(IMAGE_SIZE_LARGE, f),
                                        onChangeSubtitle: this.props.changeModalSubtitle,
                                        onChangeTermsAndConditions: this.props.changeModalTermsAndConditions,
                                        onChangeValidDate: this.props.changeModalValidDate,
                                        onChangeSharable: this.props.changeModalSharable,
                                        onChanteButtonText: this.props.chanteModalButtonText,
                                        onChangeRedeemTitle: this.props.changeModalRedeemTitle,
                                        onChangeRedeemCode: this.props.changeModalRedeemCode,
                                        onSelectRedeemCode: compose(
                                            this.props.choiseModalRedeemType,
                                            constant(MODAL_REDEEM_CODE)
                                        ),
                                        onChangeRedeemUrl: this.props.changeModalRedeemUrl,
                                        onSelectRedeemUrl: compose(
                                            this.props.choiseModalRedeemType,
                                            constant(MODAL_REDEEM_URL)
                                        ),
                                        onChangeWebsiteTitle: this.props.changeModalWebsiteTitle,
                                        onChangeWebsiteUrl: this.props.changeModalWebsiteUrl,
                                        onChangeChannel: this.props.changeModalChannel,
                                        onReceiveChannels: this.props.receiveChannels,
                                        onSave: this.props.createOrUpdateOffer
                                    }}
                                />
                            );
                        }

                        case TAB_PUSH: {
                            return Just(
                                <CreateCampaignPush
                                    {...section}
                                    enablePushHandler={this.props.enablePush}
                                    changePreviewTypeHandler={this.props.changePreviewType}
                                    changeTitleHandler={this.props.changeTitle}
                                    changeMessageHandler={this.props.changeMessage}
                                    selectOnStartHandler={this.props.selectOnStart}
                                    selectOnFutureHandler={this.props.selectOnFuture}
                                    changeSendAtDateHandler={this.props.changeSendAtDate}
                                    changeSendAtTimeHandler={this.props.changeSendAtTime}
                                    goNextTabHandler={compose(
                                        this.props.changeTab,
                                        constant(TAB_SUMMARY)
                                    )}
                                />
                            );
                        }

                        case TAB_SUMMARY: {
                            return Just(
                                <CreateCampaignSummary
                                    {...section}
                                    goCampaignTabHandler={compose(
                                        this.props.changeTab,
                                        constant(TAB_CAMPAIGN)
                                    )}
                                    goSegmentTabHandler={goToSegmentTab}
                                    goOfferTabHandler={goToOfferTab}
                                    launchCampaignHandler={this.props.launchCampaign}
                                    agreeWithLaunchHandler={this.agreeWithLaunch.bind(this)}
                                />
                            );
                        }

                        default: {
                            return Nothing();
                        }
                    }
                }).getOrElse(null)}
                {this.renderModal()}
            </CreateCampaign>
        );
    }

    renderModal() {
        return (
            <Modal show={this.props.modalShow} onHide={() => this.onCloseModal()}>
                <Modal.Header>
                    <Modal.Title>
                        Campaign saved
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Your campaign is saved as draft. You can continue configuring it later from campaigns list.
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={() => this.onCloseModal()}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


function selectTabs(tabs, offerInfo) {
    const [ campaign, segment, media, , summary ] = tabs;

    return [
        {
            type: TAB_CAMPAIGN,
            title: 'Campaign',
            busy: campaign.busy,
            errors: campaign.errors
                .orElse(
                    constant(offerInfo.errors.chain(pCampaign))
                )
        },
        {
            type: TAB_SEGMENT,
            title: 'Audience',
            busy: false,
            errors: segment.errors
                .orElse(
                    constant(offerInfo.errors.chain(pSegment))
                )
        },
        {
            type: TAB_MEDIA,
            title: 'Media',
            busy: false,
            errors: media.errors
                .orElse(
                    constant(offerInfo.errors.chain(pOffer))
                )
        },
        {
            type: TAB_PUSH,
            title: 'Push',
            busy: false,
            errors: offerInfo.errors.chain(
                errors => errors.common
                    .orElse(constant(errors.push.title))
                    .orElse(constant(errors.push.message))
                    .orElse(constant(errors.push.sendAt))
            )
        },
        {
            type: TAB_SUMMARY,
            title: 'Summary',
            busy: summary.busy,
            errors: summary.errors
        }
    ];
}

function selectSection(current, tabs, offerInfo, data) {
    const [ campaign, segment, media, push, summary ] = tabs;

    switch (current) {
        case TAB_CAMPAIGN: {
            return Just(campaign);
        }

        case TAB_SEGMENT: {

            const selectedLocations = filterMap(
                location => denormalize(Nothing(), data, location.place).map(
                    place => ({ ...location, place })
                ),
                segment.selectedLocations
            );

            return Just({
                selectedLocations,
                total: segment.usersCount,
                countBusy: segment.countBusy,
                queryBusy: segment.queryBusy,
                places: segment.results.map(
                    compose(
                        filter(el => !includes(
                            getBunchID(el.bunch),
                            map(el_ => getBunchID(el_.place.bunch), selectedLocations)
                        )),
                        denormalize(Nothing(), data)
                    )
                ),
                errors: segment.errors,
                activeLocation: segment.activeLocation.chain(
                    location => denormalize(Nothing(), data, location.place).map(place => ({ ...location, place }))
                ),
                bounds: segment.bounds,
                zoom: segment.zoom,
                mapCenter: segment.mapCenter
            });
        }

        case TAB_MEDIA: {
            return Just({
                modal: media.modal.map(modal => ({
                    ...modal,
                    fields: {
                        ...modal.fields,
                        images: {
                            small: get(IMAGE_SIZE_SMALL, modal.fields.images),
                            medium: get(IMAGE_SIZE_MEDIUM, modal.fields.images),
                            largeHalf: get(IMAGE_SIZE_LARGE_HALF, modal.fields.images),
                            large: get(IMAGE_SIZE_LARGE, modal.fields.images)
                        }
                    },
                    modals: modal.modals.map(fields => ({
                        ...fields,
                        images: {
                            small: get(IMAGE_SIZE_SMALL, fields.images),
                            medium: get(IMAGE_SIZE_MEDIUM, fields.images),
                            largeHalf: get(IMAGE_SIZE_LARGE_HALF, fields.images),
                            large: get(IMAGE_SIZE_LARGE, fields.images)
                        }
                    })),
                    channels: {
                        ...modal.channels,
                        results: modal.channels.results.map(
                            denormalize(Nothing(), data)
                        )
                    },
                    errors: modal.errors.map(errors => ({
                        ...errors,
                        images: {
                            small: get(IMAGE_SIZE_SMALL, errors.images),
                            medium: get(IMAGE_SIZE_MEDIUM, errors.images),
                            largeHalf: get(IMAGE_SIZE_LARGE_HALF, errors.images),
                            large: get(IMAGE_SIZE_LARGE, errors.images)
                        }
                    }))
                })),
                offers: media.results
                    .map(
                        compose(
                            map(offer => ({
                                ...offer,
                                selected: media.selected.map(
                                    isEqual(offer.bunch)
                                ).getOrElse(false),
                                image: get(IMAGE_SIZE_SMALL, offer.images)
                            })),
                            denormalize(Nothing(), data)
                        )
                    ),
                pageCount: media.total.map(
                    compose(
                        ceil,
                        divide(__, appConfig.pageSize)
                    )
                ).chain(total => total < 2 ? Nothing() : Just(total)),
                current: media.current,
                busy: media.busy,
                errors: media.errors
            });
        }

        case TAB_PUSH: {
            return Just({
                ...push,
                maxTitleLength: appConfig.push.displayedTitleLength,
                maxMessageLength: appConfig.push.displayedMessageLength,
                errors: offerInfo.errors.map(errors => ({
                    ...errors.push,
                    common: errors.common
                }))
            });
        }

        case TAB_SUMMARY: {
            return Just({
                ...summary,
                campaign: campaign.bunch.chain(
                    denormalize(Just({
                        offerInfo: Just({
                            offer: Nothing(),
                            segment: Just({
                                locations: Nothing()
                            })
                        })
                    }), data)
                )
                .map(campaignEntity => ({
                    ...campaignEntity,
                    startDate: formatDate(campaignEntity.startDate),
                    endDate: campaignEntity.endDate.map(formatDate),
                    offerInfo: campaignEntity.offerInfo.map(offerInfoEntity => ({
                        ...offerInfoEntity,
                        push: push.enabled ? Just({
                            ...offerInfoEntity.push,
                            sendAt: offerInfoEntity.push.sendAt.map(formatDate)
                        }) : Nothing(),
                        offer: offerInfoEntity.offer.map(offer => ({
                            ...offer,
                            image: get(IMAGE_SIZE_SMALL, offer.images)
                        }))
                    }))
                }))
            });
        }

        default: {
            return Nothing();
        }
    }
}

function select({ ui, data }) {
    const { tabs, current, offerInfo, modalShow } = ui.createCampaign;

    return {
        modalShow,
        reqFieldsDone: !companyRequiredFields.some(fn => isEmpty(tabs[0].fields[fn])),
        currentTab: current,
        tabs: selectTabs(tabs, offerInfo),
        section: selectSection(current, tabs, offerInfo, data)
    };
}

const bindActions = {
    setModalShow,
    changeTab,

    changeCampaignName,
    changeCampaignDescription,
    changeCampaignStartDate,
    changeCampaignEndDate,
    createOrUpdateCampaign,

    selectLocation,
    deleteLocation,
    showAllLocations,
    setZoom,
    setMapCenter,
    setActiveLocation,
    receivePlacesList,

    selectOffer,
    receiveMediaPage,
    openModal,
    closeModal,
    changeModalTitle,
    changeModalDescription,
    uploadModalImage,
    removeModalImage,
    modalPreviewImage,
    modalPreviewImageAdd,
    changeModalSubtitle,
    changeModalTermsAndConditions,
    changeModalValidDate,
    changeModalSharable,
    chanteModalButtonText,
    choiseModalRedeemType,
    changeModalRedeemTitle,
    changeModalRedeemCode,
    changeModalRedeemUrl,
    changeModalWebsiteTitle,
    changeModalWebsiteUrl,
    changeModalChannel,
    receiveChannels,
    createOrUpdateOffer,

    enablePush,
    changePreviewType,
    changeTitle,
    changeMessage,
    selectOnStart,
    selectOnFuture,
    changeSendAtDate,
    changeSendAtTime,

    launchCampaign
};


export default compose(
    connect(select, bindActions),
    withRouter
)(CreateCampaignContainer);
