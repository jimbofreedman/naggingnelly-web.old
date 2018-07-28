/**
*
* Action
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { ButtonGroup, DropdownButton, Glyphicon, MenuItem, Panel, SplitButton } from 'react-bootstrap';
import { ContextMenuTrigger, ContextMenu } from 'react-contextmenu';

import rest from '../../rest';
import ActionButton from './ActionButton';
import DueLabel from './DueLabel';
// import ActionMenu from './ActionMenu';
import config from '../../config';


function ActionHeader(props) {
  // console.log("RENDERING ACTIONHEADER");

  const { dispatch, action, folders, contexts } = props;
  const loading = false;

  const handleHelper = (helperFunc) => (() => {
    dispatch(helperFunc(action.id));
  });

  const handleUpdate = (actionDelta) => (() => {
    dispatch(rest.actions.actions.put(
      { id: action.id },
      { body: JSON.stringify({ ...action, ...actionDelta }) }));
  });

  const menuItems = [
    <MenuItem key="cancel" onClick={handleUpdate({ status: 2 })}><Glyphicon glyph="minus" />&nbsp;Cancel</MenuItem>,
    <MenuItem key="fail" onClick={handleUpdate({ status: 1 })}><Glyphicon glyph="remove" />&nbsp;Fail</MenuItem>,
    <MenuItem key="dfinish" divider />,
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
      <div className="pull-right">
        {dueLabel}
        <ButtonGroup style={{ marginTop: '-5px' }}>
          <SplitButton id={`dropdownMenu${action.id}`} bsSize="small" bsStyle="success" title={<Glyphicon glyph="ok"/>} disabled={loading}>
            {menuItems}
          </SplitButton>
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
    </Panel.Heading>);
}

ActionHeader.propTypes = {
  action: PropTypes.object,
  folders: PropTypes.object,
  contexts: PropTypes.object,
  dispatch: PropTypes.func,
};

export default ActionHeader;
