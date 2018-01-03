/* eslint-disable no-underscore-dangle */
// ^ to allow for reading GraphViz's SVG objects
/**
 *
 * ActionGraph
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import rest from '../../rest';
import makeSelectActionGraph from './selectors';
import reducer from './reducer';
import saga from './saga';
import Node from './Node';
import Edge from './Edge';

export class ActionGraph extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.loadActionGraph();
  }

  render() {
    const { graph } = this.props;

    if (!graph.sync) {
      return (<div>Loading</div>);
    }

    const g = graph.data;
    // const drawc = g._draw_[0];
    // const drawC = g._draw_[1];
    const drawP = g._draw_[2];
    const points = drawP.points;
    const width = points[2][0] + 16;
    const height = points[2][1] + 16;
    const viewBox = `0.00 0.00 ${width} ${height}`;
    const transform = `scale(1 1) rotate(0) translate(${(points[0][0] + 4).toString()} ${(points[2][1] + 4).toString()})`;

    const polyPoints =
      `${(points[0][0] - 4).toString()},${(-points[0][1] + 4).toString()} 
      ${(points[1][0] - 4).toString()},${(-points[1][1] + 4).toString()} 
      ${(points[2][0] - 4).toString()},${(-points[2][1] + 4).toString()} 
      ${(points[3][0] - 4).toString()},${(-points[3][1] + 4).toString()}`;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'scroll',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="graph0"
            className="graph"
            transform={transform}
          >
            <title>%3</title>
            <polygon
              fill="#ffffff"
              stroke="transparent"
              points={polyPoints}
            />
            {g.objects.map((node) => <Node node={node} />)}
            {g.edges.map((edge) => <Edge edge={edge} />)}
          </g>
        </svg>
      </div>
    );
  }
}

ActionGraph.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  loadActionGraph: PropTypes.func.isRequired,
  graph: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  graph: makeSelectActionGraph(),
});

function mapDispatchToProps(dispatch) {
  return {
    // dispatch,
    loadActionGraph: () => {
      dispatch(rest.actions.graph.sync());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'actionGraph', reducer });
const withSaga = injectSaga({ key: 'actionGraph', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ActionGraph);
