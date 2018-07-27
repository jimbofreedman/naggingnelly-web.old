/**
 *
 * ActionButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Button, Glyphicon } from 'react-bootstrap';

function ActionButton({ glyph, disabled, bsStyle, onClick }) {
  return (
    <Button bsSize="small" disabled={disabled} bsStyle={bsStyle} onClick={onClick}>
      <Glyphicon glyph={glyph} />
    </Button>
  );
}

ActionButton.propTypes = {
  glyph: PropTypes.string,
  disabled: PropTypes.bool,
  bsStyle: PropTypes.string,
  onClick: PropTypes.func,
};

export default ActionButton;
