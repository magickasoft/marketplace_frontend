import React, { PropTypes } from 'react';
import {
    map
} from 'lodash/fp';
import CSSModules from 'react-css-modules';

import styles from './styles.css';
import PropTypes_ from 'utils/prop-types';
import {
    Sorter
} from 'components/Sorter';


const mFunc = PropTypes_.Maybe(
    PropTypes.func.isRequired
);

export const TableHeader = CSSModules(
    props => (
        <thead>
            <tr>
                {map(cell => (
                    <th key={cell.label}>
                        <div styleName="cell">
                            <div styleName="label">
                                {cell.label}
                            </div>

                            <div styleName="sorter">
                                <Sorter
                                    disabled={props.busy}
                                    onDescClick={cell.sortDescHandler}
                                    onAscClick={cell.sortAscHandler}
                                />
                            </div>
                        </div>
                    </th>
                ), props.children)}

                <th key="empty"></th>
            </tr>
        </thead>
    ),
    styles
);

TableHeader.propTypes = {
    children: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            sortDescHandler: mFunc.isRequired,
            sortAscHandler: mFunc.isRequired
        }).isRequired
    ).isRequired,
    busy: PropTypes.bool.isRequired
};
