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
import { DragDropContext } from 'react-dnd';
import MouseBackend from 'react-dnd-mouse-backend';
import { DragSource, DropTarget } from 'react-dnd';
import rest from '../../rest';

const knightSource = {
  beginDrag(props) {
    return props.action;
  }
};

const squareTarget = {
  drop(props, monitor) {
    const fromId = monitor.getItem().id;
    const toId = props.action.id;
    if (fromId != toId) {
      props.dispatch(rest.actions.actions.addDependency(fromId, toId));
    }
  }
};

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function radialPoint(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

const GraphNode = DropTarget("ACTION", squareTarget, collectDrop)(DragSource("ACTION", knightSource, collectDrag)(({d, action, connectDragSource, isDragging, connectDropTarget, isOver}) => {
  return connectDropTarget(connectDragSource(
    <g
      transform={'translate(' + radialPoint(d.x, d.y) + ')'}
      style={ { fill: (isOver ? '#00cccc' : undefined) } }
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
  ));
}));

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

    const depOns = {};
    Object.keys(actions.data).forEach((actionId) => {
      const action = actions.data[actionId];
      action.dependencies.forEach((dependencyId) => {
        if (!depOns[dependencyId]) {
          depOns[dependencyId] = []
        }
        depOns[dependencyId].push(actionId);
      });
    });

    const getDependencies = (path) => (id) => {
      return [{ path: `${path}.${id}` }].concat(!depOns[id] ? [] : depOns[id].map((depId) => getDependencies(`${path}.${id}`)(depId)).reduce((acc, val) => acc.concat(val), []));
    };

    var mapped = [{
      path: 'start',
      shortDescription: 'WIN',
    }].concat(Object.keys(actions.data)
      .filter((id) => {
        const action = actions.data[id];
        return action.status === 0 && action.dependencies.length === 0;
      })
      .map((id) => {
      return getDependencies('start')(id);
    }).reduce((acc, val) => acc.concat(val), []));

    var root = tree(stratify(mapped));

    const renderNode = (d) => {
      const id = d.id.substring(d.id.lastIndexOf('.') + 1);
      const action = id === 'start' ? { shortDescription: 'WIN' } : actions.data[id];
      return [
        <GraphNode key={d.id} d={d} action={action} dispatch={this.props.dispatch} />
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
            viewBox={`0 0 ${width} ${height}`}
            style={{borderWidth:"2px", borderColor: "black", borderStyle: "solid"}}
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

function mapDispatchToProps(dispatch) {
  return {dispatch};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'actionGraph', reducer });
const withSaga = injectSaga({ key: 'actionGraph', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DragDropContext(MouseBackend)(ActionGraph));
