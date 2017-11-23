import React, { PropTypes } from 'react';
import {
    Panel
} from 'react-bootstrap';
import CSSModules from 'react-css-modules';
import {
    property
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';
import styles from './styles.css';


const pUrl = property('url');

function Result(props) {
    const headerIconUrl = props.header.icon.chain(pUrl).getOrElse('http://placehold.it/64x64/eee');
    const headerLogoUrl = props.header.logo.chain(pUrl).getOrElse('http://placehold.it/128x64/eee');
    const pageWallpaperUrl = props.page.wallpaper.chain(pUrl).getOrElse('http://placehold.it/24x24/eee');
    const [ mHeaderBackgroundColor, mHeaderBackgroundOpacity ] = props.header.background;

    return (
        <div>
            <h3>Preview</h3>

            <Panel>
                <div styleName="index">
                    <div
                        styleName="icon"
                        style={{
                            backgroundImage: `url("${headerIconUrl}")`
                        }}
                    />
                    <div styleName="title">{props.title}</div>
                </div>
            </Panel>

            <Panel>
                <div
                    styleName="header"
                >
                    <div
                        styleName="background"
                        style={{
                            background: mHeaderBackgroundColor.getOrElse('#fff'),
                            opacity: mHeaderBackgroundOpacity.map(opacity => opacity / 100).getOrElse(1)
                        }}
                    />
                    <span
                        styleName="logo"
                        style={{
                            backgroundImage: `url("${headerLogoUrl}")`
                        }}
                    />
                    <span
                        styleName="manage"
                        style={props.header.colorSpecial.map(colorSpecial => ({
                            color: colorSpecial
                        })).getOrElse(null)}
                    >Manage</span>
                    {props.description.map(description => (
                        <p
                            styleName="description"
                            style={props.header.color.map(color => ({
                                color
                            })).getOrElse(null)}
                        >
                            {description}
                        </p>
                    )).getOrElse(null)}
                </div>

                <div
                    styleName="page"
                    style={{
                        backgroundImage: `url("${pageWallpaperUrl}")`,
                        backgroundColor: props.page.background.getOrElse('#fff')
                    }}
                />
            </Panel>
        </div>
    );
}


const mString = PropTypes_.Maybe(
    PropTypes.string.isRequired
);

const mShape = shape => PropTypes_.Maybe(
    PropTypes.shape(shape).isRequired
);

const mArrayOfString = PropTypes_.Maybe(
    PropTypes.arrayOf(
        PropTypes.string.isRequired
    ).isRequired
);

const mImageShape = mShape({
    url: mString.isRequired,
    busy: PropTypes.bool.isRequired,
    errors: mShape({
        common: mArrayOfString.isRequired
    }).isRequired
});

Result.propTypes = {
    title: PropTypes.string.isRequired,
    description: mString.isRequired,
    header: PropTypes.shape({
        icon: mImageShape.isRequired,
        logo: mImageShape.isRequired,
        color: mString.isRequired,
        colorSpecial: mString.isRequired,
        background: PropTypes_.Tuple([
            mString.isRequired,
            PropTypes_.Maybe(
                PropTypes.number.isRequired
            ).isRequired
        ]).isRequired
    }).isRequired,
    page: PropTypes.shape({
        background: mString.isRequired,
        wallpaper: mImageShape.isRequired
    }).isRequired
};

export default CSSModules(Result, styles);
