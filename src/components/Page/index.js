import React, { PropTypes } from 'react';
import {
    LinkContainer
} from 'react-router-bootstrap';
import {
    Navbar,
    Nav,
    NavItem,
    NavDropdown,
    MenuItem
} from 'react-bootstrap';
import CSSModules from 'react-css-modules';

import styles from './styles.css';


const textStyle = {
    color: '#fff'
};

function Page(props) {
    return (
        <div>
            <Navbar fluid styleName="header">
                <Navbar.Header>
                    <Navbar.Brand style={textStyle}>
                        My Marketplace
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav styleName="nav">
                    <LinkContainer to="/reports">
                        <NavItem>
                            Analitics
                        </NavItem>
                    </LinkContainer>

                    <LinkContainer to="/channels">
                        <NavItem>
                            Channels
                        </NavItem>
                    </LinkContainer>

                    {props.nav_menu.visibility.campaignsTab && (
                        <LinkContainer to="/campaigns-list">
                            <NavItem>
                                Campaigns
                            </NavItem>
                        </LinkContainer>
                    )}

                    {props.nav_menu.visibility.contentTab && (
                        <NavDropdown title="Content" id="content-dropdown">
                            <LinkContainer to="/content/stories/queue">
                                <MenuItem>
                                    Stories
                                </MenuItem>
                            </LinkContainer>

                            <LinkContainer to="/content/editor-picks">
                                <MenuItem>
                                    Editor Picks
                                </MenuItem>
                            </LinkContainer>
                        </NavDropdown>
                    )}

                    <LinkContainer to="/settings">
                        <NavItem>
                            Settings
                        </NavItem>
                    </LinkContainer>
                </Nav>
                <Nav pullRight>
                    <LinkContainer to="/logout">
                        <NavItem>
                            <span style={textStyle}>
                                Logout
                            </span>
                        </NavItem>
                    </LinkContainer>
                </Nav>
            </Navbar>

            <div styleName="container">
                <div styleName="children">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

Page.propTypes = {
    children: PropTypes.element,
    nav_menu: PropTypes.shape({
        visibility: PropTypes.shape({
            contentTab: PropTypes.bool.isRequired,
            campaignsTab: PropTypes.bool.isRequired
        })
    })
};

export default CSSModules(Page, styles);
