/**
*
* Action
*
*/

import React from 'react';
// import styled from 'styled-components';
import { Panel, Grid, Row, Col } from 'react-bootstrap';

import ActionHeader from './ActionHeader';

function Action(props) {
  const { dispatch, action, folders, contexts } = props;

  const disabled = false;
  const color = undefined;

  return (
    <Panel key={action.id} eventKey={action.id} bsStyle={color} disabled={disabled}>
      <ActionHeader dispatch={dispatch} action={action} folders={folders} contexts={contexts} />
      <Panel.Body collapsible>
        <Grid>
          <Row>
            <Col sm={2} md={2}>Priority:</Col>
            <Col>{action.priority}</Col>
          </Row>
          {action.start_at ? <Row>
            <Col sm={2} md={2}>Start at:</Col>
            <Col>{action.start_at}</Col>
          </Row> : null}
          {action.dueAt ? <Row>
            <Col sm={2} md={2}>Due at:</Col>nopm
            <Col>{action.dueAt}</Col>
          </Row> : null}
        </Grid>
      </Panel.Body>
    </Panel>
  );
}

Action.propTypes = {
  action: React.PropTypes.object,
  folders: React.PropTypes.object,
  contexts: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default Action;
