/**
*
* Action
*
*/

import React from 'react';
// import styled from 'styled-components';
import { ButtonGroup, DropdownButton, Glyphicon, MenuItem, Panel } from 'react-bootstrap';
import { ContextMenuTrigger, ContextMenu } from 'react-contextmenu';

import rest from '../../rest';
import ActionButton from './ActionButton';
import DueLabel from './DueLabel';
// import ActionMenu from './ActionMenu';
import config from '../../config';


function ActionHeader(props) {
  const { dispatch, action, folders, contexts, loading } = props;

  const handleHelper = (helperFunc) => (() => {
    dispatch(helperFunc(action.id));
  });

  const handleUpdate = (actionDelta) => (() => {
    dispatch(rest.actions.actions.put(
      { id: action.id },
      { body: JSON.stringify({ ...action, ...actionDelta }) }));
  });

  const menuItems = [
    <MenuItem key={0} data={'some_data'} href={`${config.api.endpoint}admin/gtd/action/${action.id}/change`}>
      API Edit
    </MenuItem>,
    <MenuItem key="dfolder" divider />,
    <MenuItem key="hfolder" header>Move to folder</MenuItem>,
    ...Object.keys(folders.data).map((id) => {
      const folder = folders.data[id];
      return (<MenuItem key={`folder${folder.id}`} onClick={handleUpdate({ folder: folder.id })}>{folder.name}</MenuItem>);
    }),
    <MenuItem key="dcontext" divider />,
    <MenuItem key="hcontext" header>Change context</MenuItem>,
    ...Object.keys(contexts.data).map((id) => {
      const context = contexts.data[id];
      return (<MenuItem key={`context${context.id}`} onClick={handleUpdate({ context: context.id })}>{context.name}</MenuItem>);
    }),
  ];


  const dueLabel = action.dueAt ? <DueLabel dueDate={action.dueAt} /> : null;

  return (
    <Panel.Heading>
      <ContextMenuTrigger id={`contextMenu${action.id}`}>
        <div className="pull-right">
          {dueLabel}
          <ButtonGroup style={{ marginTop: '-5px' }}>
            <DropdownButton id={`dropdownMenu${action.id}`} bsSize="small" noCaret title={<Glyphicon glyph="menu-hamburger" />} disabled={loading} >
              {menuItems}
            </DropdownButton>
            <ActionButton glyph="remove" disabled={loading} bsStyle="danger" onClick={handleHelper(rest.actions.actions.fail)} />
            <ActionButton glyph="minus" disabled={loading} bsStyle="warning" onClick={handleHelper(rest.actions.actions.cancel)} />
            <ActionButton glyph="ok" disabled={loading} bsStyle="success" onClick={handleHelper(rest.actions.actions.complete)} />
          </ButtonGroup>
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <Glyphicon glyph={contexts.data[action.context].glyph} />
          <Panel.Toggle componentClass="span">{action.shortDescription}</Panel.Toggle>
        </div>
      </ContextMenuTrigger>

      <ContextMenu id={`contextMenu${action.id}`}>
        {menuItems}
      </ContextMenu>
    </Panel.Heading>);
}

ActionHeader.propTypes = {
  action: React.PropTypes.object,
  loading: React.PropTypes.bool,
  folders: React.PropTypes.object,
  contexts: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default ActionHeader;
