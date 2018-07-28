/**
 *
 * Action
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { FormGroup, InputGroup, Button } from 'react-bootstrap';
import { Form, Field, reduxForm, formValueSelector } from 'redux-form/immutable';

import rest from '../../rest';


export class EditAction extends React.PureComponent {
  componentDidMount() {
    this.props.initialize(this.props.action);
  }

  render() {
    const { dispatch, action, /* folders, contexts, */ data } = this.props;

    // const disabled = false;

    const handleUpdate = () => {
      dispatch(rest.actions.actions.put(
        { id: action.id },
        { body: JSON.stringify({ ...action, ...data }) }));
    };

    // const valid = true;
    // const pristine = true;
    // const submitting = true;

    return (
      <Form onSubmit={handleUpdate} key={`editAction${action.id}`}>
        <FormGroup>
          <InputGroup>
            <Field
              name="shortDescription"
              component="input"
              className="form-control"
              type="text"
            />
          </InputGroup>
        </FormGroup>
        <Button onClick={handleUpdate} bsStyle="primary">Save</Button>
      </Form>
    );
  }
}

EditAction.propTypes = {
  action: PropTypes.object,
  // folders: PropTypes.object,
  // contexts: PropTypes.object,
  dispatch: PropTypes.func,
  initialize: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.form);
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'irrelevant',
  fields: ['shortDescription'],
  enableReinitialize: true,
})(EditAction));
