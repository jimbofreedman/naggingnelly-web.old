/**
 *
 * Action
 *
 */

import React from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import { Panel, Grid, Row, Col, Form, FormGroup, InputGroup, SplitButton, MenuItem, Glyphicon } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';

import ActionHeader from './ActionHeader';

function EditAction(props) {
  const { dispatch, action, folders, contexts } = props;

  const disabled = false;
  const color = undefined;

  const handleSubmit = () => {};
  const valid = true;
  const pristine = true;
  const submitting = true;

  return (
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
  );
}

EditAction.propTypes = {
  action: React.PropTypes.object,
  folders: React.PropTypes.object,
  contexts: React.PropTypes.object,
  dispatch: React.PropTypes.func,
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
export default EditAction;

