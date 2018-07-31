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


export class ActionHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      finished: false
    };
  }

  render() {
    const { dispatch, action, folders, contexts } = this.props;
    const { loading, finished } = this.state;

    const handleHelper = (helperFunc) => (() => {
      dispatch(helperFunc(action.id));
    });

    const handleUpdate = (actionDelta) => (() => {
      dispatch(rest.actions.actions.put(
        { id: action.id },
        { body: JSON.stringify({ ...action, ...actionDelta }) }));
      this.setState({ loading: true, finished: actionDelta.status > 0 });
    });

    const menuItems = [
      <MenuItem key="cancel" disabled={loading} onClick={handleUpdate({ status: 2 })}><Glyphicon glyph="minus"/>&nbsp;Cancel</MenuItem>,
      <MenuItem key="fail" disabled={loading} onClick={handleUpdate({ status: 1 })}><Glyphicon glyph="remove"/>&nbsp;Fail</MenuItem>,
      <MenuItem key="dfinish" divider/>,
      <MenuItem key={0} data={'some_data'} href={`${config.api.endpoint}admin/gtd/action/${action.id}/change`}>
        API Edit
      </MenuItem>,
      <MenuItem key="dfolder" disabled={loading} divider/>,
      <MenuItem key="hfolder" disabled={loading} header>Move to folder</MenuItem>,
      ...Object.keys(folders.data).map((id) => {
        const folder = folders.data[id];
        return (
          <MenuItem key={`folder${folder.id}`} disabled={loading} onClick={handleUpdate({ folder: folder.id })}>{folder.name}</MenuItem>);
      }),
      <MenuItem key="dcontext" divider/>,
      <MenuItem key="hcontext" disabled={loading} header>Change context</MenuItem>,
      ...Object.keys(contexts.data).map((id) => {
        const context = contexts.data[id];
        return (<MenuItem key={`context${context.id}`}
                          onClick={handleUpdate({ context: context.id })}>{context.name}</MenuItem>);
      }),
    ];


    const dueLabel = action.dueAt ? <DueLabel dueDate={action.dueAt}/> : null;

    return (
      <Panel.Heading>
        <div className="pull-right">
          {dueLabel}
          <ButtonGroup style={{ marginTop: '-5px' }}>
            <SplitButton id={`dropdownMenu${action.id}`} bsSize="small" bsStyle="success"
                         onClick={handleUpdate({ status: 3 })} title={<Glyphicon glyph="ok"/>} disabled={loading}>
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
          <Glyphicon glyph={contexts.data[action.context].glyph}/>
          <Panel.Toggle componentClass="span" style={{ textDecoration: (finished ? 'line-through' : null) }}>{action.shortDescription}</Panel.Toggle>
        </div>
      </Panel.Heading>);
  }
}

ActionHeader.propTypes = {
  action: PropTypes.object,
  folders: PropTypes.object,
  contexts: PropTypes.object,
  dispatch: PropTypes.func,
};

export default ActionHeader;
