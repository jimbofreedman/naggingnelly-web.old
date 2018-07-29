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
import { PanelGroup, Form, FormGroup } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import rest from '../../rest';
import makeSelectActionList from './selectors';
import reducer from './reducer';
import saga from './saga';
import { makeSelectActions, makeSelectFolders, makeSelectContexts } from '../App/selectors';
import Action from '../../components/Action';
import SelectFolder from './SelectFolder';
import ToggleButton from './ToggleButton';
import config from '../../config';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const handleSubmit = () => {};
    const { actions, folders, contexts, dispatch, filters } = this.props;

    return (
        <div>
          <div>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Field name="folder" defaultValue={3} component={SelectFolder} data={folders.toJS().data} />
                <Field name="showFuture" component={ToggleButton} label="Show Future" />
              </FormGroup>
            </Form>
          </div>
          <PanelGroup id="actionList" accordion>
            {
              Array.from(actions.entries())
                .sort((a, b) =>
                  {
                    return b[1].get('priority') - a[1].get('priority');
                  }
                )
                .map((tup) => {
                  const id = tup[0];
                  const action = tup[1];
                  return action.get('status') === 0 &&
                    (filters.showFuture || (!action.get('startAt') || new Date(action.get('startAt')) <= new Date())) &&
                    (action.get('folder') === filters.folder) &&
                    (!action.get('dependsOn') || !action.get('dependsOn').length || !action.get('dependsOn').filter((a) => actions.get(a).get('status') === 0).length)
                    ? (
                      <Action key={id} action={action} folders={folders} contexts={contexts} dispatch={dispatch} />
                  ) : null;
                })
            }
          </PanelGroup>
        </div>
      );
  }
}

ActionList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  actions: PropTypes.object,
  contexts: PropTypes.object,
  folders: PropTypes.object,
  poll: PropTypes.func,
  filters: PropTypes.object,
};


const formName = 'actionList';

const mapStateToProps = createStructuredSelector({
  ActionList: makeSelectActionList(),
  filters: (state) => {
    const selector = formValueSelector(formName);
    return {
      folder: selector(state, 'folder'),
      showFuture: selector(state, 'showFuture'),
    };
  },
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    poll: () => {
      dispatch(rest.actions.poll());
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
)(reduxForm({ form: formName, initialValues: { folder: 3 } })(ActionList));
