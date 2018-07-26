/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Grid, Row, Col } from 'react-bootstrap';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import ActionList from 'containers/ActionList';
import ActionGraph from 'containers/ActionGraph';
import reducer from './reducer';
import saga from './saga';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h1>PRIMARY GOAL: SLEEP BETWEEN 2300 and 0700</h1>
        <Grid fluid>
          <Row>
            <Col sm={12} md={12} lg={2}>
              <ActionList />
            </Col>
            <Col xsHidden mdHidden lg={10}>
              <ActionGraph />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

HomePage.propTypes = {
};

export function mapDispatchToProps() {
  return {};
}

const mapStateToProps = createStructuredSelector({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
