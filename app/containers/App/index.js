/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import ActionList from 'containers/ActionList/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import ActionGraph from 'containers/ActionGraph/Loadable';
import AddAction from 'components/AddAction';
import Header from 'components/Header';
// import Footer from 'components/Footer';

const AppWrapper = styled.div`
  //max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
      <Helmet
        titleTemplate="%s - NaggingNelly"
        defaultTitle="NaggingNelly"
      >
        <meta name="description" content="An accountabilibuddy" />
      </Helmet>
      <Header />
      <AddAction />
      <Switch>
        <Route exact path="/" component={ActionList} />
        <Route path="/features" component={FeaturePage} />
        <Route path="/actionGraph" component={ActionGraph} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      {/* <Footer /> */}
    </AppWrapper>
  );
}
