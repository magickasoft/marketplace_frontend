import React, { PropTypes } from 'react';
import {
    Row,
    Col,
    Panel
} from 'react-bootstrap';
import {
    min
} from 'lodash/fp';
import Highchart from 'react-highcharts/ReactHighcharts';

import PropTypes_ from 'utils/prop-types';
import Placeholder from 'components/Placeholder';
import DiscretizationPicker from 'components/DiscretizationPicker';
import IntervalPicker from 'components/IntervalPicker';
import AlertErrors from 'components/AlertErrors';
import PanelTable from './PanelTable';

function getMinDate(d) {
    return min([d, (new Date()).toISOString()]);
}

export default function PanelChart(props) {
    const [ mStart, mEnd ] = props.interval;
    const intervalPickerDisabled = props.chart.busy || props.table.busy;

    return (
        <Panel header='Analitics'>
            <Row>
                <Col xs={12} sm={3}>
                    <IntervalPicker
                        value={mStart}
                        maxDate={mEnd.map(getMinDate)}
                        disabled={intervalPickerDisabled}
                        onChange={props.changeIntervalStartHandler}
                    >
                        From
                    </IntervalPicker>
                </Col>

                <Col xs={12} sm={3}>
                    <IntervalPicker
                        value={mEnd}
                        disabled={intervalPickerDisabled}
                        onChange={props.changeIntervalEndHandler}
                    >
                        To
                    </IntervalPicker>
                </Col>

                <Col xs={12} sm={6}>
                    <DiscretizationPicker
                        disabled={props.chart.busy}
                        options={props.discretizations}
                        onChange={props.changeDiscretizationHandler}
                    >
                        &nbsp;
                    </DiscretizationPicker>
                </Col>
            </Row>
            <Panel>
                <Placeholder busy={props.chart.busy} size={[ '100%', '400px' ]}>
                    {props.chart.results.map(config => (
                        <Highchart config={config} />
                    )).getOrElse(null)}
                </Placeholder>
                {props.chart.errors.map(errors => (
                    <AlertErrors
                        title="Something went wrong:"
                        errors={errors.common}
                        tryAgain={props.receiveChartAgainHandler.map(handler => ({
                            busy: props.chart.busy,
                            handler
                        }))}
                    />
                )).getOrElse(null)}
            </Panel>
            <PanelTable {...props} />
        </Panel>
    );
}

const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

const mFunc = PropTypes_.Maybe(
    PropTypes.func.isRequired
);

const mArray = PropTypes_.Maybe(
    PropTypes.array.isRequired
);

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

PanelChart.propTypes = {
    interval: PropTypes_.Tuple([
        mString.isRequired,
        mString.isRequired
    ]).isRequired,
    discretizations: PropTypes.array.isRequired,
    chart: PropTypes.shape({
        results: PropTypes_.Maybe(
            PropTypes.object.isRequired
        ).isRequired,
        busy: PropTypes.bool.isRequired,
        errors: mShape({
            common: mArray.isRequired
        }).isRequired
    }).isRequired,
    table: PropTypes.shape({
        busy: PropTypes.bool.isRequired
    }).isRequired,

    changeIntervalStartHandler: PropTypes.func.isRequired,
    changeIntervalEndHandler: PropTypes.func.isRequired,
    changeDiscretizationHandler: PropTypes.func.isRequired,
    receiveChartAgainHandler: mFunc.isRequired
};
