/* eslint-disable no-underscore-dangle */
// ^ to allow for reading GraphViz's SVG objects
import React from 'react';

function Node({ node }) {
  const drawC = node._draw_[0];
  const drawE = node._draw_[1];
  const lDrawF = node._ldraw_[0];
  const lDrawC = node._ldraw_[1];
  const lDrawT = node._ldraw_[2];

  return (<g id={`node${node.name}`} key={node.name} className="node">
    <title>{node.name}</title>
    <ellipse
      fill="none"
      stroke={drawC.color}
      cx={drawE.rect[0]}
      cy={-drawE.rect[1]}
      rx={drawE.rect[2]}
      ry={drawE.rect[3]}
    />
    <text
      textAnchor="middle"
      x={lDrawT.pt[0]}
      y={-lDrawT.pt[1]}
      fontFamily={lDrawF.face}
      fontSize={lDrawF.size}
      fill={lDrawC.color}
    >{node.label}</text>
  </g>);
}

Node.propTypes = {
  node: PropTypes.object,
};

export default Node;
