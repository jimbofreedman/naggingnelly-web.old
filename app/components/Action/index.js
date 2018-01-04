/**
*
* Action
*
*/

import React from 'react';
// import styled from 'styled-components';
import { Panel } from 'react-bootstrap';

import ActionHeader from './ActionHeader';

function Action(props) {
  const { dispatch, action, folders, contexts } = props;

  const disabled = false;
  const color = undefined;
  const open = false;

  return (<Panel key={action.id} collapsible expanded={open} bsStyle={color} disabled={disabled} header={<ActionHeader dispatch={dispatch} action={action} folders={folders} contexts={contexts} />} />);
}

Action.propTypes = {
  action: React.PropTypes.object,
  folders: React.PropTypes.object,
  contexts: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default Action;