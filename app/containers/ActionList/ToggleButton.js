/**
 *
 * ActionButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
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
  input: PropTypes.object,
  label: PropTypes.string,
};

export default ToggleButton;
