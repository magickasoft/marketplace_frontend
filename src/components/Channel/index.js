import React, { PropTypes } from 'react';
import {
    Grid,
    Row,
    Col,
    Tabs,
    Tab,
    ProgressBar,
    Modal,
    FormGroup,
    HelpBlock,
    Button
} from 'react-bootstrap';
import {
    map,
    property
} from 'lodash/fp';
import CSSModules from 'react-css-modules';

import styles from './styles.css';
import {
    EDIT as TAB_EDIT,
    PREVIEW as TAB_PREVIEW
} from 'actions/ui/channel';
import PropTypes_ from 'utils/prop-types';
import EditTab from './Edit';
import PreviewTab from './Preview';


const mapErrors = map(error => (
    <HelpBlock key={error}>{error}</HelpBlock>
));

const pCommon = property('common');

function Channel(props) {
    return (
        <Grid fluid>
            <Modal show={props.done} onHide={props.agreeWithCreationHandler}>
                <Modal.Header>
                    <Modal.Title>
                        Congratulations!
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Your Channel was successfully created.
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={props.agreeWithCreationHandler}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>

            <Row>
                <Col xs={12} sm={10} componentClass="h1">
                    Channel&nbsp;
                    {props.result.map(result => (
                        <small>{result.title}</small>
                    )).getOrElse(null)}
                </Col>
                <Col xs={12} sm={2} style={{ marginTop: 25 }}>
                    <Button
                        onClick={props.submitHandler}
                        disabled={props.busy}
                        block
                        >
                            Save
                        </Button>
                </Col>
            </Row>

            {props.fields.cata({
                Nothing: () => props.busy ? (
                    <ProgressBar active now={100}/>
                ) : (
                    <div>Try again</div>
                ),

                Just: fields => (
                    <Tabs
                        animation={false}
                        activeKey={props.tab}
                        onSelect={props.switchTabHandler}
                        id="edit-tabs"
                    >
                        <Tab styleName="pane" eventKey={TAB_EDIT} title="Edit">
                            <EditTab
                                {...props}
                                fields={fields}
                                modals={props.modals.getOrElse({})}
                            />
                        </Tab>

                        <Tab styleName="pane" eventKey={TAB_PREVIEW} title="Preview">
                            <PreviewTab
                                {...props}
                                fields={fields}
                                modals={props.modals.getOrElse({})}
                            />
                        </Tab>
                    </Tabs>
                )
            })}

            {props.errors.chain(pCommon).map(errors => (
                <FormGroup validationState="error">
                    {mapErrors(errors)}
                </FormGroup>
            )).getOrElse(null)}
        </Grid>
    );
}

const mErrorsList = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

const channelShape = PropTypes.shape({
    title: PropTypes.string.isRequired
});

Channel.propTypes = {
    tab: PropTypes.string.isRequired,
    result: PropTypes_.Maybe(
        channelShape
    ),
    fields: PropTypes_.Maybe(
        PropTypes.object.isRequired
    ).isRequired,
    modals: PropTypes_.Maybe(
        PropTypes.object.isRequired
    ).isRequired,
    busy: PropTypes.bool.isRequired,
    done: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            common: mErrorsList
        })
    ).isRequired,

    switchTabHandler: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
    agreeWithCreationHandler: PropTypes.func.isRequired
};

export default CSSModules(Channel, styles);
