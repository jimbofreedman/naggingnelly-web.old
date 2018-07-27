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
import { makeSelectActions } from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import * as d3 from "d3";
import { css } from 'styled-components';


const nodeCircle = css`
  fill: #999;
`

const nodeText = css`
  font: 10px sans-serif;
`

const nodeInternalCircle = css`
  fill: #555;
`

const nodeInternalText = css`
  text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
`

class ActionGraph extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
    this.state = {
      selectedType: null,
      selectedItem: null
    }
  }

  render() {
    const width = 2000;
    const height = 2000;
    const { actions } = this.props;

    //   g = svg.append('g").attr("transform", );

    if (!actions.sync) {
      return <div>Loading...</div>
    }

    var stratify = d3.stratify()
      .id((d) => d.path)
      .parentId(function(d) { return d.path.substring(0, d.path.lastIndexOf('.')); });

    var tree = d3.tree()
      .size([2 * Math.PI, 1000])
      .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
    
    const getDependencies = (path) => (id) => {
      const action = actions.data[id];
      return [{ path: `${path}.${id}` }].concat(action.dependencies.map((depId) => getDependencies(`${path}.${id}`)(depId)).reduce((acc, val) => acc.concat(val), []));
    };

    var mapped = [{
      path: 'start',
      shortDescription: 'WIN',
    }].concat(Object.keys(actions.data)
      .filter((id) => {
        const action = actions.data[id];
        return action.status === 0;
      })
      .map((id) => {
      return getDependencies('start')(id);
    }).reduce((acc, val) => acc.concat(val), []));

    var root = tree(stratify(mapped));

    function radialPoint(x, y) {
      return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    }

    const renderNode = (d) => {
      const id = d.id.substring(d.id.lastIndexOf('.') + 1);
      const action = id === 'start' ? { shortDescription: 'WIN' } : actions.data[id];
      return [
        <g
          key={d.id}
          transform={'translate(' + radialPoint(d.x, d.y) + ')'}
          onClick={() => this.setState({ selectedType: "node", selectedItem: id})}
        >
          <circle
            r="2.5"
            style={ { fill: (d.children ? '#555555' : '#999999') } }
          />
          <text
            dy="0.31em"
            x={d.x < Math.PI ? 6 : -6}
            textAnchor={d.x < Math.PI ? 'start' : 'end'}
            transform={'rotate(' + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ')'}
          >
            {action.shortDescription}
          </text>
        </g>
      ].concat(d.children ? d.children.map(renderNode) : []);
    };

    const renderLinks = (d) => d.links().map((l) =>
      <path
        key={`${l.source.id}:${l.target.id}`}
        style={ {
          fill: 'none',
          stroke: '#555',
          strokeOpacity: 0.4,
          strokeWidth: '3px',
        } }
        d={d3.linkRadial().angle(function (d) {
          return d.x;
        }).radius(function (d) {
          return d.y;
        })(l)}
        onClick={() => this.setState({ selectedType: "node", selectedItem: [l.source.id, l.target.id]})}
      />
    );

    return (!actions.sync) ?
      (<div>Loading</div>)
      :
      (
        <div>
          <div>Selected Type: { this.state.selectedType }</div>
          <div>Selected Item: { this.state.selectedItem }</div>
          <svg
            width="100%"
            height={2000}
            viewbox={`0 0 ${width} ${height}`}
            style={{borderWidth:"2px", borderColor: "black", borderStyle: "solid"}}
            preserveAspectRatio="xMinyMin meet"
          >
            <g transform={'translate(' + ((width / 2) + 40) + ',' + ((height / 2) + 90) + ')'}>
              {renderLinks(root)};
              {renderNode(root)};
            </g>
          </svg>
        </div>
      );
  }
}

ActionGraph.propTypes = {
  actions: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  actions: makeSelectActions(),
});

function mapDispatchToProps() {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'actionGraph', reducer });
const withSaga = injectSaga({ key: 'actionGraph', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ActionGraph);
