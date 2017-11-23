import React from 'react';
import {
    Grid
} from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

import PanelChart from './PanelChart';

function Reports(props) {
    return (
        <Grid fluid>
            <PanelChart {...props} />
        </Grid>
    );
}
export default CSSModules(Reports, styles);
