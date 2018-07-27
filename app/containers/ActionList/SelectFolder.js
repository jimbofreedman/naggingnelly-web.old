/**
 *
 * ActionButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { DropdownButton, MenuItem } from 'react-bootstrap';

function SelectFolder({ input, data, onChange }) {
  return (
    <DropdownButton
      id="selectFolder"
      title={data[input.value].name}
      onClick={onChange}
    >
      {Object.keys(data).map((id) => {
        const folder = data[id];
        return (<MenuItem key={folder.id} onClick={() => input.onChange(folder.id)} active={parseInt(input.value, 10) === folder.id}>{folder.name}</MenuItem>);
      })}
    </DropdownButton>
  );
}

SelectFolder.propTypes = {
  input: PropTypes.object,
  data: PropTypes.object,
  onChange: PropTypes.func,
};

export default SelectFolder;
