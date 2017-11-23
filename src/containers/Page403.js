import React, { Component, PropTypes } from 'react';
import {
    connect
} from 'react-redux';

import {
    somePermission
} from 'models/user';
import Page403 from 'components/Page403';


class Page403Container extends Component {
    render() {
        return somePermission(this.props.permissions, this.props.role) ?
        this.props.children : (
            <Page403 />
        );
    }
}

Page403Container.propTypes = {
    permissions: PropTypes.arrayOf(
        PropTypes.number.isRequired
    ).isRequired,
    role: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired
};

const select = ({ session }) => ({ role: session.role });

export default connect(select)(Page403Container);
