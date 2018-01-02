/**
 *
 * ActionMenu
 *
 */

import React from 'react';
import { MenuItem } from 'react-bootstrap';
// import styled from 'styled-components';
import config from '../../config';

function ActionMenu({ action }) {
  return (
    <div>
      <MenuItem data={'some_data'} href={`${config.api.endpoint}admin/gtd/action/${action.id}/change`}>
        API Edit
      </MenuItem>
    </div>);
}

ActionMenu.propTypes = {
  action: React.PropTypes.object,
};

export default ActionMenu;
