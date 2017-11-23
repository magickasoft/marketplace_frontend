import React, { Component, PropTypes } from 'react';
import {
    withRouter
} from 'react-router';
import {
    routerShape
} from 'react-router/lib/PropTypes';
import {
    connect
} from 'react-redux';
import {
    compose
} from 'lodash/fp';
import {
    Nothing
} from 'data.maybe';

import PropTypes_ from 'utils/prop-types';
import {
    get,
    denormalize
} from 'utils';
import {
    receiveCountries
} from 'actions/session';
import {
    CHANNEL_ICON as IMAGE_CHANNEL_ICON,
    CHANNEL_HEADER_BACKGROUND as IMAGE_CHANNEL_HEADER_BACKGROUND
} from 'models/images';
import {
    switchTab,
    changeTitle,
    changeDescription,
    changeCountry,
    uploadHeaderIcon,
    removeHeaderIcon,
    uploadHeaderLogo,
    removeHeaderLogo,
    changeHeaderColor,
    changeHeaderColorSpecial,
    changeHeaderBackground,
    changeHeaderBackgroundExtra,
    changePageBackground,
    uploadPageWallpaper,
    removePageWallpaper,
    createOrUpdateChannel,
    modalPreviewImage,
    modalPreviewImageAdd
} from 'actions/ui/channel';
import {
    SUPER_EDITOR,
    ADMIN,
    somePermission
} from 'models/user';
import Channel from 'components/Channel';


class ChannelContainer extends Component {
    agreeWithCreation() {
        this.props.router.push('/channels');
    }

    render() {
        return (
            <Channel
                {...this.props.channel}
                switchTabHandler={this.props.switchTab}
                changeTitleHandler={this.props.changeTitle}
                changeDescriptionHandler={this.props.changeDescription}
                changeCountryHandler={this.props.changeCountry}
                receiveCountryAgainHandler={this.props.receiveCountries}
                uploadHeaderIconHandler={this.props.uploadHeaderIcon}
                removeHeaderIconHandler={this.props.removeHeaderIcon}
                modalPreviewHeaderIconHandler={f => this.props.modalPreviewImage(IMAGE_CHANNEL_ICON, f)}
                modalPreviewHeaderIconAddHandler={f => this.props.modalPreviewImageAdd(IMAGE_CHANNEL_ICON, f)}
                changeHeaderColorHandler={this.props.changeHeaderColor}
                changeHeaderColorSpecialHandler={this.props.changeHeaderColorSpecial}
                changeHeaderBackgroundHandler={this.props.changeHeaderBackground}
                changeHeaderBackgroundExtraHandler={this.props.changeHeaderBackgroundExtra}
                changePageBackgroundHandler={this.props.changePageBackground}
                uploadPageWallpaperHandler={this.props.uploadPageWallpaper}
                removePageWallpaperHandler={this.props.removePageWallpaper}
                modalPreviewPageWallpaperHandler={f => this.props.modalPreviewImage(IMAGE_CHANNEL_HEADER_BACKGROUND, f)}
                modalPreviewPageWallpaperAddHandler={
                    f => this.props.modalPreviewImageAdd(IMAGE_CHANNEL_HEADER_BACKGROUND, f)
                }
                submitHandler={this.props.createOrUpdateChannel}
                agreeWithCreationHandler={this.agreeWithCreation.bind(this)}
            />
        );
    }
}

ChannelContainer.propTypes = {
    router: routerShape.isRequired,

    channel: PropTypes.shape({
        errors: PropTypes_.Maybe(
            PropTypes.object.isRequired
        ).isRequired
    }).isRequired,

    switchTab: PropTypes.func.isRequired,
    changeTitle: PropTypes.func.isRequired,
    changeDescription: PropTypes.func.isRequired,
    changeCountry: PropTypes.func.isRequired,
    receiveCountries: PropTypes.func.isRequired,
    uploadHeaderIcon: PropTypes.func.isRequired,
    removeHeaderIcon: PropTypes.func.isRequired,
    modalPreviewImage: PropTypes.func.isRequired,
    modalPreviewImageAdd: PropTypes.func.isRequired,
    uploadHeaderLogo: PropTypes.func.isRequired,
    removeHeaderLogo: PropTypes.func.isRequired,
    changeHeaderColor: PropTypes.func.isRequired,
    changeHeaderColorSpecial: PropTypes.func.isRequired,
    changeHeaderBackground: PropTypes.func.isRequired,
    changeHeaderBackgroundExtra: PropTypes.func.isRequired,
    changePageBackground: PropTypes.func.isRequired,
    uploadPageWallpaper: PropTypes.func.isRequired,
    removePageWallpaper: PropTypes.func.isRequired,
    createOrUpdateChannel: PropTypes.func.isRequired
};

const isAdminOrSuperEditor = somePermission([ ADMIN, SUPER_EDITOR ]);

function select({ ui, data, session }) {
    const denormalizeFromData = denormalize(Nothing(), data);

    return {
        channel: {
            ...ui.channel,
            result: ui.channel.bunch.chain(denormalizeFromData),
            fields: ui.channel.fields.map(fields => ({
                ...fields,
                country: fields.country.chain(denormalizeFromData)
            })),

            modals: ui.channel.modals.map(fields => ({
                ...fields,
                images: {
                    icon: get(IMAGE_CHANNEL_ICON, fields.images),
                    wallpaper: get(IMAGE_CHANNEL_HEADER_BACKGROUND, fields.images)
                }
            })),
            countries: {
                ...session.countries,
                results: session.countries.results.map(denormalizeFromData)
            },
            visibility: {
                countryPicker: isAdminOrSuperEditor(session.role)
            }
        }
    };
}

const bindActions = {
    receiveCountries,

    switchTab,
    changeTitle,
    changeDescription,
    changeCountry,
    uploadHeaderIcon,
    removeHeaderIcon,
    uploadHeaderLogo,
    removeHeaderLogo,
    changeHeaderColor,
    changeHeaderColorSpecial,
    changeHeaderBackground,
    changeHeaderBackgroundExtra,
    changePageBackground,
    uploadPageWallpaper,
    removePageWallpaper,
    createOrUpdateChannel,
    modalPreviewImage,
    modalPreviewImageAdd
};


export default compose(
    connect(select, bindActions),
    withRouter
)(ChannelContainer);
