/**
*
* Action
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Panel, Grid, Row, Col } from 'react-bootstrap';
import EditAction from './EditAction';

import ActionHeader from './ActionHeader';

export class Action extends React.PureComponent {
  render() {
    const props = this.props;
    const { dispatch } = props;
    const action = props.action.toJS();
    const folders = props.folders.toJS();
    const contexts = props.contexts.toJS();

    const disabled = false;

    console.log(`rendering ACTION ${action.id}`);

    return (
      <Panel key={action.id} eventKey={action.id} disabled={disabled}>
        <ActionHeader dispatch={dispatch} action={action} folders={folders} contexts={contexts}/>
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
                <Col sm={2} md={2}>Due at:</Col>
                <Col>{action.dueAt}</Col>
              </Row> : null}
          </Grid>
          {/*<EditAction action={action} form={`editAction${action.id}`} />*/}
        </Panel.Body>
      </Panel>
    );
  }
}

Action.propTypes = {
  action: PropTypes.object,
  folders: PropTypes.object,
  contexts: PropTypes.object,
  dispatch: PropTypes.func,
};

export default Action;

