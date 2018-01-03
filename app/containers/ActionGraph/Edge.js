/* eslint-disable no-underscore-dangle */
// ^ to allow for reading GraphViz's SVG objects
import React from 'react';

function Edge({ edge }) {
  const drawC = edge._draw_[0];
  const drawb = edge._draw_[1];
  // const hDrawS = edge._hdraw_[0];
  const hDrawc = edge._hdraw_[1];
  const hDrawC = edge._hdraw_[2];
  const hDrawP = edge._hdraw_[3];

  const seps = ['M', 'C'];
  const path = drawb.points.map((point, i) => `${i >= seps.length ? ' ' : seps[i]}${point[0]},-${point[1]}`).join('');

  const points = hDrawP.points.map((p) => `${p[0]},-${p[1]}`).join(' ');
  const lastPoint = `${hDrawP.points[0][0]},-${hDrawP.points[0][1]}`;

  return (<g id={`edge${edge._gvid}`} key={`edge${edge._gvid}`} className="edge">
    <path fill="none" stroke={drawC.color} d={path} />
    <polygon fill={hDrawC.color} stroke={hDrawc.color} points={`${points} ${lastPoint}`} />
  </g>);
}

Edge.propTypes = {
  edge: React.PropTypes.object,
};

export default Edge;
