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

export default reduxApi({
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
      syncSince(updatedSince) {
        const { dispatch } = this;
        dispatch(this.actions.actions.sync({ updated_since: updatedSince }, {}, (err, data) => {
          let updatedAt = '';
          Object.keys(data)
            .forEach((key) => {
              const item = data[key];
              if (item.updated_at > updatedAt) {
                updatedAt = item.updated_at;
              }
            });
          dispatch({
            type: '@@redux-api@actions_updated_at',
            value: updatedAt,
          });
        }));
      },
    },
    reducer(state, action) {
      if (action.type === '@@redux-api@actions_updated_at') {
        return state.setIn(['updatedAt'], action.value);
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
        const { dispatch } = this;
        dispatch(this.actions.contexts.sync({ updated_since: updatedSince }, {}, (err, data) => {
          let updatedAt = '';
          Object.keys(data)
            .forEach((key) => {
              const item = data[key];
              if (item.updated_at > updatedAt) {
                updatedAt = item.updated_at;
              }
            });
          dispatch({
            type: '@@redux-api@contexts_updated_at',
            value: updatedAt,
          });
        }));
      },
    },
    reducer(state, action) {
      if (action.type === '@@redux-api@contexts_updated_at') {
        return state.setIn(['updatedAt'], action.value);
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
        const { dispatch } = this;
        dispatch(this.actions.folders.sync({ updated_since: updatedSince }, {}, (err, data) => {
          let updatedAt = '';
          Object.keys(data)
            .forEach((key) => {
              const item = data[key];
              if (item.updated_at > updatedAt) {
                updatedAt = item.updated_at;
              }
            });
          dispatch({
            type: '@@redux-api@folders_updated_at',
            value: updatedAt,
          });
        }));
      },
    },
    reducer(state, action) {
      if (action.type === '@@redux-api@folders_updated_at') {
        return state.setIn(['updatedAt'], action.value);
      }
      return state;
    },
    options,
  },
  graph: {
    url: '/gtd/actions/graph_json/',
    options,
  },
}).use('fetch', adapterFetch(fetchWithCsrfToken))
  .use('rootUrl', config.api.endpoint);
