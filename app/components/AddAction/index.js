/*
 *
 * AddAction
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, InputGroup, Glyphicon, SplitButton, MenuItem } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import rest from '../../rest';

function AddAction({ dispatch, data, pristine, submitting, valid, reset }) {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch(rest.actions.actions.post({},
      { body: JSON.stringify(data) },
      (err) => {
        if (err === null) {
          reset();
        }
      }));
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <InputGroup>
            <Field name="short_description" component="input" className="form-control" type="text" placeholder="Add to collectbox..." />
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
    </div>
  );
}

AddAction.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: React.PropTypes.object,
  pristine: React.PropTypes.bool,
  submitting: React.PropTypes.bool,
  valid: React.PropTypes.bool,
  reset: React.PropTypes.func,
};

const formName = 'addAction';

const mapStateToProps = (state) => {
  const selector = formValueSelector(formName);
  return {
    data: {
      short_description: selector(state, 'short_description'),
    },
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default reduxForm({ form: formName })(connect(mapStateToProps, mapDispatchToProps)(AddAction));
