import React, { PropTypes } from 'react';
import {
    Panel,
    Radio,
    FormControl,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import {
    compose,
    property
} from 'lodash/fp';
import {
    Just
} from 'data.maybe';

import PropTypes_ from 'utils/prop-types';
import GroupInput from 'components/GroupInput';


const pTitle = property('title');
const pUrl = property('url');
const pRedeem = property('redeem');
const pRedeemTitle = compose(pTitle, pRedeem);
const pRedeemCode = compose(property('code'), pRedeem);
const pRedeemUrl = compose(pUrl, pRedeem);
const pTargetValue = compose(
    property('value'),
    property('target')
);

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

function Selectable(props) {
    return (
        <ListGroupItem bsStyle={props.selected ? 'info' : null}>
            <GroupInput
                label={Just(
                    <Radio
                        checked={props.selected}
                        onChange={props.onSelect}
                    >
                        {props.label}
                    </Radio>
                )}
                errors={props.errors}
            >
                <FormControl
                    type={props.type}
                    value={props.value.getOrElse('')}
                    placeholder={props.placeholder}
                    disabled={props.busy || !props.selected}
                    onChange={compose(props.onChange, pTargetValue)}
                />
            </GroupInput>
        </ListGroupItem>
    );
}

Selectable.propTypes = {
    value: mString.isRequired,
    selected: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    busy: PropTypes.bool.isRequired,
    errors: mArrayOfString.isRequired,

    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
};

export default function PanelRedemption(props) {
    return (
        <Panel header={
            <h1>Redemption</h1>
            }>
            <GroupInput
                label={Just('Redeem copy')}
                errors={props.errors.chain(pRedeemTitle)}
                >
                <FormControl
                    style={{ resize: 'none' }}
                    rows={5}
                    componentClass="textarea"
                    placeholder="Write a redeem copy"
                    disabled={props.busy}
                    value={props.fields.redeem.title.getOrElse('')}
                    onChange={compose(
                        props.onChangeRedeemTitle,
                        pTargetValue
                    )}
                />
            </GroupInput>

            <ListGroup>
                <Selectable
                    {...props.fields.redeem.code}
                    label="By code"
                    type="text"
                    placeholder="Write a redeem code"
                    busy={props.busy}
                    errors={props.errors.chain(pRedeemCode)}
                    onChange={props.onChangeRedeemCode}
                    onSelect={props.onSelectRedeemCode}
                />

                <Selectable
                    {...props.fields.redeem.url}
                    label="By URL"
                    type="url"
                    placeholder="Write a redeem URL"
                    busy={props.busy}
                    errors={props.errors.chain(pRedeemUrl)}
                    onChange={props.onChangeRedeemUrl}
                    onSelect={props.onSelectRedeemUrl}
                />
            </ListGroup>
        </Panel>
    );
}

PanelRedemption.propTypes = {
    fields: PropTypes.shape({
        redeem: PropTypes.shape({
            title: mString.isRequired,
            code: PropTypes.object.isRequired,
            url: PropTypes.object.isRequired
        }).isRequired,
        website: PropTypes.shape({
            title: mString.isRequired,
            url: mString.isRequired
        }).isRequired
    }).isRequired,
    busy: PropTypes.bool.isRequired,
    errors: mShape({
        redeem: PropTypes.shape({
            title: mArrayOfString.isRequired,
            code: mArrayOfString.isRequired,
            url: mArrayOfString.isRequired
        }).isRequired,
        website: PropTypes.shape({
            title: mArrayOfString.isRequired,
            url: mArrayOfString.isRequired
        }).isRequired
    }).isRequired,

    onChangeRedeemTitle: PropTypes.func.isRequired,
    onChangeRedeemCode: PropTypes.func.isRequired,
    onSelectRedeemCode: PropTypes.func.isRequired,
    onChangeRedeemUrl: PropTypes.func.isRequired,
    onSelectRedeemUrl: PropTypes.func.isRequired,
    onChangeWebsiteTitle: PropTypes.func.isRequired,
    onChangeWebsiteUrl: PropTypes.func.isRequired
};
