/**
 *
 * ActionList
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
import makeSelectActionList from './selectors';
import reducer from './reducer';
import saga from './saga';
import { makeSelectActions } from '../App/selectors';
import Action from '../../components/Action';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.loadActions();
  }

  render() {
    const { actions, dispatch } = this.props;
    return !actions.sync ?
      (<div>Loading</div>)
      :
      (
        <div>
          <div>
            {
              Object.keys(actions.data)
                .sort((a, b) =>
                  actions.data[b].priority - actions.data[a].priority
                )
                .map((id) => {
                  const action = actions.data[id];
                  return action.status === 0 &&
                  (!action.start_at || new Date(action.start_at) <= new Date()) &&
                  (action.folder !== 1) &&
                  (!action.dependencies ||
                  !action.dependencies.filter((a) => actions.data[a].status === 0).length) ? (
                    <div key={action.id}>
                      <Action action={action} dispatch={dispatch} />
                    </div>
                  ) : null;
                })
            }
          </div>
        </div>
      );
  }
}

ActionList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  actions: PropTypes.object,
  loadActions: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  ActionList: makeSelectActionList(),
  actions: makeSelectActions(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadActions: () => {
      dispatch(rest.actions.actions.sync());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'actionList', reducer });
const withSaga = injectSaga({ key: 'actionList', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ActionList);
