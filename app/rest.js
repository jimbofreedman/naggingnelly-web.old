import reduxApi from 'redux-api-immutablejs';
import adapterFetch from 'redux-api-immutablejs/lib/adapters/fetch';
import Cookies from 'universal-cookie';
import config from 'config';

const options = {
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export function stripDoubleSlashes(url) {
  const ret = url.replace(/([^:]\/)\/+/g, '$1');
  return ret;
}

export function fetchWithCsrfToken(url, request) {
  const cookies = new Cookies();
  const csrfToken = cookies.get('csrftoken');
  const newHeaders = Object.assign({}, request.headers, { 'X-CSRFToken': csrfToken });
  const newRequest = Object.assign({}, request, { headers: newHeaders });
  return fetch(stripDoubleSlashes(url), newRequest);
}

export function dictionaryTransformer(data, prevData /* , action */) {
  const newData = {};
  if (data === undefined || data === []) {
    return prevData;
  }

  if (prevData !== undefined) {
    Object.keys(prevData).forEach((id) => {
      if (Object.prototype.hasOwnProperty.call(prevData, id)) {
        newData[id] = prevData[id];
      }
    });
  }

  if (data !== undefined) {
    if (data.constructor === Array) {
      data.forEach((item) => {
        newData[item.id] = item;
      });
    } else {
      newData[data.id] = data;
    }
  }

  return newData;
}

export function syncSinceCallback(dispatch, type) {
  return (err, data) => {
    let updatedAt = '';
    Object.keys(data)
      .forEach((key) => {
        const item = data[key];
        if (item.updatedAt > updatedAt) {
          updatedAt = item.updatedAt;
        }
      });
    dispatch({
      type: `@@redux-api@${type}_updated_at`,
      value: updatedAt,
    });
  };
}

export default reduxApi({
  login: {
    reducerName: 'auth',
    url: '/rest-auth/login/',
    options: {
      ...options,
      method: 'post',
    },
  },
  logout: {
    url: '/rest-auth/logout/',
    options: {
      ...options,
      method: 'post',
    },
  },
  poll: {
    url: '/gtd/poll/',
    postfetch: [
      ({ data, actions, dispatch, getState }) => {
        if (!getState().actions.updatedAt || data.actions > getState().actions.updatedAt) {
          dispatch(actions.actions.syncSince(undefined, syncSinceCallback(dispatch, 'actions')));
        }
        if (!getState().contexts.updatedAt || data.contexts > getState().contexts.updatedAt) {
          dispatch(actions.contexts.syncSince(undefined, syncSinceCallback(dispatch, 'contexts')));
        }
        if (!getState().folders.updatedAt || data.folders > getState().folders.updatedAt) {
          dispatch(actions.folders.syncSince(undefined, syncSinceCallback(dispatch, 'folders')));
        }
      },
    ],
    options: {
      ...options,
      method: 'get',
    },
  },
  actions: {
    url: '/gtd/actions/(:id)/(:fn)/',
    transformer: dictionaryTransformer,
    crud: true,
    reducerName: 'actions',
    helpers: {
      complete(id) {
        return [{ id, fn: 'complete' }, { method: 'post' }];
      },
      cancel(id) {
        return [{ id, fn: 'cancel' }, { method: 'post' }];
      },
      fail(id) {
        return [{ id, fn: 'fail' }, { method: 'post' }];
      },
      addDependency(id, otherId) {
        return [
          { id, fn: 'add_dependency', "dependency_action_id": otherId },
          { method: 'post' }
        ];
      },
      syncSince(updatedSince) {
        return [{ updatedSince }];
      },
    },
    reducer(state, action) {
      if (action.type === '@@redux-api@actions_updated_at') {
        return !state.has('updatedAt') || action.value > state.get('updatedAt') ? state.set('updatedAt', action.value) : state;
      }
      return state;
    },
    options,
  },
  contexts: {
    url: '/gtd/contexts/(:id)/(:fn)/',
    transformer: dictionaryTransformer,
    crud: true,
    reducerName: 'contexts',
    helpers: {
      syncSince(updatedSince) {
        return [{ updatedSince }];
      },
    },
    reducer(state, action) {
      if (action.type === '@@redux-api@contexts_updated_at') {
        return !state.has('updatedAt') || action.value > state.get('updatedAt') ? state.set('updatedAt', action.value) : state;
      }
      return state;
    },
    options,
  },
  folders: {
    url: '/gtd/folders/(:id)/(:fn)/',
    transformer: dictionaryTransformer,
    crud: true,
    reducerName: 'folders',
    helpers: {
      syncSince(updatedSince) {
        return [{ updatedSince }];
      },
    },
    reducer(state, action) {
      if (action.type === '@@redux-api@folders_updated_at') {
        return !state.has('updatedAt') || action.value > state.get('updatedAt') ? state.set('updatedAt', action.value) : state;
      }
      return state;
    },
    options,
  },
}).use('fetch', adapterFetch(fetchWithCsrfToken))
  .use('rootUrl', config.api.endpoint);
