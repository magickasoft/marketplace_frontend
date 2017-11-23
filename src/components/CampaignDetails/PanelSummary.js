import React, { PropTypes } from 'react';
import {
    Row,
    Col,
    Panel
} from 'react-bootstrap';
import {
    constant,
    map
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import Placeholder from 'components/Placeholder';
import AlertErrors from 'components/AlertErrors';

const cDanger = constant('danger');

const createStatPanel = ([ type, { title, value }]) => (
    <Col xs={12} sm={6} md={4} key={type}>
        <Panel>
            <h4>{title}: <big>{value}</big></h4>
        </Panel>
    </Col>
);

const DelimeterColumn = () => (
    <Col style={{ height: '30px' }} xs={12} />
);

export default function PanelSummary(props) {
    return (
        <Panel bsStyle={props.errors.map(cDanger).getOrElse()} header={
            <h3>Total</h3>
        }>
            <Placeholder size={[ '100%', '190px' ]} busy={props.busy}>
                {props.results.map(results => (
                    <Row>
                        {map(createStatPanel, results.totals)}
                        <DelimeterColumn />
                        {map(createStatPanel, results.rates)}
                    </Row>
                )).getOrElse(null)}
            </Placeholder>

            {props.errors.map(errors => (
                <AlertErrors
                    title="Something went wrong:"
                    errors={errors.common}
                    tryAgain={props.tryAgainReceiveHandler.map(handler => ({
                        busy: props.busy,
                        handler
                    }))}
                />
            )).getOrElse(null)}
        </Panel>
    );
}

PanelSummary.propTypes = {
    results: PropTypes_.Maybe(
        PropTypes.shape({
            totals: PropTypes.arrayOf(
                PropTypes_.Tuple([
                    PropTypes.string.isRequired,
                    PropTypes.shape({
                        title: PropTypes.string.isRequired,
                        value: PropTypes.number.isRequired
                    }).isRequired
                ]).isRequired
            ).isRequired,
            rates: PropTypes.arrayOf(
                PropTypes_.Tuple([
                    PropTypes.string.isRequired,
                    PropTypes.shape({
                        title: PropTypes.string.isRequired,
                        value: PropTypes.string.isRequired
                    }).isRequired
                ]).isRequired
            ).isRequired
        }).isRequired,
    ).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.shape({
            common: PropTypes_.Maybe(
                PropTypes.array.isRequired
            ).isRequired
        }).isRequired
    ).isRequired,

    tryAgainReceiveHandler: PropTypes_.Maybe(
        PropTypes.func.isRequired
    ).isRequired
};
