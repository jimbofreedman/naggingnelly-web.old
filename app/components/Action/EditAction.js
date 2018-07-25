/**
 *
 * Action
 *
 */

import React from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import { Panel, Grid, Row, Col, FormGroup, InputGroup, Button, MenuItem, Glyphicon } from 'react-bootstrap';
import { Form, Field, reduxForm, formValueSelector } from 'redux-form/immutable';

import ActionHeader from './ActionHeader';
import rest from '../../rest';


export class EditAction extends React.PureComponent {
  componentDidMount() {
    this.props.initialize(this.props.action);
  }

  render() {
    const { dispatch, action, folders, contexts, data } = this.props;

    const disabled = false;
    const color = undefined;

    const handleUpdate = () => {
      dispatch(rest.actions.actions.put(
        { id: action.id },
        { body: JSON.stringify({ ...action, ...data }) }));
    };

    const valid = true;
    const pristine = true;
    const submitting = true;

    return (
      <Form onSubmit={handleUpdate} key={`editAction${action.id}`}>
        <FormGroup>
          <InputGroup>
            <Field name="shortDescription" component="input" className="form-control" type="text"
                   placeholder="Add to collectbox..."/>
          </InputGroup>
        </FormGroup>
        <Button onClick={handleUpdate} bsStyle="primary">Save</Button>
      </Form>
    );
  }
}

EditAction.propTypes = {
  action: React.PropTypes.object,
  folders: React.PropTypes.object,
  contexts: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};


const formName = 'editAction';

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
  form:"irrelevant",
  fields: ["shortDescription"],
  enableReinitialize: true
})(EditAction));


