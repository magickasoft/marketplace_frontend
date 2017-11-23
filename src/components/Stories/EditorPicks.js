import React from 'react';
import {
    Grid,
    Panel
} from 'react-bootstrap';
import Queue from 'components/Stories/Queue';


export default function EditorPicks(props) {
    return (
        <Grid fluid>
            <Panel header='Editor Picks'>
                <Queue {...props} />
            </Panel>
        </Grid>
    );
}
