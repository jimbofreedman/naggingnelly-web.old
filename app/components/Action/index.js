/**
*
* Action
*
*/

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Panel, Grid, Row, Col, Form, FormGroup, InputGroup, SplitButton, MenuItem, Glyphicon } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import EditAction from './EditAction';

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
        <EditAction action={action} form={`editAction${action.id}`} />
      </Panel.Body>
    </Panel>
  );
}

Action.propTypes = {
  action: PropTypes.object,
  folders: PropTypes.object,
  contexts: PropTypes.object,
  dispatch: PropTypes.func,
};


const formName = 'editAction';

const mapStateToProps = (state) => {
  const selector = formValueSelector(formName);
  return {
    data: {
      shortDescription: selector(state, 'shortDescription'),
    },
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

//export default reduxForm({ form: formName })(connect(mapStateToProps, mapDispatchToProps)(Action));
export default Action;

