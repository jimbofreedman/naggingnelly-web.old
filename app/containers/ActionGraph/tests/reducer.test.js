
import { fromJS } from 'immutable';
import actionGraphReducer from '../reducer';

describe('actionGraphReducer', () => {
  it('returns the initial state', () => {
    expect(actionGraphReducer(undefined, {})).toEqual(fromJS({}));
  });
});
