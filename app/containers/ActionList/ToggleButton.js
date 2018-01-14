/**
 *
 * ActionButton
 *
 */

import React from 'react';
// import styled from 'styled-components';
import { Button } from 'react-bootstrap';

function ToggleButton({ input, label }) {
  return (
    <Button
      id="toggleButton"
      onClick={() => { input.onChange(!input.value); }}
      active={input.value === true}
    >
      {label}
    </Button>
  );
}

ToggleButton.propTypes = {
  input: React.PropTypes.object,
  label: React.PropTypes.string,
};

export default ToggleButton;
