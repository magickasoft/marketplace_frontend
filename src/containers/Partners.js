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
    Nothing,
    Just
} from 'data.maybe';
import {
    ceil,
    divide,
    compose,
    __
} from 'lodash/fp';

import appConfig from 'config/app';
import {
    denormalize,
    filterMap
} from 'utils';
import {
    getBunchID
} from 'utils/bunch';
import {
    receiveCountries
} from 'actions/session';
import {
    receiveChannelsPage,
    enableDeleting,
    disableDeleting,
    deleteChannel
} from 'actions/ui/partners';
import {
    SUPER_EDITOR,
    COUNTRY_EDITOR,
    ADMIN,
    somePermission
} from 'models/user';
import Partners from 'components/Partners';


class PartnersContainer extends Component {
    changePageHandler(page) {
        const baseUrl = '/channels';
        const url = page > 1 ? `${baseUrl}/${page}` : baseUrl;

        this.props.router.push(url);
    }

    goToCreateChannel() {
        this.props.router.push('/channel');
    }

    goToUpdateChannel(bunch) {
        this.props.router.push(`/channel/${getBunchID(bunch)}`);
    }

    render() {
        return (
            <div>
                <Partners
                    {...this.props.partners}
                    changePageHandler={this.changePageHandler.bind(this)}
                    tryReceivePageAgainHandler={() => this.props.receiveChannelsPage(this.props.partners.current)}
                    openCreateHandler={this.goToCreateChannel.bind(this)}
                    openUpdateHandler={this.goToUpdateChannel.bind(this)}
                    openDeleteHandler={this.props.enableDeleting}
                    confirmDeleteHandler={this.props.deleteChannel}
                    abordDeleteHandler={this.props.disableDeleting}
                />
            </div>
        );
    }
}

PartnersContainer.propTypes = {
    partners: PropTypes.object.isRequired,
    router: routerShape.isRequired,

    enableDeleting: PropTypes.func.isRequired,
    disableDeleting: PropTypes.func.isRequired,
    receiveChannelsPage: PropTypes.func.isRequired,
    receiveCountries: PropTypes.func.isRequired,
    deleteChannel: PropTypes.func.isRequired
};

const isAdminOrEditor = somePermission([
    SUPER_EDITOR,
    COUNTRY_EDITOR,
    ADMIN
]);

function select({ ui, session, data }) {
    const adminOrEditorRole = isAdminOrEditor(session.role);

    return {
        partners: {
            ...ui.partners,
            channels: ui.partners.results.map(
                filterMap(
                    bunch => denormalize(Nothing(), data, bunch)
                        .map(channel => ({
                            ...channel,
                            visibility: {
                                editButton: adminOrEditorRole,
                                deleteButton: adminOrEditorRole
                            }
                        }))
                )
            ),
            pageCount: ui.partners.total.map(
                compose(
                    ceil,
                    divide(__, appConfig.pageSize)
                )
            ).chain(total => total < 2 ? Nothing() : Just(total)),
            visibility: {
                createButton: adminOrEditorRole
            }
        }
    };
}

const bindActions = {
    enableDeleting,
    disableDeleting,
    receiveChannelsPage,
    receiveCountries,
    deleteChannel
};


export default compose(
    connect(select, bindActions),
    withRouter
)(PartnersContainer);
