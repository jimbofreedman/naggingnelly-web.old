/**
*
* Action
*
*/

import React from 'react';
// import styled from 'styled-components';
import { ButtonGroup, Label, DropdownButton, Glyphicon, MenuItem } from 'react-bootstrap';
import { ContextMenuTrigger, ContextMenu } from 'react-contextmenu';

import rest from '../../rest';
import ActionButton from './ActionButton';
// import ActionMenu from './ActionMenu';
import config from '../../config';


function ActionHeader(props) {
  const { dispatch, action } = props;

  const handleHelper = (helperFunc) => (() => {
    dispatch(helperFunc(action.id));
  });

  const handleUpdate = (actionDelta) => (() => {
    dispatch(rest.actions.actions.put({ id: action.id }, { body: JSON.stringify({ ...action, ...actionDelta }) }));
  });

  const disabled = false;

  const menuItems = [
    <MenuItem key={0} data={'some_data'} href={`${config.api.endpoint}admin/gtd/action/${action.id}/change`}>
      API Edit
    </MenuItem>,
    <MenuItem key={1} onClick={handleUpdate({ folder: 1 })} >
      Move to Bin
    </MenuItem>,
  ];

  return (
    <div>
      <ContextMenuTrigger id={`contextMenu${action.id}`}>
        <div className="pull-right">
          <ButtonGroup style={{ marginTop: '-5px' }}>
            <DropdownButton id={`dropdownMenu${action.id}`} bsSize="small" noCaret title={<Glyphicon glyph="menu-hamburger" />} disabled={disabled} >
              {menuItems}
            </DropdownButton>
            <ActionButton glyph="remove" disabled={disabled} bsStyle="danger" onClick={handleHelper(rest.actions.actions.fail)} />
            <ActionButton glyph="minus" disabled={disabled} bsStyle="warning" onClick={handleHelper(rest.actions.actions.cancel)} />
            <ActionButton glyph="ok" disabled={disabled} bsStyle="success" onClick={handleHelper(rest.actions.actions.complete)} />
          </ButtonGroup>
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {action.short_description}
          <Label>{action.due_at}</Label>
        </div>
      </ContextMenuTrigger>

      <ContextMenu id={`contextMenu${action.id}`}>
        {menuItems}
      </ContextMenu>
    </div>);
}

ActionHeader.propTypes = {
  action: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default ActionHeader;
