/**
 *
 * ActionButton
 *
 */

import React from 'react';
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
  glyph: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  bsStyle: React.PropTypes.string,
  onClick: React.PropTypes.func,
};

export default ActionButton;
