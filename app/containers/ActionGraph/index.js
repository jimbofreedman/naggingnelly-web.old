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

class ActionGraph extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { actions } = this.props;
    return (!actions.sync) ?
      (<div>Loading</div>)
      :
      (
        <div>Disabled</div>
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
