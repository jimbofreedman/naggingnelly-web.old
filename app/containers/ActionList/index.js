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

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.loadAll();
  }

  render() {
    const handleSubmit = () => {};
    const { actions, folders, contexts, dispatch, filters } = this.props;

    return (!actions.sync || !folders.sync) ?
      (<div>Loading</div>)
      :
      (
        <div>
          <div>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Field name="folder" defaultValue={3} component={SelectFolder} data={folders.data} />
              </FormGroup>
            </Form>
          </div>
          <PanelGroup id="actionList" accordion>
            {
              Object.keys(actions.data)
                .sort((a, b) =>
                  actions.data[b].priority - actions.data[a].priority
                )
                .map((id) => {
                  const action = actions.data[id];
                  return action.status === 0 &&
                  (!action.start_at || new Date(action.start_at) <= new Date()) &&
                  (action.folder === filters.folder) &&
                  (!action.dependencies ||
                  !action.dependencies.filter((a) => actions.data[a].status === 0).length) ? (
                    <Action key={action.id} action={action} folders={folders} contexts={contexts} dispatch={dispatch} />
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
  loadAll: PropTypes.func,
  filters: PropTypes.object,
};


const formName = 'actionList';

const mapStateToProps = createStructuredSelector({
  ActionList: makeSelectActionList(),
  actions: makeSelectActions(),
  contexts: makeSelectContexts(),
  folders: makeSelectFolders(),
  filters: (state) => {
    const selector = formValueSelector(formName);
    return {
      folder: selector(state, 'folder'),
    };
  },
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadAll: () => {
      dispatch(rest.actions.actions.sync());
      dispatch(rest.actions.contexts.sync());
      dispatch(rest.actions.folders.sync());
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
