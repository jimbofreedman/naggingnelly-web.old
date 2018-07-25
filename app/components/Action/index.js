/**
*
* Action
*
*/

import React from 'react';
// import styled from 'styled-components';
import { Panel, Grid, Row, Col, Form, FormGroup, InputGroup, SplitButton, MenuItem, Glyphicon } from 'react-bootstrap';
import { Field } from 'redux-form/immutable';

import ActionHeader from './ActionHeader';

function Action(props) {
  const { dispatch, action, folders, contexts } = props;

  const disabled = false;
  const color = undefined;

  const handleSubmit = () => {};
  const valid = true;
  const pristine = true;
  const submitting = true;

  return (
    <Panel key={action.id} eventKey={action.id} bsStyle={color} disabled={disabled}>
      <ActionHeader dispatch={dispatch} action={action} folders={folders} contexts={contexts} />
      <Panel.Body collapsible>
        <Grid>
          <Row>
            <Col sm={2} md={2}>Priority:</Col>
            <Col>{action.priority}</Col>
          </Row>
          {action.startAt ? <Row>
            <Col sm={2} md={2}>Start at:</Col>
            <Col>{action.startAt}</Col>
          </Row> : null}
          {action.dueAt ? <Row>
            <Col sm={2} md={2}>Due at:</Col>nopm
            <Col>{action.dueAt}</Col>
          </Row> : null}
        </Grid>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup>
              <Field name="shortDescription" component="input" className="form-control" type="text" placeholder="Add to collectbox..." />
              <SplitButton
                componentClass={InputGroup.Button}
                title={<Glyphicon glyph="plus" />}
                onClick={handleSubmit}
                disabled={!valid || pristine || submitting}
                id="add_action_folder_select"
              >
                <MenuItem key="1">Item</MenuItem>
              </SplitButton>
            </InputGroup>
          </FormGroup>
        </Form>
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
