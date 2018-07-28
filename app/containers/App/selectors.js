/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectState = (state) => state;

const selectGlobal = (state) => state.get('global');

const selectRoute = (state) => state.get('route');

const makeSelectCurrentUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentUser')
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error')
);

const makeSelectRepos = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['userData', 'repositories'])
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

const makeSelectActions = () => createSelector(
  selectState,
  (state) => state.get('actions')
);

const makeSelectContexts = () => createSelector(
  selectState,
  (state) => state.get('contexts')
);

const makeSelectFolders = () => createSelector(
  selectState,
  (state) => state.get('folders')
);

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocation,
  makeSelectActions,
  makeSelectContexts,
  makeSelectFolders,
};
