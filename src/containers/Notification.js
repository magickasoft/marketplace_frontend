import React, { Component, PropTypes } from 'react';
import {
    connect
} from 'react-redux';
import {
    map
} from 'lodash/fp';
import {
    showNotification,
    hideNotification
} from 'actions/ui/notification';
import NotificationSystem from 'react-notification-system';

class NotificationContainer extends Component {

    componentWillReceiveProps(nextProps) {
        const { notifications } = nextProps;
        const notificationIds = map(notification => notification.uid, notifications);

        (this.notificationSystem.state.notifications || []).map(notification => {
            if (notificationIds.indexOf(notification.uid) < 0) {
                this.notificationSystem.removeNotification(notification.uid);
            }
        });

        (notifications).map(notification => {
            this.notificationSystem.addNotification({
                ...notification,
                uid: notification.uid || Date.now(),
                onRemove: () => {
                    this.props.hideNotification(notification.uid);
                    if (notification.onRemove) {
                        notification.onRemove();
                    }
                }
            });
        });
    }

    render() {
        return (
            <NotificationSystem ref={notif => {
                this.notificationSystem = notif;
            }}
            />
        );
    }
}

NotificationContainer.propTypes = {

    notifications: PropTypes.array.isRequired,
    showNotification: PropTypes.func.isRequired,
    hideNotification: PropTypes.func.isRequired

};

function select({ ui }) {
    return {
        notifications: ui.notifications
    };
}

const bindActions = {
    showNotification,
    hideNotification
};

export default connect(select, bindActions)(NotificationContainer);
