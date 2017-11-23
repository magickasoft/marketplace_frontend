import React, { PropTypes } from 'react';
import {
    Modal,
    Form,
    FormGroup,
    HelpBlock,
    Button
} from 'react-bootstrap';
import {
    noop,
    map
} from 'lodash/fp';

import PropTypes_ from 'utils/prop-types';


function DeleteDialog(props) {
    return (
        <Modal show onHide={props.busy ? noop : props.onCancel}>
            <Form
                onSubmit={event => {
                    if (!props.busy) {
                        props.onDelete();
                    }
                    event.preventDefault();
                }}
            >
                <Modal.Header>
                    <Modal.Title>
                        {props.children}
                    </Modal.Title>
                </Modal.Header>

                {props.errors.map(errors => (
                    <Modal.Body>
                        <FormGroup validationState="error">
                            {map(error => (
                                <HelpBlock key={error}>{error}</HelpBlock>
                            ), errors)}
                        </FormGroup>
                    </Modal.Body>
                )).getOrElse(null)}

                <Modal.Footer>
                    <Button
                        type="submit"
                        bsStyle="danger"
                        disabled={props.busy}
                    >
                        Yes, delete!
                    </Button>
                    <Button
                        onClick={props.busy ? noop : props.onCancel}
                        disabled={props.busy}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

DeleteDialog.propTypes = {
    children: PropTypes.string.isRequired,
    busy: PropTypes.bool.isRequired,
    errors: PropTypes_.Maybe(
        PropTypes.arrayOf(
            PropTypes.string.isRequired
        ).isRequired
    ).isRequired,

    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default DeleteDialog;
