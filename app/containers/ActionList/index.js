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

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.refresh, 10000);
    this.refresh();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  refresh() {
    this.props.loadContexts(this.props.contexts.updatedAt);
    this.props.loadFolders(this.props.folders.updatedAt);
    this.props.loadActions(this.props.actions.updatedAt);
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
                <Field name="showFuture" component={ToggleButton} label="Show Future" />
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
                    (filters.showFuture || (!action.start_at || new Date(action.start_at) <= new Date())) &&
                    (action.folder === filters.folder) &&
                    (!action.dependencies ||
                    !action.dependencies.filter((a) => actions.data[a].status === 0).length) ? (
                      <Action key={action.id} action={action} folders={folders} contexts={contexts} dispatch={dispatch} loading={actions.loading} />
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
  loadActions: PropTypes.func,
  loadContexts: PropTypes.func,
  loadFolders: PropTypes.func,
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
      showFuture: selector(state, 'showFuture'),
    };
  },
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loadActions: (updatedSince) => {
      dispatch(rest.actions.actions.syncSince(updatedSince));
    },
    loadContexts: (updatedSince) => {
      dispatch(rest.actions.contexts.syncSince(updatedSince));
    },
    loadFolders: (updatedSince) => {
      dispatch(rest.actions.folders.syncSince(updatedSince));
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
