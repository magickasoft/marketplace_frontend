import React, { PropTypes } from 'react';
import {
    Grid,
    Breadcrumb,
    Button,
    Badge,
    Panel
} from 'react-bootstrap';
import {
    LinkContainer
} from 'react-router-bootstrap';
import CSSModules from 'react-css-modules';

import styles from './styles.css';


function Stories(props) {
    return (
        <Grid fluid>
            <Breadcrumb>
                <LinkContainer to="/content/stories/queue">
                    <Breadcrumb.Item>Queue</Breadcrumb.Item>
                </LinkContainer>

                {props.visibility.reviewTab && (
                    <LinkContainer to="/content/stories/review">
                        <Breadcrumb.Item>
                            For review
                            {
                                props.additionalField.countForReview.cata({
                                    Nothing: () => (null),
                                    Just: value => value === 0 ? null : (<span>&nbsp;<Badge>{value}</Badge></span>)
                                })
                            }
                        </Breadcrumb.Item>
                    </LinkContainer>
                )}

                <LinkContainer to="/content/stories/all">
                    <Breadcrumb.Item>All</Breadcrumb.Item>
                </LinkContainer>
            </Breadcrumb>
            <Panel header='Stories'>
                <div styleName="header">
                    <LinkContainer to="/story">
                        <Button>Create New</Button>
                    </LinkContainer>
                </div>
                {props.children}
            </Panel>

        </Grid>
    );
}

Stories.propTypes = {
    visibility: PropTypes.shape({
        reviewTab: PropTypes.bool.isRequired
    }),
    additionalField: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
};

export default CSSModules(Stories, styles);
