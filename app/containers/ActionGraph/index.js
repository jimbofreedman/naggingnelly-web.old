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
import * as d3 from 'd3';
import MouseBackend from 'react-dnd-mouse-backend';
import { DragSource, DropTarget, DragDropContext } from 'react-dnd';
import { Button, Glyphicon } from 'react-bootstrap';

import { makeSelectActions } from '../App/selectors';
import rest from '../../rest';
import { focusOnAction } from './actions';
import reducer from './reducer';
import saga from './saga';


const knightSource = {
  beginDrag(props) {
    return props.action;
  },
};

const linkSource = {
  beginDrag(props) {
    return { sourceNodeId: props.l.source.id, targetNodeId: props.l.target.id };
  },
};

const squareTarget = {
  drop(props, monitor) {
    const fromId = monitor.getItem().id;
    const toId = props.action.id;
    if (fromId !== toId) {
      props.addDependency(fromId, toId);
    }
  },
};

const binTarget = {
  drop(props, monitor) {
    const getActionIdFromNodeId = (nodeId) => { return nodeId.substring(nodeId.lastIndexOf('.') + 1); };
    const fromId = getActionIdFromNodeId(monitor.getItem().sourceNodeId);
    const toId = getActionIdFromNodeId(monitor.getItem().targetNodeId);
    props.removeDependency(fromId, toId);
  },
};

const collectDrag = (connector, monitor) => {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const collectDrop = (connector, monitor) => {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
  };
};

const radialPoint = (x, y) => {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
};

const DeleteLink = DropTarget('LINK', binTarget, collectDrop)(({ connectDropTarget, isOver, removeDependency }) =>
  // Must wrap in div to satisfy DropTarget
  connectDropTarget(<circle r="20" style={{ fill: isOver ? '#990000' : '#000000' }} />)
);

const GraphNode = DropTarget('ACTION', squareTarget, collectDrop)(DragSource('ACTION', knightSource, collectDrag)(({ d, action, onClick, connectDragSource, isDragging, connectDropTarget, isOver, addDependency }) =>
  connectDropTarget(connectDragSource(
    <g
      transform={`translate(${radialPoint(d.x, d.y)})`}
      style={{ fill: (isDragging ? '#cc00cc' : (isOver ? '#00cccc' : undefined)) }}
      onClick={onClick}
    >
      <circle
        r="4"
        style={{ fill: (d.children ? '#999999' : '#333333') }}
      />
      <text
        dy="0.31em"
        x={d.x < Math.PI ? 6 : -6}
        textAnchor={d.x < Math.PI ? 'start' : 'end'}
        transform={`rotate(${(d.x < Math.PI ? d.x - (Math.PI / 2) : d.x + (Math.PI / 2)) * (180 / Math.PI)})`}

      >
        {action.shortDescription}
      </text>
    </g>
  ))
));


const GraphLink = DragSource('LINK', linkSource, collectDrag)(({ l, connectDragSource, isDragging }) =>
  connectDragSource(
    <path
      style={{
        fill: 'none',
        stroke: isDragging ? '#c0c' : '#bbb',
        strokeOpacity: 0.4,
        strokeWidth: '3px',
      }}
      d={d3.linkRadial().angle((d) => d.x).radius((d) => d.y)(l)}
    />
  )
);

class ActionGraph extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      selectedAction: null,
      totalRadius: 800,
    };
  }

  render() {
    const width = 1600;
    const height = 1600;
    const { actions, selectedActionId, focusOnAction } = this.props;
    const { selectedAction, totalRadius } = this.state;

    console.log("rendering ACTIONGRAPH");

    //   g = svg.append('g").attr("transform", );

    if (!actions.sync) {
      return <div>Loading...</div>;
    }

    const stratify = d3.stratify()
      .id((d) => d.path)
      .parentId((d) => d.path.substring(0, d.path.lastIndexOf('.')));

    const tree = d3.tree()
      .size([2 * Math.PI, this.state.totalRadius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    const depOns = {};
    Object.keys(actions.data).forEach((actionId) => {
      const action = actions.data[actionId];
      action.dependencies.forEach((dependencyId) => {
        if (!depOns[dependencyId]) {
          depOns[dependencyId] = [];
        }
        depOns[dependencyId].push(actionId);
      });
    });

    const filter = (id) => {
      const action = actions.data[id];
      return action.status === 0;
    };

    const getDependencies = (path) => (id) => {
      if (!filter(id)) {
        return [];
      }
      return [{ path: `${path}.${id}` }].concat(!depOns[id] ? [] : depOns[id].map((depId) => getDependencies(`${path}.${id}`)(depId)).reduce((acc, val) => acc.concat(val), []));
    };

    const initial = selectedActionId ? { ...actions.data[selectedActionId], path: `${selectedActionId}` } : { path: 'start', shortDescription: 'WIN' };
    const other = selectedActionId ? (depOns[selectedActionId] || []) : Object.keys(actions.data).filter((id) => actions.data[id].dependencies.length === 0);

    const mapped = [initial].concat(other
      .filter((id) => {
        const action = actions.data[id];
        return action.status === 0 && action.folder !== 1; // todo other people's folders
      })
      .map((id) => getDependencies(initial.path)(id))
      .reduce((acc, val) => acc.concat(val), []));

    const root = tree(stratify(mapped));

    const renderNode = (d) => {
      const id = d.id.substring(d.id.lastIndexOf('.') + 1);
      const action = id === 'start' ? { shortDescription: 'WIN' } : actions.data[id];
      return [
        <GraphNode
          key={d.id}
          d={d}
          action={action}
          onClick={() => this.setState({ selectedAction: action })}
          addDependency={this.props.addDependency}
        />,
      ].concat(d.children ? d.children.map(renderNode) : []);
    };

    const renderLinks = (d) => d.links().map((l) => <GraphLink key={`${l.source.id}-${l.target.id}`} l={l} />);

    return (!actions.sync) ?
      (<div>Loading</div>)
      :
      (
        <div>
          <div>Selected Action: { selectedAction ? selectedAction.shortDescription : 'None' }</div>
          <Button disabled={!selectedAction} onClick={() => focusOnAction(selectedAction.id)}>Focus</Button>
          <Button disabled={!selectedActionId} onClick={() => focusOnAction(0)}>Clear Focus</Button>
          <Button onClick={() => this.setState({ totalRadius: totalRadius + 100 })}><Glyphicon glyph="plus" /></Button>
          <Button onClick={() => this.setState({ totalRadius: totalRadius - 100 })}><Glyphicon glyph="minus" /></Button>

          <svg
            width="100%"
            height={1600}
            viewBox={`0 0 ${width} ${height}`}
            style={{ borderWidth: '2px', borderColor: 'black', borderStyle: 'solid' }}
          >
            <DeleteLink removeDependency={this.props.removeDependency} />
            <g transform={`translate(${((width / 2) + 40)},${((height / 2) + 90)})`}>
              {renderLinks(root)};
              {renderNode(root)};
            </g>
          </svg>
        </div>
      );
  }
}

ActionGraph.propTypes = {
  dispatch: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  selectedActionId: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  actions: makeSelectActions(),
  selectedActionId: (state) => state.get('selectedActionId'),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    focusOnAction: (id) => dispatch(focusOnAction(id)),
    addDependency: (fromId, toId) => dispatch(rest.actions.actions.addDependency(fromId, toId)),
    removeDependency: (fromId, toId) => dispatch(rest.actions.actions.removeDependency(toId, fromId)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'actionGraph', reducer });
const withSaga = injectSaga({ key: 'actionGraph', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DragDropContext(MouseBackend)(ActionGraph));


  /*
  none
  home
  work
  computer
  programming
  shopping
  purchases
  calls
  reading
  study
  errand
  barradrill
   */
