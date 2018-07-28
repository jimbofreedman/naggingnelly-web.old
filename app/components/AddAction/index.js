/*
 *
 * AddAction
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Form, FormGroup, InputGroup, Glyphicon, SplitButton, MenuItem } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import rest from '../../rest';

function AddAction({ dispatch, data, pristine, submitting, valid, reset, parentActionId }) {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    dispatch(rest.actions.actions.post({},
      { body: JSON.stringify({ ...data, ...{ folder: 3, context: 3, dependencies: parentActionId ? [parentActionId] : [] } }) },
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
    </div>
  );
}

AddAction.propTypes = {
  dispatch: PropTypes.func.isRequired,
  parentActionId: PropTypes.number,
  data: PropTypes.object,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  valid: PropTypes.bool,
  reset: PropTypes.func,
};

const formName = 'addAction';

const mapStateToProps = (state) => {
  const selector = formValueSelector(formName);
  return {
    data: {
      shortDescription: selector(state, 'shortDescription'),
    },
    parentActionId: state.get('selectedActionId'),
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default reduxForm({ form: formName })(connect(mapStateToProps, mapDispatchToProps)(AddAction));
