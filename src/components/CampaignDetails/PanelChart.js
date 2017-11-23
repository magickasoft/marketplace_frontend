import React, { PropTypes } from 'react';
import {
    Row,
    Col,
    Panel
} from 'react-bootstrap';
import Highchart from 'react-highcharts/ReactHighcharts';
import {
    constant
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import AlertErrors from 'components/AlertErrors';
import Placeholder from 'components/Placeholder';
import DiscretizationPicker from 'components/DiscretizationPicker';
import IntervalPicker from 'components/IntervalPicker';


const cDanger = constant('danger');

export default function PanelChart(props) {
    const [ mStart, mEnd ] = props.interval;

    return (
        <Panel bsStyle={props.errors.map(cDanger).getOrElse()} header={
            <h3>Trend</h3>
        }>
            <Row>
                <Col xs={12} sm={3} md={2}>
                    <IntervalPicker
                        value={mStart}
                        disabled={props.busy}
                        onChange={props.onChangeIntervalStart}
                    >
                        From
                    </IntervalPicker>
                </Col>

                <Col xs={12} sm={3} md={2}>
                    <IntervalPicker
                        value={mEnd}
                        disabled={props.busy}
                        onChange={props.onChangeIntervalEnd}
                    >
                        To
                    </IntervalPicker>
                </Col>

                <Col xs={12} sm={6} mdOffset={4} md={4}>
                    <DiscretizationPicker
                        disabled={props.busy}
                        options={props.discretizations}
                        onChange={props.onChangeDiscretization}
                    >
                        &nbsp;
                    </DiscretizationPicker>
                </Col>
            </Row>

            <Placeholder size={[ '100%', '400px' ]} busy={props.busy}>
                {props.results.map(config => (
                    <Highchart config ={config} />
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

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

PanelChart.propTypes = {
    interval: PropTypes_.Tuple([
        mString.isRequired,
        mString.isRequired
    ]).isRequired,
    discretizations: PropTypes.array.isRequired,
    results: PropTypes_.Maybe(
        PropTypes.object.isRequired
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
    ).isRequired,
    onChangeDiscretization: PropTypes.func.isRequired,
    onChangeIntervalStart: PropTypes.func.isRequired,
    onChangeIntervalEnd: PropTypes.func.isRequired
};
