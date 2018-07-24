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
import { ForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectActions } from '../App/selectors';
import reducer from './reducer';
import saga from './saga';

class ActionGraph extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { actions } = this.props;
    return (!actions.sync) ?
      (<div>Loading</div>)
      :
      (
        <ForceGraph
          simulationOptions={{ height: 1000, width: 1000 }}
          labelAttr="shortDescription"
          showLabels
        >
          {
            Object.keys(actions.data)
              .filter((id) => actions.data[id].status === 0)
              .map((id) => {
                const action = actions.data[id];
                const links = action.dependencies.filter((dependencyId) => actions.data[dependencyId].status === 0).map((dependencyId) => <ForceGraphLink link={{ source: action.id, target: dependencyId }} />);
                return links.concat([<ForceGraphNode key={action.id} node={action} fill="red" />]);
              })
          }
        </ForceGraph>
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
