/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Grid, Row, Col, Form, FormGroup } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';

import { makeSelectActions, makeSelectFolders, makeSelectContexts } from '../App/selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import ActionList from 'containers/ActionList';
import ActionGraph from 'containers/ActionGraph';
import reducer from './reducer';
import saga from './saga';
import config from '../../config';
import rest from '../../rest';
import SelectFolder from './SelectFolder';
import ToggleButton from './ToggleButton';


export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (config.autoRefresh) {
      this.interval = setInterval(this.refresh, 10000);
    }
    this.refresh();
  }

  componentWillUnmount() {
    if (config.autoRefresh) {
      clearInterval(this.interval);
    }
  }

  refresh() {
    this.props.poll();
  }

  render() {
    const { actions, folders, contexts, selectedActionId, filters } = this.props;

    const loading = !actions.get('sync') || !folders.get('sync') || !contexts.get('sync');

    const filterFunc = (action) =>
      (filters.showFuture || (!action.get('startAt') || new Date(action.get('startAt')) <= new Date())) &&
      (action.get('folder') === filters.folder);

    return loading ? (<div>Loading</div>) : (
      <div>
        <h1>PRIMARY GOAL: SLEEP BETWEEN 2300 and 0700</h1>
        <Form>
          <FormGroup>
            <Field name="folder" defaultValue={3} component={SelectFolder} data={folders.toJS().data} />
            <Field name="showFuture" component={ToggleButton} label="Show Future" />
          </FormGroup>
        </Form>
        <Grid fluid>
          <Row>
            <Col sm={12} md={12} lg={3}>
              <ActionList actions={actions.get('data')} contexts={contexts} folders={folders} filters={filters} filterFunc={filterFunc} />
            </Col>
            <Col xsHidden mdHidden lg={9}>
              <ActionGraph actions={actions} selectedActionId={selectedActionId} filters={filters} filterFunc={filterFunc} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

HomePage.propTypes = {
  actions: PropTypes.object.isRequired,
  contexts: PropTypes.object.isRequired,
  folders: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    poll: () => {
      dispatch(rest.actions.poll());
    },
  };
}

const formName = 'filters';
const mapStateToProps = createStructuredSelector({
  actions: makeSelectActions(),
  contexts: makeSelectContexts(),
  folders: makeSelectFolders(),
  selectedActionId: (state) => state.getIn(['selectedActionId', 'id']),
  filters: (state) => {
    const selector = formValueSelector(formName);
    return {
      folder: selector(state, 'folder'),
      showFuture: selector(state, 'showFuture'),
    };
  },
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
//const withReducer = injectReducer({ key: 'home', reducer });
//const withSaga = injectSaga({ key: 'home', saga });

export default compose(
//  withReducer,
//  withSaga,
  withConnect,
)(reduxForm({ form: formName, initialValues: { folder: 3 } })(HomePage));
