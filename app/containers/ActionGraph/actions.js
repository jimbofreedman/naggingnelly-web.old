/*
 *
 * ActionGraph actions
 *
 */

import {
  FOCUS_ON_ACTION,
} from './constants';

export function focusOnAction(actionId) {
  return {
    type: FOCUS_ON_ACTION,
    actionId,
  };
}
